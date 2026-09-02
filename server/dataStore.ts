import {
  CITIES,
  PLACES,
  CULTURAL_TOPICS,
  PHRASES,
  FAIR_PRICE_ITEMS,
  TRAVEL_UPDATES,
  SAFETY_RESOURCES
} from '../src/data/seedData';
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
  CityInfo
} from '../src/types';
import { calculateDistanceKm } from './itineraryEngine';

class DataStore {
  private cities: CityInfo[] = [...CITIES];
  private places: Map<string, Place> = new Map();
  private culturalTopics: CulturalTopic[] = [...CULTURAL_TOPICS];
  private phrases: Phrase[] = [...PHRASES];
  private fairPrices: FairPriceItem[] = [...FAIR_PRICE_ITEMS];
  private travelUpdates: TravelUpdate[] = [...TRAVEL_UPDATES];
  private safetyResources: SafetyResource[] = [...SAFETY_RESOURCES];
  private trips: Map<string, Trip> = new Map();
  private feedbackList: FeedbackSubmission[] = [];
  private reportList: IssueReportSubmission[] = [];

  constructor() {
    PLACES.forEach((p) => this.places.set(p.id, p));

    // Seed a demo initial trip for Jaipur for immediate demonstration
    const demoTrip: Trip = {
      id: 'demo-jaipur-trip',
      title: 'Jaipur Heritage & Flavors',
      cityId: 'jaipur',
      cityName: 'Jaipur',
      startDate: new Date().toISOString().split('T')[0],
      daysCount: 2,
      placeIds: ['amber-fort', 'city-palace-jaipur', 'hawa-mahal', 'jantar-mantar-jaipur'],
      itinerary: [
        {
          id: 'itin-demo-1',
          placeId: 'amber-fort',
          placeName: 'Amber Fort & Palace',
          placeImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
          cityId: 'jaipur',
          dayNumber: 1,
          timeSlot: 'Morning',
          startTime: '08:30 AM',
          endTime: '11:30 AM',
          durationHours: 2.5,
          travelTimeFromPrevMin: 0,
          notes: 'Best morning light in Sheesh Mahal.',
          tip: 'Official ticket counter only near Suraj Pol gate.'
        },
        {
          id: 'itin-demo-2',
          placeId: 'city-palace-jaipur',
          placeName: 'City Palace Jaipur',
          placeImage: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1000&q=80',
          cityId: 'jaipur',
          dayNumber: 1,
          timeSlot: 'Afternoon',
          startTime: '01:30 PM',
          endTime: '03:30 PM',
          durationHours: 2.0,
          travelTimeFromPrevMin: 22,
          notes: 'Visit Pritam Niwas Chowk peacock doorways.',
          tip: 'No photography inside arms gallery.'
        },
        {
          id: 'itin-demo-3',
          placeId: 'hawa-mahal',
          placeName: 'Hawa Mahal (Palace of Winds)',
          placeImage: 'https://images.unsplash.com/photo-1600100397608-f010f4439c28?auto=format&fit=crop&w=1200&q=80',
          cityId: 'jaipur',
          dayNumber: 1,
          timeSlot: 'Evening',
          startTime: '05:00 PM',
          endTime: '06:00 PM',
          durationHours: 1.0,
          travelTimeFromPrevMin: 8,
          notes: 'Capture sunset reflection on the pink stone facade.',
          tip: 'View from opposite rooftop cafe.'
        }
      ],
      travelPace: 'moderate',
      travelStyle: 'solo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.trips.set(demoTrip.id, demoTrip);
  }

  getCities(): CityInfo[] {
    return this.cities;
  }

  getAllPlaces(): Place[] {
    return Array.from(this.places.values());
  }

  getPlaceById(id: string): Place | undefined {
    return this.places.get(id);
  }

  searchPlaces(
    query?: string,
    cityId?: string,
    category?: string,
    tag?: string,
    scope: 'nearby' | 'india' = 'india',
    userLat?: number,
    userLng?: number
  ): Place[] {
    let list = this.getAllPlaces();

    if (cityId && cityId !== 'all') {
      list = list.filter((p) => p.cityId === cityId);
    }

    if (category && category !== 'all') {
      list = list.filter((p) => p.categories.includes(category as any));
    }

    if (tag && tag !== 'all') {
      list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        p.cityName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.speciality.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    // Attach calculated distance if coordinates provided
    if (userLat !== undefined && userLng !== undefined) {
      list = list.map((p) => {
        const dist = calculateDistanceKm(userLat, userLng, p.coordinates.lat, p.coordinates.lng);
        return { ...p, distanceKm: dist };
      });

      if (scope === 'nearby') {
        list.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
      }
    }

    return list;
  }

  getNearbyPlaces(lat: number, lng: number, radiusKm: number = 30): Place[] {
    const list = this.getAllPlaces().map((p) => {
      const dist = calculateDistanceKm(lat, lng, p.coordinates.lat, p.coordinates.lng);
      return { ...p, distanceKm: dist };
    });

    return list.filter((p) => (p.distanceKm || 0) <= radiusKm).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }

  getRecommendations(
    cityId?: string,
    interests: string[] = [],
    priority: string = 'balanced',
    userLat?: number,
    userLng?: number
  ): Place[] {
    let list = this.getAllPlaces();

    if (cityId && cityId !== 'all') {
      list = list.filter((p) => p.cityId === cityId);
    }

    // Score places deterministically
    const scored = list.map((place) => {
      let score = place.rating * 20; // 0–100 base from rating

      // Interest matching (+15 for each matching category/tag)
      if (interests.length > 0) {
        const matches = place.categories.filter((c) => interests.includes(c)).length;
        score += matches * 15;
      }

      // Priority adjustments
      if (priority === 'safety') {
        if (place.trust.status === 'VERIFIED') score += 20;
        if (place.trust.confidence === 'High') score += 15;
      } else if (priority === 'budget') {
        if (place.estimatedCost.indianCitizen === 0) score += 25;
        else if (place.estimatedCost.foreignNational < 300) score += 15;
      }

      let dist: number | undefined;
      if (userLat !== undefined && userLng !== undefined) {
        dist = calculateDistanceKm(userLat, userLng, place.coordinates.lat, place.coordinates.lng);
        if (dist < 10) score += 15;
      }

      return {
        place: { ...place, distanceKm: dist },
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.map((s) => s.place);
  }

  getCulturalTopics(): CulturalTopic[] {
    return this.culturalTopics;
  }

  getPhrases(category?: string, language?: string): Phrase[] {
    let list = this.phrases;
    if (category && category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (language && language !== 'all') {
      list = list.filter((p) => p.language.toLowerCase() === language.toLowerCase());
    }
    return list;
  }

  getFairPrices(cityId?: string, serviceType?: string): FairPriceItem[] {
    let list = this.fairPrices;
    if (cityId && cityId !== 'all') {
      list = list.filter((f) => f.cityId === cityId);
    }
    if (serviceType && serviceType !== 'all') {
      list = list.filter((f) => f.serviceType === serviceType);
    }
    return list;
  }

  getTravelUpdates(cityId?: string): TravelUpdate[] {
    let list = this.travelUpdates;
    if (cityId && cityId !== 'all') {
      list = list.filter((u) => u.cityId === cityId);
    }
    return list;
  }

  getSafetyResources(cityId?: string): SafetyResource[] {
    if (!cityId || cityId === 'all') {
      return this.safetyResources;
    }
    return this.safetyResources.filter((s) => s.isNational || s.cityId === cityId);
  }

  // Trips CRUD
  getTrip(id: string): Trip | undefined {
    return this.trips.get(id);
  }

  saveTrip(trip: Trip): Trip {
    trip.updatedAt = new Date().toISOString();
    this.trips.set(trip.id, trip);
    return trip;
  }

  deleteTrip(id: string): boolean {
    return this.trips.delete(id);
  }

  // Feedback & Reports
  addFeedback(feedback: FeedbackSubmission): FeedbackSubmission {
    this.feedbackList.push(feedback);
    return feedback;
  }

  getFeedbackForPlace(placeId: string): FeedbackSubmission[] {
    return this.feedbackList.filter((f) => f.placeId === placeId);
  }

  addReport(report: IssueReportSubmission): IssueReportSubmission {
    this.reportList.push(report);
    return report;
  }

  getStructuredContextForAI(cityId?: string): string {
    const places = this.getAllPlaces().filter((p) => !cityId || p.cityId === cityId);
    return places
      .map(
        (p) =>
          `[Place: ${p.name} | City: ${p.cityName} | Rating: ${p.rating} | Cost: Foreign ₹${p.estimatedCost.foreignNational}, Indian ₹${p.estimatedCost.indianCitizen} | Hours: ${p.openingHours.regular} | Best time: ${p.openingHours.bestTime} | Guidance: ${p.guidance.map((g) => g.title + ' - ' + g.description).join('; ')}]`
      )
      .join('\n');
  }
}

export const dataStore = new DataStore();
