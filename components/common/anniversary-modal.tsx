"use client";

import React, { useEffect, useState, useRef } from 'react';

// ---------- Types ----------
interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
  shape: 'rect' | 'circle' | 'ribbon';
  opacity: number;
  life: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  color: string;
  particles: FireworkParticle[];
  born: number;
}

interface FireworkParticle {
  angle: number;
  speed: number;
  color: string;
  size: number;
}

// ---------- Constants ----------
const CONFETTI_COLORS = [
  '#981a3c', '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F0B27A', '#82E0AA',
];

const FIREWORK_COLORS = [
  '#FFD700', '#FF4500', '#FF69B4', '#00CED1', '#9370DB',
  '#FF6347', '#00FA9A', '#FFB6C1', '#87CEEB', '#F0E68C',
];

const TOTAL_CONFETTI = 120;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// ---------- Canvas Fireworks ----------
const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const animFrameRef = useRef<number>(0);
  const nextFireworkRef = useRef<number>(0);
  const idRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const launchFirework = () => {
      const id = idRef.current++;
      const x = randomBetween(0.15, 0.85) * canvas.width;
      const y = randomBetween(0.08, 0.45) * canvas.height;
      const baseColor = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const count = Math.floor(randomBetween(28, 42));

      const particles: FireworkParticle[] = Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        speed: randomBetween(1.5, 4.5),
        color: Math.random() > 0.4 ? baseColor : FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)],
        size: randomBetween(2, 4),
      }));

      fireworksRef.current.push({ id, x, y, color: baseColor, particles, born: performance.now() });
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now > nextFireworkRef.current) {
        launchFirework();
        nextFireworkRef.current = now + randomBetween(500, 1100);
      }

      fireworksRef.current = fireworksRef.current.filter(fw => {
        const age = (now - fw.born) / 1000; // seconds
        if (age > 2.2) return false;

        const progress = age / 2.2;
        const opacity = Math.max(0, 1 - progress * 1.1);

        fw.particles.forEach(p => {
          const decay = 0.92;
          const dist = p.speed * (1 - Math.pow(decay, age * 60)) / (1 - decay);
          const px = fw.x + Math.cos(p.angle) * dist;
          const py = fw.y + Math.sin(p.angle) * dist + 60 * age * age; // gravity

          ctx.beginPath();
          ctx.arc(px, py, p.size * (1 - progress * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = opacity;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Sparkle trail
          ctx.beginPath();
          ctx.arc(px, py, p.size * 0.3, 0, Math.PI * 2);
          ctx.fillStyle = '#fff';
          ctx.globalAlpha = opacity * 0.6;
          ctx.fill();
          ctx.globalAlpha = 1;
        });

        return true;
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }}
    />
  );
};

// ---------- CSS Confetti ----------
const ConfettiField: React.FC = () => {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: TOTAL_CONFETTI }, (_, i) => ({
      id: i,
      x: randomBetween(0, 100),
      y: randomBetween(-20, 100),
      vx: randomBetween(-1, 1),
      vy: randomBetween(0.5, 2),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: randomBetween(5, 12),
      rotation: randomBetween(0, 360),
      rotationSpeed: randomBetween(-360, 360),
      shape: (['rect', 'circle', 'ribbon'] as const)[Math.floor(Math.random() * 3)],
      opacity: randomBetween(0.7, 1),
      life: randomBetween(2, 6),
    }))
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 2 }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.shape === 'ribbon' ? p.size * 0.4 : p.size,
            height: p.shape === 'ribbon' ? p.size * 2.5 : p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'ribbon' ? '2px' : '2px',
            opacity: p.opacity,
            animation: `confetti-fall-${p.id % 5} ${p.life}s ${randomBetween(0, 2)}s ease-in infinite`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// ---------- Main Component ----------
export const AnniversaryModal: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem('aee_anniversary_43_seen');
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const close = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('aee_anniversary_43_seen', '1');
    }, 420);
  };

  if (!visible) return null;

  return (
    <>
      {/* Keyframes injected once */}
      <style>{`
        @keyframes confetti-fall-0 {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(720deg) translateX(30px); opacity: 0; }
        }
        @keyframes confetti-fall-1 {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(-540deg) translateX(-40px); opacity: 0; }
        }
        @keyframes confetti-fall-2 {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(900deg) translateX(20px); opacity: 0; }
        }
        @keyframes confetti-fall-3 {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(-720deg) translateX(-25px); opacity: 0; }
        }
        @keyframes confetti-fall-4 {
          0%   { transform: translateY(0) rotate(0deg) translateX(0); opacity: 1; }
          100% { transform: translateY(110vh) rotate(480deg) translateX(15px); opacity: 0; }
        }

        @keyframes anniversary-in {
          0%   { opacity: 0; transform: scale(0.75) translateY(40px); }
          70%  { transform: scale(1.03) translateY(-4px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes anniversary-out {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.85) translateY(30px); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes float-badge {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50%       { transform: translateY(-8px) rotate(3deg); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50%       { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        @keyframes backdrop-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .anniversary-in  { animation: anniversary-in  0.55s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .anniversary-out { animation: anniversary-out 0.42s ease-in forwards; }
        .shimmer-text {
          background: linear-gradient(90deg, #FFD700, #FFF8DC, #FFD700, #FFA500, #FFD700);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 2.5s linear infinite;
        }
      `}</style>

      {/* Backdrop */}
      <div
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.75) 100%)',
          backdropFilter: 'blur(4px)',
          animation: 'backdrop-in 0.3s ease forwards',
          zIndex: 9998,
        }}
        onClick={close}
      >
        {/* Confetti over the whole screen */}
        <ConfettiField />

        {/* Modal Card */}
        <div
          className={`relative max-w-lg w-full overflow-y-auto rounded-3xl shadow-2xl ${closing ? 'anniversary-out' : 'anniversary-in'}`}
          style={{ maxHeight: 'min(90vh, 700px)' }}
          style={{
            background: 'linear-gradient(135deg, #1a0a10 0%, #2d1020 40%, #1a0a20 100%)',
            border: '1px solid rgba(255,215,0,0.3)',
            zIndex: 9999,
            boxShadow: '0 0 60px rgba(152,26,60,0.6), 0 0 120px rgba(255,215,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Canvas fireworks inside card */}
          <FireworksCanvas />

          {/* Decorative top border glow */}
          <div
            className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, #FFD700, #981a3c, #FFD700, transparent)' }}
          />

          {/* Pulse rings */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2" style={{ zIndex: 3 }}>
            {[0, 0.4, 0.8].map((delay, i) => (
              <div
                key={i}
                className="absolute rounded-full border border-yellow-400/40"
                style={{
                  width: 80, height: 80,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: `pulse-ring 2s ${delay}s ease-out infinite`,
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative px-4 sm:px-8 pt-10 sm:pt-14 pb-7 sm:pb-10 text-center" style={{ zIndex: 4 }}>

            {/* Floating badge */}
            <div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-full mb-4 sm:mb-6 text-xs font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(255,215,0,0.12)',
                border: '1px solid rgba(255,215,0,0.4)',
                color: '#FFD700',
                animation: 'float-badge 3s ease-in-out infinite',
              }}
            >
              <span>🎊</span>
              <span>Anniversaire Officiel</span>
              <span>🎊</span>
            </div>

            {/* 43 */}
            <div className="relative inline-block mb-2">
              <span
                className="shimmer-text block"
                style={{ fontSize: 'clamp(3.5rem, 18vw, 7rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-4px' }}
              >
                43
              </span>
              {/* Sparkles around the number */}
              {[
                { top: '-8px', left: '-12px', delay: '0s' },
                { top: '-8px', right: '-12px', delay: '0.5s' },
                { bottom: '8px', left: '-16px', delay: '1s' },
                { bottom: '8px', right: '-16px', delay: '1.5s' },
              ].map((pos, i) => (
                <span
                  key={i}
                  className="absolute text-yellow-300"
                  style={{ ...pos, fontSize: '1.25rem', animation: `sparkle 2s ${pos.delay} ease-in-out infinite` }}
                >
                  ✦
                </span>
              ))}
            </div>

            {/* ANS label */}
            <p
              className="text-yellow-400 font-black uppercase tracking-[0.5em] text-sm mb-4 sm:mb-6"
              style={{ textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
            >
              ans
            </p>

            {/* Separator */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,215,0,0.5))' }} />
              <span className="text-lg">🕯️</span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,215,0,0.5))' }} />
            </div>

            {/* Title */}
            <h2 className="text-white font-extrabold text-xl sm:text-2xl md:text-3xl leading-tight mb-3">
              43 ans au service<br />
              <span style={{ color: '#FF6B8A' }}>des enfants</span>
            </h2>

            {/* Subtitle */}
            <p className="text-zinc-400 text-xs sm:text-sm md:text-base leading-relaxed mb-5 sm:mb-8 max-w-sm mx-auto">
              Depuis 1983, l&apos;Association pour l&apos;Évangélisation des Enfants porte la Bonne Nouvelle
              à chaque enfant. Merci de faire partie de cette aventure extraordinaire.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-8">
              {[
                { value: '43', label: 'Années' },
                { value: '200K+', label: 'Enfants' },
                { value: '6', label: 'Territoires' },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="rounded-2xl py-2.5 sm:py-3 px-1 sm:px-2"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="shimmer-text text-base sm:text-xl font-black">{stat.value}</div>
                  <div className="text-zinc-500 text-xs uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={close}
              className="w-full py-3.5 px-6 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] hover:shadow-lg active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #981a3c, #c02050)',
                color: '#fff',
                boxShadow: '0 4px 24px rgba(152,26,60,0.5)',
              }}
            >
              🎉 Célébrons ensemble !
            </button>

            {/* Skip */}
            <button
              onClick={close}
              className="mt-4 text-zinc-600 hover:text-zinc-400 text-xs transition-colors"
            >
              Fermer
            </button>
          </div>

          {/* Decorative bottom border glow */}
          <div
            className="absolute bottom-0 left-0 right-0 h-px rounded-b-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(152,26,60,0.6), transparent)' }}
          />
        </div>
      </div>
    </>
  );
};
