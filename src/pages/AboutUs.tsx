/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Trophy, Eye, HeartHandshake, ShieldCheck } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative overflow-hidden">
      {/* Light spots background */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-[#FF4FA3]/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-[#FFD84D]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 select-none">
        
        {/* Main Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-black">
            The Brand Manifesto
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            ESTHERTICS <span className="text-[#FFD84D]">KINETICS</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Established on the core ideals of statement dressing, customized mystery curations, and high fashion. Inside the ateliers of Keji Aesthetics, expression is paramount.
          </p>
        </div>

        {/* Brand Motto Block */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-white/[0.01] border border-white/5 mb-16 overflow-hidden flex flex-col items-center justify-center text-center">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#FFD84D]/5 rounded-full blur-2xl pointer-events-none" />
          <span className="text-[9px] font-mono tracking-[0.4em] text-[#FF4FA3] uppercase font-bold mb-4">
            Our Official Motto
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-widest text-white leading-none uppercase max-w-2xl">
            "Dress To Impress; <span className="text-[#FFD84D]">Live To Express</span>"
          </h2>
          <div className="w-12 h-[1px] bg-white/20 mt-6 mb-4" />
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl leading-relaxed">
            The Keji brand defines fashion not simply as a textile shield, but as an active, breathing extension of identity. Every structured bag, unisex embroidery, and luxury charm is hand-curated to inspire courage.
          </p>
        </div>

        {/* Bento values segment layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <span className="w-10 h-10 bg-[#FF4FA3]/15 border border-[#FF4FA3]/30 rounded-xl flex items-center justify-center text-white mb-2">
              <Sparkles className="w-5 h-5 text-[#FF4FA3]" />
            </span>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Unisex Avant-Garde</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              We specialize in genderless aesthetics, compiling unisex hoodies, cargo coordinates, knitwares, and premium casual overlays designed for universal configurations.
            </p>
          </div>

          <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <span className="w-10 h-10 bg-[#FFD84D]/15 border border-[#FFD84D]/30 rounded-xl flex items-center justify-center text-[#FFD84D] mb-2">
              <Trophy className="w-5 h-5" />
            </span>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Luxe Jewelry & Bags</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              Crafted in robust sterling accents, micro alloys, and titanium glazes. Our designer bags combine multi-pocket utility compartments with minimalist silhouette frames.
            </p>
          </div>

          <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <span className="w-10 h-10 bg-[#FF4FA3]/15 border border-[#FF4FA3]/30 rounded-xl flex items-center justify-center text-[#FF4FA3] mb-2">
              <Eye className="w-5 h-5 text-[#FF4FA3]" />
            </span>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Digital Portfolio Assets</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              High-definition Lightroom presets, fashion mockups, styling guidelines, and creative palettes distributed instantly in download packages.
            </p>
          </div>

          <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-3">
            <span className="w-10 h-10 bg-[#FFD84D]/15 border border-[#FFD84D]/30 rounded-xl flex items-center justify-center text-[#FFD84D] mb-2">
              <HeartHandshake className="w-5 h-5 animate-bounce" />
            </span>
            <h3 className="text-white text-sm font-bold uppercase tracking-wider">Surprise Packages Gifting</h3>
            <p className="text-gray-400 text-xs leading-relaxed font-light">
              Unbox customized styling combinations handpicked by Keji's creative team, styled carefully underneath a theme selection card to deliver exquisite unboxing experiences.
            </p>
          </div>
        </div>

        {/* Quality stamp bar */}
        <div className="border-t border-white/5 pt-10 flex items-center justify-between flex-wrap gap-4 text-gray-500 font-mono text-[9px]">
          <span>© KEJI AESTHETICS • ALL RIGHTS SECURED</span>
          <span className="text-[#FF4FA3] tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#FF4FA3]" />
            100% SECURE CHECKOUTS TRANSIT
          </span>
        </div>
      </div>
    </div>
  );
}
