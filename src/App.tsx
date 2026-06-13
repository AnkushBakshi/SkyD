/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Disc, Heart, FolderLock, Instagram, Twitter, Music, Globe, Menu, X, ArrowUpRight, CheckCircle2 
} from 'lucide-react';
import { BookingInquiry } from './types';
import Hero from './components/Hero';
import Soundscape from './components/Soundscape';
import InteractiveEQ from './components/InteractiveEQ';
import Experiences from './components/Experiences';
import BookingForm from './components/BookingForm';
import InquiryManager from './components/InquiryManager';

export default function App() {
  const [activeVibePreset, setActiveVibePreset] = useState<'safari' | 'sunlight' | 'fiesta' | null>(null);
  const [inquiries, setInquiries] = useState<BookingInquiry[]>([]);
  const [isBackstageOpen, setIsBackstageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync inquiries from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('skyd_bookings');
    if (stored) {
      try {
        setInquiries(JSON.parse(stored));
      } catch (e) {
        console.error("Parsed inquiries error", e);
      }
    }
  }, []);

  const handleInquirySubmitted = (newInquiry: BookingInquiry) => {
    // Add to state list reactively so the back-office is refreshed instantly
    setInquiries(prev => [...prev, newInquiry]);
  };

  const handleUpdateInquiries = (updatedList: BookingInquiry[]) => {
    setInquiries(updatedList);
  };

  const scrollSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMobileMenuOpen(false);
  };

  const cuePreset = (presetName: 'safari' | 'sunlight' | 'fiesta') => {
    setActiveVibePreset(null); // clear briefly to trigger effect
    setTimeout(() => {
      setActiveVibePreset(presetName);
    }, 50);
  };

  return (
    <div className="bg-neutral-950 min-h-screen text-white font-sans selection:bg-amber-500 selection:text-neutral-950 overflow-x-hidden antialiased">
      {/* Dynamic Glow Header Background Bar */}
      <header className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-900/60 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          
          {/* Logo Brand Name */}
          <button onClick={() => scrollSection('hero-section')} className="flex items-center gap-2.5 group cursor-pointer">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur group-hover:scale-110 transition-transform duration-300" />
              <div className="relative bg-neutral-950 p-2 rounded-full border border-neutral-800 flex items-center justify-center">
                <Disc className="w-5 h-5 text-amber-500 animate-[spin_4000ms_linear_infinite] group-hover:text-amber-400" />
              </div>
            </div>
            <div className="text-left">
              <span className="font-sans text-xl font-black tracking-widest text-white uppercase block">
                SKY D
              </span>
              <span className="font-mono text-[8px] text-amber-500 tracking-widest block uppercase font-medium">
                Afro & Latin House
              </span>
            </div>
          </button>

          {/* Nav items: Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => scrollSection('soundscape')}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              The Artist
            </button>
            <button
              onClick={() => scrollSection('audio-console')}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider relative flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping absolute -top-0.5 right-2" />
              Track Console
            </button>
            <button
              onClick={() => scrollSection('experiences')}
              className="px-4 py-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Experiences
            </button>

            {/* Inquire booking trigger */}
            <button
              onClick={() => scrollSection('booking')}
              className="ml-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white text-xs font-mono uppercase tracking-wider font-bold shadow-lg shadow-orange-950/20 transition-all duration-300 hover:scale-103"
            >
              Secure Vibe
            </button>

            {/* Backstage Room Toggle Button */}
            <button
              onClick={() => {
                setIsBackstageOpen(!isBackstageOpen);
                setTimeout(() => scrollSection('console-manager'), 100);
              }}
              className={`ml-1 px-4 py-2.1 rounded-full border text-xs font-mono tracking-wider transition-all duration-300 uppercase flex items-center gap-1.5 ${
                isBackstageOpen
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Open Admin Backstage Listing Desk"
            >
              <FolderLock className="w-3.5 h-3.5 text-amber-500" />
              {isBackstageOpen ? 'Backstage: ON' : 'Backstage'}
            </button>
          </nav>

          {/* Hamburger Menu Mobile button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => {
                setIsBackstageOpen(!isBackstageOpen);
                setTimeout(() => scrollSection('console-manager'), 50);
              }}
              className={`p-2 rounded-xl border transition-colors ${
                isBackstageOpen ? 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
              }`}
              title="Toggle Backstage Desk"
            >
              <FolderLock className="w-4 h-4 text-amber-500" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="bg-neutral-900 border border-neutral-800 p-2 rounded-xl text-neutral-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-neutral-950 border-b border-neutral-900 p-5 space-y-3 flex flex-col">
            <button
              onClick={() => scrollSection('soundscape')}
              className="text-left py-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              The Soundscape Bio
            </button>
            <button
              onClick={() => scrollSection('audio-console')}
              className="text-left py-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Track Synth Console
            </button>
            <button
              onClick={() => scrollSection('experiences')}
              className="text-left py-2 text-xs font-mono uppercase tracking-wider text-neutral-400 hover:text-white"
            >
              Experiences
            </button>
            <button
              onClick={() => scrollSection('booking')}
              className="py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-center text-xs font-mono uppercase tracking-wider font-bold text-white shadow-xl"
            >
              Book SkyD Now
            </button>
          </div>
        )}
      </header>

      {/* Hero section */}
      <Hero onBookClick={() => scrollSection('booking')} />

      {/* Soundscape Bio section */}
      <Soundscape />

      {/* Web Audio EQ Visual Preset console */}
      <section className="py-20 bg-neutral-950 px-4 border-b border-neutral-900" id="audio-console-section">
        <InteractiveEQ externalPreset={activeVibePreset} />
      </section>

      {/* Venue Experiences section */}
      <Experiences onCueVibe={cuePreset} onBookClick={() => scrollSection('booking')} />

      {/* Elite Booking Form Reservation */}
      <BookingForm onInquirySubmitted={handleInquirySubmitted} />

      {/* Backstage management Panel (Toggleable / Admin Sandbox) */}
      {isBackstageOpen && (
        <section className="py-20 bg-neutral-950 px-4 border-t border-neutral-900" id="backstage">
          <InquiryManager inquiries={inquiries} onUpdateInquiries={handleUpdateInquiries} />
        </section>
      )}

      {/* Majestic Footer styling */}
      <footer className="bg-neutral-950 border-t border-neutral-900 py-16 px-4 text-center text-neutral-400">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-1.5 pb-2">
            <Disc className="w-5 h-5 text-amber-500 animate-[spin_6000ms_linear_infinite]" />
            <span className="font-sans text-xl font-extrabold text-white uppercase tracking-widest">
              SKY D
            </span>
          </div>

          <p className="font-sans text-xs max-w-md mx-auto leading-relaxed text-neutral-500">
            Latin & Afro House open-format DJ sets designed for sunset beach lounges, Golden Hour sundowners, club warehouses, and customized private brand activations.
          </p>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-5 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition-all hover:scale-105">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition-all hover:scale-105">
              <Music className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition-all hover:scale-105">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-850 hover:border-neutral-700 rounded-xl text-neutral-400 hover:text-white transition-all hover:scale-105">
              <Globe className="w-4 h-4" />
            </a>
          </div>

          {/* Small Credits banner */}
          <div className="pt-8 border-t border-neutral-900/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xxs font-mono text-neutral-600 uppercase tracking-widest">
            <p className="flex items-center gap-1">
              &copy; {new Date().getFullYear()} SKYD MUSIC. ALL RIGHTS RESERVED.
            </p>
            <p className="flex items-center gap-1">
              ENGINEERED WITH PASSION FOR GROOVES <Heart className="w-3 h-3 text-rose-600 fill-rose-600 animate-pulse" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
