/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface ReceiptLightboxProps {
  url: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptLightbox({ url, isOpen, onClose }: ReceiptLightboxProps) {
  if (!isOpen || !url) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in font-sans">
      {/* Tap/Click background to dismiss */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Lightbox Container Card */}
      <div className="relative max-w-2xl w-full bg-[#0D0D11] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col gap-4 p-6 z-10 animate-scale-up">
        {/* Header Controls */}
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF4FA3] font-black">
              Verified Procurement Receipt
            </span>
            <h3 className="text-sm font-sans font-light text-gray-200 mt-0.5">
              Secure Image Proof Viewer
            </h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Open link directly fallback */}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/5 border border-white/5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Open Proof File In Private Tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            {/* Direct Close Switcher button */}
            <button
              onClick={onClose}
              className="p-2 bg-white/5 border border-white/5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
              title="Dismiss Lightbox View"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Immersive Image Display Area */}
        <div className="relative bg-black/40 border border-white/5 rounded-2xl p-4 flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-auto">
          {url.startsWith('blob:') || url.startsWith('http') || url.startsWith('/') ? (
            <img
              src={url}
              alt="Payment receipt proof upload"
              className="max-h-[50vh] max-w-full rounded-lg object-contain"
              onError={(e) => {
                // Render elegant textual indicator fallback if image fails to load or blob is expired
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const errDiv = document.createElement('div');
                  errDiv.className = "flex flex-col items-center gap-3 text-center p-6";
                  errDiv.innerHTML = `
                    <div class="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xl">⚠️</div>
                    <span class="text-xs font-mono uppercase tracking-widest text-[#FFD84D]">Local Blob Expired</span>
                    <p class="text-xs text-gray-400 max-w-sm leading-relaxed">
                      This order's receipt link is a local file URL structure (<code class="bg-[#222] px-1 rounded text-red-400 font-mono italic">${url.substring(0, 30)}...</code>) belonging to the customer's browser sandbox, or the file storage session has expired.
                    </p>
                  `;
                  parent.appendChild(errDiv);
                }
              }}
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xl">⚠️</div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFD84D]">Plain Text Proof Content</span>
              <p className="text-xs text-gray-400 max-w-sm leading-relaxed mt-1">
                {url}
              </p>
            </div>
          )}
        </div>

        {/* Footer Info details */}
        <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 border-t border-white/5 pt-4">
          <span>SECURED TRANSFER TRACE MTRX</span>
          <span>KEJI AESTHETICS</span>
        </div>
      </div>
    </div>
  );
}
