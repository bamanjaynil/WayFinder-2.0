import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { CitySelectorModal } from './components/layout/CitySelectorModal';
import { AuthModal } from './components/layout/AuthModal';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { ToastContainer } from './components/ui/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SearchPage } from './pages/SearchPage';
import { PlaceDetailPage } from './pages/PlaceDetailPage';
import { CompassPage } from './pages/CompassPage';
import { TripsPage } from './pages/TripsPage';
import { AssistantPage } from './pages/AssistantPage';
import { CulturePage } from './pages/CulturePage';
import { PhrasebookPage } from './pages/PhrasebookPage';
import { FairPricePage } from './pages/FairPricePage';
import { SafetyPage } from './pages/SafetyPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-amber-100 selection:text-amber-950">
          <Navbar />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/place/:id" element={<PlaceDetailPage />} />
              <Route path="/compass" element={<CompassPage />} />
              <Route path="/trips" element={<TripsPage />} />
              <Route path="/trips/:id" element={<TripsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/culture" element={<CulturePage />} />
              <Route path="/phrasebook" element={<PhrasebookPage />} />
              <Route path="/fair-price" element={<FairPricePage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </div>

          <BottomNav />
          <CitySelectorModal />
          <AuthModal />
          <OnboardingModal />
          <ToastContainer />
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
