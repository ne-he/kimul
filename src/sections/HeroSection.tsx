import { useEffect, useRef, useState } from 'react';

const SAMPLE = 3;
const MAX_PARTICLES = 18000;

class Particle {
  ox: number;
  oy: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  g: number;
  b: number;
  a: number;
  size: number;
  stiffness: number;
  damping: number;
  repulseRadius: number;
  repulseStrength: number;
  alpha: number;
  targetAlpha: number;
  driftPhase: number;

  constructor(ox: number, oy: number, r: number, g: number, b: number, a: number) {
    this.ox = ox;
    this.oy = oy;
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.vx = 0;
    this.vy = 0;
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
    this.size = 1.2 + Math.random() * 0.8;
    // Zero-gravity: very low stiffness for slow drift
    this.stiffness = 0.008 + Math.random() * 0.004;
    // High damping for continued drift
    this.damping = 0.91 + Math.random() * 0.03;
    this.repulseRadius = 90 + Math.random() * 40;
    this.repulseStrength = 6 + Math.random() * 4;
    this.alpha = 0;
    this.targetAlpha = (a / 255) * 0.85;
    // Random drift phase for variety
    this.driftPhase = Math.random() * Math.PI * 2;
  }

  update(mx: number, my: number, time: number) {
    // Spring toward origin — very gentle (zero gravity feel)
    const fx = (this.ox - this.x) * this.stiffness;
    const fy = (this.oy - this.y) * this.stiffness;

    this.vx += fx;
    this.vy += fy;

    // Mouse repulsion
    const dx = this.x - mx;
    const dy = this.y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < this.repulseRadius && mx > 0) {
      const force = (1 - dist / this.repulseRadius);
      const angle = Math.atan2(dy, dx);
      this.vx += Math.cos(angle) * force * this.repulseStrength;
      this.vy += Math.sin(angle) * force * this.repulseStrength;
    }

    // Zero-gravity drift — perpetual floating when near target
    const distToOrigin = Math.sqrt(
      (this.x - this.ox) ** 2 + (this.y - this.oy) ** 2
    );
    if (distToOrigin < 3) {
      // Apply tiny random drift — like dust in space
      this.vx += (Math.random() - 0.5) * 0.12;
      this.vy += (Math.random() - 0.5) * 0.12;
      // Gentle sine wave drift
      this.vx += Math.sin(time * 0.5 + this.driftPhase) * 0.03;
      this.vy += Math.cos(time * 0.7 + this.driftPhase) * 0.03;
    }

    // Damping — very slow decay for space-like drift
    this.vx *= this.damping;
    this.vy *= this.damping;

    // Position update
    this.x += this.vx;
    this.y += this.vy;

    // Very gradual fade in
    if (this.alpha < this.targetAlpha) {
      this.alpha = Math.min(this.alpha + 0.008, this.targetAlpha);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // Color: mix original with cyan tint based on velocity
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const tint = Math.min(speed / 8, 1);

    const nr = Math.round(this.r + (0 - this.r) * tint * 0.6);
    const ng = Math.round(this.g + (255 - this.g) * tint * 0.5);
    const nb = Math.round(this.b + (200 - this.b) * tint * 0.7);

    ctx.fillStyle = `rgba(${nr},${ng},${nb},${this.alpha})`;
    ctx.fillRect(
      this.x - this.size / 2,
      this.y - this.size / 2,
      this.size,
      this.size
    );
  }
}

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);
  const [particleCount, setParticleCount] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');

  const title = 'NEHEMIAH';
  const subtitle = 'Data Science  //  Machine Learning  //  Visualization';

  useEffect(() => {
    // Typewriter effect for title
    let charIndex = 0;
    const titleInterval = setInterval(() => {
      charIndex++;
      setTitleText(title.slice(0, charIndex));
      if (charIndex >= title.length) {
        clearInterval(titleInterval);
        // Start subtitle after title
        let subIndex = 0;
        const subInterval = setInterval(() => {
          subIndex++;
          setSubtitleText(subtitle.slice(0, subIndex));
          if (subIndex >= subtitle.length) {
            clearInterval(subInterval);
          }
        }, 30);
      }
    }, 60);

    setTimeout(() => setShowContent(true), 500);

    return () => clearInterval(titleInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Load and process image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const oc = document.createElement('canvas');
      const scale = Math.min(
        1,
        Math.min((W * 0.38) / img.width, (H * 0.82) / img.height)
      );
      oc.width = Math.round(img.width * scale);
      oc.height = Math.round(img.height * scale);
      const octx = oc.getContext('2d');
      if (!octx) return;
      octx.drawImage(img, 0, 0, oc.width, oc.height);

      const data = octx.getImageData(0, 0, oc.width, oc.height).data;
      const offX = (W - oc.width) / 2;
      const offY = (H - oc.height) / 2;

      const particles: Particle[] = [];
      let count = 0;

      for (let i = 0; i < data.length; i += 4 * SAMPLE) {
        if (count >= MAX_PARTICLES) break;
        const a = data[i + 3];
        if (a < 60) continue;
        const idx = i / 4;
        const px = (idx % oc.width) + offX;
        const py = Math.floor(idx / oc.width) + offY;
        particles.push(
          new Particle(px, py, data[i], data[i + 1], data[i + 2], a)
        );
        count++;
      }

      particlesRef.current = particles;
      setParticleCount(particles.length);
    };
    img.src = '/nehemiah-portrait.png';

    // Animation loop
    const animate = () => {
      // Trail effect for smooth look
      ctx.fillStyle = 'rgba(4,8,16,0.18)';
      ctx.fillRect(0, 0, W, H);

      timeRef.current += 0.016;

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mx, my, timeRef.current);
        particles[i].draw(ctx);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      id="home"
      className="relative"
      style={{ height: '100vh', overflow: 'hidden' }}
    >
      {/* Particle Canvas */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      {/* UI Overlay */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-between pointer-events-none"
        style={{ padding: '40px 48px' }}
      >
        {/* Top */}
        <div
          className={`transition-opacity duration-1000 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="text-[10px] uppercase tracking-[0.25em] mb-3"
            style={{ color: 'rgba(0, 255, 204, 0.5)', fontFamily: 'var(--font-mono)' }}
          >
            Portfolio — 2026
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(36px, 5vw, 64px)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              color: '#e8edf5',
            }}
          >
            {titleText}
            {titleText.length < title.length && (
              <span className="boot-cursor" style={{ color: '#00ffcc' }}>
                _
              </span>
            )}
          </h1>
          <p
            className="mt-3 uppercase"
            style={{
              fontSize: 12,
              letterSpacing: '0.18em',
              color: 'rgba(232,237,245,0.4)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {subtitleText}
            {subtitleText.length < subtitle.length && titleText.length >= title.length && (
              <span className="boot-cursor" style={{ color: '#00ffcc' }}>
                _
              </span>
            )}
          </p>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-end">
          {/* Particle count */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 20,
                color: 'rgba(0, 255, 204, 0.7)',
                fontWeight: 400,
              }}
            >
              {particleCount.toLocaleString()}
            </div>
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'rgba(0, 255, 204, 0.4)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              ACTIVE PARTICLES
            </div>
          </div>

          {/* Links */}
          <div
            className="flex gap-6 pointer-events-auto"
            style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'rgba(232,237,245,0.3)',
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
            }}
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="link-hover">
              GitHub
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="link-hover">
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-10 transition-opacity duration-1000 pointer-events-none ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'rgba(0, 255, 204, 0.25)',
          fontFamily: 'var(--font-mono)',
          textTransform: 'uppercase',
        }}
      >
        <span className="pulse-hint">Move cursor to scatter particles</span>
      </div>

      {/* Version badge */}
      <div
        className={`absolute bottom-6 left-6 z-10 transition-opacity duration-1000 pointer-events-none ${
          showContent ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          fontSize: 9,
          letterSpacing: '0.15em',
          color: 'rgba(0, 255, 204, 0.25)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        v21.04.2026 — build #847
      </div>
    </section>
  );
}
