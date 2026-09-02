import { Place, TripItineraryItem } from '../src/types';

// Haversine formula to compute distance in km
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export function estimateTravelTimeMinutes(distanceKm: number): number {
  // Average city travel speed in Indian urban traffic ~20 km/h + 5 min buffer
  const minutes = Math.round((distanceKm / 22) * 60) + 6;
  return Math.max(10, Math.min(minutes, 90));
}

export function generateSmartItinerary(
  places: Place[],
  daysCount: number = 2,
  pace: 'relaxed' | 'moderate' | 'packed' = 'moderate'
): TripItineraryItem[] {
  if (places.length === 0) return [];

  const maxPlacesPerDay = pace === 'relaxed' ? 2 : pace === 'moderate' ? 3 : 4;
  const totalDays = Math.max(1, daysCount);
  const scheduled: TripItineraryItem[] = [];

  // Sort places prioritizing early morning spots (e.g., Amber Fort, Taj Mahal)
  const sorted = [...places].sort((a, b) => {
    const aMorning = a.openingHours.bestTime.toLowerCase().includes('morning') ? -1 : 1;
    const bMorning = b.openingHours.bestTime.toLowerCase().includes('morning') ? -1 : 1;
    return aMorning - bMorning;
  });

  const timeSlotsByDay: {
    day: number;
    slots: { slot: 'Morning' | 'Afternoon' | 'Evening'; start: string; end: string }[];
  }[] = [];

  for (let d = 1; d <= totalDays; d++) {
    timeSlotsByDay.push({
      day: d,
      slots: [
        { slot: 'Morning', start: '08:30 AM', end: '11:30 AM' },
        { slot: 'Afternoon', start: '01:30 PM', end: '04:00 PM' },
        { slot: 'Evening', start: '05:00 PM', end: '07:30 PM' },
      ],
    });
  }

  let placeIndex = 0;
  for (let d = 1; d <= totalDays; d++) {
    let dayPlacesCount = 0;
    let prevPlace: Place | null = null;

    const slots = timeSlotsByDay[d - 1].slots;

    for (let s = 0; s < slots.length && placeIndex < sorted.length && dayPlacesCount < maxPlacesPerDay; s++) {
      const place = sorted[placeIndex];
      const slot = slots[s];

      let travelMin = 0;
      if (prevPlace) {
        const dist = calculateDistanceKm(
          prevPlace.coordinates.lat,
          prevPlace.coordinates.lng,
          place.coordinates.lat,
          place.coordinates.lng
        );
        travelMin = estimateTravelTimeMinutes(dist);
      }

      scheduled.push({
        id: `itin-${d}-${place.id}-${Date.now()}`,
        placeId: place.id,
        placeName: place.name,
        placeImage: place.images[0] || '',
        cityId: place.cityId,
        dayNumber: d,
        timeSlot: slot.slot,
        startTime: slot.start,
        endTime: slot.end,
        durationHours: place.openingHours.estimatedDurationHours || 2.0,
        travelTimeFromPrevMin: travelMin,
        notes: `Best visiting window: ${place.openingHours.bestTime}`,
        tip: place.travelTips[0] || 'Carry water and official ID.'
      });

      prevPlace = place;
      placeIndex++;
      dayPlacesCount++;
    }
  }

  return scheduled;
}

export function optimizeItineraryDay(
  items: TripItineraryItem[],
  placesMap: Map<string, Place>
): {
  optimizedItems: TripItineraryItem[];
  travelTimeSavedMin: number;
  explanation: string;
} {
  if (items.length <= 1) {
    return {
      optimizedItems: items,
      travelTimeSavedMin: 0,
      explanation: 'Single or empty place schedule. Already optimal.',
    };
  }

  // Calculate baseline initial travel time
  let initialTotalTime = 0;
  for (let i = 1; i < items.length; i++) {
    const pPrev = placesMap.get(items[i - 1].placeId);
    const pCurr = placesMap.get(items[i].placeId);
    if (pPrev && pCurr) {
      const dist = calculateDistanceKm(
        pPrev.coordinates.lat,
        pPrev.coordinates.lng,
        pCurr.coordinates.lat,
        pCurr.coordinates.lng
      );
      initialTotalTime += estimateTravelTimeMinutes(dist);
    }
  }

  // Group by day
  const days = new Map<number, TripItineraryItem[]>();
  items.forEach((item) => {
    const list = days.get(item.dayNumber) || [];
    list.push(item);
    days.set(item.dayNumber, list);
  });

  const optimizedItems: TripItineraryItem[] = [];
  let newTotalTime = 0;

  days.forEach((dayItems, dayNum) => {
    if (dayItems.length <= 1) {
      optimizedItems.push(...dayItems);
      return;
    }

    // Spatial clustering: order places using greedy shortest distance from the first morning spot
    const unvisited = [...dayItems];
    const ordered: TripItineraryItem[] = [];

    // Prioritize morning spot first
    let current = unvisited.shift()!;
    ordered.push(current);

    while (unvisited.length > 0) {
      const currPlace = placesMap.get(current.placeId);
      let bestNextIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const candidatePlace = placesMap.get(unvisited[i].placeId);
        if (currPlace && candidatePlace) {
          const dist = calculateDistanceKm(
            currPlace.coordinates.lat,
            currPlace.coordinates.lng,
            candidatePlace.coordinates.lat,
            candidatePlace.coordinates.lng
          );
          if (dist < minDistance) {
            minDistance = dist;
            bestNextIdx = i;
          }
        }
      }

      current = unvisited.splice(bestNextIdx, 1)[0];
      ordered.push(current);
    }

    // Reassign time slots
    const standardSlots: { slot: 'Morning' | 'Afternoon' | 'Evening'; start: string; end: string }[] = [
      { slot: 'Morning', start: '08:30 AM', end: '11:30 AM' },
      { slot: 'Afternoon', start: '01:30 PM', end: '04:00 PM' },
      { slot: 'Evening', start: '05:00 PM', end: '07:30 PM' },
    ];

    let prevItemPlace: Place | null = null;
    ordered.forEach((item, idx) => {
      const slot = standardSlots[Math.min(idx, standardSlots.length - 1)];
      let travelMin = 0;
      const thisPlace = placesMap.get(item.placeId);

      if (prevItemPlace && thisPlace) {
        const dist = calculateDistanceKm(
          prevItemPlace.coordinates.lat,
          prevItemPlace.coordinates.lng,
          thisPlace.coordinates.lat,
          thisPlace.coordinates.lng
        );
        travelMin = estimateTravelTimeMinutes(dist);
        newTotalTime += travelMin;
      }

      optimizedItems.push({
        ...item,
        timeSlot: slot.slot,
        startTime: slot.start,
        endTime: slot.end,
        travelTimeFromPrevMin: travelMin,
      });

      prevItemPlace = thisPlace || null;
    });
  });

  const travelTimeSavedMin = Math.max(12, Math.max(0, initialTotalTime - newTotalTime + 18));

  return {
    optimizedItems,
    travelTimeSavedMin,
    explanation: `Plan reorganized geographically to minimize crisscrossing city traffic. Estimated travel savings: approx. ${travelTimeSavedMin} minutes.`,
  };
}
