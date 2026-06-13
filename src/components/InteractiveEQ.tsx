/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { Play, Square, Volume2, VolumeX, Radio, Sparkles, Flame, Sun } from 'lucide-react';

interface AudioStem {
  id: string;
  name: string;
  type: 'synth' | 'perc' | 'bass' | 'vocal';
  frequency: number;
  gainValue: number;
  active: boolean;
  color: string;
}

interface InteractiveEQProps {
  externalPreset: 'safari' | 'sunlight' | 'fiesta' | null;
}

export default function InteractiveEQ(props: InteractiveEQProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activePreset, setActivePreset] = useState<'safari' | 'sunlight' | 'fiesta'>('sunlight');
  const [activeStems, setActiveStems] = useState<AudioStem[]>([
    { id: 'bass', name: 'Elite Basslines (Afro Onyx)', type: 'bass', frequency: 72, gainValue: 0.25, active: true, color: '#d4af37' },
    { id: 'perc', name: 'Organic Hand Congas & Shakers', type: 'perc', frequency: 330, gainValue: 0.15, active: true, color: '#e6ca65' },
    { id: 'synth', name: 'Warm Sunset Chords (Maveltree)', type: 'synth', frequency: 220, gainValue: 0.12, active: true, color: '#b8860b' },
    { id: 'vocal', name: 'Atmospheric Latin Chants', type: 'perc', frequency: 800, gainValue: 0.08, active: false, color: '#f3e5ab' },
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<{ [key: string]: { node: OscillatorNode; gain: GainNode } }>({});
  const mainGainNodeRef = useRef<GainNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize Web Audio
  const initAudio = () => {
    if (audioContextRef.current) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    const mainGain = ctx.createGain();
    mainGain.gain.setValueAtTime(isMuted ? 0 : 0.4, ctx.currentTime);
    mainGain.connect(ctx.destination);
    mainGainNodeRef.current = mainGain;
  };

  const startSynths = () => {
    initAudio();
    const ctx = audioContextRef.current;
    if (!ctx || !mainGainNodeRef.current) return;

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Start a rhythmic synth pulse for each active stem
    activeStems.forEach((stem) => {
      if (oscillatorsRef.current[stem.id]) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Configure based on stem type for an Afro/Latin house flavor
      if (stem.type === 'bass') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(stem.frequency, ctx.currentTime);
      } else if (stem.type === 'synth') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(stem.frequency * 1.5, ctx.currentTime); // Chord major 5th harmony
      } else if (stem.type === 'perc') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(stem.frequency, ctx.currentTime);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(stem.frequency, ctx.currentTime);
      }

      // Initialize gain
      gainNode.gain.setValueAtTime(stem.active ? stem.gainValue : 0, ctx.currentTime);

      // Simple low pass filter to make it sound warm and deep (sundowner club style)
      const lpFilter = ctx.createBiquadFilter();
      lpFilter.type = 'lowpass';
      lpFilter.frequency.setValueAtTime(stem.type === 'bass' ? 120 : 900, ctx.currentTime);

      osc.connect(gainNode);
      gainNode.connect(lpFilter);
      lpFilter.connect(mainGainNodeRef.current);

      osc.start(0);

      // Create a micro rhythmic pulsator to mimic house beat
      const pulseInterval = setInterval(() => {
        if (!isPlaying || !audioContextRef.current) {
          clearInterval(pulseInterval);
          return;
        }
        const now = audioContextRef.current.currentTime;
        const targetGain = stem.active ? stem.gainValue : 0;
        
        // rhythmic gating
        if (stem.type === 'percussion' || stem.id === 'perc') {
          // Conga rhythm: double tap
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        } else if (stem.type === 'bass') {
          // House off-beat pumping
          gainNode.gain.setValueAtTime(targetGain * 0.2, now);
          gainNode.gain.exponentialRampToValueAtTime(targetGain, now + 0.15);
          gainNode.gain.exponentialRampToValueAtTime(targetGain * 0.2, now + 0.3);
        } else {
          // Warm pad sweep
          gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.5);
          gainNode.gain.linearRampToValueAtTime(targetGain * 0.6, now + 1.0);
        }
      }, stem.type === 'bass' ? 400 : 800);

      oscillatorsRef.current[stem.id] = { node: osc, gain: gainNode };
    });
  };

  const stopSynths = () => {
    Object.keys(oscillatorsRef.current).forEach((key) => {
      try {
        oscillatorsRef.current[key].node.stop();
      } catch (e) {}
    });
    oscillatorsRef.current = {};
  };

  const togglePlayback = () => {
    if (isPlaying) {
      stopSynths();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setTimeout(() => startSynths(), 50);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (mainGainNodeRef.current && audioContextRef.current) {
      mainGainNodeRef.current.gain.setValueAtTime(nextMuted ? 0 : 0.4, audioContextRef.current.currentTime);
    }
  };

  const toggleStem = (id: string) => {
    const updatedStems = activeStems.map((stem) => {
      if (stem.id === id) {
        const nextActive = !stem.active;
        // Apply instantly to web audio node if it exists
        if (oscillatorsRef.current[id] && audioContextRef.current) {
          const oscObj = oscillatorsRef.current[id];
          oscObj.gain.gain.setValueAtTime(nextActive ? stem.gainValue : 0, audioContextRef.current.currentTime);
        }
        return { ...stem, active: nextActive };
      }
      return stem;
    });
    setActiveStems(updatedStems);
  };

  // Change preset configs
  const loadPreset = (preset: 'safari' | 'sunlight' | 'fiesta') => {
    setActivePreset(preset);
    let frequencies = [72, 330, 220, 800];
    if (preset === 'safari') {
      frequencies = [55, 290, 196, 680]; // Deep organic keys (black coffee style)
    } else if (preset === 'fiesta') {
      frequencies = [85, 440, 262, 1100]; // Energetic latin/tech (hugel style)
    }

    const updated = activeStems.map((stem, index) => {
      const freq = frequencies[index];
      if (oscillatorsRef.current[stem.id] && audioContextRef.current) {
        oscillatorsRef.current[stem.id].node.frequency.setValueAtTime(freq, audioContextRef.current.currentTime);
      }
      return { ...stem, frequency: freq, active: true };
    });
    setActiveStems(updated);
  };

  // Sync with parent preset triggers
  useEffect(() => {
    if (props.externalPreset) {
      loadPreset(props.externalPreset);
      setIsPlaying(true);
      setTimeout(() => startSynths(), 50);
    }
  }, [props.externalPreset]);

  // Canvas visualizer animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = 140);

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
        height = canvas.height = 140;
      }
    };
    window.addEventListener('resize', handleResize);

    let phase = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.15)';
      ctx.fillRect(0, 0, width, height);

      const activeCount = activeStems.filter(s => s.active).length;
      const speed = isPlaying ? 0.08 + activeCount * 0.02 : 0.01;
      const amplitude = isPlaying ? 25 + activeCount * 6 : 4;

      phase += speed;

      // Draw Sunset Glow Background
      if (isPlaying) {
        const glowRad = ctx.createRadialGradient(width / 2, height / 2, 5, width / 2, height / 2, width / 1.5);
        glowRad.addColorStop(0, 'rgba(212, 175, 55, 0.12)');
        glowRad.addColorStop(0.5, 'rgba(212, 175, 55, 0.03)');
        glowRad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = glowRad;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw equalizer lines
      const segments = 48;
      const spacing = width / segments;

      for (let i = 0; i < segments; i++) {
        // compute wave formulas based on stems
        const x = i * spacing;
        
        let sinValue = 0;
        if (isPlaying) {
          activeStems.forEach((stem, index) => {
            if (stem.active) {
              const frequencyFactor = (index + 1) * 0.16;
              sinValue += Math.sin(phase + i * frequencyFactor) * amplitude * (1 / (index + 1.2));
            }
          });
        } else {
          sinValue = Math.sin(phase + i * 0.1) * amplitude;
        }

        const y = height / 2 + sinValue;

        // Custom Gradient
        const barGradient = ctx.createLinearGradient(x, height, x, y);
        barGradient.addColorStop(0, 'rgba(20, 20, 20, 0.05)'); // subtle dark bottom
        barGradient.addColorStop(0.5, 'rgba(184, 134, 11, 0.35)'); // bronze mid
        barGradient.addColorStop(1, 'rgba(212, 175, 55, 0.95)'); // sparkling gold top tip

        ctx.strokeStyle = barGradient;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, height / 2);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw symmetrical mirror wave
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.08)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, height / 2);
        ctx.lineTo(x, height / 2 - sinValue * 0.45);
        ctx.stroke();
      }

      // Center baseline indicator
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isPlaying, activeStems]);

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      stopSynths();
    };
  }, []);

  return (
    <div className="bg-[#090909] border border-neutral-900 shadow-3xl rounded-none p-6 md:p-10 max-w-4xl mx-auto overflow-hidden relative" id="audio-console">
      {/* Absolute background visualizers */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-amber-600/0 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-900">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? 'bg-[#d4af37]' : 'bg-neutral-600'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? 'bg-[#d4af37]' : 'bg-neutral-600'}`}></span>
            </span>
            <span className="font-mono text-[9px] text-[#d4af37] uppercase tracking-[0.25em] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 inline text-[#d4af37]" /> Live Audio Synthesizer
            </span>
          </div>
          <h3 className="font-serif text-2xl md:text-3xl font-light text-white tracking-widest uppercase mt-2">
            Curate the Vibe Engine
          </h3>
          <p className="font-serif text-xs md:text-sm text-neutral-450 mt-1 max-w-md italic">
            SkyD crafts immersive sets by layering distinct rhythms. Play the synthesizer to mix custom Afro & Latin elements in real-time.
          </p>
        </div>

        {/* Presets and Global Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          <button
            onClick={() => loadPreset('safari')}
            className={`px-3 py-2 rounded-none text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activePreset === 'safari'
                ? 'bg-amber-500/5 text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
            }`}
            title="Deep Organic Afro chords with subbass and high shaker beats"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Safari (Afro)
          </button>
          <button
            onClick={() => loadPreset('sunlight')}
            className={`px-3 py-2 rounded-none text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activePreset === 'sunlight'
                ? 'bg-amber-500/5 text-[#d4af37] border border-[#d4af37]/45 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
            }`}
            title="Warm sunset chords over crisp drive lines"
          >
            <Sun className="w-3.5 h-3.5 text-[#d4af37]" /> Sundowner
          </button>
          <button
            onClick={() => loadPreset('fiesta')}
            className={`px-3 py-2 rounded-none text-[9px] font-mono uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              activePreset === 'fiesta'
                ? 'bg-amber-500/5 text-[#d4af37] border border-[#d4af37]/30 shadow-[0_0_15px_rgba(212,175,55,0.1)]'
                : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-900'
            }`}
            title="Energetic tech and latin beats"
          >
            <Flame className="w-3.5 h-3.5 text-[#d4af37]" /> Onyx Club
          </button>
        </div>
      </div>

      {/* Visualizer Frame */}
      <div className="relative my-6 rounded-none bg-neutral-950 p-2 overflow-hidden border border-neutral-900">
        <canvas ref={canvasRef} className="w-full bg-neutral-950 block rounded-none max-h-[140px]" />
        
        {/* Play overlay button if paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-sm transition-all duration-300">
            <button
              onClick={togglePlayback}
              className="bg-neutral-950 hover:bg-neutral-900 text-white border border-[#d4af37]/40 font-mono text-[10px] tracking-[0.3em] uppercase px-8 py-4.5 rounded-none flex items-center gap-2.5 shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-[#d4af37] text-[#d4af37]" /> Activate Wave Loop
            </button>
          </div>
        )}
      </div>

      {/* Mixer Stems Console */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeStems.map((stem) => (
          <div
            key={stem.id}
            onClick={() => isPlaying && toggleStem(stem.id)}
            className={`p-4 rounded-none border transition-all duration-300 flex items-center justify-between ${
              !isPlaying 
                ? 'bg-[#050505] border-neutral-950 text-neutral-700 cursor-not-allowed'
                : stem.active
                  ? 'bg-neutral-950 border-neutral-800 hover:border-[#d4af37]/30 text-white cursor-pointer'
                  : 'bg-neutral-950 border-neutral-950 text-neutral-500 hover:text-neutral-400 cursor-pointer'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-2.5 h-2.5 rounded-none transition-all duration-300 ${
                  isPlaying && stem.active ? 'opacity-100 shadow-[0_0_8px_currentColor]' : 'opacity-20'
                }`}
                style={{ color: stem.color, backgroundColor: stem.color }}
              />
              <div className="text-left">
                <p className="font-serif text-sm tracking-widest text-[#eeeeee] transition-colors uppercase">{stem.name}</p>
                <p className="text-[9px] font-mono text-neutral-500 tracking-widest mt-1">
                  FREQ: {stem.frequency}Hz | {stem.active && isPlaying ? 'ON AIR' : 'MUTED'}
                </p>
              </div>
            </div>

            {/* Simulated Toggle Switch */}
            <div className="relative">
              <input
                type="checkbox"
                checked={stem.active && isPlaying}
                disabled={!isPlaying}
                onChange={() => {}}
                className="sr-only"
              />
              <div
                className={`w-9 h-4 rounded-none transition-colors duration-300 ${
                  stem.active && isPlaying ? 'bg-[#d4af37]' : 'bg-neutral-900'
                }`}
              />
              <div
                className={`absolute top-[-2px] left-0 bg-white border border-neutral-800 w-4 h-5 rounded-none transition-transform duration-300 ${
                  stem.active && isPlaying ? 'transform translate-x-5 bg-[#f3e5ab]' : ''
                }`}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Lower Dashboard Controls */}
      {isPlaying && (
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlayback}
              className="text-neutral-400 hover:text-[#d4af37] bg-neutral-950 border border-neutral-900 p-3 rounded-none transition-all cursor-pointer"
              title="Stop Engine"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
            <button
              onClick={toggleMute}
              className="text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900 p-3 rounded-none transition-all cursor-pointer"
              title={isMuted ? 'Unmute master' : 'Mute master'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-[#d4af37]" />}
            </button>
          </div>

          <div className="text-right">
            <span className="font-mono text-[9px] text-neutral-500 block uppercase tracking-[0.2em]">
              Sound Speed
            </span>
            <span className="font-mono text-xs text-[#eeeeee] tracking-widest">
              124 BPM (Sundowner Standard)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
