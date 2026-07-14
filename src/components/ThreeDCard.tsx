/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useTransition } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  id?: string;
  key?: React.Key;
}

export default function ThreeDCard({ children, className = '', onClick, id }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Spring configurations for super smooth fluid animations
  const rotateXSpring = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 });
  const rotateYSpring = useSpring(0, { stiffness: 120, damping: 18, mass: 0.6 });
  const scaleSpring = useSpring(1, { stiffness: 150, damping: 20 });
  
  // Custom glare reflection position states
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Relative position inside the card (coordinate from 0 to width/height)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize coordinates: center is (0,0), range from -0.5 to 0.5
    const normalizedX = (mouseX / width) - 0.5;
    const normalizedY = (mouseY / height) - 0.5;

    // Set maximum tilt angles (degrees)
    const maxTilt = 14; 
    
    // Calculate tilt
    // moving cursor up (negative normalizedY) Tilts card forward (positive x rotation)
    // moving cursor right (positive normalizedX) Tilts card right (positive y rotation)
    rotateXSpring.set(-normalizedY * maxTilt);
    rotateYSpring.set(normalizedX * maxTilt);

    // Glare position percentage (for background radial gradient)
    const glareXPercent = (mouseX / width) * 100;
    const glareYPercent = (mouseY / height) * 100;
    setGlarePos({
      x: glareXPercent,
      y: glareYPercent,
      opacity: 0.45
    });
  };

  const handleMouseEnter = () => {
    scaleSpring.set(1.03);
  };

  const handleMouseLeave = () => {
    rotateXSpring.set(0);
    rotateYSpring.set(0);
    scaleSpring.set(1);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative select-none [perspective:1000px] ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          scale: scaleSpring,
          transformStyle: 'preserve-3d'
        }}
        className="relative w-full h-full transition-shadow duration-300"
      >
        {/* Dynamic Interactive Glare Reflection Sheet */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-30 transition-opacity duration-300 pointer-events-none mix-blend-color-dodge"
          style={{
            opacity: glarePos.opacity,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.15) 0%, rgba(255, 79, 163, 0.08) 30%, rgba(255, 216, 77, 0.05) 50%, transparent 80%)`
          }}
        />

        {/* Highlight Contour lines layer for depth */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none z-20 border border-white/5 transition-colors duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 79, 163, 0.12) 0%, transparent 60%)`,
            mixBlendMode: 'screen'
          }}
        />

        {/* Main Content Node */}
        <div className="w-full h-full" style={{ transform: 'translateZ(0px)', transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
