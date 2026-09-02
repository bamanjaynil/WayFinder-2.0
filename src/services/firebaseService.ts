import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { Trip, FeedbackSubmission, UserProfile, UserPreferences } from '../types';

export const firebaseAuthService = {
  onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  async signInWithGoogle(): Promise<FirebaseUser> {
    const cred = await signInWithPopup(auth, googleProvider);
    const user = cred.user;
    
    // Create initial user profile document in Firestore if it doesn't exist
    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'Traveler',
          email: user.email,
          travelStyle: 'solo',
          dietaryPreference: 'all',
          interests: ['heritage', 'food', 'photography'],
          savedPlaceIds: [],
          language: 'English',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('Could not save user profile doc to firestore:', err);
    }

    return user;
  },

  async signOut(): Promise<void> {
    await signOut(auth);
  },

  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }
};

export const firestoreService = {
  // User Profile
  async getUserProfile(userId: string): Promise<Partial<UserProfile> | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data() as Partial<UserProfile>;
      }
    } catch (err) {
      console.warn('Error fetching firestore user profile:', err);
    }
    return null;
  },

  async saveUserProfile(userId: string, data: Partial<UserProfile>): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error saving firestore user profile:', err);
    }
  },

  // Trips
  async saveTrip(userId: string, trip: Trip): Promise<void> {
    try {
      const tripRef = doc(db, 'users', userId, 'trips', trip.id);
      await setDoc(tripRef, {
        ...trip,
        userId,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (err) {
      console.warn('Error saving trip in firestore:', err);
    }
  },

  async getUserTrips(userId: string): Promise<Trip[]> {
    try {
      const tripsColl = collection(db, 'users', userId, 'trips');
      const snap = await getDocs(tripsColl);
      return snap.docs.map(d => d.data() as Trip);
    } catch (err) {
      console.warn('Error getting trips in firestore:', err);
      return [];
    }
  },

  subscribeToUserTrips(userId: string, callback: (trips: Trip[]) => void) {
    const tripsColl = collection(db, 'users', userId, 'trips');
    return onSnapshot(tripsColl, (snap) => {
      const trips = snap.docs.map(d => d.data() as Trip);
      callback(trips);
    }, (err) => {
      console.warn('Firestore trips listener error:', err);
    });
  },

  async deleteTrip(userId: string, tripId: string): Promise<void> {
    try {
      const tripRef = doc(db, 'users', userId, 'trips', tripId);
      await deleteDoc(tripRef);
    } catch (err) {
      console.warn('Error deleting trip in firestore:', err);
    }
  },

  // Feedback
  async submitFeedback(feedback: Partial<FeedbackSubmission>): Promise<string> {
    try {
      const coll = collection(db, 'feedbacks');
      const docRef = await addDoc(coll, {
        ...feedback,
        createdAt: new Date().toISOString(),
        status: 'verified_traveler'
      });
      return docRef.id;
    } catch (err) {
      console.warn('Error submitting feedback to firestore:', err);
      return `local-${Date.now()}`;
    }
  },

  async getPlaceFeedbacks(placeId: string): Promise<FeedbackSubmission[]> {
    try {
      const coll = collection(db, 'feedbacks');
      const q = query(coll, where('placeId', '==', placeId));
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as FeedbackSubmission));
    } catch (err) {
      console.warn('Error fetching place feedbacks from firestore:', err);
      return [];
    }
  }
};
