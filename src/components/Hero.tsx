/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, Music, CalendarDays, Zap, Sparkles } from 'lucide-react';

interface HeroProps {
  onBookClick: () => void;
}

export default function Hero(props: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center text-center px-4 overflow-hidden bg-neutral-950" id="hero-section">
      {/* Immersive background media loop replacement */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-neutral-950/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1571266028243-e4733b0f0bb1?w=1600&auto=format&fit=crop&q=80"
          alt="SkyD (Aakash) performing live behind Pioneer DJ controller under tropical leaves"
          className="w-full h-full object-cover filter brightness-75 scale-105 animate-pulse duration-[8000ms]"
          referrerPolicy="no-referrer"
        />
        {/* Vibrant sunset ambient glowing overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-neutral-950/40 z-10" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/20 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen animate-bounce duration-[15000ms] z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen animate-pulse duration-[10000ms] z-10" />
      </div>

      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center">
        {/* Glowing sub tagline badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-905/90 border border-amber-500/20 text-[#d4af37] font-mono text-[10px] uppercase tracking-[0.2em] mb-8 animate-fade-in shadow-[0_0_20px_rgba(212,175,55,0.08)]">
          <Sparkles className="w-3 h-3 text-[#d4af37] animate-pulse" /> Premium Artist Press Kit & Booking
        </div>

        {/* Dynamic Display Headline */}
        <h1 className="font-serif text-6xl sm:text-8xl md:text-[7rem] font-light text-white tracking-widest leading-none uppercase mb-2">
          SKY D
          <span className="block font-sans font-light text-[10px] sm:text-xs tracking-[0.5em] text-neutral-400 mt-5 uppercase">
            Sophisticated Afro & Latin House Soundscapes
          </span>
        </h1>

        {/* Dynamic description layout */}
        <p className="font-serif text-lg sm:text-xl md:text-2xl text-neutral-350 max-w-2xl font-light italic leading-relaxed tracking-wide mb-12">
          Uplifting body & soul through sun-drenched beach grooves & elite sunset club residencies.
        </p>

        {/* Multi CTA Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto">
          <button
            onClick={props.onBookClick}
            className="w-full sm:w-auto bg-gradient-to-r from-amber-100 via-[#d4af37] to-amber-600 text-neutral-950 font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-12 py-5 rounded-none flex items-center justify-center gap-2.5 shadow-[0_0_25px_rgba(212,175,55,0.2)] hover:shadow-[0_0_40px_rgba(212,175,55,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95 group border border-amber-200/20 cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-neutral-950" />
            Request Booking
          </button>
          
          <a
            href="#audio-console"
            className="w-full sm:w-auto bg-neutral-950 hover:bg-neutral-900 border border-neutral-800 hover:border-amber-500/30 text-white font-sans text-[10px] font-bold tracking-[0.25em] uppercase px-12 py-5 rounded-none flex items-center justify-center gap-2.5 transition-all duration-300"
          >
            <Music className="w-4 h-4 text-[#d4af37]" />
            Launch Console
          </a>
        </div>

        {/* Staggered visual anchor scroll */}
        <div className="absolute bottom-[-10px] left-1/2 -translate-x-1/2 flex flex-col items-center text-neutral-500 gap-1 mt-12 animate-bounce">
          <span className="font-mono text-[9px] uppercase tracking-widest">Learn More</span>
          <ArrowDown className="w-4 h-4" />
        </div>
      </div>
    </section>
  );
}
