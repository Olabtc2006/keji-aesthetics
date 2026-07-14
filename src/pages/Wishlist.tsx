/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, Heart, Trash2, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { api } from '../lib/supabase';

interface WishlistProps {
  wishlistIds: string[];
  onRemoveFromWishlist: (productId: string) => void;
  onMoveToCart: (product: Product) => void;
  onSelectProduct: (productId: string) => void;
  onNavigate: (page: string) => void;
}

export default function Wishlist({
  wishlistIds,
  onRemoveFromWishlist,
  onMoveToCart,
  onSelectProduct,
  onNavigate
}: WishlistProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.fetchProducts()
      .then((all) => {
        const wishList = all.filter(p => wishlistIds.includes(p.id));
        setProducts(wishList);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [wishlistIds]);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-12 left-0 w-80 h-80 bg-[#FFD84D]/3 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 select-none">
        
        {/* Title */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold">
            Bookmarks Vault
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            YOUR <span className="text-[#FFD84D]">WISHLIST</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Keep track of statement designs you love. Move items to the shopping bag when you're ready to checkout and place your order.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#FF4FA3] animate-spin mb-4" />
            <span className="text-xs font-mono text-gray-500">Loading bookmarked favorites...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div
                key={p.id}
                className="group relative bg-[#0F0F13]/55 border border-white/5 hover:border-[#FF4FA3]/25 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_10px_25px_rgba(0,0,0,0.6)]"
              >
                {/* Image Section */}
                <div
                  onClick={() => onSelectProduct(p.id)}
                  className="relative h-64 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Absolute remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFromWishlist(p.id);
                    }}
                    className="absolute top-4 right-4 bg-black/60 border border-white/10 text-gray-400 hover:text-[#FF4FA3] hover:border-[#FF4FA3]/30 p-2 rounded-xl transition-all cursor-pointer shadow-lg z-10"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Metadata content */}
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">{p.category}</span>
                  <h3
                    onClick={() => onSelectProduct(p.id)}
                    className="text-white text-sm font-semibold truncate hover:text-[#FF4FA3] cursor-pointer transition-colors"
                  >
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 text-[#FFD84D] fill-[#FFD84D]" />
                    <span className="text-[10px] font-mono text-gray-400">{p.rating}</span>
                  </div>
                  <div className="font-mono text-white text-sm font-bold mt-3">
                    ₦{p.price.toLocaleString()}
                  </div>
                </div>

                {/* Grid controls */}
                <button
                  onClick={() => onMoveToCart(p)}
                  className="w-full bg-[#FF4FA3]/10 hover:bg-[#FF4FA3] border border-[#FF4FA3]/30 rounded-xl py-3 text-xs font-mono tracking-widest uppercase text-[#FF4FA3] hover:text-white transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Move To Bag Cart
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-32 flex flex-col items-center justify-center gap-4 bg-[#0F0F13]/25 border border-white/5 rounded-3xl p-8">
            <Heart className="w-12 h-12 text-[#FF4FA3]/30 animate-pulse" />
            <h3 className="text-lg uppercase tracking-widest font-mono text-gray-300">
              Your Wishlist Is Empty
            </h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              Explore the showroom and add statement pieces to your secret bookmarks vault. Double click to inspect and select options anytime.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-2 px-6 py-3 bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/70 text-white font-mono text-xs uppercase tracking-widest rounded-full hover:shadow-[0_0_15px_rgba(255,79,163,0.35)] transition-all cursor-pointer flex items-center gap-2"
            >
              Browse Shop Catalog
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
