export type CityId =
  | 'jaipur'
  | 'delhi'
  | 'agra'
  | 'varanasi'
  | 'goa'
  | 'mumbai'
  | 'udaipur'
  | 'jodhpur'
  | 'amritsar'
  | 'rishikesh'
  | 'shimla'
  | 'manali'
  | 'bengaluru'
  | 'mysuru'
  | 'hyderabad'
  | 'chennai'
  | 'kochi'
  | 'munnar'
  | 'ooty'
  | 'pune'
  | 'ahmedabad'
  | 'kolkata'
  | 'darjeeling'
  | 'bhubaneswar'
  | 'puri'
  | 'bhopal'
  | 'indore'
  | 'khajuraho'
  | 'guwahati'
  | 'shillong'
  | string;

export interface CityInfo {
  id: CityId;
  name: string;
  state: string;
  region?: 'North' | 'South' | 'West' | 'East' | 'Central' | 'Northeast';
  tagline: string;
  coordinates: { lat: number; lng: number };
  image: string;
  popularFor: string[];
  description?: string;
}

export type PlaceCategory = 
  | 'heritage'
  | 'food'
  | 'spiritual'
  | 'photography'
  | 'nature'
  | 'shopping'
  | 'museum'
  | 'culture'
  | 'viewpoint';

export type TrustStatus = 'VERIFIED' | 'COMMUNITY_REPORTED' | 'DEMO' | 'AI_GENERATED';

export interface PracticalGuidance {
  id: string;
  type: 'ticket' | 'timing' | 'scam_prevention' | 'clothing' | 'transport' | 'general';
  title: string;
  description: string;
  severity: 'info' | 'caution' | 'important';
  verified: boolean;
  updatedAt: string;
}

export interface PlaceCulturalEtiquette {
  dressCode?: string;
  footwearRule?: 'remove_shoes' | 'shoe_covers_provided' | 'allowed' | 'socks_recommended';
  photography?: 'allowed_free' | 'ticket_required' | 'strictly_prohibited' | 'restricted_inside_sanctum';
  sacredRules?: string[];
  etiquetteTips?: string[];
}

export interface OpeningHours {
  regular: string;
  bestTime: string;
  closedOn?: string;
  isOpenToday?: boolean;
  estimatedDurationHours: number;
}

export interface Place {
  id: string;
  name: string;
  hindiName?: string;
  cityId: CityId;
  cityName: string;
  state: string;
  coordinates: { lat: number; lng: number };
  address: string;
  description: string;
  speciality: string;
  categories: PlaceCategory[];
  tags: string[];
  images: string[];
  rating: number;
  reviewCount: number;
  openingHours: OpeningHours;
  estimatedCost: {
    indianCitizen: number;
    foreignNational: number;
    currency: string;
    note?: string;
  };
  crowdLevel: 'Low' | 'Moderate' | 'High' | 'Peak';
  accessibility: {
    wheelchairAccessible: boolean;
    restroomsAvailable: boolean;
    stairsHeavy: boolean;
    drinkingWaterAvailable: boolean;
  };
  guidance: PracticalGuidance[];
  culture: PlaceCulturalEtiquette;
  travelTips: string[];
  trust: {
    status: TrustStatus;
    sourceType: string;
    confidence: 'High' | 'Medium' | 'Preliminary';
    lastVerified: string;
  };
  distanceKm?: number;
}

export interface CulturalTopic {
  id: string;
  title: string;
  category: 'sacred' | 'attire' | 'photography' | 'footwear' | 'dining' | 'greetings' | 'taboos' | 'tipping' | 'shopping' | 'bargaining' | string;
  summary: string;
  detailedGuide: string[];
  regionScope: string;
  doList?: string[];
  dontList?: string[];
  dos?: string[];
  donts?: string[];
  culturalContext: string;
  iconName: string;
}

export interface Phrase {
  id: string;
  originalText?: string;
  hindi?: string;
  transliteration?: string;
  phonetic?: string;
  english?: string;
  englishMeaning?: string;
  language?: string;
  category: string;
  contextTip?: string;
  situation?: string;
  audioPronunciationText?: string;
}

export interface FairPriceItem {
  id: string;
  cityId: CityId;
  serviceType: 'auto_rickshaw' | 'taxi' | 'monument_guide' | 'street_food' | 'market_shopping' | 'boat_ride';
  title: string;
  routeOrItem: string;
  minPrice: number;
  maxPrice: number;
  currency: string;
  unit: string;
  practicalAdvice: string;
  negotiationTips: string[];
  recommendedAlternatives: string[];
}

export interface TravelUpdate {
  id: string;
  title: string;
  summary: string;
  cityId: CityId;
  cityName: string;
  relatedPlaceId?: string;
  relatedPlaceName?: string;
  date: string;
  importance: 'low' | 'medium' | 'high';
  sourceLabel: string;
  category: 'advisory' | 'event' | 'maintenance' | 'weather';
}

export interface SafetyResource {
  id: string;
  type: 'helpline' | 'hospital' | 'police' | 'women_safety' | 'tourist_desk';
  name: string;
  phoneNumber: string;
  address?: string;
  cityId?: CityId;
  availableHours: string;
  description: string;
  isNational: boolean;
}

export interface TripItineraryItem {
  id: string;
  placeId: string;
  placeName: string;
  placeImage: string;
  cityId?: CityId;
  dayNumber: number;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening' | 'Night' | string;
  startTime: string;
  endTime?: string;
  durationHours: number;
  travelTimeFromPrevMin?: number;
  distanceFromPrevKm?: number;
  notes?: string;
  tip?: string;
}

export interface Trip {
  id: string;
  title: string;
  cityId: CityId;
  cityName: string;
  startDate: string;
  daysCount: number;
  placeIds: string[];
  itinerary: TripItineraryItem[];
  travelPace: 'relaxed' | 'moderate' | 'packed';
  travelStyle: 'solo' | 'couple' | 'family' | 'friends';
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  companion: 'solo' | 'couple' | 'family' | 'friends';
  interests: PlaceCategory[];
  priority: 'safety' | 'budget' | 'convenience' | 'authentic';
  diet: 'all' | 'vegetarian' | 'vegan' | 'jain' | 'halal';
  language: string;
  onboardingCompleted: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  avatarUrl?: string;
  preferences: UserPreferences;
  savedPlaceIds: string[];
  activeTripId?: string;
  emergencyContacts: EmergencyContact[];
}

export interface FeedbackSubmission {
  id: string;
  placeId: string;
  placeName: string;
  userId?: string;
  isHoursAccurate: boolean;
  isPriceAccurate: boolean;
  isGuidanceHelpful: boolean;
  crowdRating: 'Low' | 'Moderate' | 'High' | 'Peak';
  comments?: string;
  timestamp: string;
}

export interface IssueReportSubmission {
  id: string;
  placeId: string;
  placeName: string;
  category: 'wrong_hours' | 'wrong_price' | 'accessibility' | 'misleading' | 'touts_concern' | 'other';
  description: string;
  timestamp: string;
  status: 'received' | 'investigating' | 'resolved';
}

export interface AIChatMessage {
  id: string;
  sender?: 'user' | 'ai';
  role?: 'user' | 'assistant';
  text?: string;
  content?: string;
  timestamp: string;
  sources?: string[];
  confidence?: 'High' | 'Medium' | 'Preliminary' | string;
  suggestedActions?: {
    label: string;
    type?: string;
    payload?: string;
  }[];
  warnings?: string[];
}
