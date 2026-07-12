/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Category, CategorySlug } from '../types';
import { api } from '../lib/supabase';

interface CategoriesProps {
  onNavigateCategory: (slug: CategorySlug) => void;
}

export default function Categories({ onNavigateCategory }: CategoriesProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  
  useEffect(() => {
    api.fetchCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      {/* Light design filters */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4FA3]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 select-none">
        
        {/* Page title */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold">
            Curated Showroom
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            BUSINESS <span className="text-[#FFD84D]">DEPARTMENTS</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Explore carefully partitioned lines of fashion wardrobe apparel, cozy undergarments, luxury accessories, customized mystery gifts, and digital workflow assets.
          </p>
        </div>

        {/* Categories bento layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              onClick={() => onNavigateCategory(cat.slug)}
              className="group relative h-96 rounded-3xl overflow-hidden border border-white/5 bg-[#121217]/60 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
            >
              {/* Image background block */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              
              {/* Luxury linear dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-black/45 to-transparent" />
              
              {/* Corner item placement stamp */}
              <div className="absolute top-6 left-6 font-mono text-[9px] text-[#FFD84D] tracking-widest uppercase border border-[#FFD84D]/20 px-2.5 py-1 bg-black/60 rounded-full">
                Line 0{idx + 1}
              </div>

              {/* Text Areas */}
              <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-2">
                <span className="text-[#FF4FA3] text-[9px] font-mono tracking-[0.25em] uppercase font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  Keji Aesthetics
                </span>
                <h2 className="text-2xl text-white tracking-widest uppercase font-black">
                  {cat.name}
                </h2>
                <p className="text-gray-400 text-xs font-light leading-relaxed mt-2 line-clamp-3">
                  {cat.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono text-white tracking-widest uppercase mt-5 group-hover:text-[#FFD84D] transition-colors">
                  <span>Browse Category</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
