/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Play, ArrowRight, MousePointerClick, Sparkles } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onShopClick, onExploreClick }: HeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [videoSrc, setVideoSrc] = useState('/assets/hero.mp4');

  // Parallax parallax transforms using scroll
  const { scrollY } = useScroll();
  const yText = useTransform(scrollY, [0, 400], [0, 100]);
  const opacityText = useTransform(scrollY, [0, 450], [1, 0]);
  const scaleBackground = useTransform(scrollY, [0, 600], [1, 1.1]);

  // Video fallback strategy: if /assets/hero.mp4 fails, trigger a premium cinematic background
  const handleVideoError = () => {
    console.log('Official hero video assets failed or missing, deploying aesthetic luxurious fallback backdrop');
    // Using a gorgeous, high-end, dark luxury butterfly/abstract close-up loop from Pexels/CDN
    setVideoSrc('https://player.vimeo.com/external/371433846.sd.mp4?s=23116527b686369dc1e7da4777d4c20b853507bc&profile_id=165&oauth2_token_id=57447761');
  };

  // Interactive 3D Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Mouse coordinates tracker
    let mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Particle construct
    interface Particle {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      size: number;
      density: number;
      color: string;
      angle: number;
      speed: number;
    }

    const particles: Particle[] = [];
    const particleCount = 120;

    // Soft Gold (#FFD84D) and Luxury Pink (#FF4FA3) particle color accents
    const colors = ['rgba(255, 79, 163, 0.4)', 'rgba(255, 216, 77, 0.45)', 'rgba(255, 255, 255, 0.25)'];

    for (let i = 0; i < particleCount; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      particles.push({
        x: px,
        y: py,
        baseX: px,
        baseY: py,
        size: Math.random() * 2 + 0.8,
        density: Math.random() * 20 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.4 + 0.1
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Animate Loop
    const drawAndAnimate = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse follow
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      particles.forEach((p) => {
        // Floating circular motion
        p.angle += p.speed * 0.02;
        p.x += Math.cos(p.angle) * 0.3;
        p.y += Math.sin(p.angle) * 0.3;

        // Mouse attraction/repulsion matrix
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDistance = 180;

        if (distance < maxDistance) {
          const force = (maxDistance - distance) / maxDistance;
          // Pull towards mouse slightly
          p.x += (dx / distance) * force * 1.5;
          p.y += (dy / distance) * force * 1.5;
        }

        // Draw particle with gentle glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();

        // Connect lines if close to create neat wireframe constellation
        particles.forEach((other, idx) => {
          if (idx <= particles.indexOf(p)) return;
          const odx = p.x - other.x;
          const ody = p.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < 90) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(255, 79, 163, ${(1 - odist / 90) * 0.06})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      // Ambient pink neon cursor aura
      ctx.beginPath();
      const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 5, mouse.x, mouse.y, 140);
      gradient.addColorStop(0, 'rgba(255, 79, 163, 0.05)');
      gradient.addColorStop(1, 'rgba(13, 13, 13, 0)');
      ctx.fillStyle = gradient;
      ctx.arc(mouse.x, mouse.y, 140, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(drawAndAnimate);
    };

    drawAndAnimate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      id="hero-section"
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D] pt-16 z-10"
    >
      {/* 1. Cinematic Background Video Frame */}
      <motion.div
        style={{ scale: scaleBackground }}
        className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
      >
        <video
          key={videoSrc}
          autoPlay
          muted
          loop
          playsInline
          onError={handleVideoError}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </motion.div>

      {/* 2. Luxury Dark Gradient & Pink Neon Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-black/55 to-black/85 z-1" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-1" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0D0D0D] to-transparent z-2" />
      
      {/* Subtle Pink Neon Radial Glow Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#FF4FA3]/10 rounded-full blur-[140px] pointer-events-none mix-blend-screen z-1" />

      {/* 3. Interactive WebGL/Canvas Particle Overlay */}
      <canvas
        id="hero-particles"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-3"
      />

      {/* 4. Luxury Cinematic Text & Actions Layout */}
      <div className="relative max-w-6xl mx-auto px-6 text-center z-10 select-none">
        <motion.div
          style={{ y: yText, opacity: opacityText }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          {/* Tagline Badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-black/60 border border-[#FF4FA3]/30 rounded-full shadow-[0_0_15px_rgba(255,79,163,0.15)] backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#FFD84D] animate-pulse" />
            <span className="text-[10px] tracking-[0.25em] font-mono text-gray-300 uppercase">
              Keji Aesthetics • Official E-Store
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-8xl tracking-tight leading-none text-white font-sans font-black uppercase max-w-4xl drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            <span className="block drop-shadow-sm font-sans">
              Dress To <span className="bg-gradient-to-r from-[#FF4FA3] via-[#FFD84D] to-[#FF4FA3] bg-clip-text text-transparent">Impress.</span>
            </span>
            <span className="block text-4xl md:text-7xl font-light tracking-[0.15em] font-sans text-gray-300 mt-2">
              Live To Express.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-gray-400 text-sm md:text-lg font-light max-w-2xl px-4 mt-2 drop-shadow-md leading-relaxed">
            Discover premium fashion, accessories, lifestyle essentials, digital products, and curated mystery packages engineered to elevate your wardrobe.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center">
            {/* Shop now - Neon glow pink panel */}
            <button
              id="hero-shop-btn"
              onClick={onShopClick}
              className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 rounded-full text-white font-mono text-xs tracking-widest uppercase font-semibold overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(255,79,163,0.35)] hover:shadow-[0_0_45px_rgba(255,79,163,0.55)] cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative flex items-center justify-center gap-2">
                Shop Collection
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            {/* Explore collections - Glass crystal luxury */}
            <button
              id="hero-explore-btn"
              onClick={onExploreClick}
              className="group relative w-full sm:w-auto px-8 py-4 bg-black/40 border border-white/20 rounded-full text-white font-mono text-xs tracking-widest uppercase hover:bg-white/10 hover:border-[#FFD84D]/40 transition-all duration-300 backdrop-blur-md cursor-pointer"
            >
              <span className="relative flex items-center justify-center gap-2">
                Explore Categories
                <span className="w-1.5 h-1.5 bg-[#FFD84D] rounded-full group-hover:scale-125 transition-transform" />
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* 5. Animated Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none"
      >
        <span className="text-[9px] uppercase font-mono tracking-[0.2em] text-gray-500">
          Scroll
        </span>
        <div className="w-5 h-8 border border-white/20 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-[#FF4FA3] rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
}
