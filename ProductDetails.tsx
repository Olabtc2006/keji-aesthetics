/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from 'react';
import {
  ShoppingBag,
  Star,
  Heart,
  Share2,
  Check,
  ChevronRight,
  ShieldCheck,
  Box,
  Truck,
  Sparkles,
  ArrowLeft,
  X,
  MessageSquare,
  Calendar,
  User,
  Plus,
  TrendingUp,
  ThumbsUp
} from 'lucide-react';
import { Product, Review, UserProfile } from '../types';
import { api } from '../lib/supabase';

interface ProductDetailsProps {
  productId: string;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistProducts: string[];
  onSelectProduct: (id: string) => void;
  userProfile?: UserProfile | null;
}

export default function ProductDetails({
  productId,
  onBack,
  onAddToCart,
  onAddToWishlist,
  wishlistProducts,
  onSelectProduct,
  userProfile = null
}: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [shared, setShared] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' });
  const [loading, setLoading] = useState(true);

  // Experience feedback / reviews parameters
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);

  // Hover Zoom Ref Tracker
  const imageDisplayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    // Fetch product specs
    api.fetchProductById(productId)
      .then((item) => {
        if (item) {
          setProduct(item);
          setSelectedImage(item.imageUrl);
          setSelectedSize(item.sizes && item.sizes.length > 0 ? item.sizes[0] : '');
          setSelectedColor(item.colors && item.colors.length > 0 ? item.colors[0] : '');
          setQuantity(1);

          // Fetch related
          api.fetchProducts().then((all) => {
            const rel = all.filter(p => p.category === item.category && p.id !== item.id);
            setRelatedProducts(rel.slice(0, 4));
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  // Load reviews, auto-prefill profile if user is logged in, and resolve recently viewed cache
  useEffect(() => {
    setReviewsLoading(true);
    api.fetchReviews(productId)
      .then((data) => {
        setReviews(data);
        setReviewsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching reviews:', err);
        setReviewsLoading(false);
      });

    // Resolve recently viewed items list
    try {
      const viewedIds: string[] = JSON.parse(localStorage.getItem('keji_recently_viewed') || '[]');
      const filteredIds = viewedIds.filter(id => id !== productId);
      if (filteredIds.length > 0) {
        api.fetchProducts().then((allProducts) => {
          const matched = allProducts.filter(p => filteredIds.includes(p.id));
          // Keep original order of recently viewed
          const sortedMatched = filteredIds
            .map(id => matched.find(p => p.id === id))
            .filter((p): p is Product => !!p);
          setRecentlyViewed(sortedMatched.slice(0, 4));
        });
      } else {
        setRecentlyViewed([]);
      }
    } catch (e) {
      console.error(e);
    }
  }, [productId]);

  // Autofill review details with user profile
  useEffect(() => {
    if (userProfile) {
      setNameInput(userProfile.fullName || '');
      setEmailInput(userProfile.email || '');
    }
  }, [userProfile]);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !emailInput.trim() || !commentInput.trim()) {
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewObj = {
        productId: productId,
        reviewerName: nameInput,
        reviewerEmail: emailInput,
        rating: ratingInput,
        comment: commentInput
      };
      const createdReview = await api.addReview(reviewObj);
      
      // Update reviews list locally
      setReviews(prev => [createdReview, ...prev]);
      
      // Clear inputs
      setCommentInput('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
      setShowReviewForm(false);

      // Re-fetch product to update its rating indices
      api.fetchProductById(productId).then((updatedProduct) => {
        if (updatedProduct) {
          setProduct(updatedProduct);
        }
      });
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen text-white pt-32 flex flex-col items-center justify-center">
        <div className="w-8 h-8 rounded-full border-t-2 border-[#FF4FA3] animate-spin mb-4" />
        <span className="text-xs font-mono text-gray-500">Loading curation details...</span>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[#0D0D0D] min-h-screen text-white pt-32 text-center flex flex-col items-center justify-center gap-4">
        <span className="text-3xl">⚠️</span>
        <h2 className="text-xl uppercase tracking-widest font-mono text-[#FFD84D]">Product Not Found</h2>
        <button onClick={onBack} className="text-xs font-mono text-[#FF4FA3] hover:underline">
          Go Back To Gallery
        </button>
      </div>
    );
  }

  const wishlisted = wishlistProducts.includes(product.id);

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    } catch {
      setShared(true);
      setTimeout(() => setShared(false), 2500);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = imageDisplayRef.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: 'block',
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' });
  };

  const incrementQty = () => {
    if (quantity < product.stock) setQuantity(prev => prev + 1);
  };

  const decrementQty = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-12 right-0 w-[400px] h-[400px] bg-[#FF4FA3]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 select-none">
        
        {/* Back Link Nav Bar */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white mb-8 group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK TO COLLECTIONS</span>
        </button>

        {/* Core details layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: GALLERY WITH HOVER ZOOM SYSTEM */}
          <div className="flex flex-col gap-4">
            
            {/* Primary Main Image Frame */}
            <div
              ref={imageDisplayRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative aspect-square rounded-2xl overflow-hidden bg-[#141419] border border-white/5 cursor-crosshair group shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            >
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />

              {/* Zoom Panel Mirror */}
              <div
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${selectedImage})`,
                  backgroundSize: '200%'
                }}
                className="absolute inset-0 bg-no-repeat pointer-events-none"
              />

              {/* Bottom Tag instructions */}
              <div className="absolute bottom-4 left-4 bg-black/60 border border-white/15 px-3 py-1.5 rounded-lg text-[9px] font-mono text-gray-300 tracking-wider">
                🔬 HOVER PHOTO TO ZOOM
              </div>
            </div>

            {/* Sub image tiles */}
            {product.additionalImages && product.additionalImages.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedImage(product.imageUrl)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border bg-neutral-900 ${
                    selectedImage === product.imageUrl ? 'border-[#FF4FA3]' : 'border-white/5 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                </button>
                {product.additionalImages.map((imgUrl, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border bg-neutral-900 ${
                      selectedImage === imgUrl ? 'border-[#FF4FA3]' : 'border-white/5 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: SPECIFICATION SECTOR AND ACTIONS */}
          <div className="flex flex-col gap-6">
            
            {/* Dept details */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#FF4FA3] uppercase tracking-[0.2em] font-bold">
                {product.category.replace('-', ' ')}
              </span>
              <span className="h-3 w-[1px] bg-white/15" />
              {product.stock > 0 ? (
                <span className="text-[10px] font-mono text-purple-400 tracking-wider flex items-center gap-1 bg-[#FF4FA3]/5 px-2 py-0.5 rounded-full border border-[#FF4FA3]/15">
                  ● INSTOCK • {product.stock} PIECES LEFT
                </span>
              ) : (
                <span className="text-[10px] font-mono text-red-500 tracking-wider">
                  ● OUT OF STOCK
                </span>
              )}
            </div>

            {/* Core Titles */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-sans tracking-tight font-black uppercase text-white leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-[#FFD84D] fill-[#FFD84D]" />
                  <span className="text-sm font-semibold font-mono">{product.rating}</span>
                </div>
                <span className="text-gray-500 text-xs font-mono">
                  ({product.reviewCount} verified review comments)
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-baseline gap-4 mt-2">
              <span className="text-3xl font-mono text-[#FF4FA3] font-black">
                ₦{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-gray-500 font-mono line-through text-sm">
                    ₦{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-mono bg-[#FF4FA3] text-white px-2 py-1 rounded-full uppercase tracking-widest font-black self-center">
                    {product.discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Descriptions paragraph */}
            <p className="text-gray-400 text-sm font-light leading-relaxed">
              {product.description}
            </p>

            {/* Dynamic Sizing Selects */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] tracking-[0.25em] font-mono text-gray-400 uppercase">
                  Select Dimension / Sizing
                </span>
                <div className="flex items-center gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`min-w-10 h-10 px-3 border rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#FF4FA3] bg-[#FF4FA3]/15 text-[#FF4FA3] shadow-[0_0_8px_rgba(255,79,163,0.3)]'
                          : 'border-white/10 hover:border-white/30 text-gray-300'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dynamic Colors selects */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-[10px] tracking-[0.25em] font-mono text-gray-400 uppercase">
                  Select Aesthetic Finish
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={`px-4 py-2 border rounded-xl text-xs font-mono transition-all cursor-pointer ${
                        selectedColor === c
                          ? 'border-[#FFD84D] bg-[#FFD84D]/10 text-[#FFD84D]'
                          : 'border-white/10 hover:border-white/30 text-gray-300'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Incrementor */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mt-2">
                <span className="text-[10px] tracking-[0.25em] font-mono text-gray-400 uppercase">
                  Quantity
                </span>
                <div className="flex items-center border border-white/10 rounded-xl bg-[#141419]/50 overflow-hidden h-10 w-32">
                  <button
                    onClick={decrementQty}
                    className="flex-1 hover:bg-white/10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-mono text-xs">{quantity}</span>
                  <button
                    onClick={incrementQty}
                    className="flex-1 hover:bg-white/10 h-full flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Main CTA purchase buttons */}
            <div className="flex gap-4 mt-4">
              {product.stock > 0 ? (
                <button
                  onClick={() => onAddToCart(product, quantity, selectedSize, selectedColor)}
                  className="flex-1 bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 hover:from-[#FF4FA3]/90 rounded-2xl py-4 text-xs font-mono tracking-widest uppercase font-bold text-white shadow-[0_0_20px_rgba(255,79,163,0.3)] hover:shadow-[0_0_30px_rgba(255,79,163,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Add To Cart Bag
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 bg-neutral-800 border border-neutral-700 text-neutral-500 rounded-2xl py-4 text-xs font-mono tracking-widest uppercase text-center cursor-not-allowed"
                >
                  SOLD OUT DROP
                </button>
              )}

              {/* Wishlist Toggle Button */}
              <button
                onClick={() => onAddToWishlist(product)}
                className={`px-5 rounded-2xl border flex items-center justify-center h-12 self-stretch transition-all ${
                  wishlisted
                    ? 'border-[#FF4FA3] text-[#FF4FA3] bg-[#FF4FA3]/15'
                    : 'border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
                } cursor-pointer`}
                title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                ❤️
              </button>

              {/* Share button tool */}
              <button
                onClick={handleShare}
                className="px-5 rounded-2xl border border-white/10 hover:border-white/30 hover:bg-white/5 flex items-center justify-center h-12 self-stretch text-gray-400 hover:text-white cursor-pointer"
                title="Share product with signature copier"
              >
                {shared ? <Check className="w-4 h-4 text-[#FFD84D]" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Tidy Copied Ribbon text */}
            {shared && (
              <span className="text-[10px] font-mono text-[#FFD84D] tracking-wide animate-fade-in self-start -mt-2">
                ✓ Product checkout link coped to clipboard! Share on WhatsApp!
              </span>
            )}

            {/* Specifications Lists */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="border-t border-white/5 pt-6 mt-4">
                <h3 className="text-xs uppercase font-mono tracking-[0.2em] text-[#FFD84D] mb-4 flex items-center gap-1.5">
                  <Box className="w-4 h-4" />
                  Product Specifications
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                  {product.specifications.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400 font-light">
                      <span className="text-[#FF4FA3] mt-1 shrink-0">•</span>
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* LIVE CUSTOMER REVIEWS & RATING EXPERIENCE DASHBOARD */}
        <div className="border-t border-white/5 pt-16 mt-20">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" /> VERIFIED MARKET feedback
              </span>
              <h2 className="text-2xl font-sans font-black uppercase text-white tracking-tight">
                Customer Reviews & Ratings ({reviews.length})
              </h2>
            </div>

            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-3 bg-[#FF4FA3]/15 border border-[#FF4FA3]/30 hover:border-[#FF4FA3]/50 text-[#FF4FA3] text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start"
            >
              {showReviewForm ? (
                <>
                  <X className="w-4 h-4" /> Cancel Review Submission
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Write Verified Product Review
                </>
              )}
            </button>
          </div>

          {/* DYNAMIC REVIEW FORM DRAWER */}
          {showReviewForm && (
            <form
              onSubmit={handleAddReview}
              className="bg-[#111115] border border-[#FF4FA3]/20 rounded-2xl p-6 lg:p-8 max-w-2xl mb-12 animate-scale-up flex flex-col gap-5 select-none"
            >
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF4FA3] font-bold">
                  Express Your Experience
                </span>
                <span className="text-xs text-gray-400">
                  Your feedback helps maintain original Keji quality standards.
                </span>
              </div>

              {/* Stars selection rating */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Product Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRatingInput(stars)}
                      className="p-1 cursor-pointer group transition-transform active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          ratingInput >= stars
                            ? 'text-[#FFD84D] fill-[#FFD84D]'
                            : 'text-neutral-700 hover:text-neutral-500'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-gray-500 ml-2">
                    ({ratingInput} out of 5 stars)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full name input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-black/40 border border-white/10 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all font-mono"
                  />
                </div>

                {/* Email address input */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    Your Email (Verifiable)
                  </label>
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="bg-black/40 border border-white/10 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all font-mono"
                  />
                </div>
              </div>

              {/* Comment descriptions text area */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                  Review Statement
                </label>
                <textarea
                  required
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share details of your purchase experience, fit, color satisfaction, texture vibe, or design feedback..."
                  className="bg-black/40 border border-white/10 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 rounded-xl px-4 py-3 text-xs text-white outline-none transition-all leading-relaxed whitespace-pre-wrap"
                />
              </div>

              {/* Submit triggers CTA */}
              <button
                type="submit"
                disabled={submittingReview}
                className="bg-[#FF4FA3] hover:bg-[#FF4FA3]/90 text-white font-mono text-xs uppercase tracking-widest font-bold py-3.5 px-6 rounded-xl cursor-pointer self-start transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(255,79,163,0.3)] hover:shadow-[0_4px_20px_rgba(255,79,163,0.5)] flex items-center gap-2"
              >
                {submittingReview ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-t border-white animate-spin" /> Recording Review...
                  </>
                ) : (
                  'Submit My Review'
                )}
              </button>
            </form>
          )}

          {/* Form Success Indicator Ribbon */}
          {reviewSuccess && (
            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl max-w-2xl mb-8 animate-fade-in text-xs font-mono">
              <Check className="w-4 h-4 shrink-0" />
              <span>Great luxury feedback recorded successfully! Verified review counter updated. Thank you!</span>
            </div>
          )}

          {/* DOUBLE GRID RATING AGGREGATION & BREAKDOWNS */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
            {/* AGGREGATE DISPLAY */}
            <div className="bg-[#111115] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gray-500">
                OVERALL RATING
              </span>
              <div className="flex flex-col gap-1 items-center">
                <span className="text-4xl lg:text-5xl font-mono font-black text-white">
                  {product.rating || '0.0'}
                </span>
                <span className="text-gray-500 text-xs font-mono">out of 5.0</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      Math.round(product.rating || 0) >= star
                        ? 'text-[#FFD84D] fill-[#FFD84D]'
                        : 'text-neutral-700'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-mono mt-1">
                {reviews.length} Verified Opinions
              </span>
            </div>

            {/* PROGRESS RATING BARS */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#111115] border border-white/5 rounded-2xl p-6 flex flex-col justify-center gap-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-4 text-xs">
                    <span className="font-mono text-gray-400 w-12 text-right shrink-0">
                      {stars} Stars
                    </span>
                    <div className="flex-1 bg-black/40 h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        style={{ width: `${percentage}%` }}
                        className="bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/60 h-full rounded-full transition-all duration-500"
                      />
                    </div>
                    <span className="font-mono text-gray-500 w-12 text-left shrink-0">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ACTIVE REVIEWS LISTING */}
          {reviewsLoading ? (
            <div className="text-center py-10 flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full border-t border-[#FF4FA3] animate-spin" />
              <span className="text-[10px] font-mono text-gray-500">Retrieving feedback indexes...</span>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/5 bg-[#111115]/30 rounded-2xl p-6">
              <span className="text-2xl">⭐</span>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-[#FFD84D] mt-2 mb-1">
                No Reviews Staged Yet
            </h3>
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed">
                Be the first to share your aesthetic review comment on this premium item. Press the write-review switcher above!
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.map((rev) => {
                const firstLetter = rev.reviewerName ? rev.reviewerName.charAt(0).toUpperCase() : 'U';
                return (
                  <div
                    key={rev.id}
                    className="bg-[#111115] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col gap-3.5 transition-colors select-none"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#FF4FA3]/15 border border-[#FF4FA3]/30 text-[#FF4FA3] flex items-center justify-center font-mono font-black text-sm uppercase">
                          {firstLetter}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                            {rev.reviewerName}{' '}
                            <span className="text-[8px] font-mono tracking-widest bg-green-500/10 border border-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full uppercase">
                              ✓ Verified Buyer
                            </span>
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono mt-0.5 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-gray-600" />{' '}
                            {new Date(rev.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Stars indicator */}
                      <div className="flex items-center gap-0.5 bg-black/30 border border-white/5 py-1 px-2 rounded-xl">
                        {[1, 2, 3, 4, 5].map((starIdx) => (
                          <Star
                            key={starIdx}
                            className={`w-3.5 h-3.5 ${
                              rev.rating >= starIdx
                                ? 'text-[#FFD84D] fill-[#FFD84D]'
                                : 'text-neutral-800'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 font-light leading-relaxed pl-1 whitespace-pre-wrap">
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RELATED PRODUCTS RECOMMENDATION SECTOR */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-white/5 pt-16 mt-20 select-none">
            <h2 className="text-lg uppercase font-mono tracking-[0.2em] text-white mb-8 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF4FA3] animate-pulse" />
              Related Curations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="group relative bg-[#0D0D11] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] cursor-pointer transition-all"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-xl border border-white/5 group-hover:scale-103 transition-transform"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-[8px] uppercase font-mono">{p.category}</span>
                    <h3 className="text-white text-xs font-semibold uppercase truncate group-hover:text-[#FF4FA3]">{p.name}</h3>
                    <div className="font-mono text-xs text-[#FFD84D] font-bold mt-1">₦{p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENTLY VIEWED PRODUCTS SHELF */}
        {recentlyViewed.length > 0 && (
          <div className="border-t border-white/5 pt-16 mt-16 select-none animate-fade-in">
            <h2 className="text-lg uppercase font-mono tracking-[0.2em] text-white mb-8 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF4FA3]" />
              Recently Viewed Curations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onSelectProduct(p.id)}
                  className="group relative bg-[#0D0D11] border border-white/5 hover:border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] cursor-pointer transition-all"
                >
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-48 object-cover rounded-xl border border-white/5 group-hover:scale-103 transition-transform"
                    loading="lazy"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-[8px] uppercase font-mono">{p.category}</span>
                    <h3 className="text-white text-xs font-semibold uppercase truncate group-hover:text-[#FF4FA3]">{p.name}</h3>
                    <div className="font-mono text-xs text-[#FFD84D] font-bold mt-1">₦{p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
