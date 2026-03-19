'use client';
import { useState, useEffect, useRef } from 'react';

/**
 * AmbientSound — a discreet toggle for ambient audio.
 * Uses Web Audio API to generate pink noise (no external file needed).
 * Falls back gracefully if audio isn't supported.
 */
export function AmbientSound() {
  const [playing,  setPlaying]  = useState(false);
  const [volume,   setVolume]   = useState(0.25);
  const [mounted,  setMounted]  = useState(false);
  const [showVol,  setShowVol]  = useState(false);

  const ctxRef       = useRef(null);
  const bufferRef    = useRef(null);
  const sourceRef    = useRef(null);
  const gainRef      = useRef(null);
  const fadeTimerRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  function buildPinkNoise(ctx, duration = 30) {
    const sampleRate  = ctx.sampleRate;
    const frameCount  = sampleRate * duration;
    const buffer      = ctx.createBuffer(2, frameCount, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      // Pink noise via Paul Kellet's algorithm
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < frameCount; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886*b0 + white*0.0555179;
        b1 = 0.99332*b1 + white*0.0750759;
        b2 = 0.96900*b2 + white*0.1538520;
        b3 = 0.86650*b3 + white*0.3104856;
        b4 = 0.55000*b4 + white*0.5329522;
        b5 = -0.7616*b5 - white*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6+white*0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    }
    return buffer;
  }

  function getCtx() {
    if (!ctxRef.current) {
      try {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      } catch { return null; }
    }
    return ctxRef.current;
  }

  async function start() {
    const ctx = getCtx();
    if (!ctx) return;

    if (ctx.state === 'suspended') await ctx.resume();

    // Build noise buffer (cached)
    if (!bufferRef.current) bufferRef.current = buildPinkNoise(ctx);

    // Gain node for fade + volume
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 1.5);
    gain.connect(ctx.destination);
    gainRef.current = gain;

    // Looping source
    const src = ctx.createBufferSource();
    src.buffer = bufferRef.current;
    src.loop   = true;
    src.connect(gain);
    src.start();
    sourceRef.current = src;
  }

  function stop() {
    const ctx  = ctxRef.current;
    const gain = gainRef.current;
    const src  = sourceRef.current;
    if (!ctx || !gain || !src) return;

    gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.2);

    clearTimeout(fadeTimerRef.current);
    fadeTimerRef.current = setTimeout(() => {
      try { src.stop(); src.disconnect(); } catch {}
      sourceRef.current = null;
    }, 1300);
  }

  async function toggle() {
    if (playing) {
      stop();
      setPlaying(false);
    } else {
      await start();
      setPlaying(true);
    }
  }

  // Update volume live
  useEffect(() => {
    if (gainRef.current && ctxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(
        playing ? volume : 0,
        ctxRef.current.currentTime + 0.1
      );
    }
  }, [volume, playing]);

  if (!mounted) return null;

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
      onMouseEnter={() => setShowVol(true)}
      onMouseLeave={() => setShowVol(false)}
    >
      {/* Volume slider — appears on hover */}
      <div style={{
        position:   'absolute',
        right:      'calc(100% + var(--space-3))',
        top:        '50%',
        transform:  'translateY(-50%)',
        display:    'flex',
        alignItems: 'center',
        gap:        'var(--space-2)',
        opacity:    showVol && playing ? 1 : 0,
        transition: 'opacity 200ms',
        pointerEvents: showVol && playing ? 'auto' : 'none',
        background: 'var(--surface-1)',
        border:     '1px solid var(--border)',
        borderRadius: 'var(--radius-full)',
        padding:    '4px 10px',
      }}>
        <span style={{ fontSize: '10px' }}>🔈</span>
        <input
          type="range"
          min="0"
          max="0.6"
          step="0.01"
          value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))}
          style={{
            width:    '60px',
            accentColor: 'var(--amber)',
            cursor:   'pointer',
          }}
        />
        <span style={{ fontSize: '10px' }}>🔊</span>
      </div>

      {/* Main toggle */}
      <button
        onClick={toggle}
        title={playing ? 'Stop ambient sound' : 'Play ambient sound'}
        style={{
          display:      'flex',
          alignItems:   'center',
          gap:          'var(--space-2)',
          padding:      '5px 12px',
          borderRadius: 'var(--radius-full)',
          border:       '1px solid',
          borderColor:  playing ? 'rgba(201,146,42,0.4)' : 'var(--border)',
          background:   playing ? 'var(--amber-subtle)' : 'var(--surface-1)',
          cursor:       'pointer',
          transition:   'all var(--duration-fast)',
          fontFamily:   'var(--font-mono)',
          fontSize:     '11px',
          color:        playing ? 'var(--amber)' : 'var(--ink-30)',
          letterSpacing:'0.06em',
        }}
      >
        {/* Animated bars when playing */}
        {playing ? (
          <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px' }}>
            {[1,2,3].map(i => (
              <span key={i} style={{
                display:   'block',
                width:     '2px',
                background:'var(--amber)',
                borderRadius: '1px',
                animation: `eq-bar ${0.4 + i * 0.15}s ease-in-out infinite alternate`,
                height:    `${4 + i * 2}px`,
              }} />
            ))}
          </span>
        ) : (
          <span>♪</span>
        )}
        {playing ? 'Ambient on' : 'Ambient'}
      </button>

      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1);   }
        }
      `}</style>
    </div>
  );
}