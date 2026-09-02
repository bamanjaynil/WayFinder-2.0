import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { AIChatMessage } from '../types';
import { Button } from '../components/ui/Button';
import {
  Sparkles,
  Send,
  ShieldAlert,
  HelpCircle,
  Clock,
  ArrowRight,
  BookOpen,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Volume2
} from 'lucide-react';

export const AssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentCity, user } = useApp();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Namaste ${user.name}! I am your WayFinder Intelligence Advisor for India. I provide calm, culturally accurate, and verified ground-truth advice for ${currentCity.name} and across India. How can I help you right now?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      confidence: 'High',
      sources: ['WayFinder Verified Ground Truth', 'Ministry of Tourism India Guidelines'],
      suggestedActions: [
        { label: 'Check Auto Tariff', type: 'fair_price' },
        { label: 'Temple Dress Code', type: 'culture' },
        { label: 'Useful Hindi Phrases', type: 'phrases' },
      ],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If query passed in URL, auto-submit
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      handleSend(q);
    }
  }, [searchParams]);

  const handleSend = async (textToSend?: string) => {
    const queryText = textToSend || inputMessage;
    if (!queryText.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await api.sendAIChat(queryText, {
        cityId: currentCity.id,
        cityName: currentCity.name,
        userPreferences: user.preferences,
      });

      const aiMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: response.confidence || 'High',
        sources: response.sources || ['WayFinder Ground Truth Database'],
        warnings: response.warnings || [],
        suggestedActions: response.suggestedActions || [],
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: AIChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `In ${currentCity.name}, key monuments generally operate 09:00 to 17:30. For temple visits, remember to dress respectfully with shoulders and knees covered, remove footwear at designated shoe deposit counters, and agree upon auto-rickshaw fares or use official apps beforehand.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: 'Medium',
        sources: ['Curated Local Cultural Standards'],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action: { label: string; type: any; payload?: string }) => {
    if (action.type === 'fair_price') {
      navigate('/fair-price');
    } else if (action.type === 'culture') {
      navigate('/culture');
    } else if (action.type === 'phrases') {
      navigate('/phrasebook');
    } else if (action.type === 'place_detail' && action.payload) {
      navigate(`/place/${action.payload}`);
    } else if (action.type === 'safety') {
      navigate('/safety');
    }
  };

  const promptSuggestions = [
    `Is ₹300 a fair auto fare from Hawa Mahal to Amber Fort?`,
    `What is the dress code and shoe policy at Akshardham Temple?`,
    `Can you recommend safe vegetarian street food in ${currentCity.name}?`,
    `How do I politely decline aggressive touts outside monuments?`,
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col pb-24 lg:pb-12">
      {/* Top Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4 sticky top-16 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  WayFinder AI Intelligence Advisor
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
                  GROUND TRUTH AI
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Specialized in cultural nuances, fair pricing, and safety for {currentCity.name}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 flex flex-col gap-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            {/* Message Bubble */}
            <div
              className={`max-w-2xl rounded-2xl p-5 shadow-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-br-xs'
                  : 'bg-white border border-slate-200/90 text-slate-900 rounded-bl-xs'
              }`}
            >
              {/* Message text with basic paragraph formatting */}
              <div className="text-xs sm:text-sm space-y-2 whitespace-pre-wrap">
                {msg.text}
              </div>

              {/* AI Message Metadata: Confidence & Sources */}
              {msg.sender === 'ai' && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  {msg.confidence && (
                    <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Confidence: {msg.confidence}
                    </span>
                  )}
                  {msg.sources && msg.sources.length > 0 && (
                    <span className="text-slate-400">
                      Sources: {msg.sources.join(' · ')}
                    </span>
                  )}
                </div>
              )}

              {/* Crucial Warnings Box */}
              {msg.warnings && msg.warnings.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Practical Caution
                  </div>
                  {msg.warnings.map((w, idx) => (
                    <div key={idx}>• {w}</div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 pt-2">
                  {msg.suggestedActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleActionClick(action)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
                    >
                      <span>{action.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 p-4 max-w-sm rounded-2xl bg-white border border-slate-200 text-slate-600 text-xs">
            <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <span>Consulting WayFinder ground truth & cultural models...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* Suggested Prompt Chips */}
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 mb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {promptSuggestions.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium shrink-0 whitespace-nowrap shadow-2xs transition-colors cursor-pointer"
            >
              "{prompt}"
            </button>
          ))}
        </div>
      </div>

      {/* Input Form Bar */}
      <div className="bg-white border-t border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3 sticky bottom-16 lg:bottom-0">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Ask about monuments, scams, dress codes, or food in ${currentCity.name}...`}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!inputMessage.trim() || loading}
              className="h-11 px-5"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
