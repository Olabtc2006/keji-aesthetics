/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, Heart, Sparkles, Send } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onNavigateCategory: (categorySlug: any) => void;
}

export default function Footer({ onNavigate, onNavigateCategory }: FooterProps) {
  const [emailSub, setEmailSub] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSub.trim()) return;
    setSubscribed(true);
    setEmailSub('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="relative bg-[#0A0A0A] border-t border-white/5 pt-20 pb-10 overflow-hidden z-10 w-full">
      {/* Visual accents */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF4FA3]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-12 w-[300px] h-[300px] bg-[#FFD84D]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Block */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-xl tracking-[0.25em] font-sans font-black text-white">
              KEJI<span className="text-[#FF4FA3]">_</span>AESTHETICS
            </span>
          </div>
          <p className="text-gray-500 font-mono text-[11px] tracking-widest uppercase">
            Dress To Impress; Live To Express
          </p>
          <p className="text-gray-400 text-xs font-light leading-relaxed max-w-sm mt-1">
            We provide carefully curated apparel, accessories, home décor, digital products, and lifestyle essentials designed for those who express pure confidence.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#FFD84D]">
            Explore
          </h3>
          <ul className="flex flex-col gap-3">
            {[
              { label: 'Shop Store', page: 'shop' },
              { label: 'Categories Menu', page: 'categories' },
              { label: 'Our Story', page: 'about' },
              { label: 'Wishlist Hub', page: 'wishlist' },
              { label: 'User Portal', page: 'account' },
            ].map((link) => (
              <li key={link.label}>
                <button
                  onClick={() => onNavigate(link.page)}
                  className="text-gray-400 hover:text-[#FF4FA3] text-xs font-light tracking-wide transition-colors duration-200"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories Block */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#FF4FA3]">
            Curated Lines
          </h3>
          <ul className="flex flex-col gap-3">
            {[
              { label: 'Unisex Apparel', slug: 'unisex-wears' },
              { label: 'Intimate Wear', slug: 'underwear' },
              { label: 'Designer Bags', slug: 'bags' },
              { label: 'Luxe Jewelry', slug: 'jewelry' },
              { label: 'Home Ornaments', slug: 'home-decor' },
            ].map((cat) => (
              <li key={cat.label}>
                <button
                  onClick={() => onNavigateCategory(cat.slug)}
                  className="text-gray-400 hover:text-white text-xs font-light tracking-wide transition-colors duration-200"
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="flex flex-col gap-5">
          <h3 className="text-white font-mono text-xs tracking-[0.2em] uppercase font-bold text-[#FFD84D]">
            Aesthetic Feed
          </h3>
          <p className="text-gray-400 text-xs font-light leading-relaxed">
            Join the inner elite. Receive access to drop releases, secret coupon vouchers, and new curations.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center mt-2 group">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={emailSub}
              onChange={(e) => setEmailSub(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-5 pr-12 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#FF4FA3]/60 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 w-9 h-9 bg-[#FF4FA3] hover:bg-[#FF4FA3]/80 rounded-full flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          {subscribed && (
            <span className="text-[10px] font-mono text-[#FF4FA3] self-start animate-fade-in">
              Welcome to KEJI_AESTHETICS 💖
            </span>
          )}
        </div>
      </div>

      {/* Social, Admin Info and Direct Contacts */}
      <div className="max-w-6xl mx-auto px-6 mt-16 pt-10 border-t border-white/5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Contacts Grid */}
          <div className="flex flex-col md:flex-row flex-wrap gap-x-8 gap-y-3">
            <a
              href="https://wa.me/2349020942048"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF4FA3] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF4FA3]" />
              <span className="font-mono">09020942048</span>
            </a>
            <a
              href="mailto:kejiaesthetics@gmail.com"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-[#FF4FA3] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FFD84D]" />
              <span className="font-mono">kejiaesthetics@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/kejihub09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Instagram: <span className="text-[#FF4FA3] font-mono">@kejihub09</span>
            </a>
            <a
              href="https://tiktok.com/@kejiaesthetics09"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              TikTok: <span className="text-[#FF4FA3] font-mono">@kejiaesthetics09</span>
            </a>
          </div>

          {/* Social icons & copyright */}
          <div className="flex flex-col md:items-end gap-2 text-xs text-gray-500 font-mono">
            <span className="flex items-center gap-1.5 md:justify-end">
              Dress to Impress <Heart className="w-3 h-3 text-[#FF4FA3]" /> Live to Express.
            </span>
            <span>
              &copy; {new Date().getFullYear()} KEJI AESTHETICS Ltd.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
