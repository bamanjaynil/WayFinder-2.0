import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export interface AIChatRequestPayload {
  message: string;
  context?: {
    cityId?: string;
    cityName?: string;
    placeId?: string;
    placeName?: string;
    userPreferences?: Record<string, unknown>;
    activeTripSummary?: string;
    currentTime?: string;
  };
}

export interface AIChatResponsePayload {
  answer: string;
  confidence: 'High' | 'Medium' | 'Preliminary';
  sources: string[];
  warnings: string[];
  suggestedActions: {
    label: string;
    type: 'navigate' | 'trip_add' | 'fair_price' | 'safety' | 'culture' | 'search';
    payload?: string;
  }[];
}

export async function generateAIChatResponse(
  payload: AIChatRequestPayload,
  structuredPlacesContext: string
): Promise<AIChatResponsePayload> {
  const ai = getGeminiClient();

  if (!ai) {
    return getDeterministicFallbackResponse(payload);
  }

  try {
    const prompt = `You are WayFinder Assistant, a calm, trustworthy, practical, culturally respectful AI tourism intelligence advisor for travelers exploring India.
Your mission is to help travelers discover places, understand local customs, plan their day, prevent scams, and receive practical assistance.

RULES:
1. Ground your advice strictly in verified facts and practical ground reality.
2. Never make absolute safety claims (e.g. avoid "100% safe"). Use terms like "generally suitable for solo travelers" or "confidence: High".
3. Never invent emergency numbers or fake official policies. (Official national helpline is 112, tourist helpline is 1363).
4. Keep answers concise, clear, and actionable (2-4 brief paragraphs or bullet points).
5. Always provide suggested next actions and reliable sources.

STRUCTURED PLACES & GUIDANCE KNOWLEDGE BASE:
${structuredPlacesContext}

USER QUERY: "${payload.message}"
CURRENT CONTEXT:
- City: ${payload.context?.cityName || 'India'}
- Place focus: ${payload.context?.placeName || 'None'}
- Active Trip: ${payload.context?.activeTripSummary || 'None'}
- Current Time: ${payload.context?.currentTime || new Date().toLocaleTimeString()}

Respond with valid JSON adhering to the following structure:
{
  "answer": "Clear, helpful, culturally informed advice answering the user's specific question...",
  "confidence": "High" | "Medium" | "Preliminary",
  "sources": ["Archaeological Survey of India", "Rajasthan Tourism verified", "Ganga Seva Nidhi Trust"],
  "warnings": ["Carry water bottle", "Only purchase tickets via official QR counter"],
  "suggestedActions": [
    { "label": "Check Fair Price", "type": "fair_price", "payload": "auto_rickshaw" },
    { "label": "Explore Culture Guide", "type": "culture", "payload": "temple-etiquette" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
        systemInstruction: 'You are WayFinder Assistant. Output only valid JSON without markdown wrapping if possible.',
      },
    });

    const rawText = response.text || '';
    const cleanText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText) as AIChatResponsePayload;
    return {
      answer: parsed.answer || 'Here is the relevant travel information for your journey.',
      confidence: parsed.confidence || 'High',
      sources: parsed.sources || ['WayFinder Curated Intelligence'],
      warnings: parsed.warnings || [],
      suggestedActions: parsed.suggestedActions || [],
    };
  } catch (error) {
    console.error('Gemini API Error or parsing error:', error);
    return getDeterministicFallbackResponse(payload);
  }
}

export function getDeterministicFallbackResponse(payload: AIChatRequestPayload): AIChatResponsePayload {
  const query = (payload.message || '').toLowerCase();
  const city = payload.context?.cityName || 'Jaipur';
  const place = payload.context?.placeName || 'Amber Fort';

  if (query.includes('amber fort') || (query.includes('visit') && place.toLowerCase().includes('amber'))) {
    return {
      answer: `Amber Fort is best visited in the early morning (8:00 AM – 10:00 AM) to experience the Sheesh Mahal (Mirror Palace) before peak tour groups arrive.
The entry fee is ₹100 for Indian citizens and ₹500 for foreign visitors. You can walk up the paved stone path (10–15 mins) or take an authorized electric jeep (approx. ₹400 round-trip). Ensure you purchase tickets exclusively at the official ASI ticket counter or via official Rajasthan Tourism portals.`,
      confidence: 'High',
      sources: ['Archaeological Survey of India', 'Rajasthan Tourism Department (Verified)'],
      warnings: [
        'Do not engage with unofficial individuals claiming to sell express entry tickets outside the Suraj Pol gate.',
        'Wear comfortable walking shoes with traction for the ancient stone pathways.'
      ],
      suggestedActions: [
        { label: 'View Cultural Etiquette', type: 'culture', payload: 'temple-etiquette' },
        { label: 'Check Auto Fare to Fort', type: 'fair_price', payload: 'auto_rickshaw' },
        { label: 'Add Amber Fort to Trip', type: 'trip_add', payload: 'amber-fort' }
      ]
    };
  }

  if (query.includes('avoid') || query.includes('scam') || query.includes('safe')) {
    return {
      answer: `Key practical cautions when exploring ${city}:
1. **Transport**: Fix taxi and auto rickshaw fares in advance, or prefer app-based cabs (Uber/Ola) and prepaid police counters at airport/stations.
2. **Guides**: Hire only certified guides displaying official government photo ID badges.
3. **Tickets**: Always use official ASI or monument ticket counters directly or book online on government portals.
4. **Emergency Contact**: For any assistance, the National Emergency Helpline is **112** and the 24/7 Multi-lingual Tourist Helpline is **1363**.`,
      confidence: 'High',
      sources: ['Ministry of Tourism 24x7 Helpline', 'State Tourism Safety Guidelines'],
      warnings: ['Never accept unsolicited travel packages from individuals approaching at transit hubs.'],
      suggestedActions: [
        { label: 'Open Safety Center', type: 'safety' },
        { label: 'Fair Price Calculator', type: 'fair_price' }
      ]
    };
  }

  if (query.includes('taj mahal') || query.includes('agra')) {
    return {
      answer: `The Taj Mahal in Agra is open from Sunrise to Sunset and is **CLOSED on Fridays**.
Foreign visitor admission is ₹1,100 (+ ₹200 for main mausoleum plinth). Tickets must be purchased online in advance via the official ASI portal (asi.payumoney.com). Bring only minimal belongings (phone, camera, passport) as power banks, tripods, and food are strictly prohibited by security.`,
      confidence: 'High',
      sources: ['Archaeological Survey of India - Agra Circle'],
      warnings: ['Closed on Fridays for general visitors.', 'Power banks and tripods are strictly prohibited.'],
      suggestedActions: [
        { label: 'View Taj Mahal Details', type: 'search', payload: 'Taj Mahal' },
        { label: 'Explore Cultural Guide', type: 'culture', payload: 'temple-etiquette' }
      ]
    };
  }

  if (query.includes('vegetarian') || query.includes('food') || query.includes('lunch')) {
    return {
      answer: `Pure vegetarian food (Shakahari) is widely available across ${city}. In India, packaged food with a green circle inside a green square is certified vegetarian. When eating at local restaurants, you can ask "Kya yeh shakahari hai?" (Is this vegetarian?) and request "Kam teekha" (Less spicy) if you prefer milder seasoning.`,
      confidence: 'High',
      sources: ['WayFinder Culinary Guide', 'FSSAI Food Safety Standards'],
      warnings: ['Always drink sealed bottled water or verified filtered water in restaurants.'],
      suggestedActions: [
        { label: 'Local Phrases for Dining', type: 'culture', payload: 'dining-norms' }
      ]
    };
  }

  return {
    answer: `Welcome to WayFinder Intelligence for ${city}.
You can ask about visiting hours, cultural etiquette, fair transport pricing, recommended morning itineraries, or safety guidelines. All guidance is cross-referenced with official archaeological and regional tourism records.`,
    confidence: 'High',
    sources: ['WayFinder Curated Intelligence Engine'],
    warnings: ['Guidance is calibrated for current traveler ground realities.'],
    suggestedActions: [
      { label: 'Explore Top Places in ' + city, type: 'search', payload: city },
      { label: 'Check Fair Prices', type: 'fair_price' },
      { label: 'Safety Helplines', type: 'safety' }
    ]
  };
}

export async function translateTextWithGemini(
  text: string,
  targetLanguage: string,
  sourceLanguage: string = 'Auto-detect'
): Promise<{
  translation: string;
  phonetic?: string;
  pronunciationAdvice?: string;
  detectedSourceLanguage?: string;
}> {
  const ai = getGeminiClient();

  if (!ai) {
    return getFallbackTranslation(text, targetLanguage);
  }

  try {
    const prompt = `You are an expert translator for travelers in India.
Translate the following text from ${sourceLanguage} to ${targetLanguage}.
Provide accurate, natural, respectful translation with phonetic guide (Romanized script) for English speakers to pronounce easily.

Text to translate: "${text}"

Respond in JSON format:
{
  "translation": "translated text in target script",
  "phonetic": "easy phonetic romanization for speaking aloud",
  "pronunciationAdvice": "brief 1-sentence tip on inflection or tone",
  "detectedSourceLanguage": "English"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const clean = (response.text || '').replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      translation: parsed.translation || text,
      phonetic: parsed.phonetic || '',
      pronunciationAdvice: parsed.pronunciationAdvice || 'Speak clearly at a normal conversational pace.',
      detectedSourceLanguage: parsed.detectedSourceLanguage || 'English',
    };
  } catch (error) {
    console.error('Translation error:', error);
    return getFallbackTranslation(text, targetLanguage);
  }
}

function getFallbackTranslation(text: string, targetLanguage: string) {
  const lower = text.toLowerCase().trim();
  const dict: Record<string, { translation: string; phonetic: string }> = {
    'hello': { translation: 'नमस्ते', phonetic: 'Namaste' },
    'thank you': { translation: 'धन्यवाद', phonetic: 'Dhanyavaad' },
    'how much is this': { translation: 'यह कितने का है?', phonetic: 'Yeh kitne ka hai?' },
    'how much is this?': { translation: 'यह कितने का है?', phonetic: 'Yeh kitne ka hai?' },
    'please reduce the price': { translation: 'थोड़ा कम कीजिए', phonetic: 'Thoda kam kijiye' },
    'will you go to amber fort?': { translation: 'क्या आप आमेर का किला चलेंगे?', phonetic: 'Kya aap Amber Fort chalenge?' },
    'where is the bathroom?': { translation: 'शौचालय कहाँ है?', phonetic: 'Shauchalay kahan hai?' },
    'make it less spicy': { translation: 'कम तीखा बनाइए', phonetic: 'Kam teekha banaiye' },
    'is this vegetarian?': { translation: 'क्या यह शाकाहारी है?', phonetic: 'Kya yeh shakahari hai?' },
    'please help me': { translation: 'कृपया मेरी मदद कीजिए', phonetic: 'Kripya meri madad kijiye' },
  };

  if (dict[lower]) {
    return {
      translation: dict[lower].translation,
      phonetic: dict[lower].phonetic,
      pronunciationAdvice: 'Pronounce phonetically with a friendly, respectful tone.',
      detectedSourceLanguage: 'English'
    };
  }

  return {
    translation: text,
    phonetic: text,
    pronunciationAdvice: 'Direct translation dictionary fallback active.',
    detectedSourceLanguage: 'English'
  };
}
