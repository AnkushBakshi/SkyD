/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  FolderLock, Search, Filter, Inbox, SlidersHorizontal, Check, 
  X, Sparkles, MessageSquare, MapPin, CalendarDays, BarChart4,
  Trash2, ShieldCheck, HelpCircle, User, Info, Users
} from 'lucide-react';
import { BookingInquiry } from '../types';

interface InquiryManagerProps {
  inquiries: BookingInquiry[];
  onUpdateInquiries: (updatedList: BookingInquiry[]) => void;
}

export default function InquiryManager(props: InquiryManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Aligned' | 'Declined'>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<BookingInquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');

  // Pre-seed demo inquiries if localStorage is empty
  useEffect(() => {
    const localData = localStorage.getItem('skyd_bookings');
    if (!localData || JSON.parse(localData).length === 0) {
      const demoInquiries: BookingInquiry[] = [
        {
          id: 'SKY-20260714-9844',
          organizerName: 'Alessia Bianchi',
          email: 'alessia@ibizagrand.com',
          phone: '+34 621 992 104',
          company: 'Ibiza Sanctuary Beach Club',
          eventDate: '2026-07-14',
          duration: '6 Hours',
          venueLocation: 'Ibiza Cove Beach, Spain',
          crowdSize: '500+',
          eventType: 'Golden Hour / Sundowner',
          sonicDirections: ['Afro House', 'Latin House'],
          djEquipment: 'Yes, fully equipped',
          peakVision: 'Sleek bohemian sunset party. Golden hour transition to high-end acoustic drums overlaying standard warm Afro rhythms. Guests are VIP tastemakers.',
          submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(), // 4h ago
          status: 'Aligned',
          managementNotes: 'Confirmed. Align percussion set times. Double check CDJ-3000 linkages.',
        },
        {
          id: 'SKY-20260822-4412',
          organizerName: 'Kenji Sato',
          email: 'sato@apex-tokyo.org',
          phone: '+81 3 5550 0192',
          company: 'Apex Hospitality Tokyo',
          eventDate: '2026-08-22',
          duration: 'Full Night',
          venueLocation: 'Roppongi Sky Tower Helix, Tokyo',
          crowdSize: '200-500',
          eventType: 'Corporate / Brand Activation',
          sonicDirections: ['Latin House', 'Open-Format'],
          djEquipment: 'Yes, fully equipped',
          peakVision: 'Private launching party of a global luxury electric vehicle brand. Sleek, fast, highly digital atmosphere. High impact transitions required.',
          submittedAt: new Date(Date.now() - 3600000 * 22).toISOString(), // 22h ago
          status: 'Pending',
        },
        {
          id: 'SKY-20260905-1955',
          organizerName: 'Mateo Cardona',
          email: 'cardona@tulumreunion.net',
          phone: '+52 984 102 9942',
          eventDate: '2026-09-05',
          duration: '6 Hours',
          venueLocation: 'Zama Jungle Citadel, Tulum',
          crowdSize: '500+',
          eventType: 'Festival / Outdoor Stage',
          sonicDirections: ['Afro House', 'Techno / Tech House'],
          djEquipment: 'No, we need setup',
          peakVision: 'Open-air moonrise party. Jungle backdrop, heavy rhythmic energy, seamless transitions from deeper sub basses into fast melodic house drops.',
          submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(), // 1.5 days ago
          status: 'Pending',
        }
      ];
      localStorage.setItem('skyd_bookings', JSON.stringify(demoInquiries));
      props.onUpdateInquiries(demoInquiries);
    }
  }, []);

  // Update status
  const updateStatus = (id: string, newStatus: BookingInquiry['status']) => {
    const updated = props.inquiries.map(item => {
      if (item.id === id) {
        const withStatus = { ...item, status: newStatus };
        if (selectedInquiry?.id === id) {
          setSelectedInquiry(withStatus);
        }
        return withStatus;
      }
      return item;
    });
    localStorage.setItem('skyd_bookings', JSON.stringify(updated));
    props.onUpdateInquiries(updated);
  };

  // Save notes
  const saveNotes = (id: string) => {
    const updated = props.inquiries.map(item => {
      if (item.id === id) {
        const withNotes = { ...item, managementNotes: notesDraft };
        setSelectedInquiry(withNotes);
        return withNotes;
      }
      return item;
    });
    localStorage.setItem('skyd_bookings', JSON.stringify(updated));
    props.onUpdateInquiries(updated);
  };

  // Delete booking
  const deleteInquiry = (id: string) => {
    const filtered = props.inquiries.filter(item => item.id !== id);
    localStorage.setItem('skyd_bookings', JSON.stringify(filtered));
    props.onUpdateInquiries(filtered);
    if (selectedInquiry?.id === id) {
      setSelectedInquiry(null);
    }
  };

  // Filter & Search calculation
  const filtered = props.inquiries.filter(item => {
    const matchesSearch = 
      item.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.venueLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.company || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Analytics helper counts
  const totalCount = props.inquiries.length;
  const pendingCount = props.inquiries.filter(i => i.status === 'Pending').length;
  const alignedCount = props.inquiries.filter(i => i.status === 'Aligned').length;
  const totalGuests = props.inquiries.reduce((acc, curr) => {
    if (curr.crowdSize === 'Under 50') return acc + 30;
    if (curr.crowdSize === '50-200') return acc + 120;
    if (curr.crowdSize === '200-500') return acc + 350;
    if (curr.crowdSize === '500+') return acc + 750;
    return acc;
  }, 0);

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 md:p-8 max-w-6xl mx-auto overflow-hidden relative shadow-2xl mt-12" id="console-manager">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <span className="font-mono text-xs text-amber-500 uppercase tracking-widest flex items-center gap-1.5 justify-center md:justify-start">
            <FolderLock className="w-3.5 h-3.5 inline text-amber-500" /> Backstage DJ Management Room
          </span>
          <h3 className="font-sans text-xl md:text-2xl font-semibold text-white mt-1">
            Incoming Vibe Desk
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Review live client submissions, align event schedules, and analyze sonic matches.
          </p>
        </div>

        {/* Stats Summary Panel */}
        <div className="grid grid-cols-3 gap-2 bg-neutral-950 p-3 rounded-xl border border-neutral-850">
          <div className="px-3 py-1 bg-neutral-900/40 rounded-lg text-center">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase">INBOX</span>
            <span className="text-sm font-sans font-bold text-white">{totalCount}</span>
          </div>
          <div className="px-3 py-1 bg-neutral-900/40 rounded-lg text-center">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase">ALIGNED</span>
            <span className="text-sm font-sans font-bold text-emerald-400">{alignedCount}</span>
          </div>
          <div className="px-3 py-1 bg-neutral-900/40 rounded-lg text-center">
            <span className="text-[10px] font-mono text-neutral-400 block uppercase">EST. DENSITY</span>
            <span className="text-sm font-sans font-bold text-amber-400">{totalGuests}+</span>
          </div>
        </div>
      </div>

      {/* Control Filters and Listing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Side: Filter and inquiries list */}
        <div className="col-span-1 lg:col-span-7 space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search by Organizer, Venue, or Brand..."
                className="w-full bg-neutral-950 border border-neutral-800 text-xs rounded-xl pl-9 pr-3 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {(['All', 'Pending', 'Aligned', 'Declined'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-3 py-2 text-[10px] font-mono rounded-lg border transition-all ${
                    statusFilter === f
                      ? 'bg-amber-500/20 border-amber-500 text-amber-400 font-semibold'
                      : 'bg-neutral-950 border-neutral-805 text-neutral-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map(inquiry => {
                const isSelected = selectedInquiry?.id === inquiry.id;
                return (
                  <div
                    key={inquiry.id}
                    onClick={() => {
                      setSelectedInquiry(inquiry);
                      setNotesDraft(inquiry.managementNotes || '');
                    }}
                    className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-neutral-950 border-amber-500/60 shadow-lg shadow-amber-500/5'
                        : 'bg-neutral-950/40 border-neutral-805 hover:bg-neutral-950 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs font-semibold text-white">
                          {inquiry.organizerName}
                        </span>
                        {inquiry.company && (
                          <span className="text-xxs text-neutral-400 bg-neutral-900 border border-neutral-800 px-1.5 py-0.5 rounded block max-w-[120px] truncate">
                            {inquiry.company}
                          </span>
                        )}
                      </div>

                      <span className={`px-2 py-0.5 rounded font-mono text-[9px] uppercase tracking-wider ${
                        inquiry.status === 'Aligned'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : inquiry.status === 'Declined'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xxs text-neutral-400 mt-1">
                      <p className="flex items-center gap-1.5">
                        <CalendarDays className="w-3 h-3 text-neutral-500" /> {inquiry.eventDate}
                      </p>
                      <p className="flex items-center gap-1.5 text-right justify-end truncate">
                        <MapPin className="w-3 h-3 text-neutral-500" /> {inquiry.venueLocation}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      <span className="text-[9px] font-mono text-neutral-500 uppercase bg-neutral-900 px-2 py-0.5 rounded">
                        {inquiry.eventType.split(' / ')[0]}
                      </span>
                      {inquiry.sonicDirections.map(s => (
                        <span key={s} className="text-[9px] font-mono text-amber-500 bg-amber-500/5 px-1.5 py-0.5 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center bg-neutral-950/20 border border-dashed border-neutral-800 rounded-xl">
                <Inbox className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
                <p className="text-xs text-neutral-400">No matching booking inquiries in inbox.</p>
                <p className="text-xxs text-neutral-500 mt-1">Submit the inquiry form above to seed new bookings.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Showcase detailed inspection panel */}
        <div className="col-span-1 lg:col-span-5">
          {selectedInquiry ? (
            <div className="bg-neutral-950 rounded-xl border border-neutral-800 p-5 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-3 gap-3">
                <div>
                  <h4 className="text-xs font-mono text-amber-500 uppercase">Selected Slot</h4>
                  <p className="text-xs font-semibold text-white tracking-tight mt-0.5">{selectedInquiry.id}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateStatus(selectedInquiry.id, 'Aligned')}
                    className="p-1.5 bg-neutral-900 hover:bg-emerald-500/20 border border-neutral-800 text-emerald-400 rounded-lg transition-colors"
                    title="Align and Approve Vibe"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => updateStatus(selectedInquiry.id, 'Declined')}
                    className="p-1.5 bg-neutral-900 hover:bg-rose-500/20 border border-neutral-800 text-rose-400 rounded-lg transition-colors"
                    title="Decline Booking"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteInquiry(selectedInquiry.id)}
                    className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:text-rose-500 rounded-lg transition-colors"
                    title="Delete Inquiries"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Detailed specs */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-neutral-500 uppercase text-[9px] font-mono block">Contact Information</span>
                  <p className="text-white font-medium mt-0.5">{selectedInquiry.organizerName}</p>
                  <p className="text-neutral-400 font-mono text-xxs mt-0.5">{selectedInquiry.email} | {selectedInquiry.phone}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] font-mono block">DATE & VENUE</span>
                    <p className="text-white mt-0.5">{selectedInquiry.eventDate}</p>
                    <p className="text-neutral-400 text-xxs mt-0.5 truncate">{selectedInquiry.venueLocation}</p>
                  </div>
                  <div>
                    <span className="text-neutral-500 uppercase text-[9px] font-mono block">Vibe Context</span>
                    <p className="text-white mt-0.5">{selectedInquiry.eventType}</p>
                    <p className="text-neutral-400 text-xxs mt-0.5">{selectedInquiry.crowdSize} Guests</p>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-neutral-500 uppercase text-[9px] font-mono block">TECH REQUIRES</span>
                  <p className="text-neutral-300 font-mono text-[10px] mt-0.5">{selectedInquiry.djEquipment}</p>
                </div>

                <div className="pt-2 bg-neutral-900/40 p-3 rounded-lg border border-neutral-900/80">
                  <span className="text-neutral-400 uppercase text-[9px] font-mono block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" /> Peak Hour Vision
                  </span>
                  <p className="text-neutral-300 font-light text-xxs leading-relaxed mt-1 italic">
                    "{selectedInquiry.peakVision}"
                  </p>
                </div>

                {/* Management Note-taking */}
                <div className="pt-2">
                  <label className="text-neutral-400 uppercase text-[9px] font-mono block flex items-center gap-1 mb-2">
                    <MessageSquare className="w-3 h-3 text-neutral-500" /> Management Notes
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={notesDraft}
                      onChange={e => setNotesDraft(e.target.value)}
                      placeholder="Add negotiation notes..."
                      className="w-full bg-neutral-900 border border-neutral-800 text-xxs rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => saveNotes(selectedInquiry.id)}
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xxs rounded-lg transition-colors flex-shrink-0"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-neutral-950 rounded-xl border border-neutral-805 h-full flex flex-col items-center justify-center text-neutral-500 relative min-h-[340px]">
              <Info className="w-8 h-8 text-neutral-600 mb-2" />
              <p className="text-xs">No slot inspected.</p>
              <p className="text-[10px] text-neutral-500 max-w-xs mt-1">Select an incoming inquiry from the backstage inbox to check guest counts, technical setups, and update booking status schedules.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
