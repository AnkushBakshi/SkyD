/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  User, Mail, Phone, Building, Calendar, Clock, MapPin, Users,
  Check, ChevronRight, ChevronLeft, Send, Sparkles, Disc, 
  HelpCircle, Printer, CheckCircle2, Ticket, ListMusic
} from 'lucide-react';
import { BookingInquiry } from '../types';

interface BookingFormProps {
  onInquirySubmitted: (inquiry: BookingInquiry) => void;
}

export default function BookingForm(props: BookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<BookingInquiry | null>(null);

  // Form State Values
  const [formData, setFormData] = useState({
    organizerName: '',
    email: '',
    phone: '',
    company: '',
    eventDate: '',
    duration: '4 Hours',
    venueLocation: '',
    crowdSize: '50-200' as BookingInquiry['crowdSize'],
    eventType: 'Exclusive Private Party' as BookingInquiry['eventType'],
    sonicDirections: [] as string[],
    djEquipment: 'Yes, fully equipped' as BookingInquiry['djEquipment'],
    peakVision: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Field Options
  const durationOptions = ['2 Hours', '4 Hours', '6 Hours', 'Full Night'];
  const crowdSizeOptions: BookingInquiry['crowdSize'][] = ['Under 50', '50-200', '200-500', '500+'];
  
  const eventTypes: BookingInquiry['eventType'][] = [
    'Golden Hour / Sundowner',
    'Exclusive Private Party',
    'Club / Nightlife Event',
    'Festival / Outdoor Stage',
    'Corporate / Brand Activation'
  ];

  const sonicDirections = [
    { key: 'Afro House', label: 'Afro House (Deep, rhythmic, driving)' },
    { key: 'Latin House', label: 'Latin House (Warm, infectious, high-energy)' },
    { key: 'Open-Format', label: 'Open-Format (Genre-fluid crowd-pleasers)' },
    { key: 'Techno / Tech House', label: 'Techno / Tech House (Underground, high-tempo)' }
  ];

  const djEquipments: { value: BookingInquiry['djEquipment']; label: string }[] = [
    { value: 'Yes, fully equipped', label: 'Yes, fully equipped (Pioneer CDJs & Mixer provided)' },
    { value: 'No, we need setup', label: 'No, we need SkyD to bring full controller/decks setup' },
    { value: 'I\'m not sure', label: 'I\'m not sure, let\'s review venue requirements together' }
  ];

  // Manual Checkboxes Support
  const toggleSonicDirection = (key: string) => {
    const prev = formData.sonicDirections;
    if (prev.includes(key)) {
      setFormData({ ...formData, sonicDirections: prev.filter(item => item !== key) });
    } else {
      setFormData({ ...formData, sonicDirections: [...prev, key] });
    }
  };

  // Validation before changing steps
  const validateStep = (step: number): boolean => {
    const nextErrors: { [key: string]: string } = {};

    if (step === 1) {
      if (!formData.organizerName.trim()) nextErrors.organizerName = 'Organizer Name is required';
      if (!formData.email.trim()) {
        nextErrors.email = 'Email Address is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        nextErrors.email = 'Please provide a valid email';
      }
      if (!formData.phone.trim()) nextErrors.phone = 'Phone Number is required';
    }

    if (step === 2) {
      if (!formData.eventDate) nextErrors.eventDate = 'Event Date is required';
      if (!formData.venueLocation.trim()) nextErrors.venueLocation = 'Venue & City Location is required';
    }

    if (step === 3) {
      if (formData.sonicDirections.length === 0) {
        nextErrors.sonicDirections = 'Please choose at least one sonic direction';
      }
    }

    if (step === 5) {
      if (formData.peakVision.trim().length < 15) {
        nextErrors.peakVision = 'Please describe the peak vision in at least 15 characters';
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(5)) return;

    setIsSubmitting(true);

    // Simulate elite sound analysis delay
    setTimeout(() => {
      const uniqueId = `SKY-${formData.eventDate.replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newInquiry: BookingInquiry = {
        ...formData,
        id: uniqueId,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
      };

      // Save to localStorage
      const existing = localStorage.getItem('skyd_bookings');
      const list = existing ? JSON.parse(existing) : [];
      list.push(newInquiry);
      localStorage.setItem('skyd_bookings', JSON.stringify(list));

      // Trigger parents
      props.onInquirySubmitted(newInquiry);
      setSubmittedInquiry(newInquiry);
      setIsSubmitting(false);
    }, 1800);
  };

  const resetForm = () => {
    setFormData({
      organizerName: '',
      email: '',
      phone: '',
      company: '',
      eventDate: '',
      duration: '4 Hours',
      venueLocation: '',
      crowdSize: '50-200',
      eventType: 'Exclusive Private Party',
      sonicDirections: [],
      djEquipment: 'Yes, fully equipped',
      peakVision: '',
    });
    setSubmittedInquiry(null);
    setCurrentStep(1);
    setErrors({});
  };

  return (
    <section className="py-24 bg-neutral-950 text-white relative min-h-screen flex items-center justify-center overflow-hidden border-b border-neutral-900" id="booking">
      {/* Background radial glowing effects */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto px-4 relative z-10">
        <AnimatePresence mode="wait">
          {!submittedInquiry ? (
            <motion.div
              key="booking-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-[#090909] border border-neutral-900 md:p-12 p-6 shadow-[0_30px_60px_rgba(0,0,0,0.85)] relative rounded-none"
            >
              <div className="text-center mb-10">
                <span className="font-mono text-[9px] text-[#d4af37] uppercase tracking-[0.3em] block mb-3">
                  Reservation Window
                </span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-[0.1em] text-white">
                  SECURE THE VIBE
                </h2>
                <p className="font-serif italic text-xs sm:text-sm text-neutral-400 mt-3 max-w-lg mx-auto leading-relaxed">
                  Tell us about your event. If the vision aligns, our management team will be in touch within 24 hours.
                </p>
                <div className="w-16 h-[1px] mt-4 bg-[#d4af37] mx-auto" />
              </div>

              {/* Step indicator */}
              <div className="mb-10 block">
                <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-2">
                  <span className="tracking-widest">STEP {currentStep} OF 5</span>
                  <span className="text-[#d4af37] tracking-widest font-bold">
                    {currentStep === 1 && 'THE BASICS'}
                    {currentStep === 2 && 'EVENT LOGISTICS'}
                    {currentStep === 3 && 'CHOOSE THE VIBE'}
                    {currentStep === 4 && 'EQUIPMENT CONFIG'}
                    {currentStep === 5 && 'THE PEAK VISION'}
                  </span>
                </div>
                {/* Horizontal Progress bar */}
                <div className="h-[2px] bg-neutral-900 rounded-none overflow-hidden">
                  <div
                    className="h-full bg-[#d4af37] transition-all duration-300"
                    style={{ width: `${(currentStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Steps renderers */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                        Full Name / Organizer Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                        <input
                          type="text"
                          required
                          value={formData.organizerName}
                          onChange={e => setFormData({ ...formData, organizerName: e.target.value })}
                          placeholder="e.g. Liam Sterling"
                          className={`w-full bg-neutral-950 border text-sm rounded-none pl-10 pr-4 py-3.5 text-white placeholder-neutral-750 focus:outline-none focus:border-[#d4af37] transition-colors ${
                            errors.organizerName ? 'border-rose-500' : 'border-neutral-900'
                          }`}
                        />
                      </div>
                      {errors.organizerName && <p className="text-xs text-rose-500 mt-1">{errors.organizerName}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="liam@vibelounge.com"
                            className={`w-full bg-neutral-950 border text-sm rounded-none pl-10 pr-4 py-3.5 text-white placeholder-neutral-750 focus:outline-none focus:border-[#d4af37] transition-colors ${
                              errors.email ? 'border-rose-500' : 'border-neutral-900'
                            }`}
                          />
                        </div>
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="+1 (555) 019-2834"
                            className={`w-full bg-neutral-950 border text-sm rounded-none pl-10 pr-4 py-3.5 text-white placeholder-neutral-750 focus:outline-none focus:border-[#d4af37] transition-colors ${
                              errors.phone ? 'border-rose-500' : 'border-neutral-900'
                            }`}
                          />
                        </div>
                        {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                        Company / Brand (Optional)
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                        <input
                          type="text"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Apex Hospitality Group"
                          className="w-full bg-neutral-950 border border-neutral-900 text-sm rounded-none pl-10 pr-4 py-3.5 text-white placeholder-neutral-750 focus:outline-none focus:border-[#d4af37] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-5"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Event Date *
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                          <input
                            type="date"
                            required
                            value={formData.eventDate}
                            onChange={e => setFormData({ ...formData, eventDate: e.target.value })}
                            className={`w-full bg-neutral-950 border text-sm rounded-none pl-10 pr-4 py-3.5 text-white focus:outline-none focus:border-[#d4af37] transition-colors ${
                              errors.eventDate ? 'border-rose-500' : 'border-neutral-900'
                            }`}
                          />
                        </div>
                        {errors.eventDate && <p className="text-xs text-rose-500 mt-1">{errors.eventDate}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Set Duration *
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {durationOptions.map(option => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => setFormData({ ...formData, duration: option })}
                              className={`py-3 text-[11px] font-mono uppercase tracking-wider rounded-none border text-center transition-all cursor-pointer ${
                                formData.duration === option
                                  ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-semibold animate-pulse-subtle'
                                  : 'bg-neutral-955 border-neutral-900 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Venue Name & Location *
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600" />
                          <input
                            type="text"
                            required
                            value={formData.venueLocation}
                            onChange={e => setFormData({ ...formData, venueLocation: e.target.value })}
                            placeholder="e.g. Sunset SkyBar, Los Angeles"
                            className={`w-full bg-neutral-950 border text-sm rounded-none pl-10 pr-4 py-3.5 text-white placeholder-neutral-750 focus:outline-none focus:border-[#d4af37] transition-colors ${
                              errors.venueLocation ? 'border-rose-500' : 'border-neutral-900'
                            }`}
                          />
                        </div>
                        {errors.venueLocation && <p className="text-xs text-rose-500 mt-1">{errors.venueLocation}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                          Expected Crowd Size *
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-3.5 w-4 h-4 text-neutral-600 md:block hidden animate-pulse-subtle" />
                          <select
                            value={formData.crowdSize}
                            onChange={e => setFormData({ ...formData, crowdSize: e.target.value as BookingInquiry['crowdSize'] })}
                            className="bg-neutral-950 border border-neutral-900 text-sm rounded-none px-4 py-3.5 w-full text-white focus:outline-none focus:border-[#d4af37]"
                          >
                            {crowdSizeOptions.map(option => (
                              <option key={option} value={option} className="bg-neutral-950 text-white">
                                {option} Guests
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <span className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-3.5">
                        What type of event are you hosting? (Check one)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {eventTypes.map(type => (
                          <div
                            key={type}
                            onClick={() => setFormData({ ...formData, eventType: type })}
                            className={`p-3.5 rounded-none border text-left cursor-pointer transition-all flex items-center justify-between text-xs ${
                              formData.eventType === type
                                ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-semibold'
                                : 'bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white'
                            }`}
                          >
                            <span className="font-serif tracking-wide">{type}</span>
                            <div className={`w-3.5 h-3.5 rounded-none border flex items-center justify-center ${
                              formData.eventType === type ? 'border-[#d4af37] bg-[#d4af37] text-neutral-950' : 'border-neutral-700'
                            }`}>
                              {formData.eventType === type && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                            </div>
                          </div>
                      ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-3.5">
                        Which sonic direction fits your night best? (Check all that apply)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {sonicDirections.map(dir => {
                          const isChecked = formData.sonicDirections.includes(dir.key);
                          return (
                            <div
                              key={dir.key}
                              onClick={() => toggleSonicDirection(dir.key)}
                              className={`p-3.5 rounded-none border text-left cursor-pointer transition-all flex items-center justify-between text-xs ${
                                isChecked
                                  ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-semibold'
                                  : 'bg-neutral-955 border-neutral-900 text-neutral-400 hover:text-white'
                              }`}
                            >
                              <span className="font-serif tracking-wide">{dir.label}</span>
                              <div className={`w-3.5 h-3.5 rounded-none border flex items-center justify-center ${
                                isChecked ? 'border-[#d4af37] bg-[#d4af37] text-neutral-950' : 'border-neutral-700'
                              }`}>
                                {isChecked && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {errors.sonicDirections && <p className="text-xs text-rose-500 mt-2">{errors.sonicDirections}</p>}
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <span className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-4 text-center">
                        Does the venue have a professional DJ booth/equipment?
                      </span>
                      <div className="space-y-3">
                        {djEquipments.map(item => (
                          <div
                            key={item.value}
                            onClick={() => setFormData({ ...formData, djEquipment: item.value })}
                            className={`p-5 rounded-none border text-left cursor-pointer transition-all flex items-center justify-between ${
                              formData.djEquipment === item.value
                                ? 'bg-[#d4af37]/10 border-[#d4af37] text-[#d4af37] font-semibold'
                                : 'bg-neutral-950/45 border-neutral-900 text-neutral-400 hover:text-neutral-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3.5 h-3.5 rounded-none border flex items-center justify-center ${
                                formData.djEquipment === item.value ? 'border-[#d4af37] bg-[#d4af37] text-neutral-950' : 'border-neutral-700'
                              }`}>
                                {formData.djEquipment === item.value && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                              </div>
                              <span className="text-sm font-serif tracking-wide">{item.label}</span>
                            </div>
                          </div>
                      ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-[0.2em] text-[#d4af37] mb-2.5">
                        Describe the energy you want at the peak of the night *
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={formData.peakVision}
                        onChange={e => setFormData({ ...formData, peakVision: e.target.value })}
                        placeholder="Tell us about the crowd and the exact vibe you want to create... e.g., Sunset sunset cocktail flowing gently into high energy dancing..."
                        className={`w-full bg-neutral-950 border text-sm rounded-none p-4 text-white placeholder-neutral-700 focus:outline-none focus:border-[#d4af37] transition-colors ${
                          errors.peakVision ? 'border-rose-500' : 'border-neutral-900'
                        }`}
                      />
                      <div className="flex items-center justify-between mt-1.5 text-xxs text-neutral-500 font-mono uppercase tracking-wider">
                        <span>Minimum 15 characters required</span>
                        <span className="text-[#d4af37]">{formData.peakVision.length} chars</span>
                      </div>
                      {errors.peakVision && <p className="text-xs text-rose-500 mt-2">{errors.peakVision}</p>}
                    </div>
                  </motion.div>
                )}

                {/* Footer Buttons Navigation */}
                <div className="flex items-center justify-between pt-6 border-t border-neutral-900">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="px-5 py-3 text-xs font-mono border border-neutral-900 hover:border-neutral-800 rounded-none text-neutral-400 hover:text-white flex items-center gap-2 transition-colors duration-150 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4 text-[#d4af37]" /> PREV STEP
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 5 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="px-6 py-3.5 text-xs font-mono bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:border-[#d4af37]/35 rounded-none text-white flex items-center gap-2 transition-all duration-150 cursor-pointer"
                    >
                      NEXT STEP <ChevronRight className="w-4 h-4 text-[#d4af37]" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 rounded-none bg-neutral-950 hover:bg-[#d4af37] text-white hover:text-neutral-950 border border-[#d4af37] font-bold text-xs font-mono tracking-widest uppercase flex items-center gap-2 shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-none h-4 w-4 border-2 border-white border-t-transparent" />
                          ANALYZING VIBE...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          INITIATE BOOKING
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          ) : (
            /* Golden-Hour VIP Ticket Receipt Confirmation Screen */
            <motion.div
              key="ticket-confirmation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto bg-[#090909] border border-neutral-900 rounded-none p-6 md:p-10 shadow-3xl relative overflow-hidden"
            >
              {/* Confetti element */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d4af37]/10 rounded-none blur-3xl pointer-events-none" />

              <div className="text-center mb-8">
                <CheckCircle2 className="w-12 h-12 text-[#d4af37] mx-auto mb-4" />
                <h3 className="font-serif text-2xl md:text-3xl font-light uppercase text-white tracking-[0.1em]">
                  VIBE ANALYZED & ALIGNED
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono mt-2 uppercase tracking-widest">
                  booking reference: <span className="text-[#d4af37]">{submittedInquiry.id}</span>
                </p>
              </div>

              {/* Aesthetic Ticket Receipt Layout */}
              <div className="bg-[#050505] rounded-none border border-neutral-900 overflow-hidden shadow-inner relative">
                {/* Horizontal dotted separator tabs on sides to simulate real boarding pass */}
                <div className="absolute left-[30%] top-0 bottom-0 w-px border-l-2 border-dashed border-neutral-800" />
                <div className="absolute -left-3 top-[50%] -translate-y-1/2 w-6 h-6 bg-[#090909] border border-neutral-900 rounded-full z-10" />
                <div className="absolute -right-3 top-[50%] -translate-y-1/2 w-6 h-6 bg-[#090909] border border-neutral-900 rounded-full z-10" />

                <div className="grid grid-cols-12">
                  {/* Ticket Left Side */}
                  <div className="col-span-8 p-6 text-left border-r border-neutral-900">
                    <div className="mb-4">
                      <span className="font-mono text-[9px] text-[#d4af37] block uppercase tracking-widest">Artist Selected</span>
                      <span className="font-sans text-sm font-bold text-white tracking-widest flex items-center gap-1.5 uppercase mt-1">
                        <Disc className="w-3.5 h-3.5 text-[#d4af37] animate-spin" /> SKY D
                      </span>
                    </div>

                    <div className="mb-4">
                      <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest">Organizer / Brand</span>
                      <span className="font-serif text-sm font-light text-white truncate block mt-1">
                        {submittedInquiry.organizerName}
                        {submittedInquiry.company && <span className="text-neutral-400 text-xxs block italic">({submittedInquiry.company})</span>}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-2">
                      <div>
                        <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest">Event Date</span>
                        <span className="font-serif text-xs font-light text-white">{submittedInquiry.eventDate}</span>
                      </div>
                      <div>
                        <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest">Duration</span>
                        <span className="font-serif text-xs font-light text-[#eeeeee]">{submittedInquiry.duration}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-900/60">
                      <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-widest">Location</span>
                      <span className="font-serif text-xs font-light text-neutral-300 block truncate mt-1">{submittedInquiry.venueLocation}</span>
                    </div>
                  </div>

                  {/* Ticket Right Side */}
                  <div className="col-span-4 p-5 flex flex-col justify-between bg-neutral-950/40 text-center relative">
                    <div className="space-y-1.5">
                      <span className="font-mono text-[9px] text-[#d4af37] block uppercase tracking-[0.2em]">
                        Vibe DNA
                      </span>
                      {submittedInquiry.sonicDirections.map(dir => (
                        <span key={dir} className="inline-block bg-[#d4af37]/5 text-[#d4af37] font-mono text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-[#d4af37]/20 block truncate mx-auto max-w-[100px]">
                          {dir.split(' ')[0]}
                        </span>
                      ))}
                    </div>

                    {/* QR Code / Barcode visualization */}
                    <div className="pt-4 flex flex-col items-center">
                      <div className="w-full h-8 flex items-center justify-between gap-0.5">
                        {[1.5, 3, 2, 4, 1.5, 3.5, 2, 1, 3, 2.5, 1.5, 4, 2, 3].map((h, i) => (
                          <div key={i} className="bg-[#d4af37]/50 w-full rounded-none" style={{ height: `${h * 18}%` }} />
                        ))}
                      </div>
                      <span className="font-mono text-[8px] text-neutral-500 mt-1.5 uppercase tracking-widest">PASS KEY</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status information banner */}
              <div className="mt-6 p-4 rounded-none bg-amber-500/5 border border-[#d4af37]/15 flex gap-3.5 items-start text-left">
                <Ticket className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif text-xs font-bold text-white uppercase tracking-wider">What happens next?</h4>
                  <p className="font-serif text-[11px] text-neutral-450 mt-1 leading-relaxed italic">
                    The management team analyzes dates against his tour schedules. We strive hard to preserve vibes; expect a matching confirmation dispatch on <span className="text-white font-medium underline decoration-[#d4af37]">{submittedInquiry.email}</span> within <span className="text-[#d4af37] underline decoration-dashed">24 hours</span>.
                  </p>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 py-3.5 bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-300 transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-[#d4af37]" /> PRINT INQUIRY
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3.5 bg-neutral-900 hover:bg-[#d4af37] hover:text-neutral-950 text-[#d4af37] border border-neutral-805 hover:border-[#d4af37] rounded-none text-[10px] font-mono uppercase tracking-[0.2em] font-light transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  SUBMIT NEW SLOT
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
