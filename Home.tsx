/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  TrendingUp,
  Tag,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BadgePercent,
  Compass,
  Clock,
  X,
  Percent,
  Copy,
  Check
} from 'lucide-react';
import { Product, Category, FlashSaleBannerConfig } from '../types';
import { api } from '../lib/supabase';
import Hero from '../components/Hero';
import ThreeDCard from '../components/ThreeDCard';

interface HomeProps {
  onNavigate: (page: string) => void;
  onNavigateCategory: (slug: any) => void;
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistProducts: string[];
}

export default function Home({
  onNavigate,
  onNavigateCategory,
  onSelectProduct,
  onAddToCart,
  onAddToWishlist,
  wishlistProducts
}: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [activeReviewIdx, setActiveReviewIdx] = useState(0);

  // Flash Sale Pop-Up Banner states
  const [bannerConfig, setBannerConfig] = useState<FlashSaleBannerConfig | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [copiedPromo, setCopiedPromo] = useState(false);
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    // Fetch store assets and Flash Sale Banner Config
    Promise.all([
      api.fetchProducts(),
      api.fetchCategories(),
      api.fetchReviews(),
      api.fetchFlashSaleBanner()
    ])
      .then(([pList, cList, rList, banner]) => {
        setProducts(pList);
        setCategories(cList);
        setReviews(rList);
        setBannerConfig(banner);
        
        // Popup checking once per session
        const isDismissed = sessionStorage.getItem('keji_flash_banner_dismissed') === 'true';
        if (banner && banner.isActive && !isDismissed) {
          setShowPopup(true);
        }
      })
      .catch(console.error);
  }, []);

  // Update countdown clock timer dynamically
  useEffect(() => {
    if (!bannerConfig?.countdownDate || !showPopup) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const end = new Date(bannerConfig.countdownDate!).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft(null);
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    updateTimer(); // Initial run
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [bannerConfig, showPopup]);

  const handleCopyPromo = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedPromo(true);
    setTimeout(() => setCopiedPromo(false), 2500);
  };

  const handleBannerDismiss = () => {
    sessionStorage.setItem('keji_flash_banner_dismissed', 'true');
    setShowPopup(false);
  };

  // Filter distinct product streams
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);
  const flashSaleProducts = products.filter(p => p.isFlashSale).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);
  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const handleNextReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev + 1) % reviews.length);
  };

  const handlePrevReview = () => {
    if (reviews.length === 0) return;
    setActiveReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Automated reviews carousel roll
  useEffect(() => {
    if (reviews.length === 0) return;
    const interval = setInterval(handleNextReview, 7000);
    return () => clearInterval(interval);
  }, [reviews]);

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pb-16 overflow-x-hidden selection:bg-[#FF4FA3] selection:text-white">
      {/* 1. HERO COVER SECTION */}
      <Hero
        onShopClick={() => onNavigate('shop')}
        onExploreClick={() => {
          const catSec = document.getElementById('categories-section');
          if (catSec) catSec.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 2. CORE VALUE ASSETS BAR */}
      <div className="relative border-y border-white/5 bg-black/40 py-8 backdrop-blur-md z-10 w-full select-none">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl">🌟</span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#FFD84D] font-bold">Premium Curation</span>
            <span className="text-[10px] text-gray-500 font-sans mt-0.5">Handpicked luxury designs only</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl">💬</span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#FF4FA3] font-bold">Direct WhatsApp Checkout</span>
            <span className="text-[10px] text-gray-500 font-sans mt-0.5">Instant order processing</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl">✈️</span>
            <span className="text-xs uppercase font-mono tracking-widest text-white font-bold">Swift Delivery</span>
            <span className="text-[10px] text-gray-500 font-sans mt-0.5">Secure nation-wide delivery tracking</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xl">🔒</span>
            <span className="text-xs uppercase font-mono tracking-widest text-[#FFD84D] font-bold">Authentic Integrity</span>
            <span className="text-[10px] text-gray-500 font-sans mt-0.5">Verified checkout verification receipt uploads</span>
          </div>
        </div>
      </div>

      {/* 3. FLOATING 3D BENTO CATEGORIES SECTION */}
      <section id="categories-section" className="py-24 max-w-6xl mx-auto px-6 z-10 relative">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FF4FA3]/10 border border-[#FF4FA3]/20 rounded-full">
            <span className="text-[9px] tracking-[0.25em] font-mono text-[#FF4FA3] uppercase font-bold">Curated Lines</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase">
            Shop By <span className="bg-gradient-to-r from-[#FF4FA3] to-[#FFD84D] bg-clip-text text-transparent">Category</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-lg">
            Explore carefully crafted categories. Each item is designed under our luxury philosophy: Dress to Impress; Live to Express.
          </p>
        </div>

        {/* Categories Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.slice(0, 9).map((cat, idx) => (
            <motion.div
              key={cat.id}
              onClick={() => onNavigateCategory(cat.slug)}
              whileHover={{ y: -8, rotateX: 1, rotateY: -3, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="group relative cursor-pointer h-72 rounded-2xl overflow-hidden border border-white/5 bg-[#0F0F13]/40 backdrop-blur-md shadow-[0_5px_15px_rgba(0,0,0,0.4)]"
            >
              {/* Image Frame */}
              <img
                src={cat.imageUrl}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-700"
              />
              {/* Luxury Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0E] via-[#0A0A0E]/60 to-transparent" />
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-xs tracking-mono text-[#FFD84D]">
                0{idx + 1}
              </div>

              {/* Text Area */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col gap-2">
                <span className="text-[#FF4FA3] text-[9px] font-mono tracking-[0.25em] uppercase font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#FF4FA3] rounded-full inline-block shrink-0 animate-pulse" />
                  Explore Line
                </span>
                <h3 className="text-xl text-white tracking-widest uppercase font-black">
                  {cat.name}
                </h3>
                <p className="text-gray-400 text-[11px] font-light leading-relaxed line-clamp-2 mt-1">
                  {cat.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-white uppercase font-mono tracking-widest mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1.5 transition-all duration-300">
                  <span>Enter Store</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#FFD84D]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. EXCLUSIVE FLASH SALES SECTION */}
      {flashSaleProducts.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-black/40 via-[#140C10]/40 to-black/40 border-y border-white/5 relative w-full overflow-hidden">
          {/* Neon side glows */}
          <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FF4FA3]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-24 right-0 w-[500px] h-96 bg-[#FFD84D]/3 rounded-full blur-[140px] pointer-events-none" />

          <div className="max-w-6xl mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-16">
              <div className="flex flex-col gap-2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-1.5 px-3 py-1 bg-[#FFD84D]/10 border border-[#FFD84D]/35 rounded-full max-w-max self-center md:self-auto">
                  <BadgePercent className="w-3.5 h-3.5 text-[#FFD84D] animate-spin-slow" />
                  <span className="text-[9px] tracking-[0.25em] font-mono text-[#FFD84D] uppercase font-bold">Limited Priority Offer</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase mt-1">
                  FLASH SALE <span className="text-[#FF4FA3]">DROP</span>
                </h2>
                <p className="text-gray-400 text-xs md:text-sm font-light max-w-md">
                  Premium statement designs heavily discounted for the next 24 hours. Once the stock burns out, prices revert.
                </p>
              </div>
              <button
                onClick={() => onNavigate('shop?filter=flash-sale')}
                className="px-6 py-3 border border-white/10 rounded-full text-xs font-mono tracking-widest uppercase hover:text-[#FF4FA3] hover:border-[#FF4FA3]/50 transition-colors cursor-pointer"
              >
                View Flame Drop
              </button>
            </div>

            {/* Flash Sale Product list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {flashSaleProducts.map((p) => {
                const wishlisted = wishlistProducts.includes(p.id);
                return (
                  <ThreeDCard
                    key={p.id}
                    id={`flash-card-${p.id}`}
                    className="group relative bg-[#0D0D11] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all hover:border-[#FF4FA3]/30 h-full"
                  >
                    {/* Badge */}
                    <div className="absolute top-6 left-6 z-10 bg-[#FF4FA3] text-white text-[9px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase shadow-[0_0_12px_#FF4FA3]">
                      {p.discountPercentage}% OFF
                    </div>

                    {/* Image Area */}
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
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 border border-white/20 bg-black/40 rounded-full text-[10px] font-mono tracking-widest uppercase text-white hover:border-white transition-all">
                          Quick View
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-gray-500 text-[10px] uppercase font-mono tracking-widest">
                        {p.category.replace('-', ' ')}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(p.id)}
                        className="text-white text-sm font-semibold truncate hover:text-[#FF4FA3] cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h3>

                      {/* Ratings stars */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-[#FFD84D] fill-[#FFD84D]" />
                        <span className="text-[10px] font-mono text-gray-400">
                          {p.rating} ({p.reviewCount})
                        </span>
                      </div>

                      {/* Pricing Comparison */}
                      <div className="flex items-baseline gap-2.5 mt-2">
                        <span className="font-mono text-[#FF4FA3] font-black text-sm">
                          ₦{p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span className="font-mono text-gray-600 line-through text-xs">
                            ₦{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAddToCart(p, 1)}
                        className="flex-1 bg-white/5 hover:bg-[#FF4FA3]/15 hover:border-[#FF4FA3]/30 border border-white/10 rounded-xl py-2.5 text-[10px] font-mono tracking-widest uppercase text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#FF4FA3]" />
                        Add To Cart
                      </button>
                      <button
                        onClick={() => onAddToWishlist(p)}
                        className={`px-3 border border-white/10 rounded-xl flex items-center justify-center transition-colors hover:border-[#FF4FA3] ${
                          wishlisted ? 'border-[#FF4FA3] text-[#FF4FA3] bg-[#FF4FA3]/10' : 'text-gray-400'
                        }`}
                        title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        ❤️
                      </button>
                    </div>
                  </ThreeDCard>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 5. FEATURED & TRENDING GRID */}
      <section className="py-24 max-w-6xl mx-auto px-6 z-10 relative">
        <div className="flex flex-col items-center text-center gap-4 mb-16">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#FFD84D]/10 border border-[#FFD84D]/25 rounded-full">
            <span className="text-[9px] tracking-[0.25em] font-mono text-[#FFD84D] uppercase font-bold">Recommended Drop</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-sans tracking-tight font-black uppercase">
            FEATURED <span className="text-[#FF4FA3]">PIECES</span>
          </h2>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-md">
            The heart of Keji Aesthetics. Discover statement items blending premium fabrics, luxury styling accessories, and bold vibes.
          </p>
        </div>

        {/* Featured Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {featuredProducts.map((p) => {
            const wishlisted = wishlistProducts.includes(p.id);
            return (
              <ThreeDCard
                key={p.id}
                id={`featured-card-${p.id}`}
                className="group relative bg-[#0D0D11] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all h-full"
              >
                {/* Image panel with zoom clip */}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="w-full text-center py-2 border border-white/25 bg-black/50 text-[9px] font-mono tracking-widest uppercase rounded-lg text-white">
                      Inspect Product Details
                    </span>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col gap-1 flex-1">
                  <span className="text-gray-500 text-[9px] uppercase font-mono tracking-widest">
                    {p.category.replace('-', ' ')}
                  </span>
                  <h3
                    onClick={() => onSelectProduct(p.id)}
                    className="text-white text-sm font-semibold truncate hover:text-[#FF4FA3] transition-colors cursor-pointer"
                  >
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-3.5 h-3.5 text-[#FFD84D] fill-[#FFD84D]" />
                    <span className="text-[10px] font-mono text-gray-400">
                      {p.rating}
                    </span>
                  </div>
                  <div className="font-mono text-white font-bold text-xs mt-2.5">
                    ₦{p.price.toLocaleString()}
                  </div>
                </div>

                {/* Direct Action Hub */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onAddToCart(p, 1)}
                    className="flex-1 bg-[#FF4FA3]/10 hover:bg-[#FF4FA3] hover:text-white border border-[#FF4FA3]/30 rounded-xl py-2.5 text-[10px] font-mono tracking-widest uppercase text-[#FF4FA3] transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Cart
                  </button>
                  <button
                    onClick={() => onAddToWishlist(p)}
                    className={`px-3 border border-white/10 rounded-xl flex items-center justify-center transition-colors hover:border-[#FF4FA3] ${
                      wishlisted ? 'border-[#FF4FA3] text-[#FF4FA3] bg-[#FF4FA3]/10' : 'text-gray-400'
                    }`}
                  >
                    ❤️
                  </button>
                </div>
              </ThreeDCard>
            );
          })}
        </div>
      </section>

      {/* 6. NEW ARRIVALS & TRENDINGS SPLIT BLOCK */}
      <section className="py-24 bg-black/40 border-t border-white/5 relative z-10 w-full select-none">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* New Arrivals Left */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84D] shadow-[0_0_8px_#FFD84D]" />
              <h3 className="text-xl md:text-2xl font-sans tracking-tight font-black uppercase text-white">
                NEW <span className="bg-gradient-to-r from-[#FFD84D] to-white bg-clip-text text-transparent">ARRIVALS</span>
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {newArrivals.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item.id)}
                  className="flex items-center gap-4 p-3 bg-[#0F0F13]/40 border border-white/5 hover:border-[#FF4FA3]/20 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-500 text-[8px] uppercase font-mono tracking-widest">{item.category}</span>
                    <h4 className="text-white text-xs font-semibold truncate uppercase mt-0.5 leading-tight hover:text-[#FF4FA3]">{item.name}</h4>
                    <span className="font-mono text-xs text-[#FFD84D] font-bold mt-1.5 block">₦{item.price.toLocaleString()}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF4FA3]/10 hover:text-[#FF4FA3] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Best Sellers Right */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF4FA3] shadow-[0_0_8px_#FF4FA3]" />
              <h3 className="text-xl md:text-2xl font-sans tracking-tight font-black uppercase text-white">
                BEST <span className="text-[#FF4FA3]">SELLERS</span>
              </h3>
            </div>
            <div className="flex flex-col gap-4">
              {bestSellers.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectProduct(item.id)}
                  className="flex items-center gap-4 p-3 bg-[#0F0F13]/40 border border-white/5 hover:border-[#FF4FA3]/20 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-white/5"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-gray-500 text-[8px] uppercase font-mono tracking-widest">{item.category}</span>
                    <h4 className="text-white text-xs font-semibold truncate uppercase mt-0.5 leading-tight hover:text-[#FF4FA3]">{item.name}</h4>
                    <span className="font-mono text-xs text-[#FF4FA3] font-bold mt-1.5 block font-black">₦{item.price.toLocaleString()}</span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF4FA3]/10 hover:text-[#FF4FA3] transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS AMBIENT CAROUSEL SECTION */}
      {reviews.length > 0 && (
        <section className="py-24 relative select-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF4FA3]/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
            
            {/* Header */}
            <div className="flex flex-col items-center gap-3 mb-12">
              <span className="text-[#FFD84D] text-[10px] uppercase font-mono tracking-[0.25em] font-black">
                Public Endorsements
              </span>
              <h2 className="text-3xl md:text-4xl font-sans tracking-tight font-black uppercase">
                Customer <span className="text-[#FF4FA3]">Reviews</span>
              </h2>
            </div>

            {/* Testimonial Panel */}
            <div className="bg-[#0F0F13]/60 border border-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl shadow-[0_15px_30px_rgba(0,0,0,0.6)] flex flex-col items-center relative gap-6">
              {/* Quotes decorative */}
              <span className="text-[#FF4FA3]/15 text-7xl font-serif absolute top-4 left-8">“</span>

              {/* Star scale */}
              <div className="flex items-center gap-1 justify-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < reviews[activeReviewIdx]?.rating
                        ? 'text-[#FFD84D] fill-[#FFD84D]'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>

              {/* Dynamic review text */}
              <p className="text-gray-300 font-light text-sm md:text-base leading-relaxed max-w-2xl px-2">
                "{reviews[activeReviewIdx]?.comment}"
              </p>

              {/* User Avatar, Name and product tag info */}
              <div className="flex items-center gap-4 mt-4 text-left">
                {reviews[activeReviewIdx]?.imageUrl && (
                  <img
                    src={reviews[activeReviewIdx].imageUrl}
                    alt={reviews[activeReviewIdx].reviewerName}
                    className="w-12 h-12 rounded-full object-cover border border-[#FF4FA3]/30"
                  />
                )}
                <div className="flex flex-col">
                  <h4 className="text-white text-xs font-bold tracking-widest font-mono uppercase">
                    {reviews[activeReviewIdx]?.reviewerName}
                  </h4>
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5">
                    Verified Buyer • {reviews[activeReviewIdx]?.productName || 'Keji Customer'}
                  </span>
                </div>
              </div>

              {/* Carousel controls bar */}
              <div className="flex items-center gap-6 mt-8">
                <button
                  onClick={handlePrevReview}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-[#FF4FA3]/40 bg-black/40 flex items-center justify-center hover:text-[#FF4FA3] transition-colors cursor-pointer"
                  title="Previous testimonial"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-gray-500">
                  {activeReviewIdx + 1} <span className="opacity-40">/</span> {reviews.length}
                </span>
                <button
                  onClick={handleNextReview}
                  className="w-10 h-10 rounded-full border border-white/10 hover:border-[#FF4FA3]/40 bg-black/40 flex items-center justify-center hover:text-[#FF4FA3] transition-colors cursor-pointer"
                  title="Next testimonial"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 8. EDITORIAL ABOUT US STATEMENT FRAME */}
      <section className="py-24 bg-gradient-to-t from-[#09090D] to-[#0D0D0D] border-t border-white/5 relative z-10 w-full select-none">
        <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
            <Compass className="w-4 h-4 text-[#FFD84D]" />
          </div>
          <span className="text-[10px] font-mono tracking-[0.3em] text-[#FF4FA3] uppercase font-black uppercase mt-1">
            Brand Declaration • About Keji Aesthetics
          </span>
          <h2 className="text-4xl text-white tracking-[0.2em] font-sans font-black uppercase">
            KEJI AESTHETICS
          </h2>
          <p className="text-gray-500 font-mono text-[10px] uppercase tracking-[0.2em] -mt-3 italic">
            "Dress To Impress; Live To Express"
          </p>
          <p className="text-gray-400 font-light text-sm md:text-base leading-relaxed max-w-2xl mt-3">
            We provide carefully curated fashion, apparel, underwear, designer bags, precious jewelry, minimalist home décor, accessories, and digital workspace toolkits that help our community express raw confidence and unapologetic individuality. We combine top-tier global street aesthetics of a high-end fashion house with direct WhatsApp messaging checkouts, proving that modern luxury can feel responsive and incredibly personal.
          </p>
          <button
            onClick={() => onNavigate('about')}
            className="mt-6 px-7 py-3 border border-white/10 rounded-full text-xs font-mono tracking-widest uppercase hover:bg-white/5 transition-all text-white cursor-pointer"
          >
            Our Full Manifesto
          </button>
        </div>
      </section>

      {/* FLASH SALE POPUP BANNER MODAL OVERLAY */}
      {showPopup && bannerConfig && (
        <div id="flash-sale-banner-popup" className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative bg-[#0E0E12] border border-white/10 rounded-3xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row shadow-[0_0_50px_rgba(255,79,163,0.15)] animate-scale-up">
            
            {/* Close Button Trigger */}
            <button
              onClick={handleBannerDismiss}
              className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-black/65 hover:bg-[#FF4FA3]/20 border border-white/10 hover:border-[#FF4FA3]/40 flex items-center justify-center text-white transition-all cursor-pointer group active:scale-90"
              title="Close Banner"
            >
              <X className="w-5 h-5 group-hover:text-[#FF4FA3]" />
            </button>

            {/* Left/Image Content Column */}
            <div className="md:w-1/2 relative min-h-[220px] md:min-h-[480px]">
              <img
                src={bannerConfig.imageUrl || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200'}
                alt={bannerConfig.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
              
              {/* Badge Overlay */}
              <div className="absolute bottom-6 left-6 flex flex-col gap-1 z-10">
                <span className="px-3.5 py-1.5 bg-[#FF4FA3] text-white text-[10px] uppercase font-mono font-black tracking-widest rounded-full self-start shadow-md shadow-[#FF4FA3]/30">
                  ⚡ {bannerConfig.discountBadge}
                </span>
                {timeLeft && (
                  <div className="flex items-center gap-1.5 mt-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 text-white font-mono text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#FFD84D]" />
                    <span>Ending in {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Content Panel Column */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center select-none gap-6">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-mono tracking-[0.3em] text-[#FF4FA3] uppercase font-black">
                  🔥 Keji Aesthetics Flash offer
                </span>
                <h3 className="text-2xl md:text-3xl font-sans tracking-tight font-black uppercase text-white leading-tight">
                  {bannerConfig.title}
                </h3>
                <p className="text-gray-400 font-light text-xs md:text-sm leading-relaxed mt-1 w-full scale-95 origin-left">
                  {bannerConfig.subtitle}
                </p>
              </div>

              {/* Countdown Ticker Segment */}
              {timeLeft ? (
                <div className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between text-center max-w-sm">
                  <div>
                    <div className="text-2xl font-mono font-black text-[#FFD84D]">{timeLeft.days.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">Days</div>
                  </div>
                  <div className="text-2xl font-mono font-black text-gray-700">:</div>
                  <div>
                    <div className="text-2xl font-mono font-black text-[#FFD84D]">{timeLeft.hours.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">Hours</div>
                  </div>
                  <div className="text-2xl font-mono font-black text-gray-700">:</div>
                  <div>
                    <div className="text-2xl font-mono font-black text-[#FFD84D]">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">Mins</div>
                  </div>
                  <div className="text-2xl font-mono font-black text-gray-700">:</div>
                  <div>
                    <div className="text-2xl font-mono font-black text-[#FF4FA3]">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                    <div className="text-[8px] font-mono uppercase text-gray-500 tracking-wider">Secs</div>
                  </div>
                </div>
              ) : (
                <div className="text-xs font-mono text-red-500">
                  ⌛ Flash Offer timer expired! Submit orders shortly.
                </div>
              )}

              {/* Promo Key Copy Trigger */}
              {bannerConfig.promoCode && (
                <div className="flex flex-col gap-2 max-w-sm">
                  <span className="text-[10px] font-mono uppercase text-gray-500 tracking-widest">
                    Checkout Promo Code
                  </span>
                  <div className="flex bg-black/60 border border-white/10 rounded-xl p-1 items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#FFD84D] uppercase px-3 tracking-widest select-all">
                      {bannerConfig.promoCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyPromo(bannerConfig.promoCode!)}
                      className="px-4 py-2 bg-white/5 border border-white/5 hover:border-[#FFD84D]/40 text-[#FFD84D] hover:text-white rounded-lg transition-all text-[11px] font-mono uppercase font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedPromo ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-green-400" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Code
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Dynamic CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleBannerDismiss();
                    if (bannerConfig.targetUrl) {
                      if (bannerConfig.targetUrl === 'shop' || bannerConfig.targetUrl === 'home' || bannerConfig.targetUrl === 'about' || bannerConfig.targetUrl === 'contact') {
                        onNavigate(bannerConfig.targetUrl);
                      } else {
                        onNavigateCategory(bannerConfig.targetUrl);
                      }
                    } else {
                      onNavigate('shop');
                    }
                  }}
                  className="bg-[#FF4FA3] hover:bg-[#FF4FA3]/90 text-white font-mono text-xs uppercase tracking-widest font-black py-4 px-6 rounded-2xl cursor-pointer transition-all shadow-[0_4px_12px_rgba(255,79,163,0.3)] hover:shadow-[0_4px_22px_rgba(255,79,163,0.5)] active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <Percent className="w-4 h-4 shrink-0" />
                  <span>{bannerConfig.buttonText}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBannerDismiss}
                  className="px-6 py-4 border border-white/10 hover:border-white/20 text-gray-400 hover:text-white font-mono text-xs uppercase tracking-widest rounded-2xl cursor-pointer text-center hover:bg-white/2 transition-colors inline-block"
                >
                  Dismiss Offer
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
