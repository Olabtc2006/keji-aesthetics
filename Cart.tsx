/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  Heart,
  ChevronRight,
  ArrowRight,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { OrderItem } from '../types';
import { COUNTRIES, NIGERIAN_STATES, getShippingFee } from '../lib/shipping';

interface CartProps {
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  onRemoveFromCart: (productId: string, size?: string, color?: string) => void;
  onSaveForLater: (productId: string, size?: string, color?: string) => void;
  onNavigate: (page: string) => void;
}

export default function Cart({
  cartItems,
  onUpdateQuantity,
  onRemoveFromCart,
  onSaveForLater,
  onNavigate
}: CartProps) {
  
  // Shipping Estimator States
  const [estCountry, setEstCountry] = useState('Nigeria');
  const [estState, setEstState] = useState('');

  // Calculate total costs details
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = estCountry && estState ? getShippingFee(estCountry, estState, subtotal) : null;
  const totalAmount = subtotal + (deliveryFee || 0);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-12 right-0 w-80 h-80 bg-[#FF4FA3]/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 select-none">
        
        {/* Title Heading */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold">
            Draft Bag
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            SHOPPING <span className="text-[#FFD84D]">BAG CART</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Review the items inside your premium Keji Aesthetics shopping bag before proceeding. Free express delivery automatically triggers on orders above ₦50,000!
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            
            {/* LEFT: CART ITEMS LIST */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {cartItems.map((item, index) => (
                <div
                  key={`${item.productId}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-5 bg-[#0F0F13]/60 border border-white/5 rounded-2xl gap-5 relative group"
                >
                  <div className="flex items-center gap-5">
                    {/* Item preview image */}
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-20 h-20 rounded-xl object-cover border border-white/5 bg-neutral-900"
                    />

                    <div className="flex flex-col">
                      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                        Item #{index + 1}
                      </span>
                      <h3 className="text-white text-sm font-semibold truncate max-w-[200px] sm:max-w-xs mt-0.5 uppercase">
                        {item.productName}
                      </h3>
                      {/* Configuration items specs */}
                      <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] font-mono text-gray-400">
                        {item.selectedSize && (
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            SIZE: <span className="text-white font-bold">{item.selectedSize}</span>
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="bg-white/5 px-2 py-0.5 rounded border border-white/5">
                            STYLE: <span className="text-[#FFD84D] font-bold">{item.selectedColor}</span>
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-mono text-gray-400 mt-3 sm:hidden font-bold">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions (Incrementors, delete) */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-none border-white/5 pt-4 sm:pt-0">
                    {/* Size and color selector quantity */}
                    <div className="flex items-center border border-white/10 rounded-xl bg-black/40 overflow-hidden h-9 w-28">
                      <button
                        onClick={() => {
                          if (item.quantity > 1) {
                            onUpdateQuantity(item.productId, item.quantity - 1, item.selectedSize, item.selectedColor);
                          }
                        }}
                        className="flex-1 hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono text-xs">{item.quantity}</span>
                      <button
                        onClick={() => {
                          onUpdateQuantity(item.productId, item.quantity + 1, item.selectedSize, item.selectedColor);
                        }}
                        className="flex-1 hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer text-xs"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right hidden sm:flex flex-col min-w-24">
                      <span className="text-xs font-mono font-bold text-white">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-gray-500 font-mono">
                        ₦{item.price.toLocaleString()} ea
                      </span>
                    </div>

                    {/* Secondary operations panel */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onSaveForLater(item.productId, item.selectedSize, item.selectedColor)}
                        className="p-2 hover:bg-[#FF4FA3]/5 rounded-xl border border-transparent hover:border-[#FF4FA3]/15 text-gray-500 hover:text-[#FF4FA3] transition-colors cursor-pointer"
                        title="Save for Later"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFromCart(item.productId, item.selectedSize, item.selectedColor)}
                        className="p-2 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/20 text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: ORDER SUMMARY PANEL */}
            <div className="bg-[#0F0F13]/80 border border-white/5 rounded-2xl p-6 backdrop-blur-md shadow-[0_15px_30px_rgba(0,0,0,0.8)] flex flex-col gap-6">
              <h2 className="text-xs uppercase font-mono tracking-[0.2em] text-[#FFD84D] font-bold pb-4 border-b border-white/5">
                Cart Summary
              </h2>

              <div className="flex flex-col gap-3 font-mono text-xs text-gray-400 border-b border-white/5 pb-4">
                <div className="flex justify-between">
                  <span>Bag Items Subtotal</span>
                  <span className="text-white">₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Delivery/Shipping Fee</span>
                  {deliveryFee === null ? (
                    <span className="text-[#FFD84D] text-[10px] uppercase font-bold tracking-wider animate-pulse">
                      Select Location
                    </span>
                  ) : deliveryFee === 0 ? (
                    <span className="text-green-400 font-bold uppercase tracking-widest text-[9px]">
                      FREE TRANSIT
                    </span>
                  ) : (
                    <span className="text-white">₦{deliveryFee.toLocaleString()}</span>
                  )}
                </div>
              </div>

              {/* Shipping Estimator Drawer/Subcard */}
              <div className="bg-black/20 border border-white/5 rounded-xl p-3.5 flex flex-col gap-2.5 font-mono text-xs">
                <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider flex justify-between">
                  <span>TRANSIT FEES BY LOCATION</span>
                  <span className="text-[#FF4FA3]">★ Live rates</span>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <select
                    value={estCountry}
                    onChange={(e) => {
                      setEstCountry(e.target.value);
                      setEstState('');
                    }}
                    className="bg-[#000]/60 border border-white/5 hover:border-[#FF4FA3]/25 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                  >
                    <option value="" disabled>Select Country...</option>
                    {COUNTRIES.map(c => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  {estCountry === 'Nigeria' ? (
                    <select
                      value={estState}
                      onChange={(e) => setEstState(e.target.value)}
                      className="bg-[#000]/60 border border-white/5 hover:border-[#FF4FA3]/25 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none"
                    >
                      <option value="" className="text-gray-500">Select State...</option>
                      {NIGERIAN_STATES.map(s => (
                        <option key={s.name} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Type State/Region/City..."
                      value={estState}
                      onChange={(e) => setEstState(e.target.value)}
                      className="bg-[#000]/60 border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] text-white focus:outline-none placeholder-gray-600"
                    />
                  )}
                </div>
              </div>

              {/* Total scale */}
              <div className="flex justify-between items-baseline font-mono pb-2">
                <span className="text-xs font-bold text-gray-200">Bag Order Total:</span>
                <span className="text-2xl font-black text-[#FF4FA3]">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              {/* Free transit notification banner */}
              {subtotal < 50000 && (
                <div className="bg-[#FFD84D]/5 border border-[#FFD84D]/25 p-3 rounded-xl flex items-start gap-2.5">
                  <span className="text-xs">👋</span>
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans">
                    Add <span className="font-mono text-[#FFD84D] font-bold">₦{(50000 - subtotal).toLocaleString()}</span> more value of premium items to qualify for{' '}
                    <span className="text-white font-semibold">FREE Express Transit</span> across Nigeria!
                  </p>
                </div>
              )}

              {/* Checkout process button */}
              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 hover:from-[#FF4FA3]/90 rounded-xl py-3.5 text-xs font-mono tracking-widest uppercase font-bold text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,79,163,0.25)] hover:shadow-[0_0_35px_rgba(255,79,163,0.45)] flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                Proceed To Checkout
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="w-full bg-white/3 border border-white/10 hover:bg-white/5 rounded-xl py-3 text-xs font-mono tracking-widest uppercase text-gray-400 hover:text-white transition-colors cursor-pointer text-center"
              >
                Continue Showroom Browse
              </button>
            </div>
          </div>
        ) : (
          /* Empty Bag state */
          <div className="text-center py-32 flex flex-col items-center justify-center gap-4 bg-[#0F0F13]/25 border border-white/5 rounded-3xl p-8 select-none">
            <ShoppingBag className="w-12 h-12 text-[#FFD84D]/30 animate-pulse" />
            <h3 className="text-lg uppercase tracking-widest font-mono text-gray-300">
              Your Cart Is Empty
            </h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              You haven't added any premium signature items to your bag yet. Head over to the storefront and select options of choice!
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-2 px-6 py-3 bg-gradient-to-r from-[#FFD84D] to-orange-500 text-[#000] font-mono text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer flex items-center gap-2 font-bold"
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
