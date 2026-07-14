import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Shield, Compass } from 'lucide-react';

interface IntroAnimationProps {
  key?: React.Key;
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('AUTHENTICATING CURATIONS');

  useEffect(() => {
    // Stage-based loading messages for premium cinematic feel
    const textStages = [
      { progress: 0, text: 'AUTHENTICATING ORIGINAL CURATIONS' },
      { progress: 25, text: 'ESTABLISHING KEJI CRYPTO SECURITY' },
      { progress: 50, text: 'SYNCHRONIZING CHIC LUXURY MANIFESTS' },
      { progress: 78, text: 'ALPINING ULTIMATE GLASS VIBE SELECTION' },
      { progress: 95, text: 'READY' }
    ];

    const interval = setInterval(() => {
      setLoadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const next = Math.min(prev + Math.floor(Math.random() * 8) + 3, 100);
        
        // Match appropriate text message
        const matchedStage = [...textStages]
          .reverse()
          .find(stage => next >= stage.progress);
        
        if (matchedStage) {
          setLoadingText(matchedStage.text);
        }

        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Safe tracking of loading progress completion
  useEffect(() => {
    if (loadProgress >= 100) {
      const timer = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [loadProgress, onComplete]);

  // Motion variants for nested elements
  const containerVariants = {
    initial: { opacity: 1 },
    exit: {
      opacity: 0,
      y: -40,
      scale: 1.02,
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1] // Custom refined cubic bezier exit
      }
    }
  };

  const logoVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: 'easeOut',
        staggerChildren: 0.15
      }
    }
  };

  const wordPartVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const ambientGlowVariants = {
    animate: {
      scale: [1, 1.15, 1],
      opacity: [0.25, 0.45, 0.25],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <motion.div
      id="keji-intro-splash"
      key="keji-intro-splash-overlay"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-[9999] bg-[#050508] text-white flex flex-col items-center justify-center select-none overflow-hidden"
    >
        {/* Cinematic Backdrop Glow Lights */}
        <motion.div
          variants={ambientGlowVariants}
          animate="animate"
          className="absolute w-[350px] md:w-[600px] h-[350px] md:h-[600px] rounded-full bg-gradient-to-r from-[#FF4FA3]/15 to-[#FFD84D]/10 blur-[100px] md:blur-[140px] pointer-events-none"
        />

        {/* Ambient Subtle Grid Backing */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] mix-blend-color-dodge opacity-60" />

        {/* Content Wrapper */}
        <div className="relative flex flex-col items-center justify-center max-w-lg w-full px-6 text-center z-10">
          
          {/* Top aesthetic label & emblem */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex items-center gap-2 mb-8"
          >
            <div className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/30" />
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#FF4FA3] uppercase font-bold flex items-center gap-1">
              <Compass className="w-3 h-3 animate-spin" style={{ animationDuration: '3s' }} /> TO EXPRESS, NOT TO IMPRESS
            </span>
            <div className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/30" />
          </motion.div>

          {/* Grand Wordmark Logo with stagger slide animations */}
          <motion.div
            variants={logoVariants}
            initial="initial"
            animate="animate"
            className="flex flex-col items-center gap-1.5"
          >
            <motion.h1 
              variants={wordPartVariants}
              className="text-5xl md:text-7xl font-sans tracking-[0.3em] md:tracking-[0.45em] font-black text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-none select-none pl-[0.3em] md:pl-[0.45em]"
            >
              KEJI
            </motion.h1>
            
            {/* Elegant high-contrast line element */}
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '80%' }}
              transition={{ delay: 0.5, duration: 1, ease: 'easeInOut' }}
              className="h-[1px] bg-gradient-to-r from-transparent via-[#FFD84D] to-transparent my-1 md:my-2"
            />

            <motion.p 
              variants={wordPartVariants}
              className="text-xs md:text-sm font-mono tracking-[0.55em] md:tracking-[0.7em] text-[#FF4FA3] font-black uppercase text-center pl-[0.55em] md:pl-[0.7em] drop-shadow-[0_2px_8px_rgba(255,79,163,0.3)]"
            >
              AESTHETICS
            </motion.p>
          </motion.div>

          {/* Slogan Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.65 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 text-[11px] md:text-xs text-gray-400 font-light max-w-[280px] md:max-w-[340px] leading-relaxed select-none"
          >
            Luxury apparel, custom streetwear curations, and bespoke premium designer assets.
          </motion.p>

          {/* Loading bar and metadata */}
          <div className="mt-16 w-full max-w-[240px] flex flex-col gap-3">
            
            {/* Loading text readout */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={loadingText}
              className="text-[8px] font-mono uppercase text-gray-500 tracking-[0.2em] h-3 select-none flex items-center justify-center gap-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-[#FFD84D] animate-pulse" />
              <span>{loadingText}</span>
            </motion.div>

            {/* Absolute linear percentage indicator */}
            <div className="relative h-[2px] w-full bg-neutral-900 border border-white/5 rounded-full overflow-hidden">
              <motion.div
                style={{ width: `${loadProgress}%` }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#FFD84D] via-[#FF4FA3] to-[#FF4FA3] rounded-full transition-all duration-100 ease-out"
              />
            </div>

            {/* Numeric percent ticker */}
            <div className="flex justify-between items-center text-[9px] font-mono text-gray-600 tracking-widest mt-0.5 select-none">
              <span className="flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-green-500/50" /> SECURE SSL
              </span>
              <span className="text-gray-400 font-black">{loadProgress}%</span>
            </div>
          </div>

        </div>

        {/* Vintage static frame edges detail */}
        <div className="absolute top-8 left-8 text-[8px] font-mono text-white/10 tracking-[0.2em] pointer-events-none hidden md:block select-none">
          SYS_EST: L_2026.KJA
        </div>
        <div className="absolute bottom-8 right-8 text-[8px] font-mono text-white/10 tracking-[0.2em] pointer-events-none hidden md:block select-none">
          LOC: NG/EU.SECURE
        </div>
      </motion.div>
  );
}
