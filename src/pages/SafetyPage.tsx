import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { SafetyResource, EmergencyContact } from '../types';
import { Button } from '../components/ui/Button';
import { SectionHeader } from '../components/ui/SectionHeader';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  PhoneCall,
  MapPin,
  Share2,
  AlertTriangle,
  Building2,
  HeartPulse,
  Plus,
  Trash2,
  CheckCircle2,
  Users
} from 'lucide-react';

export const SafetyPage: React.FC = () => {
  const { currentCity, user, userLocation, requestUserLocation, showToast } = useApp();

  const [resources, setResources] = useState<SafetyResource[]>([]);
  const [contacts, setContacts] = useState<EmergencyContact[]>(user.emergencyContacts || []);
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  // New Contact form
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRel, setNewContactRel] = useState('Family');

  useEffect(() => {
    api.getSafetyResources(currentCity.id).then(setResources);
  }, [currentCity.id]);

  const nationalHelplines = [
    { number: '112', label: 'All-India Unified Emergency', desc: 'Police, Fire, Medical Response in all Indian States', primary: true },
    { number: '1363', label: '24x7 Multi-Lingual Tourist Helpline', desc: 'Govt of India Ministry of Tourism (English, French, German, Spanish, Hindi, etc.)', primary: true },
    { number: '1091', label: "Women's Helpline (Specialized)", desc: 'Dedicated 24x7 safety response & support for women travelers', primary: false },
    { number: '102', label: 'Medical Ambulance (Direct)', desc: 'National government medical dispatch', primary: false },
  ];

  const handleShareLiveLocation = () => {
    const lat = userLocation?.lat || currentCity.coordinates.lat;
    const lng = userLocation?.lng || currentCity.coordinates.lng;
    const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
    const text = `WayFinder Safety Notice: I am currently at ${currentCity.name}. My coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}. Map link: ${mapUrl}`;

    if (navigator.share) {
      navigator.share({ title: 'My Location in India', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast('success', 'Location Text Copied', 'Paste into WhatsApp, SMS, or Telegram to share with your family.');
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName || !newContactPhone) return;

    const contact: EmergencyContact = {
      id: `ec-${Date.now()}`,
      name: newContactName,
      phone: newContactPhone,
      relationship: newContactRel,
    };
    setContacts([...contacts, contact]);
    setIsAddContactOpen(false);
    setNewContactName('');
    setNewContactPhone('');
    showToast('success', 'Contact Saved', `${contact.name} added to trusted list.`);
  };

  const handleRemoveContact = (id: string) => {
    setContacts(contacts.filter((c) => c.id !== id));
    showToast('info', 'Contact Removed');
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24 lg:pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Safety & Emergency Response Intelligence
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Direct official Indian helplines, location sharing, and verified emergency facilities.
                </p>
              </div>
            </div>

            {/* Quick Share SOS button */}
            <Button
              variant="danger"
              size="md"
              onClick={handleShareLiveLocation}
              className="shadow-sm"
            >
              <Share2 className="w-4 h-4" />
              Share Current Location Link
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* National Helplines Bar */}
        <section>
          <SectionHeader
            title="Official National Helplines"
            subtitle="Toll-free 24x7 assistance from any Indian mobile network or landline"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {nationalHelplines.map((item, idx) => (
              <a
                key={idx}
                href={`tel:${item.number}`}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between group ${
                  item.primary
                    ? 'bg-rose-50 border-rose-200 hover:border-rose-300'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-2xl font-extrabold text-rose-700 tracking-tight">
                      {item.number}
                    </span>
                    <div className="p-2 rounded-xl bg-white text-rose-700 shadow-2xs group-hover:bg-rose-700 group-hover:text-white transition-colors">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-rose-700 group-hover:underline">
                  Tap to Dial Directly →
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Local Verified Emergency Facilities (Hospitals & Police) */}
        <section>
          <SectionHeader
            title={`Verified Emergency Resources in ${currentCity.name}`}
            subtitle="Accredited 24x7 emergency medical centers and tourist police assistance booths"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resources.map((res) => {
              const isHospital = res.type === 'hospital';
              return (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-start gap-4"
                >
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isHospital ? 'bg-rose-50 text-rose-700' : 'bg-sky-50 text-sky-700'
                  }`}>
                    {isHospital ? <HeartPulse className="w-5 h-5" /> : <Building2 className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {res.type.toUpperCase()} · 24/7
                      </span>
                      {res.verified && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Verified
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 truncate">
                      {res.name}
                    </h4>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{res.address}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                      <a
                        href={`tel:${res.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline"
                      >
                        <PhoneCall className="w-3 h-3" />
                        {res.phone}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Trusted Personal Contacts Manager */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Your Trusted Emergency Contacts
              </h3>
              <p className="text-xs text-slate-500">
                Saved contacts for instant one-tap messaging or emergency dispatch.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddContactOpen(true)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Contact
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
            {contacts.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-900">{c.name}</h5>
                  <p className="text-xs text-slate-600 font-mono mt-0.5">{c.phone}</p>
                  <span className="text-[10px] text-slate-400">{c.relationship}</span>
                </div>
                <button
                  onClick={() => handleRemoveContact(c.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Add Contact Modal */}
      <Modal
        isOpen={isAddContactOpen}
        onClose={() => setIsAddContactOpen(false)}
        title="Add Emergency Contact"
        subtitle="Saved locally on your device"
        maxWidth="sm"
      >
        <form onSubmit={handleAddContact} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Contact Name
            </label>
            <input
              type="text"
              required
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              placeholder="e.g. Partner / Family"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={newContactPhone}
              onChange={(e) => setNewContactPhone(e.target.value)}
              placeholder="+1 555 019 2831"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Relationship
            </label>
            <input
              type="text"
              value={newContactRel}
              onChange={(e) => setNewContactRel(e.target.value)}
              placeholder="Family / Friend / Hotel"
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 text-slate-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsAddContactOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
            >
              Save Contact
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
