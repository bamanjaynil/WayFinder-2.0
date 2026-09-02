import React, { createContext, useContext, useState, useEffect } from 'react';
import { CityInfo, CityId, UserProfile, UserPreferences, Trip, Place } from '../types';
import { CITIES, PLACES } from '../data/seedData';
import { api } from '../services/api';
import { firebaseAuthService, firestoreService } from '../services/firebaseService';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
}

interface AppContextType {
  cities: CityInfo[];
  currentCity: CityInfo;
  setCurrentCityId: (cityId: CityId) => void;
  user: UserProfile;
  loginAsGuest: () => void;
  loginUser: (name: string, email: string) => void;
  logout: () => Promise<void>;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  savedPlaceIds: string[];
  toggleSavePlace: (placeId: string) => void;
  isPlaceSaved: (placeId: string) => boolean;
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  userTrips: Trip[];
  loadTrip: (tripId: string) => Promise<void>;
  saveTripToCloud: (trip: Trip) => Promise<void>;
  userLocation: { lat: number; lng: number } | null;
  requestUserLocation: () => Promise<void>;
  toasts: ToastMessage[];
  showToast: (type: 'success' | 'info' | 'warning' | 'error', title: string, description?: string) => void;
  removeToast: (id: string) => void;
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
}

const defaultPreferences: UserPreferences = {
  companion: 'solo',
  interests: ['heritage', 'food', 'photography'],
  priority: 'safety',
  diet: 'all',
  language: 'English',
  onboardingCompleted: true,
};

const defaultProfile: UserProfile = {
  id: 'guest-traveler',
  name: 'Guest Traveler',
  isGuest: true,
  preferences: defaultPreferences,
  savedPlaceIds: [],
  activeTripId: undefined,
  emergencyContacts: [
    { id: 'ec-1', name: 'National Emergency', phone: '112', relationship: 'Police' },
    { id: 'ec-2', name: 'Tourist Helpline', phone: '1363', relationship: 'Support' },
  ],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cities] = useState<CityInfo[]>(CITIES);
  const [currentCityId, setCurrentCityIdState] = useState<CityId>('jaipur');
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wayfinder_user_profile');
      return saved ? JSON.parse(saved) : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [userTrips, setUserTrips] = useState<Trip[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  // Sync current city object
  const currentCity = cities.find((c) => c.id === currentCityId) || cities[0];

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Logged in via Firebase
        const profile = await firestoreService.getUserProfile(firebaseUser.uid);
        setUser((prev) => ({
          ...prev,
          id: firebaseUser.uid,
          name: profile?.name || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Traveler',
          email: firebaseUser.email || '',
          isGuest: false,
          savedPlaceIds: profile?.savedPlaceIds || prev.savedPlaceIds,
          preferences: profile?.preferences || prev.preferences,
        }));
      } else {
        // Guest or signed out
        setUser((prev) => {
          if (!prev.isGuest) {
            return {
              ...defaultProfile,
              id: `guest-${Date.now()}`,
              isGuest: true,
            };
          }
          return prev;
        });
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to User Trips in Firestore if authenticated
  useEffect(() => {
    if (!user.isGuest && user.id && !user.id.startsWith('guest-')) {
      const unsubscribe = firestoreService.subscribeToUserTrips(user.id, (trips) => {
        setUserTrips(trips);
        if (trips.length > 0 && !activeTrip) {
          setActiveTrip(trips[0]);
        }
      });
      return () => unsubscribe();
    }
  }, [user.id, user.isGuest]);

  // Save profile to localStorage for instant local access
  useEffect(() => {
    try {
      localStorage.setItem('wayfinder_user_profile', JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    if (!user.isGuest && user.id && !user.id.startsWith('guest-')) {
      firestoreService.saveUserProfile(user.id, {
        name: user.name,
        email: user.email,
        savedPlaceIds: user.savedPlaceIds,
        preferences: user.preferences,
      });
    }
  }, [user]);

  // Initial load of default demo trip if none
  useEffect(() => {
    if (!activeTrip) {
      api.getTrip('demo-jaipur-trip').then((trip) => {
        if (trip) setActiveTrip(trip);
      }).catch(() => {
        // Fallback
      });
    }
  }, []);

  const setCurrentCityId = (cityId: CityId) => {
    setCurrentCityIdState(cityId);
    setUserLocation(null);
    showToast('info', `City switched to ${cities.find((c) => c.id === cityId)?.name || cityId}`);
  };

  const loginAsGuest = () => {
    const guestUser: UserProfile = {
      ...defaultProfile,
      id: `guest-${Date.now()}`,
      name: 'Guest Explorer',
      isGuest: true,
    };
    setUser(guestUser);
    setIsAuthModalOpen(false);
    showToast('success', 'Continuing as Guest', 'All public intelligence, maps, and guides are accessible.');
  };

  const loginUser = (name: string, email: string) => {
    const authUser: UserProfile = {
      ...user,
      id: `user-${Date.now()}`,
      name: name || 'Alex Rivera',
      email: email || 'alex@example.com',
      isGuest: false,
    };
    setUser(authUser);
    setIsAuthModalOpen(false);
    showToast('success', `Welcome back, ${authUser.name}!`, 'Personalized trips and preferences synchronized.');
  };

  const logout = async () => {
    try {
      await firebaseAuthService.signOut();
    } catch (err) {
      console.warn('Firebase signout error:', err);
    }
    loginAsGuest();
    showToast('info', 'Signed out', 'Now browsing in Guest mode.');
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...prefs,
      },
    }));
    showToast('success', 'Preferences updated', 'Recommendations tailored to your travel style.');
  };

  const toggleSavePlace = (placeId: string) => {
    setUser((prev) => {
      const exists = prev.savedPlaceIds.includes(placeId);
      const updated = exists
        ? prev.savedPlaceIds.filter((id) => id !== placeId)
        : [...prev.savedPlaceIds, placeId];

      const placeName = PLACES.find((p) => p.id === placeId)?.name || 'Place';
      if (exists) {
        showToast('info', 'Removed from saved places', placeName);
      } else {
        showToast('success', 'Saved to your collection', placeName);
      }

      return {
        ...prev,
        savedPlaceIds: updated,
      };
    });
  };

  const isPlaceSaved = (placeId: string) => {
    return user.savedPlaceIds.includes(placeId);
  };

  const loadTrip = async (tripId: string) => {
    try {
      const trip = await api.getTrip(tripId);
      if (trip) {
        setActiveTrip(trip);
        setUser((prev) => ({ ...prev, activeTripId: trip.id }));
        if (trip.cityId) {
          setCurrentCityIdState(trip.cityId);
        }
      }
    } catch (e) {
      console.warn('Failed to load trip', e);
    }
  };

  const saveTripToCloud = async (trip: Trip) => {
    setActiveTrip(trip);
    if (!user.isGuest && user.id && !user.id.startsWith('guest-')) {
      await firestoreService.saveTrip(user.id, trip);
      showToast('success', 'Trip Synced to Cloud', `${trip.title} is backed up in your Firebase account.`);
    } else {
      showToast('info', 'Trip Saved Locally', 'Sign in to sync your trips across all devices.');
    }
  };

  const requestUserLocation = async (): Promise<void> => {
    return new Promise((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            setUserLocation(coords);
            showToast('success', 'GPS Location active', `Latitude: ${coords.lat.toFixed(3)}, Longitude: ${coords.lng.toFixed(3)}`);
            resolve();
          },
          (err) => {
            console.warn('Geolocation denied or unavailable:', err);
            setUserLocation(currentCity.coordinates);
            showToast('info', `Using ${currentCity.name} center`, 'Location permission unavailable. You can change city manually anytime.');
            resolve();
          },
          { timeout: 8000 }
        );
      } else {
        setUserLocation(currentCity.coordinates);
        resolve();
      }
    });
  };

  const showToast = (type: 'success' | 'info' | 'warning' | 'error', title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        cities,
        currentCity,
        setCurrentCityId,
        user,
        loginAsGuest,
        loginUser,
        logout,
        updatePreferences,
        savedPlaceIds: user.savedPlaceIds,
        toggleSavePlace,
        isPlaceSaved,
        activeTrip,
        setActiveTrip,
        userTrips,
        loadTrip,
        saveTripToCloud,
        userLocation,
        requestUserLocation,
        toasts,
        showToast,
        removeToast,
        isOnboardingOpen,
        setIsOnboardingOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCityModalOpen,
        setIsCityModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
