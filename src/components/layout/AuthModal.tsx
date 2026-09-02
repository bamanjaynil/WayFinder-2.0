import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useApp } from '../../context/AppContext';
import { Compass, Sparkles, Shield, Bookmark, CheckCircle, Mail, User as UserIcon } from 'lucide-react';
import { firebaseAuthService } from '../../services/firebaseService';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAsGuest, showToast } = useApp();
  const [tab, setTab] = useState<'signin' | 'guest'>('signin');

  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const mapFirebaseError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/popup-closed-by-user') {
      return "Sign in cancelled.";
    }
    if (code === 'auth/network-request-failed') {
      return 'Network connection issue. Please check your internet and try again.';
    }
    return err?.message || 'Authentication error. Please try again.';
  };

  const handleSignInWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);
    try {
      await firebaseAuthService.signInWithGoogle();
      setIsAuthModalOpen(false);
      showToast('success', 'Signed In', 'Welcome to WayFinder!');
    } catch (err: any) {
      setErrorMessage(mapFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    setIsAuthModalOpen(false);
    showToast('info', 'Guest Mode Active', 'Enjoy full access to Indian guides and phrasebooks.');
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={() => setIsAuthModalOpen(false)}
      maxWidth="md"
    >
      {/* Header Visual */}
      <div className="text-center mb-5">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center mx-auto mb-3 shadow-md">
          <Compass className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          WayFinder Traveler Access
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
          Your calm, intelligent companion for discovering India with cultural confidence and peace of mind.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-slate-100 rounded-xl mb-5">
        <button
          type="button"
          onClick={() => {
            setTab('signin');
            setErrorMessage('');
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === 'signin' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => {
            setTab('guest');
            setErrorMessage('');
          }}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
            tab === 'guest' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Guest Access
        </button>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {errorMessage}
        </div>
      )}

      {/* Sign In Form */}
      {tab === 'signin' && (
        <form onSubmit={handleSignInWithGoogle} className="space-y-4">
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Cloud Sync</strong>: Save trips securely and access them across devices.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Real Community</strong>: Submit place feedback to help fellow travelers.</span>
            </div>
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              className="w-full flex items-center justify-center gap-2"
            >
              Sign In with Google
            </Button>
          </div>
        </form>
      )}

      {/* Guest Mode Info & Action */}
      {tab === 'guest' && (
        <div className="space-y-4">
          <div className="space-y-2.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Instant Access</strong>: Explore 30+ Indian destinations, monument timings, dress codes, radar compass, and phrasebooks immediately.</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-slate-700">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Local Storage</strong>: Bookmarks and custom itineraries will save locally to your browser cache.</span>
            </div>
          </div>

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={handleGuest}
            className="w-full"
          >
            Continue in Guest Mode
          </Button>
        </div>
      )}
    </Modal>
  );
};
