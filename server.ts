import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { dataStore } from './server/dataStore';
import { generateSmartItinerary, optimizeItineraryDay, calculateDistanceKm } from './server/itineraryEngine';
import { generateAIChatResponse, translateTextWithGemini } from './server/gemini';
import { Trip, FeedbackSubmission, IssueReportSubmission } from './src/types';
import * as fs from 'fs';

dotenv.config();

// In-memory cache to store dynamically generated places so all endpoints see them
const dynamicPlacesCache: Record<string, any[]> = {};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Response Helper
  const sendSuccess = (res: Response, data: any, meta: any = {}) => {
    res.json({
      success: true,
      data,
      error: null,
      meta: { timestamp: new Date().toISOString(), ...meta },
    });
  };

  const sendError = (res: Response, code: string, message: string, status = 400) => {
    res.status(status).json({
      success: false,
      data: null,
      error: { code, message },
      meta: { timestamp: new Date().toISOString() },
    });
  };

  // =====================
  // API V1 ENDPOINTS
  // =====================

  // Health
  app.get('/api/v1/health', (_req: Request, res: Response) => {
    sendSuccess(res, { status: 'healthy', service: 'WayFinder Intelligence Server' });
  });

  // Cities
  app.get('/api/v1/cities', (_req: Request, res: Response) => {
    sendSuccess(res, dataStore.getCities());
  });

  // Places search / list (UNIFIED ROUTE WITH DYNAMIC AI LAZY-LOADING)
  app.get('/api/v1/places', async (req: Request, res: Response) => {
    const { query, cityId, category, tag, scope, lat, lng } = req.query;
    const cid = cityId ? String(cityId).toLowerCase() : undefined;

    // 1. Check in-memory dataStore first
    let places = dataStore.searchPlaces(
      query as string,
      cid,
      category as string,
      tag as string,
      (scope as any) || 'india',
      lat ? parseFloat(lat as string) : undefined,
      lng ? parseFloat(lng as string) : undefined
    );

    // 2. Check if we already dynamically fetched this city
    if (places.length === 0 && cid && dynamicPlacesCache[cid]) {
      places = dynamicPlacesCache[cid];
    }

    // 3. Dynamic Lazy-Loading: If still empty, fetch live from Gemini
    if (places.length === 0 && cid && cid !== 'all') {
      console.log(`[WayFinder] No places for ${cid}. Fetching live via Gemini...`);

      const photoPool = [
        'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1200&q=80'
      ];

      const prompt = `
        Generate a JSON array of 6 major real tourist attractions in ${cid}, India.
        Output ONLY a valid JSON array matching this exact schema:
        [
          {
            "id": "${cid}-place-1",
            "name": "Attraction Name",
            "hindiName": "हिंदी नाम",
            "cityId": "${cid}",
            "cityName": "${cid.charAt(0).toUpperCase() + cid.slice(1)}",
            "state": "State Name",
            "coordinates": { "lat": 23.02, "lng": 72.57 },
            "address": "Address or Area",
            "description": "2-sentence clear cultural and architectural summary.",
            "speciality": "Main architectural highlight.",
            "categories": ["heritage"],
            "tags": ["Heritage", "Photography", "Historic"],
            "images": ["${photoPool[0]}"],
            "rating": 4.7,
            "reviewCount": 2400,
            "openingHours": { "regular": "9:00 AM - 5:30 PM", "bestTime": "Morning", "estimatedDurationHours": 2 },
            "estimatedCost": { "indianCitizen": 50, "foreignNational": 300, "currency": "₹" },
            "crowdLevel": "Moderate",
            "accessibility": { "wheelchairAccessible": true, "restroomsAvailable": true, "stairsHeavy": false, "drinkingWaterAvailable": true },
            "guidance": [
              { "id": "g-1", "type": "timing", "title": "Best Timing", "description": "Visit early to avoid crowds.", "severity": "info", "verified": true, "updatedAt": "2026-08-20" }
            ],
            "culture": { "dressCode": "Modest attire", "footwearRule": "allowed", "photography": "allowed_free" },
            "travelTips": ["Carry water and a sun hat."],
            "trust": { "status": "VERIFIED", "sourceType": "Tourism Board", "confidence": "High", "lastVerified": "2026-08-20" }
          }
        ]
        Do not use markdown blocks or backticks. Return raw parseable JSON only.
      `;

      try {
        const structuredContext = dataStore.getStructuredContextForAI(cid as string);
        const aiResponse = await generateAIChatResponse({ message: prompt }, structuredContext);

        const rawText = aiResponse?.answer || '';
        
        // BULLETPROOF JSON EXTRACTION
        // Isolates the array and ignores any conversational text Gemini adds
        const startIndex = rawText.indexOf('[');
        const endIndex = rawText.lastIndexOf(']');
        
        if (startIndex === -1 || endIndex === -1) {
          throw new Error("AI response did not contain a valid JSON array.");
        }

        const jsonString = rawText.substring(startIndex, endIndex + 1);
        const generatedPlaces = JSON.parse(jsonString);

        // Assign distinct images from the pool to each place
        generatedPlaces.forEach((p: any, idx: number) => {
          p.images = [photoPool[idx % photoPool.length]];
        });

        places = generatedPlaces;
        dynamicPlacesCache[cid] = generatedPlaces;

        // Auto-save to local JSON dump for your final seedData.ts
        const dumpPath = path.join(process.cwd(), 'wayfinder_generated_places.json');
        fs.appendFileSync(dumpPath, JSON.stringify(generatedPlaces, null, 2) + ',\n');
        console.log(`[WayFinder] Generated & cached ${generatedPlaces.length} places for ${cid}.`);
      } catch (err: any) {
        // THIS ERROR PRINTS IN YOUR VS CODE TERMINAL, NOT THE BROWSER
        console.error(`\n[WayFinder] Live generation failed for ${cid}:`, err.message || err, '\n');
        places = [];
      }
    }

    sendSuccess(res, places, { total: places.length });
  });

  // Place by ID
  app.get('/api/v1/places/:id', (req: Request, res: Response) => {
    let place = dataStore.getPlaceById(req.params.id);
    if (!place) {
      for (const list of Object.values(dynamicPlacesCache)) {
        const found = list.find((p) => p.id === req.params.id);
        if (found) {
          place = found;
          break;
        }
      }
    }
    if (!place) {
      return sendError(res, 'NOT_FOUND', `Place with id '${req.params.id}' not found`, 404);
    }
    sendSuccess(res, place);
  });

  // Nearby places
  app.get('/api/v1/nearby', (req: Request, res: Response) => {
    const { lat, lng, radius } = req.query;
    if (!lat || !lng) {
      return sendError(res, 'VALIDATION_ERROR', 'Coordinates (lat, lng) are required for nearby search');
    }
    const places = dataStore.getNearbyPlaces(
      parseFloat(lat as string),
      parseFloat(lng as string),
      radius ? parseFloat(radius as string) : 35
    );
    sendSuccess(res, places, { count: places.length });
  });

  // Recommendations (Falls back to dynamic cache if seedData is empty)
  app.get('/api/v1/recommendations', (req: Request, res: Response) => {
    const { cityId, interests, priority, lat, lng } = req.query;
    const cid = cityId ? String(cityId).toLowerCase() : undefined;
    const interestArr = interests ? (interests as string).split(',') : [];
    const userLat = lat ? parseFloat(lat as string) : undefined;
    const userLng = lng ? parseFloat(lng as string) : undefined;

    let recommended = dataStore.getRecommendations(
      cid as string,
      interestArr,
      (priority as string) || 'balanced',
      userLat,
      userLng
    );

    // If empty, pull from our dynamic cache
    if (recommended.length === 0 && cid && dynamicPlacesCache[cid]) {
      recommended = dynamicPlacesCache[cid].slice(0, 4);
    }

    sendSuccess(res, recommended);
  });

  // Cultural Guidance
  app.get('/api/v1/culture', (_req: Request, res: Response) => {
    sendSuccess(res, dataStore.getCulturalTopics());
  });

  // Phrases
  app.get('/api/v1/phrases', (req: Request, res: Response) => {
    const { category, language } = req.query;
    sendSuccess(res, dataStore.getPhrases(category as string, language as string));
  });

  // Fair Price Check List
  app.get('/api/v1/fair-price', (req: Request, res: Response) => {
    const { cityId, serviceType } = req.query;
    sendSuccess(res, dataStore.getFairPrices(cityId as string, serviceType as string));
  });

  // Interactive Fair Price Calculator
  app.post('/api/v1/fair-price/calculate', (req: Request, res: Response) => {
    const { serviceType, quotedAmount, distanceKm } = req.body;
    const quote = parseFloat(quotedAmount);

    if (isNaN(quote) || quote < 0) {
      return sendError(res, 'VALIDATION_ERROR', 'Valid quotedAmount is required');
    }

    let minEstimated = 50;
    let maxEstimated = 150;
    let warningLevel: 'fair' | 'slight_high' | 'very_high' = 'fair';
    let advice = 'The quoted rate looks within typical local parameters.';
    let politePhrase = 'Thank you, this price sounds reasonable.';
    let politeHindi = 'ठीक है, धन्यवाद।';

    const dist = distanceKm ? parseFloat(distanceKm) : 5;

    if (serviceType === 'auto_rickshaw') {
      minEstimated = Math.max(40, Math.round(30 + dist * 14));
      maxEstimated = Math.max(60, Math.round(40 + dist * 22));
    } else if (serviceType === 'taxi') {
      minEstimated = Math.max(150, Math.round(80 + dist * 24));
      maxEstimated = Math.max(250, Math.round(100 + dist * 35));
    } else if (serviceType === 'monument_guide') {
      minEstimated = 400;
      maxEstimated = 650;
    } else if (serviceType === 'boat_ride') {
      minEstimated = 150;
      maxEstimated = 300;
    }

    if (quote > maxEstimated * 1.8) {
      warningLevel = 'very_high';
      advice = `The quoted amount (₹${quote}) appears significantly above typical local estimates (₹${minEstimated}–₹${maxEstimated}).`;
      politePhrase = `Could you do ₹${Math.round((minEstimated + maxEstimated) / 2)}? Otherwise, I will use standard app transport.`;
      politeHindi = `₹${Math.round((minEstimated + maxEstimated) / 2)} में चलेंगे क्या?`;
    } else if (quote > maxEstimated * 1.25) {
      warningLevel = 'slight_high';
      advice = `The quote is slightly higher than usual (Typical: ₹${minEstimated}–₹${maxEstimated}). A mild polite counter-offer is appropriate.`;
      politePhrase = `Please reduce it a bit, how about ₹${maxEstimated}?`;
      politeHindi = `थोड़ा कम कीजिए, ₹${maxEstimated} ठीक रहेगा?`;
    }

    sendSuccess(res, {
      quotedAmount: quote,
      estimatedRange: { min: minEstimated, max: maxEstimated, currency: '₹' },
      warningLevel,
      practicalAdvice: advice,
      counterOfferRecommendation: Math.round((minEstimated + maxEstimated) / 2),
      politeCounterPhrase: {
        english: politePhrase,
        hindi: politeHindi,
      },
      alternatives: [
        'Uber Auto / Ola Auto for automatic metered pricing',
        'Official Metro / Low-floor City Bus network',
      ],
    });
  });

  // Safety Resources
  app.get('/api/v1/safety', (req: Request, res: Response) => {
    const { cityId } = req.query;
    sendSuccess(res, dataStore.getSafetyResources(cityId as string));
  });

  // Travel Updates
  app.get('/api/v1/updates', (req: Request, res: Response) => {
    const { cityId } = req.query;
    sendSuccess(res, dataStore.getTravelUpdates(cityId as string));
  });

  // Trips CRUD
  app.get('/api/v1/trips/:id', (req: Request, res: Response) => {
    const trip = dataStore.getTrip(req.params.id);
    if (!trip) {
      return sendError(res, 'NOT_FOUND', `Trip '${req.params.id}' not found`, 404);
    }
    sendSuccess(res, trip);
  });

  app.post('/api/v1/trips', (req: Request, res: Response) => {
    const { title, cityId, cityName, startDate, daysCount, placeIds, travelPace, travelStyle } = req.body;
    if (!title || !cityId) {
      return sendError(res, 'VALIDATION_ERROR', 'Title and cityId are required');
    }

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      title,
      cityId,
      cityName: cityName || cityId,
      startDate: startDate || new Date().toISOString().split('T')[0],
      daysCount: daysCount || 2,
      placeIds: placeIds || [],
      itinerary: [],
      travelPace: travelPace || 'moderate',
      travelStyle: travelStyle || 'solo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (newTrip.placeIds.length > 0) {
      const places = newTrip.placeIds
        .map((id) => dataStore.getPlaceById(id))
        .filter(Boolean) as any[];
      newTrip.itinerary = generateSmartItinerary(places, newTrip.daysCount, newTrip.travelPace);
    }

    dataStore.saveTrip(newTrip);
    sendSuccess(res, newTrip, { created: true });
  });

  app.put('/api/v1/trips/:id', (req: Request, res: Response) => {
    const existing = dataStore.getTrip(req.params.id);
    if (!existing) {
      return sendError(res, 'NOT_FOUND', `Trip '${req.params.id}' not found`, 404);
    }
    const updated: Trip = {
      ...existing,
      ...req.body,
      id: existing.id,
      updatedAt: new Date().toISOString(),
    };
    dataStore.saveTrip(updated);
    sendSuccess(res, updated);
  });

  // Generate Smart Itinerary
  app.post('/api/v1/trips/:id/generate', (req: Request, res: Response) => {
    const trip = dataStore.getTrip(req.params.id);
    if (!trip) {
      return sendError(res, 'NOT_FOUND', `Trip '${req.params.id}' not found`, 404);
    }

    const { daysCount, pace } = req.body;
    if (daysCount) trip.daysCount = parseInt(daysCount);
    if (pace) trip.travelPace = pace;

    const places = trip.placeIds
      .map((id) => dataStore.getPlaceById(id))
      .filter(Boolean) as any[];

    trip.itinerary = generateSmartItinerary(places, trip.daysCount, trip.travelPace);
    dataStore.saveTrip(trip);
    sendSuccess(res, trip, { message: 'Itinerary generated successfully' });
  });

  // Optimize Day Itinerary
  app.post('/api/v1/trips/:id/optimize', (req: Request, res: Response) => {
    const trip = dataStore.getTrip(req.params.id);
    if (!trip) {
      return sendError(res, 'NOT_FOUND', `Trip '${req.params.id}' not found`, 404);
    }

    const allPlacesMap = new Map<string, any>();
    dataStore.getAllPlaces().forEach((p) => allPlacesMap.set(p.id, p));

    const result = optimizeItineraryDay(trip.itinerary, allPlacesMap);
    trip.itinerary = result.optimizedItems;
    dataStore.saveTrip(trip);

    sendSuccess(res, {
      trip,
      travelTimeSavedMin: result.travelTimeSavedMin,
      explanation: result.explanation,
    });
  });

  // User Feedback
  app.post('/api/v1/feedback', (req: Request, res: Response) => {
    const { placeId, placeName, isHoursAccurate, isPriceAccurate, isGuidanceHelpful, crowdRating, comments } = req.body;
    if (!placeId) {
      return sendError(res, 'VALIDATION_ERROR', 'placeId is required');
    }
    const submission: FeedbackSubmission = {
      id: `fb-${Date.now()}`,
      placeId,
      placeName: placeName || placeId,
      isHoursAccurate: !!isHoursAccurate,
      isPriceAccurate: !!isPriceAccurate,
      isGuidanceHelpful: !!isGuidanceHelpful,
      crowdRating: crowdRating || 'Moderate',
      comments: comments || '',
      timestamp: new Date().toISOString(),
    };
    dataStore.addFeedback(submission);
    sendSuccess(res, { submission, message: 'Thank you for helping keep traveler intelligence accurate!' });
  });

  // Report Issue
  app.post('/api/v1/report', (req: Request, res: Response) => {
    const { placeId, placeName, category, description } = req.body;
    if (!placeId || !description) {
      return sendError(res, 'VALIDATION_ERROR', 'placeId and description are required');
    }
    const report: IssueReportSubmission = {
      id: `rep-${Date.now()}`,
      placeId,
      placeName: placeName || placeId,
      category: category || 'other',
      description,
      timestamp: new Date().toISOString(),
      status: 'received',
    };
    dataStore.addReport(report);
    sendSuccess(res, { report, message: 'Report received for editorial verification.' });
  });

  // AI Assistant Chat (Server-side Gemini)
  app.post('/api/v1/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, context } = req.body;
      if (!message || typeof message !== 'string') {
        return sendError(res, 'VALIDATION_ERROR', 'Valid message string is required');
      }

      const structuredContext = dataStore.getStructuredContextForAI(context?.cityId);
      const aiResponse = await generateAIChatResponse({ message, context }, structuredContext);

      sendSuccess(res, aiResponse);
    } catch (err: any) {
      console.error('Server AI Chat handler error:', err);
      sendError(res, 'AI_UNAVAILABLE', 'AI assistant service temporarily degraded, standard verified guides available.');
    }
  });

  // Translation (Server-side Gemini)
  app.post('/api/v1/translate', async (req: Request, res: Response) => {
    try {
      const { text, targetLanguage, sourceLanguage } = req.body;
      if (!text || !targetLanguage) {
        return sendError(res, 'VALIDATION_ERROR', 'text and targetLanguage are required');
      }

      const translationResult = await translateTextWithGemini(
        text,
        targetLanguage,
        sourceLanguage || 'Auto-detect'
      );
      sendSuccess(res, translationResult);
    } catch (err: any) {
      console.error('Translation handler error:', err);
      sendError(res, 'TRANSLATION_ERROR', 'Translation service error');
    }
  });

  // =====================
  // VITE / STATIC SERVING
  // =====================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WayFinder Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});