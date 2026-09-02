import {
  Place,
  CulturalTopic,
  Phrase,
  FairPriceItem,
  TravelUpdate,
  SafetyResource,
  Trip,
  FeedbackSubmission,
  IssueReportSubmission,
  CityInfo,
  AIChatMessage
} from '../types';
import {
  CITIES,
  PLACES,
  CULTURAL_TOPICS,
  PHRASES,
  FAIR_PRICE_ITEMS,
  TRAVEL_UPDATES,
  SAFETY_RESOURCES
} from '../data/seedData';

const BASE_URL = '/api/v1';

async function fetchJson<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const json = await res.json();
    if (json && json.success) {
      return json.data;
    }
    throw new Error(json?.error?.message || 'Failed to fetch API data');
  } catch (err) {
    console.warn(`API call failed for ${url}, using resilient fallback:`, err);
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    throw err;
  }
}

export const api = {
  // Cities
  async getCities(): Promise<CityInfo[]> {
    return fetchJson<CityInfo[]>(`${BASE_URL}/cities`, undefined, CITIES);
  },

  // Places
  async getPlaces(params?: {
    query?: string;
    cityId?: string;
    category?: string;
    tag?: string;
    scope?: 'nearby' | 'india';
    lat?: number;
    lng?: number;
  }): Promise<Place[]> {
    const q = new URLSearchParams();
    if (params?.query) q.set('query', params.query);
    if (params?.cityId && params.cityId !== 'all') q.set('cityId', params.cityId);
    if (params?.category && params.category !== 'all') q.set('category', params.category);
    if (params?.tag && params.tag !== 'all') q.set('tag', params.tag);
    if (params?.scope) q.set('scope', params.scope);
    if (params?.lat !== undefined) q.set('lat', params.lat.toString());
    if (params?.lng !== undefined) q.set('lng', params.lng.toString());

    let fallback = [...PLACES];
    if (params?.cityId && params.cityId !== 'all') {
      fallback = fallback.filter((p) => p.cityId === params.cityId);
    }
    if (params?.category && params.category !== 'all') {
      fallback = fallback.filter((p) => p.categories.includes(params.category as any));
    }
    if (params?.query) {
      const s = params.query.toLowerCase();
      fallback = fallback.filter((p) => p.name.toLowerCase().includes(s) || p.cityName.toLowerCase().includes(s));
    }

    return fetchJson<Place[]>(`${BASE_URL}/places?${q.toString()}`, undefined, fallback);
  },

  async getPlaceById(id: string): Promise<Place> {
    const fallback = PLACES.find((p) => p.id === id) || PLACES[0];
    return fetchJson<Place>(`${BASE_URL}/places/${id}`, undefined, fallback);
  },

  async getRecommendations(params?: {
    cityId?: string;
    interests?: string[];
    priority?: string;
    lat?: number;
    lng?: number;
  }): Promise<Place[]> {
    const q = new URLSearchParams();
    if (params?.cityId) q.set('cityId', params.cityId);
    if (params?.interests?.length) q.set('interests', params.interests.join(','));
    if (params?.priority) q.set('priority', params.priority);
    if (params?.lat !== undefined) q.set('lat', params.lat.toString());
    if (params?.lng !== undefined) q.set('lng', params.lng.toString());

    let fallback = [...PLACES];
    if (params?.cityId && params.cityId !== 'all') {
      fallback = fallback.filter((p) => p.cityId === params.cityId);
    }

    return fetchJson<Place[]>(`${BASE_URL}/recommendations?${q.toString()}`, undefined, fallback);
  },

  async getNearbyPlaces(lat: number, lng: number, radius = 30): Promise<Place[]> {
    return fetchJson<Place[]>(
      `${BASE_URL}/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      undefined,
      PLACES
    );
  },

  // Culture
  async getCulture(): Promise<CulturalTopic[]> {
    return fetchJson<CulturalTopic[]>(`${BASE_URL}/culture`, undefined, CULTURAL_TOPICS);
  },

  // Phrases
  async getPhrases(category?: string, language?: string): Promise<Phrase[]> {
    const q = new URLSearchParams();
    if (category) q.set('category', category);
    if (language) q.set('language', language);
    return fetchJson<Phrase[]>(`${BASE_URL}/phrases?${q.toString()}`, undefined, PHRASES);
  },

  // Fair Prices
  async getFairPrices(cityId?: string, serviceType?: string): Promise<FairPriceItem[]> {
    const q = new URLSearchParams();
    if (cityId) q.set('cityId', cityId);
    if (serviceType) q.set('serviceType', serviceType);
    return fetchJson<FairPriceItem[]>(`${BASE_URL}/fair-price?${q.toString()}`, undefined, FAIR_PRICE_ITEMS);
  },

  async calculateFairPrice(payload: {
    cityId?: string;
    serviceType: string;
    quotedAmount: number;
    distanceKm?: number;
  }) {
    return fetchJson<any>(`${BASE_URL}/fair-price/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  // Safety
  async getSafetyResources(cityId?: string): Promise<SafetyResource[]> {
    const q = cityId ? `?cityId=${cityId}` : '';
    return fetchJson<SafetyResource[]>(`${BASE_URL}/safety${q}`, undefined, SAFETY_RESOURCES);
  },

  // Travel Updates
  async getTravelUpdates(cityId?: string): Promise<TravelUpdate[]> {
    const q = cityId ? `?cityId=${cityId}` : '';
    return fetchJson<TravelUpdate[]>(`${BASE_URL}/updates${q}`, undefined, TRAVEL_UPDATES);
  },

  // Trips
  async getTrip(id: string): Promise<Trip> {
    return fetchJson<Trip>(`${BASE_URL}/trips/${id}`);
  },

  async createTrip(trip: Partial<Trip>): Promise<Trip> {
    return fetchJson<Trip>(`${BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });
  },

  async updateTrip(id: string, updates: Partial<Trip>): Promise<Trip> {
    return fetchJson<Trip>(`${BASE_URL}/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  },

  async generateItinerary(id: string, daysCount: number, pace: string): Promise<Trip> {
    return fetchJson<Trip>(`${BASE_URL}/trips/${id}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ daysCount, pace }),
    });
  },

  async optimizeItinerary(id: string): Promise<{
    trip: Trip;
    travelTimeSavedMin: number;
    explanation: string;
  }> {
    return fetchJson<any>(`${BASE_URL}/trips/${id}/optimize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
  },

  // Feedback & Reports
  async submitFeedback(feedback: Partial<FeedbackSubmission>): Promise<any> {
    return fetchJson<any>(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
  },

  async submitReport(report: Partial<IssueReportSubmission>): Promise<any> {
    return fetchJson<any>(`${BASE_URL}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
  },

  // AI Chat Assistant
  async sendAIChat(message: string, context?: any): Promise<{
    answer: string;
    confidence: 'High' | 'Medium' | 'Preliminary';
    sources: string[];
    warnings: string[];
    suggestedActions: { label: string; type: any; payload?: string }[];
  }> {
    return fetchJson<any>(`${BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, context }),
    });
  },

  // Translation
  async translate(text: string, targetLanguage: string, sourceLanguage?: string): Promise<{
    translation: string;
    phonetic?: string;
    pronunciationAdvice?: string;
    detectedSourceLanguage?: string;
  }> {
    return fetchJson<any>(`${BASE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, targetLanguage, sourceLanguage }),
    });
  },
};
