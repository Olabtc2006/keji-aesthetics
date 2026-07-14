/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  ClipboardList,
  Sparkles,
  Lock,
  Mail,
  Compass,
  ArrowRight,
  ShieldCheck,
  Power,
  RotateCcw
} from 'lucide-react';
import { Order, UserProfile, Product, OrderStatus } from '../types';
import { api } from '../lib/supabase';
import ReceiptLightbox from '../components/ReceiptLightbox';

interface AccountProps {
  onNavigate: (page: string) => void;
  onLoginSuccess: (user: UserProfile) => void;
  userProfile: UserProfile | null;
  onLogout: () => void;
  onSelectProduct: (productId: string) => void;
}

export default function Account({
  onNavigate,
  onLoginSuccess,
  userProfile,
  onLogout,
  onSelectProduct
}: AccountProps) {
  // Auth Form parameters
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  
  // Dashboard details
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  // Receipt light box modal state parameters
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile) {
      setLoading(true);
      setEditName(userProfile.fullName);
      setEditPhone(userProfile.phoneNumber || '');
      setEditAddress(userProfile.shippingAddress || '');

      // Load client details
      Promise.all([
        api.fetchOrders(userProfile.email),
        api.fetchProducts()
      ])
        .then(([ordList, pList]) => {
          setOrders(ordList);

          // Simulate recently viewed items from local storage
          try {
            const viewedIds: string[] = JSON.parse(localStorage.getItem('keji_recently_viewed') || '[]');
            const filteredRecs = pList.filter(p => viewedIds.includes(p.id));
            setRecentlyViewed(filteredRecs.slice(0, 4));
          } catch {
            setRecentlyViewed(pList.slice(0, 3));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [userProfile]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Sign in
        const user = await api.signIn(email, password);
        onLoginSuccess(user);
      } else {
        // register / sign up
        if (!fullName.trim()) {
          setAuthError('Full Name is required for registration!');
          setLoading(false);
          return;
        }
        const user = await api.signUp(email, fullName, password);
        onLoginSuccess(user);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed, check inputs');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await api.updateUserProfile(editName, editPhone, editAddress);
      onLoginSuccess(updated);
      setEditingProfile(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Helper renderer for tracked order step index
  const getStatusStepIndex = (status: OrderStatus): number => {
    const steps: OrderStatus[] = ['Pending', 'Payment Confirmed', 'Processing', 'Shipped', 'Delivered'];
    return steps.indexOf(status);
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#FF4FA3]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 select-none">
        
        {/* Dynamic header toggles */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold animate-pulse">
            Identity & Orders Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight uppercase leading-none">
            {userProfile ? 'YOUR PORTAL' : 'AUTHENTICATE'}
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            {userProfile
              ? `Welcome back, ${userProfile.fullName}. Track shipping lines, coordinate address archives, and review bookmarks.`
              : 'Sign in to access your historic invoices, track shipping paths, and secure customizable profiles.'}
          </p>
        </div>

        {userProfile ? (
          /* ===================================================
             MEMBER LOGGED-IN VIEW: CUSTOMER DASHBOARD
             =================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start scale-in-animation">
            
            {/* LEFT PROFILE CONTROLS column */}
            <div className="lg:col-span-1 bg-[#121217]/55 border border-white/5 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 shadow-md select-text">
              <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                <div className="w-12 h-12 rounded-2xl bg-[#FF4FA3]/15 border border-[#FF4FA3]/30 flex items-center justify-center text-white text-lg font-black font-mono">
                  {userProfile.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <h3 className="text-white text-sm font-bold truncate">
                    {userProfile.fullName}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider truncate">
                    {userProfile.email}
                  </span>
                </div>
              </div>

              {editingProfile ? (
                /* Profile Edit Drawer */
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Phone Number</label>
                    <input
                      type="tel"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      placeholder="e.g. 09020942048"
                      className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none font-mono"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Saved Shipping Address</label>
                    <textarea
                      rows={3}
                      value={editAddress}
                      onChange={(e) => setEditAddress(e.target.value)}
                      placeholder="Street, landmarks, city, Nigeria"
                      className="bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none leading-relaxed"
                    />
                  </div>
                  <div className="flex gap-2.5 mt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 rounded-xl py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-white"
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingProfile(false)}
                      className="px-4 border border-white/10 text-xs font-mono text-gray-400 rounded-xl hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Profile Summary View */
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Phone Support:</span>
                    <span className="text-white text-xs font-mono">{userProfile.phoneNumber || 'Not configured'}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Shipping Address:</span>
                    <p className="text-gray-300 text-xs leading-relaxed font-light">{userProfile.shippingAddress || 'No default shipping address logged'}</p>
                  </div>

                  {userProfile.role === 'admin' && (
                    <div className="bg-[#FFD84D]/5 border border-[#FFD84D]/30 rounded-2xl p-4 flex flex-col gap-2 shadow-sm">
                      <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#FFD84D] font-black flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#FFD84D]" />
                        Authorized Admin Account
                      </h4>
                      <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                        Your email is registered inside the administrative roster. You have exclusive rights to replace assets, edit orders pipelines, catalog products, and view analytics at route address.
                      </p>
                      <button
                        onClick={() => onNavigate('admin')}
                        className="w-full mt-2 bg-gradient-to-r from-[#FFD84D] to-amber-500 text-[#000] font-mono text-[10px] tracking-widest uppercase font-bold py-2 rounded-lg cursor-pointer"
                      >
                        Enter Administrative Matrix
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setEditingProfile(true)}
                      className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#FF4FA3]/30 text-xs font-mono uppercase tracking-widest rounded-xl text-white transition-all cursor-pointer"
                    >
                      Edit Account Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onNavigate('home');
                      }}
                      className="w-full py-3 bg-red-500/5 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 text-xs font-mono uppercase tracking-widest text-red-400 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Power className="w-4 h-4" />
                      Sign Out Portal
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLS: DETAILED HISTORICAL ORDERS PIPELINE */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Orders Checklist */}
              <div className="flex flex-col gap-5 border-b border-white/5 pb-8 mb-4">
                <h2 className="text-xl font-sans tracking-tight font-black uppercase text-[#FFD84D] flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-[#FFD84D]" />
                  Order Procurement History ({orders.length})
                </h2>

                {orders.length > 0 ? (
                  <div className="flex flex-col gap-6">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="bg-[#0F0F13]/55 border border-white/5 rounded-3xl p-6 flex flex-col gap-5 shadow-sm"
                      >
                        {/* Header Brief */}
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
                          <div className="flex flex-col leading-tight">
                            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.1em]">Ordered At: {new Date(ord.createdAt).toLocaleDateString()}</span>
                            <h3 className="text-sm font-mono text-white font-black mt-1">INVOICE: #{ord.id}</h3>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-[#FF4FA3] font-black">₦{ord.totalAmount.toLocaleString()}</span>
                            {/* Receipt Proof Badge details */}
                            {ord.paymentReceiptUrl ? (
                              <button
                                onClick={() => setActiveReceiptUrl(ord.paymentReceiptUrl || null)}
                                className="text-[9px] font-mono border border-green-500/30 text-green-400 bg-green-500/5 px-2.5 py-0.5 rounded-full cursor-pointer hover:bg-green-500/10 active:scale-95 transition-all text-left"
                              >
                                View Payment Proof
                              </button>
                            ) : (
                              <span className="text-[9px] font-mono border border-amber-500/20 text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-full">
                                No Receipt Uploaded
                              </span>
                            )}
                          </div>
                        </div>

                        {/* STEP STAT TRACKING PIPELINE DRAW LINE */}
                        <div className="py-2.5 select-none font-mono">
                          <div className="flex justify-between items-center text-[10px] text-gray-500 mb-2">
                            <span>Track Pipeline Status:</span>
                            <span className="text-[#FF4FA3] uppercase font-bold">{ord.status}</span>
                          </div>
                          
                          {/* Visual Step indicators bar */}
                          <div className="relative flex items-center justify-between w-full mt-4">
                            {/* Line bar background */}
                            <div className="absolute top-1.5 left-1 w-full h-[3px] bg-white/5 z-0" />
                            <div
                              style={{
                                width: `${(getStatusStepIndex(ord.status) / 4) * 100}%`
                              }}
                              className="absolute top-1.5 left-1 h-[3px] bg-gradient-to-r from-[#FF4FA3] to-[#FFD84D] transition-all duration-1000 z-0"
                            />

                            {/* Circle stops */}
                            {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map((stepVal, idx) => {
                              const activeIdx = getStatusStepIndex(ord.status);
                              const passed = idx <= activeIdx;
                              const currentStep = idx === activeIdx;

                              return (
                                <div key={stepVal} className="flex flex-col items-center gap-2 relative z-10">
                                  <div
                                    className={`w-3.5 h-3.5 rounded-full border transition-all duration-700 flex items-center justify-center ${
                                      currentStep
                                        ? 'bg-[#FF4FA3] border-[#FF4FA3] shadow-[0_0_8px_#FF4FA3]'
                                        : passed
                                        ? 'bg-[#FFD84D] border-[#FFD84D]'
                                        : 'bg-neutral-900 border-neutral-700'
                                    }`}
                                  />
                                  <span className={`text-[8px] font-mono transition-colors duration-300 ${passed ? 'text-gray-300 font-bold' : 'text-gray-600'}`}>
                                    {stepVal}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Small Item details list description */}
                        <div className="flex flex-col gap-2 border-t border-white/5 pt-4 mt-2">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="flex items-center justify-between text-xs font-light">
                              <span className="text-gray-400">
                                {it.productName} <span className="font-mono text-gray-600">(x{it.quantity})</span>{' '}
                                {it.selectedSize ? `[Size: ${it.selectedSize}]` : ''}
                              </span>
                              <span className="font-mono text-gray-400">₦{(it.price * it.quantity).toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Zero historical orders */
                  <div className="text-center py-16 bg-[#0F0F13]/25 border border-white/5 rounded-3xl p-6">
                    <span className="text-3xl">📦</span>
                    <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-gray-400 mt-2">No procurement orders yet</h4>
                    <p className="text-[11px] text-gray-500 max-w-sm mx-auto leading-relaxed mt-1">
                      Once you finish order checkout transfers and submit receipt proofs, invoices will track here. Go browse!
                    </p>
                    <button
                      onClick={() => onNavigate('shop')}
                      className="mt-4 px-5 py-2 border border-white/10 hover:border-[#FF4FA3]/30 rounded-xl text-[10px] font-mono uppercase tracking-widest text-white cursor-pointer"
                    >
                      Enter Showrooms
                    </button>
                  </div>
                )}
              </div>

              {/* Recently Viewed Products Sector */}
              {recentlyViewed.length > 0 && (
                <div className="flex flex-col gap-5 pt-4">
                  <h2 className="text-xl font-sans tracking-tight font-black uppercase text-[#FF4FA3] flex items-center gap-2">
                    <RotateCcw className="w-5 h-5 text-[#FF4FA3]" />
                    Recently Visited Items
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewed.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => onSelectProduct(p.id)}
                        className="bg-[#0F0F13]/40 border border-white/5 hover:border-[#FF4FA3]/20 rounded-2xl p-3 cursor-pointer group transition-all"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-32 object-cover rounded-xl border border-white/5 group-hover:scale-102 transition-transform"
                          loading="lazy"
                        />
                        <h4 className="text-white text-[11px] font-semibold uppercase truncate mt-2 group-hover:text-[#FF4FA3] transition-colors">{p.name}</h4>
                        <span className="font-mono text-[10px] text-[#FFD84D] font-bold block mt-0.5">₦{p.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ===================================================
             AUTH LOGIN / REGISTRATION FORMS
             =================================================== */
          <div className="max-w-md mx-auto bg-[#121217]/50 border border-white/5 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] scale-in-animation">
            
            {/* Header toggle links tab */}
            <div className="flex items-center justify-between border-b border-white/5 pb-6 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setAuthError('');
                }}
                className={`text-sm font-mono tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                  isLogin ? 'text-[#FF4FA3] font-bold' : 'text-gray-500 hover:text-white'
                }`}
              >
                Sign In Portal
              </button>
              <div className="w-[1px] h-4 bg-white/10" />
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setAuthError('');
                }}
                className={`text-sm font-mono tracking-widest uppercase transition-colors duration-200 cursor-pointer ${
                  !isLogin ? 'text-[#FFD84D] font-bold' : 'text-gray-500 hover:text-white'
                }`}
              >
                Register Account
              </button>
            </div>

            {/* Error notifications */}
            {authError && (
              <div className="bg-red-500/10 border border-red-500/25 p-3.5 rounded-xl text-red-400 text-xs text-center mb-6 leading-relaxed">
                ⚠️ {authError}
              </div>
            )}

            {/* Auth Form Form */}
            <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
              
              {!isLogin && (
                <div className="flex flex-col gap-2 select-none">
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Azeez Lawal"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 focus:border-[#FFD84D]/50 focus:ring-none rounded-xl py-3 px-4 text-xs text-white focus:outline-none"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 select-none">
                <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. kejiaesthetics@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#FF4FA3]/50 focus:ring-none rounded-xl py-3 px-4 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              <div className="flex flex-col gap-2 select-none">
                <div className="flex justify-between items-center">
                  <label className="text-[9px] font-mono text-gray-400 uppercase tracking-widest">
                    Secure Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => {
                        setAuthError('Password reset link dispatched! Check your mail boxes.');
                      }}
                      className="text-[9px] font-mono text-gray-500 hover:text-[#FF4FA3] transition-colors uppercase tracking-widest cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 focus:border-[#FF4FA3]/50 focus:ring-none rounded-xl py-3 px-4 text-xs text-white focus:outline-none font-mono"
                />
              </div>

              {/* Submit CTA button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full rounded-xl py-3.5 text-xs font-mono tracking-widest uppercase font-bold text-white transition-all cursor-pointer mt-4 flex items-center justify-center gap-2 ${
                  isLogin
                    ? 'bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 shadow-[0_0_15px_rgba(255,79,163,0.2)] hover:shadow-[0_0_25px_rgba(255,79,163,0.4)]'
                    : 'bg-gradient-to-r from-[#FFD84D] to-orange-500 shadow-[0_0_15px_rgba(255,216,77,0.15)] hover:shadow-[0_0_25px_rgba(255,216,77,0.35)] text-black'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                    <span>Processing Portal Auth...</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? 'Sign In To Portal' : 'Register Member account'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>


          </div>
        )}
      </div>

      {/* Shared Receipt Lightbox Component Modal */}
      <ReceiptLightbox 
        url={activeReceiptUrl}
        isOpen={!!activeReceiptUrl}
        onClose={() => setActiveReceiptUrl(null)}
      />
    </div>
  );
}
