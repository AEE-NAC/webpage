"use client";

import React, { useEffect, useState, useRef } from 'react';
import { CMSText } from '../cms/cms-text';
import { CMSImage } from '../cms/cms-image';

// ---------- Types & Constants ----------
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
  decay: number;
}

const FIREWORK_COLORS = ['#FFD700', '#FF6B35', '#FF4D6D', '#FFFFFF', '#FFA62B', '#C9184A'];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

// ---------- Confetti Particle System ----------
const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

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

    const confettiColors = ['#FFD700', '#FF6B35', '#C9184A', '#FFA62B', '#FF4D6D', '#FFFFFF'];
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: randomBetween(4, 8),
      h: randomBetween(8, 14),
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: Math.random() * 360,
      rotSpeed: randomBetween(-3, 3),
      speedY: randomBetween(0.5, 2),
      speedX: randomBetween(-0.5, 0.5),
      oscillate: randomBetween(0.5, 2),
      phase: Math.random() * Math.PI * 2,
    }));

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = now / 1000;

      particles.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(t * p.oscillate + p.phase) * 0.5 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height + 20) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });

      animRef.current = requestAnimationFrame(render);
    };

    animRef.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};

// ---------- Canvas Fireworks (Optimized) ----------
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
      const x = randomBetween(0.1, 0.9) * canvas.width;
      const y = randomBetween(0.1, 0.5) * canvas.height;
      const baseColor = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
      const count = Math.floor(randomBetween(30, 50));

      const particles: FireworkParticle[] = Array.from({ length: count }, (_, i) => ({
        angle: (i / count) * Math.PI * 2,
        speed: randomBetween(2, 6),
        color: baseColor,
        size: randomBetween(1.5, 3),
        decay: randomBetween(0.95, 0.97)
      }));

      fireworksRef.current.push({ id, x, y, color: baseColor, particles, born: performance.now() });
    };

    const render = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (now > nextFireworkRef.current) {
        launchFirework();
        nextFireworkRef.current = now + randomBetween(800, 1500);
      }

      fireworksRef.current = fireworksRef.current.filter(fw => {
        const age = (now - fw.born) / 1000;
        if (age > 2.5) return false;

        const progress = age / 2.5;
        const opacity = Math.max(0, 1 - progress);

        fw.particles.forEach(p => {
          p.speed *= p.decay;
          const px = fw.x + Math.cos(p.angle) * p.speed * (age * 60);
          const py = fw.y + Math.sin(p.angle) * p.speed * (age * 60) + (40 * age * age);

          ctx.beginPath();
          ctx.arc(px, py, p.size * opacity, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = opacity;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.fill();
          ctx.shadowBlur = 0;
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />;
};

// ---------- Candle Mosaic ----------
const CandleMosaic: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8 bg-[#1a0e0a]">
      {/* Container for the candle composition */}
      <div className="relative w-full max-w-[300px] aspect-[2/3] drop-shadow-[0_0_50px_rgba(255,160,0,0.3)]">
        
        {/* Flame Image */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30%] h-[20%] z-20 animate-pulse">
           <div className="w-full h-full relative" style={{ clipPath: 'path("M50,0 C50,0 20,40 20,65 C20,85 35,100 50,100 C65,100 80,85 80,65 C80,40 50,0 50,0 Z")' }}>
              <CMSImage 
                k="anniversary.candle.flame" 
                defaultSrc="/images/Haiti_staffs/promotional/IMG_8226.JPG" 
                alt="Candle Flame" 
                fill 
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-orange-500/80 via-yellow-400/50 to-white/80 mix-blend-overlay pointer-events-none" />
           </div>
        </div>

        {/* Candle Body Top - CBN Guadeloupe */}
        <div className="absolute top-[22%] left-1/2 -translate-x-1/2 w-[50%] h-[35%] z-10">
           <div className="w-full h-full relative rounded-t-lg overflow-hidden border-x-2 border-t-2 border-amber-900/30">
               <CMSImage 
                 k="anniversary.candle.body_top" 
                 defaultSrc="/images/CBN_guadeloupe.jpeg" 
                 alt="Candle Body Top" 
                 fill 
                 className="object-cover opacity-90 hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-linear-to-b from-amber-200/20 to-transparent pointer-events-none" />
           </div>
        </div>

        {/* Candle Body Bottom - Haiti Staff */}
        <div className="absolute top-[57%] left-1/2 -translate-x-1/2 w-[50%] h-[43%] z-10">
           <div className="w-full h-full relative rounded-b-lg overflow-hidden border-x-2 border-b-2 border-amber-900/30">
               <CMSImage 
                 k="anniversary.candle.body_bottom" 
                 defaultSrc="/images/Haiti_staffs/in%20action/C5D.JPG" 
                 alt="Candle Body Bottom" 
                 fill 
                 className="object-cover opacity-90 hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none" />
           </div>
        </div>

        {/* Wax drip decoration (SVG) */}
        <svg className="absolute top-[21%] left-1/2 -translate-x-1/2 w-[52%] h-10 text-[#fcf6ba] drop-shadow-md z-30 pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
             <path d="M0,0 Q10,15 20,5 Q30,-5 40,10 Q50,20 60,5 Q70,0 80,10 Q90,15 100,0 L100,2 L0,2 Z" fill="currentColor" opacity="0.9" />
        </svg>

        {/* Halo Glow behind flame */}
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[60%] h-[30%] bg-orange-500/30 blur-[40px] rounded-full pointer-events-none z-0 animate-pulse" />

      </div>
    </div>
  );
};

// ---------- Floating Sparkles ----------
const Sparkles: React.FC = () => {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    duration: `${2 + Math.random() * 2}s`,
    size: Math.random() > 0.5 ? 'w-1 h-1' : 'w-1.5 h-1.5',
  }));

  return (
    <>
      {sparkles.map(s => (
        <div
          key={s.id}
          className={`absolute ${s.size} rounded-full bg-amber-300 pointer-events-none z-20`}
          style={{
            left: s.left,
            top: s.top,
            animation: `sparkle ${s.duration} ease-in-out ${s.delay} infinite`,
          }}
        />
      ))}
    </>
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
    }, 500);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-3 md:p-6" style={{ perspective: '1200px' }}>

      {/* ---------- CSS Animations ---------- */}
      <style>{`
        @keyframes modalIn {
          0% { opacity: 0; transform: scale(0.92) translateY(40px) rotateX(8deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotateX(0); }
        }
        @keyframes modalOut {
          to { opacity: 0; transform: scale(0.96) translateY(-20px); }
        }
        @keyframes textShine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes glare {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }
        @keyframes masonryFadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 170, 0, 0.15); }
          50% { box-shadow: 0 0 40px rgba(255, 170, 0, 0.3); }
        }

        .animate-modal-in { animation: modalIn 0.7s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-modal-out { animation: modalOut 0.4s ease-in forwards; }

        .text-gold-shine {
          background: linear-gradient(
            to right,
            #bf953f 0%,
            #fcf6ba 20%,
            #ffd700 40%,
            #fcf6ba 60%,
            #bf953f 80%,
            #fcf6ba 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: textShine 3s linear infinite;
        }

        .btn-festive {
          position: relative;
          overflow: hidden;
        }
        .btn-festive::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.35),
            transparent
          );
          transform: skewX(-25deg);
          animation: glare 3.5s infinite ease-in-out;
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(30, 15, 10, 0.85) 0%, rgba(45, 20, 15, 0.9) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
      `}</style>

      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-500 ${closing ? 'opacity-0' : 'opacity-100'}`}
        onClick={close}
      />

      {/* Fireworks behind modal */}
      <FireworksCanvas />

      {/* ---------- MAIN CARD ---------- */}
      <div
        className={`
          relative flex flex-col md:flex-row
          w-full max-w-250
          h-[88vh] md:h-auto md:max-h-[85vh] md:aspect-video
          glass-card
          rounded-3xl
          overflow-hidden
          border border-amber-500/20
          shadow-[0_0_60px_rgba(0,0,0,0.5),0_0_120px_rgba(255,170,0,0.08)]
          ${closing ? 'animate-modal-out' : 'animate-modal-in'}
        `}
        style={{ animation: closing ? undefined : undefined }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle animated glow border */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none z-30" style={{ animation: 'pulseGlow 4s ease-in-out infinite' }} />

        {/* Sparkle particles over the entire card */}
        <Sparkles />

        {/* ---------- LEFT: CONTENT ---------- */}
        <div className="
          relative z-20
          order-2 md:order-1
          flex-1 md:flex-[0.55]
          flex flex-col justify-center items-center md:items-start
          p-5 md:p-8 lg:p-10
          text-center md:text-left
          overflow-hidden
        ">

          {/* Badge */}
          <div className="mb-3 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/25 bg-amber-500/10 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <CMSText
              k="anniversary.badge"
              defaultVal="Association AEE"
              className="text-amber-300 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase"
            />
          </div>

          {/* Title */}
          <h2 className="text-white text-3xl md:text-4xl lg:text-5xl font-black leading-[1.1] mb-2">
            <CMSText
              k="anniversary.subtitle"
              defaultVal="Célébrons"
              as="span"
              className="block text-base md:text-lg font-medium text-amber-200/70 mb-1"
            />
            <span className="text-gold-shine drop-shadow-[0_2px_20px_rgba(255,215,0,0.3)]" style={{ animation: 'textShine 3s linear infinite, float 4s ease-in-out infinite' }}>
              <CMSText k="anniversary.years" defaultVal="43 Ans" />
            </span>
          </h2>

          <CMSText
            k="anniversary.tagline"
            defaultVal="au service des enfants"
            as="h3"
            className="text-white/80 text-sm md:text-base font-light tracking-wide mb-3"
          />

          <CMSText
            k="anniversary.description"
            defaultVal="Depuis 1983, l'Évangile est partagé avec passion. Merci à chaque partenaire qui rend cette mission possible."
            as="p"
            className="text-amber-100/50 text-xs md:text-sm leading-relaxed max-w-md mb-4"
          />

          {/* Stats */}
          <div className="flex gap-8 mb-5 border-t border-white/10 pt-4 w-full justify-center md:justify-start">
            <div className="text-center md:text-left">
              <CMSText
                k="anniversary.stat.year_start"
                defaultVal="1983"
                as="div"
                className="text-rose-400 font-bold text-xl md:text-2xl tabular-nums"
              />
              <CMSText
                k="anniversary.stat.year_start_label"
                defaultVal="Début"
                as="div"
                className="text-[10px] uppercase text-amber-200/40 tracking-wider mt-1"
              />
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center md:text-left">
              <CMSText
                k="anniversary.stat.year_now"
                defaultVal="2026"
                as="div"
                className="text-amber-400 font-bold text-xl md:text-2xl tabular-nums"
              />
              <CMSText
                k="anniversary.stat.year_now_label"
                defaultVal="Aujourd'hui"
                as="div"
                className="text-[10px] uppercase text-amber-200/40 tracking-wider mt-1"
              />
            </div>
          </div>

          {/* CTA Button */}
          <button
            onClick={close}
            className="
              btn-festive
              relative group
              bg-linear-to-r from-rose-700 via-rose-600 to-amber-600
              hover:from-rose-600 hover:via-rose-500 hover:to-amber-500
              text-white font-bold uppercase tracking-wider text-sm
              px-6 py-3
              rounded-2xl
              shadow-[0_8px_32px_rgba(200,30,70,0.35)]
              hover:shadow-[0_12px_40px_rgba(200,30,70,0.5)]
              hover:-translate-y-0.5
              active:translate-y-0
              transition-all duration-300
              whitespace-nowrap
              w-full md:w-auto
              min-w-48
            "
          >
            <CMSText k="anniversary.cta" defaultVal="Découvrir l'histoire" />
          </button>

          <button
            onClick={close}
            className="mt-3 text-xs text-amber-200/30 hover:text-white/80 transition-colors underline decoration-amber-900/50 underline-offset-4 hover:decoration-white/30"
          >
            <CMSText k="anniversary.skip" defaultVal="Passer l'introduction" />
          </button>
        </div>

        {/* ---------- RIGHT: CANDLE ILLUMINATION ---------- */}
        <div className="relative order-1 md:order-2 h-[38vh] md:h-auto flex-[0.45] overflow-hidden bg-black/40">
          <CandleMosaic />
          
          {/* Confetti over the candle */}
          <ConfettiCanvas />

          {/* Big watermark number */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="w-full h-full bg-linear-to-t from-[#1a0e0a] to-transparent md:bg-linear-to-l md:from-[#1a0e0a]/60 md:to-transparent opacity-70" />
            <span
              className="absolute text-[130px] md:text-[200px] font-black text-transparent select-none"
              style={{
                WebkitTextStroke: '2px rgba(255,215,0,0.15)',
                textShadow: '0 0 80px rgba(255,215,0,0.1)',
              }}
            >
              43
            </span>
          </div>

          {/* Close button (mobile: top right of image area) */}
          <button
            onClick={close}
            className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-black/60 transition-all duration-200"
            aria-label="Fermer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
};