/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, VolumeX, Volume2, ShieldCheck, Disc, Star, Zap } from 'lucide-react';

export default function Soundscape() {
  const [activeInfluencer, setActiveInfluencer] = useState<string | null>(null);

  const influencers = [
    { name: 'Black Coffee', style: 'Afro House / Deep rhythms, spiritual drums, ethereal pads.' },
    { name: 'Hugel', style: 'Latin & Afro Groove / Infectious brass loops, modern high-energy rhythms.' },
    { name: 'San Pacho', style: 'Latin House / Sharp tech drums, heavy sub basslines, ethnic vocals.' },
    { name: 'Raffa Guido', style: 'Latin Percussion / Golden sun melodies, organic afro instrumentation.' },
  ];

  return (
    <section className="py-20 bg-neutral-950 text-white relative border-b border-neutral-900" id="soundscape">
      {/* Background gradients */}
      <div className="absolute top-1/2 right-0 w-80 h-80 bg-orange-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-12 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Title Header */}
        <div className="text-center md:text-left mb-16">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#d4af37] block mb-3">
            The Artist Behind the Decks
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-[0.1em]">
            THE SOUNDSCAPE
          </h2>
          <div className="w-20 h-[1px] mt-4 bg-[#d4af37]" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Card Portrait Column (Artist Promo Representation) */}
          <div className="col-span-1 lg:col-span-5">
            <div className="relative group p-3.5 bg-[#090909] border border-neutral-900 shadow-2xl transition-all duration-500 hover:border-amber-500/20">
              {/* Image Frame */}
              <div className="relative aspect-[4/5] overflow-hidden bg-neutral-950">
                <img
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80"
                  alt="SkyD (Aakash) official studio booking portrait with sunglasses"
                  className="w-full h-full object-cover filter brightness-90 grayscale contrast-115 transition-all duration-700 group-hover:scale-103 group-hover:grayscale-0"
                  referrerPolicy="no-referrer"
                />
                
                {/* Vintage overlay glass effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90" />
                
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-neutral-950/95 border border-neutral-850 p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#d4af37] p-1.5 text-black animate-spin duration-3000">
                      <Disc className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-[#d4af37]">DJ.PRODUCER</p>
                      <p className="text-sm font-light font-serif tracking-widest text-white">SKY D (Aakash)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy-writing details block */}
          <div className="col-span-1 lg:col-span-7 space-y-8">
            <div className="bg-[#090909] border border-neutral-900 p-8 sm:p-10 relative">
              <span className="absolute top-4 right-6 text-neutral-800 font-serif text-8xl pointer-events-none select-none italic">“</span>
              <p className="font-serif text-lg sm:text-xl text-neutral-300 leading-relaxed font-light italic">
                Aakash, known to the floor as <strong className="text-[#d4af37] font-normal not-italic tracking-wider">SkyD</strong>, is a dynamic open-format DJ engineering unforgettable nights. Blending the infectious rhythms of Latin House with the deep, driving pulse of Afro House, SkyD doesn’t just play tracks—he curates an immersive vibe.
              </p>
              <p className="font-serif text-lg sm:text-xl text-neutral-300 leading-relaxed font-light italic mt-5">
                Drawing inspiration from heavyweights like <span className="text-white font-normal not-italic border-b border-[#d4af37]/20 pb-0.5">Black Coffee</span>, <span className="text-white font-normal not-italic border-b border-[#d4af37]/20 pb-0.5">Hugel</span>, <span className="text-white font-normal not-italic border-b border-[#d4af37]/20 pb-0.5">San Pacho</span>, and <span className="text-white font-normal not-italic border-b border-[#d4af37]/20 pb-0.5">Raffa Guido</span>, his genre-fluid sets are designed to light up exclusive private parties, golden-hour sundowners, and high-energy club nights alike.
              </p>
            </div>

            {/* Clickable Heavyweight Inspirations */}
            <div>
              <p className="font-mono text-[9px] text-neutral-400 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-[#d4af37]" /> Hover / Tap to explore Sonic Roots:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {influencers.map((inf) => (
                  <button
                    key={inf.name}
                    onMouseEnter={() => setActiveInfluencer(inf.name)}
                    onMouseLeave={() => setActiveInfluencer(null)}
                    onClick={() => setActiveInfluencer(activeInfluencer === inf.name ? null : inf.name)}
                    className={`p-4 rounded-none border text-left transition-all duration-300 cursor-pointer ${
                      activeInfluencer === inf.name
                        ? 'bg-amber-500/5 border-[#d4af37]/40 text-[#d4af37]'
                        : 'bg-neutral-950 border-neutral-900 text-neutral-300 hover:border-neutral-800'
                    }`}
                  >
                    <span className="font-serif text-base font-light tracking-wide block">{inf.name}</span>
                    <span className="font-mono text-[9px] text-neutral-500 block uppercase mt-1 tracking-widest">Inspiration root</span>
                  </button>
                ))}
              </div>

              {/* Explanatory Overlay box for sound signature */}
              <div className="mt-4 h-16 relative overflow-hidden">
                <div
                  className={`absolute inset-0 p-4 rounded-none bg-neutral-950 border border-neutral-900 transition-all duration-300 flex items-center gap-3 ${
                    activeInfluencer ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
                  }`}
                >
                  <Zap className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                  <p className="text-xs text-neutral-300 leading-normal font-sans">
                    <strong>{activeInfluencer}:</strong> {influencers.find(i => i.name === activeInfluencer)?.style}
                  </p>
                </div>
                {!activeInfluencer && (
                  <p className="text-[10px] uppercase tracking-widest font-mono text-neutral-500 block p-4 text-center italic">
                    Tap any sonic root above to expose styling properties.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
