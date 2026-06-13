/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Shield, Flame, Play, Music4, CalendarRange } from 'lucide-react';

interface ExperiencesProps {
  onCueVibe: (vibe: 'safari' | 'sunlight' | 'fiesta') => void;
  onBookClick: () => void;
}

export default function Experiences(props: ExperiencesProps) {
  const customVibes = [
    {
      id: 'sundowner' as const,
      preset: 'sunlight' as const,
      title: 'Sundowners',
      subtitle: 'GOLDEN HOUR BEATS',
      desc: 'Warm, organic, rhythmic, and melodic beats perfect for the magical transition of twilight. Seamless blend of sunset chords and infectious shakers.',
      icon: Sun,
      color: 'from-amber-500 to-orange-600',
      glowColor: 'rgba(245,158,11,0.4)',
      bgImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&auto=format&fit=crop&q=80',
      sampleName: 'Sunset Beach Lounge'
    },
    {
      id: 'private' as const,
      preset: 'safari' as const,
      title: 'Private VIP Events',
      subtitle: 'EXCLUSIVE & TAILORED',
      desc: 'Tailored, genre-fluid open-format sets structured specifically to match your brand vision. Multi-genre flow designed to keep elite guests moving.',
      icon: Shield,
      color: 'from-orange-600 to-rose-600',
      glowColor: 'rgba(234,88,12,0.4)',
      bgImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
      sampleName: 'Tailored VIP Grooves'
    },
    {
      id: 'club' as const,
      preset: 'fiesta' as const,
      title: 'Club Nights',
      subtitle: 'HIGH-VELOCITY GROOVES',
      desc: 'Deep, high-energy Afro and Latin House grooves that dictate the absolute pulse of the warehouse or festival floor. Heavy sub bass and technical drops.',
      icon: Flame,
      color: 'from-rose-600 to-amber-500',
      glowColor: 'rgba(220,38,38,0.4)',
      bgImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
      sampleName: 'Apex Hour House Pulse'
    }
  ];

  return (
    <section className="py-24 bg-neutral-950 text-white relative border-b border-neutral-900" id="experiences">
      {/* Visual backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <div>
            <span className="font-mono text-[9px] text-[#d4af37] uppercase tracking-[0.3em] block mb-3">
              Signature Sets
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-light uppercase tracking-[0.1em]">
              THE EXPERIENCES
            </h2>
            <div className="w-20 h-[1px] mt-4 bg-[#d4af37]" />
          </div>
          <p className="text-neutral-450 font-serif italic text-base sm:text-lg max-w-sm">
            SkyD structures dynamic pacing customized to the layout and emotional intent of your venue. Click any cue button below to preview synths.
          </p>
        </div>

        {/* Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {customVibes.map((vibe) => {
            const IconComponent = vibe.icon;
            return (
              <div
                key={vibe.id}
                className="group relative rounded-none border border-neutral-900 bg-neutral-950 flex flex-col h-full min-h-[460px] transition-all duration-500 hover:border-[#d4af37]/25 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.7)]"
              >
                {/* Visual Backdrop Frame */}
                <div className="relative h-48 overflow-hidden bg-neutral-950">
                  <div className="absolute inset-0 bg-neutral-950/50 group-hover:bg-neutral-950/20 transition-colors duration-500 z-10" />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent z-15" />
                  <img
                    src={vibe.bgImage}
                    alt={vibe.title}
                    className="w-full h-full object-cover filter brightness-90 grayscale group-hover:grayscale-0 group-hover:scale-103 transition-all duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category icon floated */}
                  <div className="absolute top-4 right-4 bg-neutral-950 border border-neutral-800 text-[#d4af37] p-3 rounded-none z-20 shadow-lg group-hover:border-[#d4af37]/40 transition-colors duration-300">
                    <IconComponent className="w-5 h-5 text-[#d4af37]" />
                  </div>
                </div>

                {/* Info Text Frame */}
                <div className="p-8 flex-grow flex flex-col justify-between relative z-20 bg-neutral-950">
                  <div className="space-y-3">
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#d4af37] uppercase font-bold">
                      {vibe.subtitle}
                    </span>
                    <h3 className="font-serif text-2xl font-light text-white tracking-widest uppercase">
                      {vibe.title}
                    </h3>
                    <p className="text-neutral-400 font-serif italic text-sm leading-relaxed pt-2">
                      {vibe.desc}
                    </p>
                  </div>

                  {/* Synchronized Interaction Buttons */}
                  <div className="mt-8 pt-6 border-t border-neutral-900 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        props.onCueVibe(vibe.preset);
                        const consoleElem = document.getElementById('audio-console');
                        if (consoleElem) {
                          consoleElem.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="px-3 py-3.5 bg-neutral-950 hover:bg-[#d4af37] hover:text-neutral-950 text-white border border-neutral-850 hover:border-[#d4af37] rounded-none text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      title={`Cue the ${vibe.title} audio preview`}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Cue Sound
                    </button>

                    <button
                      onClick={props.onBookClick}
                      className="px-3 py-3.5 bg-neutral-900 hover:bg-neutral-850 text-[#d4af37] border border-neutral-850 hover:border-neutral-750 rounded-none text-[10px] font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CalendarRange className="w-3.5 h-3.5 text-[#d4af37]" />
                      Book Spot
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
