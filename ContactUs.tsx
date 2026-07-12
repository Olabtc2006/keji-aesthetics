/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Instagram,
  Video,
  Send,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  const contactLinks = [
    {
      label: 'Direct Line WhatsApp',
      value: '09020942048',
      href: 'https://wa.me/2349020942048',
      icon: <Phone className="w-5 h-5 text-green-400" />
    },
    {
      label: 'Official Email Support',
      value: 'kejiaesthetics@gmail.com',
      href: 'mailto:kejiaesthetics@gmail.com',
      icon: <Mail className="w-5 h-5 text-sky-400" />
    },
    {
      label: 'Instagram Runway',
      value: '@kejihub09',
      href: 'https://instagram.com/kejihub09',
      icon: <Instagram className="w-5 h-5 text-pink-400" />
    },
    {
      label: 'TikTok Creative Hub',
      value: '@kejiaesthetics09',
      href: 'https://www.tiktok.com/@kejiaesthetics09',
      icon: <Video className="w-5 h-5 text-[#FFD84D]" />
    }
  ];

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[#FF4FA3]/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10 select-none">
        
        {/* Main Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-black">
            The Communication Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            REACH <span className="text-[#FFD84D]">OUT TO US</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Have questions regarding delivery schedules across Lagos, customizing surprise bundles, or custom sizing apparel models? Get in touch with our creative concierge.
          </p>
        </div>

        {/* Layout: Links vs Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT 5 COLUMNS: CARDS ACTIONS */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-5 bg-[#0F0F13]/60 border border-white/5 hover:border-[#FF4FA3]/20 rounded-2xl flex items-center justify-between transition-all shadow-md cursor-pointer select-text"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/3 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-colors">
                    {link.icon}
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                      {link.label}
                    </span>
                    <span className="text-xs text-white font-bold font-mono mt-0.5">
                      {link.value}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-gray-600 group-hover:text-[#FF4FA3] group-hover:translate-x-1 transition-all">
                  Connect →
                </span>
              </a>
            ))}
          </div>

          {/* RIGHT 7 COLUMNS: CONTACT HELP FORM */}
          <div className="lg:col-span-7 bg-[#121217]/60 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-md">
            <h3 className="text-xs uppercase font-mono text-[#FFD84D] tracking-[0.2em] font-bold pb-4 border-b border-white/5 flex items-center gap-1.5 mb-6">
              <MessageSquare className="w-4.5 h-4.5 text-[#FFD84D]" />
              Leave A Styled Request
            </h3>

            {submitted && (
              <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl text-green-400 text-xs text-center mb-6 leading-relaxed flex items-center justify-center gap-2">
                <Check className="w-4 h-4 text-green-400 animate-pulse" />
                <span>Message submitted! Keji aesthetic agents will reply shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Azeez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4FA3]/50 focus:ring-none placeholder-gray-600"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. support@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4FA3]/50 focus:ring-none placeholder-gray-600 font-mono"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Aesthetic Query Details</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ask anything about sizing, customized items lists, delivery timelines..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#FF4FA3]/50 focus:ring-none placeholder-gray-600 leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 hover:from-[#FF4FA3]/90 rounded-xl py-3.5 text-xs font-mono tracking-widest font-bold uppercase text-white transition-all shadow-[0_0_15px_rgba(255,79,163,0.2)] hover:shadow-[0_0_25px_rgba(255,79,163,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Transmitting Message...</span>
                  </>
                ) : (
                  <>
                    <span>Transmit Styled message</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
