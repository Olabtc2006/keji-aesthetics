/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  ShieldAlert,
  Boxes,
  ShoppingBag,
  ListOrdered,
  Users,
  LineChart,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  FolderSync,
  Heart,
  Sparkles,
  Check,
  Star,
  Flag,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
  Upload,
  X
} from 'lucide-react';
import { Product, Category, Order, Review, UserProfile, OrderStatus, FlashSaleBannerConfig } from '../types';
import { api } from '../lib/supabase';
import ReceiptLightbox from '../components/ReceiptLightbox';
import ProductImageManager from '../components/ProductImageManager';

interface AdminDashboardProps {
  userProfile: UserProfile | null;
  onNavigate: (page: string) => void;
}

export default function AdminDashboard({ userProfile, onNavigate }: AdminDashboardProps) {
  // Validate email boundaries
  const isAuthorizedAdmin =
    userProfile &&
    (userProfile.email === 'olaniyilawalazeez@gmail.com' ||
      userProfile.email === 'kejiaesthetics@gmail.com');

  // Admin Tab selection
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'reviews' | 'banners' | 'images'>('analytics');

  // Custom Lightbox state for holding clicked receipt
  const [activeReceiptUrl, setActiveReceiptUrl] = useState<string | null>(null);

  // System states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Flash Sale configuration state
  const [bannerConfig, setBannerConfig] = useState<FlashSaleBannerConfig | null>(null);
  const [bannerActive, setBannerActive] = useState(false);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerBadge, setBannerBadge] = useState('');
  const [bannerPromo, setBannerPromo] = useState('');
  const [bannerImg, setBannerImg] = useState('');
  const [bannerTarget, setBannerTarget] = useState('unisex-wears');
  const [bannerBtnText, setBannerBtnText] = useState('');
  const [bannerCountdown, setBannerCountdown] = useState('');
  const [updatingBanner, setUpdatingBanner] = useState(false);
  const [bannerUpdateSuccess, setBannerUpdateSuccess] = useState(false);

  // Form states for creating/editing products
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState('');
  const [pPrice, setPPrice] = useState(0);
  const [pOrigPrice, setPOrigPrice] = useState(0);
  const [pCategory, setPCategory] = useState<string>('unisex-wears');
  const [pStock, setPStock] = useState(1);
  const [pDesc, setPDesc] = useState('');
  const [pSizes, setPSizes] = useState('');
  const [pColors, setPColors] = useState('');
  const [pImg, setPImg] = useState('');
  const [pFlash, setPFlash] = useState(false);

  // File upload UI states
  const [isUploadingProductImg, setIsUploadingProductImg] = useState(false);
  const [productDragActive, setProductDragActive] = useState(false);
  const [showProductUrlInput, setShowProductUrlInput] = useState(false);

  const [isUploadingBannerImg, setIsUploadingBannerImg] = useState(false);
  const [bannerDragActive, setBannerDragActive] = useState(false);
  const [showBannerUrlInput, setShowBannerUrlInput] = useState(false);

  useEffect(() => {
    if (isAuthorizedAdmin) {
      loadSystemData();
    }
  }, [isAuthorizedAdmin]);

  const loadSystemData = () => {
    setLoading(true);
    Promise.all([
      api.fetchProducts(),
      api.fetchOrders(),
      api.fetchReviews(),
      api.fetchCategories(),
      api.fetchFlashSaleBanner()
    ])
      .then(([pList, ordList, revList, catList, banner]) => {
        setProducts(pList);
        setOrders(ordList);
        setReviews(revList);
        setCategories(catList);
        setBannerConfig(banner);

        if (banner) {
          setBannerActive(banner.isActive);
          setBannerTitle(banner.title);
          setBannerSubtitle(banner.subtitle);
          setBannerBadge(banner.discountBadge);
          setBannerPromo(banner.promoCode || '');
          setBannerImg(banner.imageUrl || '');
          setBannerTarget(banner.targetUrl || '');
          setBannerBtnText(banner.buttonText);
          setBannerCountdown(banner.countdownDate || '');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  if (!isAuthorizedAdmin) {
    /* Restriction Block Shield */
    return (
      <div className="bg-[#0D0D0D] min-h-screen text-white pt-32 px-6 flex flex-col items-center justify-center text-center gap-6">
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/25 rounded-2xl flex items-center justify-center text-red-400">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#FF4FA3] uppercase font-bold">
          Restricted Administrative Matrix
        </span>
        <h1 className="text-3xl font-black uppercase text-white leading-tight">
          ACCESS COMPROMISED
        </h1>
        <p className="text-gray-400 text-xs md:text-sm max-w-sm font-light leading-relaxed">
          Your current email profile state is not authorized on our admin panel roster. Please authenticate with authorized admin keys.
        </p>
        <button
          onClick={() => onNavigate('account')}
          className="px-6 py-3 bg-white/5 border border-white/10 hover:border-[#FF4FA3]/30 text-xs font-mono uppercase tracking-widest text-white rounded-full transition-all cursor-pointer"
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  const handleUpdateBannerConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingBanner(true);
    try {
      const updatedConfig: FlashSaleBannerConfig = {
        isActive: bannerActive,
        title: bannerTitle,
        subtitle: bannerSubtitle,
        discountBadge: bannerBadge,
        promoCode: bannerPromo || undefined,
        imageUrl: bannerImg || undefined,
        targetUrl: bannerTarget || undefined,
        buttonText: bannerBtnText || 'SHOP NOW',
        countdownDate: bannerCountdown || undefined
      };
      
      const saved = await api.saveFlashSaleBanner(updatedConfig);
      setBannerConfig(saved);
      setBannerUpdateSuccess(true);
      setTimeout(() => setBannerUpdateSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to update banner:', err);
    } finally {
      setUpdatingBanner(false);
    }
  };

  const handleProductImgUpload = async (file: File) => {
    setIsUploadingProductImg(true);
    try {
      const url = await api.uploadFile('product-assets', file);
      setPImg(url);
    } catch (err) {
      console.error('Product image upload failed:', err);
    } finally {
      setIsUploadingProductImg(false);
    }
  };

  const handleProductImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleProductImgUpload(file);
    }
  };

  const handleProductDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setProductDragActive(true);
    } else if (e.type === "dragleave") {
      setProductDragActive(false);
    }
  };

  const handleProductDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProductDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleProductImgUpload(file);
    }
  };

  const handleBannerImgUploadNew = async (file: File) => {
    setIsUploadingBannerImg(true);
    try {
      const url = await api.uploadFile('product-assets', file);
      setBannerImg(url);
    } catch (err) {
      console.error('Banner image upload failed:', err);
    } finally {
      setIsUploadingBannerImg(false);
    }
  };

  const handleBannerImgChangeNew = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleBannerImgUploadNew(file);
    }
  };

  const handleBannerDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setBannerDragActive(true);
    } else if (e.type === "dragleave") {
      setBannerDragActive(false);
    }
  };

  const handleBannerDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setBannerDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleBannerImgUploadNew(file);
    }
  };

  // Analytics helper sum metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderVal = orders.length > 0 ? totalRevenue / orders.length : 0;
  const inStockCount = products.filter((p) => p.stock > 0).length;

  const handleCreateOrUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const sizesArr = pSizes ? pSizes.split(',').map((s) => s.trim()) : [];
    const colorsArr = pColors ? pColors.split(',').map((c) => c.trim()) : [];

    const productPayload: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'> = {
      name: pName,
      price: Number(pPrice),
      originalPrice: pOrigPrice ? Number(pOrigPrice) : undefined,
      description: pDesc,
      category: pCategory as any,
      imageUrl: pImg || 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
      stock: Number(pStock),
      sizes: sizesArr,
      colors: colorsArr,
      isFlashSale: pFlash,
      isFeatured: !pFlash,
      isNewArrival: true,
      isTrending: false,
      isBestSeller: false,
      discountPercentage: pOrigPrice ? Math.round(((Number(pOrigPrice) - Number(pPrice)) / Number(pOrigPrice)) * 100) : undefined
    };

    try {
      if (editingProduct) {
        // update
        await api.updateProduct(editingProduct.id, productPayload);
      } else {
        // create
        await api.createProduct(productPayload);
      }
      resetProductForm();
      loadSystemData();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleEditProductClick = (p: Product) => {
    setEditingProduct(p);
    setPName(p.name);
    setPPrice(p.price);
    setPOrigPrice(p.originalPrice || 0);
    setPCategory(p.category);
    setPStock(p.stock);
    setPDesc(p.description);
    setPSizes(p.sizes ? p.sizes.join(', ') : '');
    setPColors(p.colors ? p.colors.join(', ') : '');
    setPImg(p.imageUrl);
    setPFlash(p.isFlashSale);
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Delete this product curation forever?')) {
      setLoading(true);
      try {
        await api.deleteProduct(id);
        loadSystemData();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const resetProductForm = () => {
    setEditingProduct(null);
    setPName('');
    setPPrice(0);
    setPOrigPrice(0);
    setPCategory('unisex-wears');
    setPStock(1);
    setPDesc('');
    setPSizes('');
    setPColors('');
    setPImg('');
    setPFlash(false);
  };

  const updateOrderStatus = async (orderId: string, nextStatus: OrderStatus) => {
    setLoading(true);
    try {
      await api.updateOrderStatus(orderId, nextStatus);
      loadSystemData();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (confirm('Delete this user comment and star rating?')) {
      setLoading(true);
      try {
        await api.deleteReview(reviewId);
        loadSystemData();
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-12 right-0 w-80 h-80 bg-[#FF4FA3]/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 select-none">
        
        {/* Top Header info */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-white/5 mb-10 gap-6">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold flex items-center gap-1">
              👑 Administrative Matrix Portal
            </span>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white leading-none">
              KEJI <span className="text-[#FFD84D]">AESTHETICS OPERATIONS</span>
            </h1>
          </div>

          {/* Quick Refresh indicators button */}
          <button
            onClick={loadSystemData}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-mono text-gray-300 rounded-xl transition-all cursor-pointer border border-white/5 active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF4FA3]' : ''}`} />
            <span>Resync Database</span>
          </button>
        </div>

        {/* Outer Tabs selector menu */}
        <div className="flex overflow-x-auto pb-2 scrollbar-none gap-4 mb-8">
          {[
            { id: 'analytics', label: '📊 System Analytics', color: 'border-yellow-400' },
            { id: 'products', label: '📦 Curations Cataloging', color: 'border-pink-500' },
            { id: 'images', label: '📸 Media Gallery Manager', color: 'border-orange-500' },
            { id: 'orders', label: '🛍️ Order Disbursement', color: 'border-cyan-500' },
            { id: 'reviews', label: '⭐ Feedback moderation', color: 'border-purple-500' },
            { id: 'banners', label: '⚡ Flash Sale Popup', color: 'border-[#FF4FA3]' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-[11px] font-mono uppercase tracking-wider font-bold shrink-0 border transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-white/10 border-white/20 text-white shadow-md'
                  : 'bg-white/2 border-transparent text-gray-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading && products.length === 0 ? (
          <div className="flex items-center justify-center py-32 flex-col">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#FFD84D] animate-spin mb-4" />
            <span className="text-xs font-mono text-gray-500">Retrieving system states catalogs...</span>
          </div>
        ) : (
          <div>
            
            {/* ===================================================
               SUB CONTENT: SYSTEM ANALYTICS COMPARTMENT
               =================================================== */}
            {activeTab === 'analytics' && (
              <div className="flex flex-col gap-8 scale-in-animation">
                {/* 4 Cards Grid metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-text">
                  <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Cumulative Revenue</span>
                    <span className="text-2xl font-mono text-[#FF4FA3] font-black">₦{totalRevenue.toLocaleString()}</span>
                    <span className="text-[9px] font-mono text-green-400">↑ 100% Organically Verified</span>
                  </div>
                  <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Processed Bills</span>
                    <span className="text-2xl font-mono text-[#FFD84D] font-black">{orders.length} Invoices</span>
                    <span className="text-[9px] font-mono text-gray-500">Orders tracking live states</span>
                  </div>
                  <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-gray-500">AOV (Average Order Value)</span>
                    <span className="text-2xl font-mono text-white font-black">₦{Math.round(averageOrderVal).toLocaleString()}</span>
                    <span className="text-[9px] font-mono text-cyan-400">Ticket size average scale</span>
                  </div>
                  <div className="bg-[#121217]/60 border border-white/5 rounded-2xl p-6 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-mono text-gray-500">Stock Availability</span>
                    <span className="text-2xl font-mono text-green-400 font-black">{inStockCount} Items</span>
                    <span className="text-[9px] font-mono text-gray-500">Out of {products.length} registered Drops</span>
                  </div>
                </div>

                {/* Analytical graphical mock representation placeholder */}
                <div className="bg-[#121217]/65 border border-white/5 rounded-3xl p-6 relative flex flex-col gap-4 shadow-sm">
                  <h3 className="text-xs uppercase font-mono text-gray-400 tracking-wider">Lagos & Transit Regional Earnings Output</h3>

                  <div className="h-48 border-b border-white/5 flex items-end gap-3 pt-6 font-mono text-[10px]">
                    {/* Simulated vertical bar components */}
                    {[
                      { l: 'Apparel', val: 75, prc: '₦450k', color: '#FF4FA3' },
                      { l: 'Jewelry', val: 55, prc: '₦310k', color: '#FFD84D' },
                      { l: 'Bags', val: 90, prc: '₦620k', color: '#38bdf8' },
                      { l: 'Unbox Gifting', val: 40, prc: '₦180k', color: '#a855f7' }
                    ].map((bar) => (
                      <div key={bar.l} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                        <span className="text-gray-400 text-[9px]">{bar.prc}</span>
                        <div
                          style={{
                            height: `${bar.val}%`,
                            backgroundColor: bar.color
                          }}
                          className="w-full rounded-t-lg transition-all duration-1000 max-w-24 shadow-[0_4px_15px_rgba(0,0,0,0.4)]"
                        />
                        <span className="text-gray-500 text-[9px] text-center truncate w-full">{bar.l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================
               SUB CONTENT: PRODUCT CATALOGING CREATION
               =================================================== */}
            {activeTab === 'products' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scale-in-animation">
                
                {/* Product form creator panel (Left 5 cols) */}
                <form
                  onSubmit={handleCreateOrUpdateProduct}
                  className="lg:col-span-5 bg-[#121217]/60 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 select-text"
                >
                  <h3 className="text-xs uppercase font-mono text-[#FFD84D] tracking-widest font-black flex items-center gap-1 border-b border-white/5 pb-3">
                    {editingProduct ? '✏️ Edit Catalog Drop' : '➕ Register Catalog Drop'}
                  </h3>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase">Product Headline Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Signature Velvet Hoodie"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-gray-400 uppercase">Sale price ₦</label>
                      <input
                        type="number"
                        required
                        value={pPrice}
                        onChange={(e) => setPPrice(Number(e.target.value))}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-gray-400 uppercase">Original Price (optional)</label>
                      <input
                        type="number"
                        value={pOrigPrice}
                        onChange={(e) => setPOrigPrice(Number(e.target.value))}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-gray-400">STOCK VOLUME</label>
                      <input
                        type="number"
                        required
                        value={pStock}
                        onChange={(e) => setPStock(Number(e.target.value))}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] font-mono text-gray-400">CAMPAIGN TYPE</label>
                      <select
                        value={pFlash ? 'flash' : 'regular'}
                        onChange={(e) => setPFlash(e.target.value === 'flash')}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        <option value="regular">Regular catalog</option>
                        <option value="flash">Flame Sale Drop</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase">Department Location</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.slug} value={c.slug}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-gray-400">DESCRIPTIVE PARAGRAPHS</label>
                    <textarea
                      rows={3}
                      value={pDesc}
                      onChange={(e) => setPDesc(e.target.value)}
                      placeholder="Input fabric weight, wash instructions, specifications..."
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase">Aesthetic Options finishes (split via comma)</label>
                    <input
                      type="text"
                      placeholder="e.g. Sterling silver, Gold glaze, Royal blue"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-mono text-gray-400 uppercase">Available Sizes (split via comma)</label>
                    <input
                      type="text"
                      placeholder="e.g. S, M, L, XL"
                      value={pSizes}
                      onChange={(e) => setPSizes(e.target.value)}
                      className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[9px] font-mono text-gray-400 uppercase tracking-wider font-bold">Product Media Asset</label>
                      <button
                        type="button"
                        onClick={() => setShowProductUrlInput(!showProductUrlInput)}
                        className="text-[9px] font-mono text-[#FF4FA3] hover:underline cursor-pointer"
                      >
                        {showProductUrlInput ? "⚡ Use Direct File Upload" : "🔗 Or paste custom URL"}
                      </button>
                    </div>

                    {showProductUrlInput ? (
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={pImg}
                        onChange={(e) => setPImg(e.target.value)}
                        className="bg-black/30 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:border-[#FF4FA3] outline-none transition-all"
                      />
                    ) : (
                      <div
                        onDragEnter={handleProductDrag}
                        onDragOver={handleProductDrag}
                        onDragLeave={handleProductDrag}
                        onDrop={handleProductDrop}
                        className={`border border-dashed rounded-2xl p-5 flex flex-col items-center justify-center gap-3 transition-all relative ${
                          productDragActive
                            ? 'border-[#FF4FA3] bg-[#FF4FA3]/5'
                            : 'border-white/10 bg-black/20 hover:border-white/20'
                        }`}
                      >
                        {isUploadingProductImg ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <RefreshCw className="w-5 h-5 text-[#FFD84D] animate-spin" />
                            <span className="text-[10px] font-mono text-gray-400">Uploading high-res asset...</span>
                          </div>
                        ) : pImg ? (
                          <div className="flex items-center gap-4 w-full">
                            <div className="relative group shrink-0">
                              <img
                                src={pImg}
                                alt="Product thumbnail"
                                className="w-16 h-16 rounded-xl object-cover border border-white/10"
                              />
                              <button
                                type="button"
                                onClick={() => setPImg('')}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                                title="Remove photo"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <span className="text-[10px] font-mono text-green-400 flex items-center gap-1 font-bold">
                                <Check className="w-3 h-3" /> File ready to save
                              </span>
                              <p className="text-[9px] font-mono text-gray-500 truncate">{pImg}</p>
                              <label className="text-[9px] font-mono text-[#FF4FA3] hover:underline cursor-pointer">
                                Replace with another file
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProductImgChange}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 py-2">
                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-all">
                              <Upload className="w-5 h-5" />
                            </div>
                            <div className="text-center">
                              <label className="text-[11px] font-mono text-[#FF4FA3] hover:underline cursor-pointer font-bold block">
                                Click to upload photo
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleProductImgChange}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[9px] font-mono text-gray-500 block mt-1">
                                or drag and drop image here
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2.5 mt-2">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 py-3 rounded-xl text-xs font-mono font-bold uppercase text-white shadow-md active:scale-95 transition-all"
                    >
                      {editingProduct ? 'Apply Catalog updates' : 'Upload Catalog Drop'}
                    </button>
                    {editingProduct && (
                      <button
                        type="button"
                        onClick={resetProductForm}
                        className="px-4 border border-white/10 rounded-xl text-xs font-mono text-gray-500 hover:text-white"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </form>

                {/* Products list visualizer (Right 7 cols) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                    Currently cataloged ({products.length} Drop Items)
                  </span>

                  <div className="flex flex-col gap-3.5 max-h-[85vh] overflow-y-auto pr-1">
                    {products.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-4 bg-[#121217]/60 border border-white/5 rounded-2xl gap-4 hover:border-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={item.imageUrl}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-neutral-900 border border-white/5"
                          />
                          <div className="flex flex-col leading-tight">
                            <span className="text-[8px] font-mono text-[#FF4FA3] uppercase font-bold tracking-wider">{item.category}</span>
                            <h4 className="text-white text-xs font-semibold uppercase truncate max-w-xs">{item.name}</h4>
                            <span className="text-[10px] text-[#FFD84D] font-mono mt-0.5">
                              ₦{item.price.toLocaleString()} • STOCK: {item.stock} PIECES
                            </span>
                          </div>
                        </div>

                        {/* Mod buttons */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditProductClick(item)}
                            className="p-2 hover:bg-[#FFD84D]/10 rounded-xl border border-transparent hover:border-[#FFD84D]/20 text-[#FFD84D] transition-colors cursor-pointer"
                            title="Edit curation"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(item.id)}
                            className="p-2 hover:bg-red-500/10 rounded-xl border border-transparent hover:border-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="Delete curation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ===================================================
               SUB CONTENT: MEDIA GALLERY MANAGER
               =================================================== */}
            {activeTab === 'images' && (
              <div className="scale-in-animation">
                <ProductImageManager
                  products={products}
                  onImageUpdate={loadSystemData}
                />
              </div>
            )}

            {/* ===================================================
               SUB CONTENT: ORDER TRACKING STATS CONTROL
               =================================================== */}
            {activeTab === 'orders' && (
              <div className="flex flex-col gap-6 scale-in-animation">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Received client checkout disbursements ({orders.length} orders total)
                </span>

                <div className="flex flex-col gap-6 font-sans">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-[#121217]/55 border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row gap-6 justify-between select-text shadow-sm"
                    >
                      {/* Left: General address & client info */}
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex items-baseline gap-3">
                          <h4 className="font-mono text-xs text-white font-bold uppercase tracking-wider">ORDER CODE #{ord.id}</h4>
                          <span className="text-[9px] font-mono text-gray-500">Log: {new Date(ord.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="text-xs text-gray-400 font-light flex flex-col gap-1.5 leading-relaxed">
                          <div>
                            <span className="text-gray-500 font-mono text-[10px]">Client Name:</span> <span className="text-white font-semibold">{ord.customerName}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-mono text-[10px]">Phone support:</span> <span className="text-white font-mono">{ord.phoneNumber}</span>
                          </div>
                          <div>
                            <span className="text-gray-500 font-mono text-[10px]">Destination Delivery:</span> <span className="text-gray-300">{ord.deliveryAddress}</span>
                          </div>
                        </div>

                        {/* Items listed summary */}
                        <div className="flex flex-col gap-1 border-t border-white/5 pt-3 mt-1.5 text-xs font-mono">
                          {ord.items.map((it, idx) => (
                            <span key={idx} className="text-gray-500 font-light">
                              • {it.productName} (x{it.quantity}) {it.selectedSize ? `[${it.selectedSize}]` : ''} - ₦{(it.price * it.quantity).toLocaleString()}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Right: Payment status mod actions selectors inputs */}
                      <div className="flex flex-col md:items-end justify-between gap-5 font-mono">
                        <div className="text-right">
                          <span className="text-[10px] uppercase text-gray-500 block">SUM OUTPAY</span>
                          <span className="text-lg text-[#FF4FA3] font-black">₦{ord.totalAmount.toLocaleString()}</span>
                        </div>

                        {ord.paymentReceiptUrl && (
                          <button
                            onClick={() => setActiveReceiptUrl(ord.paymentReceiptUrl || null)}
                            className="bg-green-500/10 border border-green-500/25 px-4 py-2.5 rounded-xl text-green-400 text-xs font-mono text-center hover:bg-green-500/20 active:scale-95 transition-all cursor-pointer"
                          >
                            🔎 View verified upload receipt proof
                          </button>
                        )}

                        <div className="flex items-center gap-3">
                          <label className="text-[9px] uppercase tracking-wider text-gray-500 text-right">MARK STATE STAT:</label>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                            className="bg-[#0D0D11] border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-[#FFD84D]"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Payment Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
               SUB CONTENT: REVIEWS DISBURSEMENT feedback
               =================================================== */}
            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-5 scale-in-animation">
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest font-bold">
                  Verifiable client reviews listings ({reviews.length} feedback items)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-text">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-[#121217]/55 border border-white/5 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative group"
                    >
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="absolute top-6 right-6 bg-red-500/5 hover:bg-red-500/15 border border-transparent hover:border-red-500/20 p-2 rounded-xl text-gray-500 hover:text-red-500 transition-all cursor-pointer"
                        title="Delete this bad / toxic review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating ? 'text-[#FFD84D] fill-[#FFD84D]' : 'text-neutral-800'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-gray-500">Rating: {rev.rating}/5</span>
                        </div>

                        <p className="text-gray-300 text-xs italic font-light leading-relaxed font-sans pr-8">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="border-t border-white/5 pt-4 mt-4 flex items-center justify-between text-[10px] font-mono text-gray-500 uppercase">
                        <div>
                          <span>Verified buyer:</span> <span className="text-white">{rev.userName}</span>
                        </div>
                        <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ===================================================
               SUB CONTENT: FLASH SALE BANNER CONFIGURATION
               =================================================== */}
            {activeTab === 'banners' && (
              <div className="flex flex-col gap-6 scale-in-animation max-w-4xl select-none">
                <div className="flex flex-col gap-1.5 border-b border-white/5 pb-5">
                  <span className="text-[10px] font-mono text-[#FF4FA3] uppercase tracking-widest font-black flex items-center gap-1.5">
                    <Flag className="w-4 h-4" /> POPUP CAMPAIGNS & BANNER DEALS
                  </span>
                  <h2 className="text-xl uppercase font-sans font-black text-white tracking-wider font-bold">
                    Homepage Flash Sale Dialog Editor
                  </h2>
                  <p className="text-gray-400 text-xs font-light leading-relaxed">
                    Set up, fine-tune, and live-toggle the promotional Pop-up Dialog Banner mapped onto the homepage for high conversion clearance deals.
                  </p>
                </div>

                {bannerUpdateSuccess && (
                  <div className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/25 px-5 py-4 rounded-2xl text-green-400 text-xs font-mono animate-fade-in">
                    <Check className="w-4 h-4 text-green-400 shrink-0" />
                    <span>Flash Sale Pop-Up configurations synced and saved successfully! Pop-up state updated.</span>
                  </div>
                )}

                <form onSubmit={handleUpdateBannerConfig} className="bg-[#111116] border border-white/5 rounded-3xl p-6 lg:p-10 flex flex-col gap-8">
                  
                  {/* Toggle and Activation Row */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/40 border border-white/5 p-5 rounded-2xl">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs uppercase font-mono tracking-wider text-white font-bold">Campaign Status Toggle</span>
                      <span className="text-[11px] text-gray-500">Enable or disable the overlay banner pop-up across visitor landing page.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBannerActive(!bannerActive)}
                      className={`relative w-16 h-8 rounded-full p-1 transition-colors duration-300 outline-none cursor-pointer select-none ${
                        bannerActive ? 'bg-[#FF4FA3]' : 'bg-neutral-800'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                          bannerActive ? 'translate-x-8' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Big Heading Title */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Campaign Main Title</label>
                      <input
                        type="text"
                        required
                        value={bannerTitle}
                        onChange={(e) => setBannerTitle(e.target.value)}
                        placeholder="e.g. EXTRAORDINARY FLASH CLEARANCE"
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white placeholder-gray-600 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all"
                      />
                    </div>

                    {/* Left corner Discount Badge / Tag line */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Discount Badge / Ribbon Text</label>
                      <input
                        type="text"
                        required
                        value={bannerBadge}
                        onChange={(e) => setBannerBadge(e.target.value)}
                        placeholder="e.g. 50% OFF COUREUR"
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white placeholder-gray-600 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Subtitle / Descriptive Slogan */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Offer Slogan Subhead</label>
                    <textarea
                      required
                      rows={3}
                      value={bannerSubtitle}
                      onChange={(e) => setBannerSubtitle(e.target.value)}
                      placeholder="e.g. Dress to impress; live to express. Buy 2 get 1 absolutely free for limited orders."
                      className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs text-white placeholder-gray-600 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Promo Code string */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Coupon Promo Code (Optional)</label>
                      <input
                        type="text"
                        value={bannerPromo}
                        onChange={(e) => setBannerPromo(e.target.value)}
                        placeholder="e.g. KEJI50"
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-[#FFD84D] placeholder-gray-600 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all uppercase font-black tracking-widest"
                      />
                    </div>

                    {/* Countdown End Date datetime picker */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-500" /> Countdown Deadline Date/Time
                      </label>
                      <input
                        type="datetime-local"
                        required
                        value={bannerCountdown}
                        onChange={(e) => setBannerCountdown(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all"
                      />
                    </div>
                  </div>

                  {/* Banner Image Customization Field and Direct File Uploader combined */}
                  <div className="bg-black/40 border border-white/5 p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-gray-400 font-bold">Promotional Banner Graphic Asset</span>
                      <button
                        type="button"
                        onClick={() => setShowBannerUrlInput(!showBannerUrlInput)}
                        className="text-[9px] font-mono text-[#FF4FA3] hover:underline cursor-pointer"
                      >
                        {showBannerUrlInput ? "⚡ Use Direct File Upload" : "🔗 Or paste custom URL"}
                      </button>
                    </div>

                    {showBannerUrlInput ? (
                      <input
                        type="text"
                        value={bannerImg}
                        onChange={(e) => setBannerImg(e.target.value)}
                        placeholder="Paste custom hot-linked image URL"
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white placeholder-gray-600 focus:border-[#FF4FA3] outline-none transition-all w-full"
                      />
                    ) : (
                      <div
                        onDragEnter={handleBannerDrag}
                        onDragOver={handleBannerDrag}
                        onDragLeave={handleBannerDrag}
                        onDrop={handleBannerDrop}
                        className={`border border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-4 transition-all relative min-h-[160px] ${
                          bannerDragActive
                            ? 'border-[#FF4FA3] bg-[#FF4FA3]/5'
                            : 'border-white/10 bg-black/20 hover:border-white/20'
                        }`}
                      >
                        {isUploadingBannerImg ? (
                          <div className="flex flex-col items-center gap-2 py-4">
                            <RefreshCw className="w-6 h-6 text-[#FFD84D] animate-spin" />
                            <span className="text-xs font-mono text-gray-400">Uploading banner image to cloud...</span>
                          </div>
                        ) : bannerImg ? (
                          <div className="flex flex-col md:flex-row items-center gap-5 w-full">
                            <div className="relative shrink-0">
                              <img
                                src={bannerImg}
                                alt="Banner preview"
                                className="w-28 h-20 rounded-xl object-cover border border-white/10 shadow-lg"
                              />
                              <button
                                type="button"
                                onClick={() => setBannerImg('')}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                                title="Remove image"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                              <span className="text-xs font-mono text-green-400 flex items-center gap-1.5 font-bold">
                                <Check className="w-4 h-4 text-green-400" /> Active campaign banner set
                              </span>
                              <p className="text-[10px] font-mono text-gray-500 truncate">{bannerImg}</p>
                              <label className="text-[10px] font-mono text-[#FF4FA3] hover:underline cursor-pointer">
                                Select replacement file
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerImgChangeNew}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 py-2">
                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                              <Upload className="w-6 h-6 text-gray-300" />
                            </div>
                            <div className="text-center">
                              <label className="text-xs font-mono text-[#FF4FA3] hover:underline cursor-pointer font-bold block">
                                Click to upload campaign banner image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleBannerImgChangeNew}
                                  className="hidden"
                                />
                              </label>
                              <span className="text-[10px] font-mono text-gray-500 block mt-1">
                                JPG, PNG, WEBP files supported. Or drag and drop here
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Targeting Link Redirection Dropdown selection */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Redirection CTA link Route</label>
                      <select
                        value={bannerTarget}
                        onChange={(e) => setBannerTarget(e.target.value)}
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white focus:border-[#FF4FA3] outline-none transition-all cursor-pointer"
                      >
                        <option value="shop">🛍️ Whole Catalog View (/shop)</option>
                        <option value="unisex-wears">Unisex Wears line</option>
                        <option value="underwear">Apparel Underwear line</option>
                        <option value="bags">Designer Luxury Bags</option>
                        <option value="jewelry">Iconic Precious Jewelry</option>
                        <option value="accessories">Aesthetic Accessories</option>
                        <option value="home-decor">Home Decor & Curations</option>
                        <option value="head-wears">Head Wears</option>
                        <option value="surprise-packages">Surprise Packages</option>
                        <option value="digital-assets">Digital Assets</option>
                        <option value="about">Manifesto page</option>
                      </select>
                    </div>

                    {/* Banner Main button Call To Action Text */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono uppercase tracking-widest text-gray-400">Button CTA Text</label>
                      <input
                        type="text"
                        required
                        value={bannerBtnText}
                        onChange={(e) => setBannerBtnText(e.target.value)}
                        placeholder="e.g. SHOP DEALS NOW"
                        className="bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-xs font-mono text-white placeholder-gray-600 focus:border-[#FF4FA3] focus:ring-1 focus:ring-[#FF4FA3]/30 outline-none transition-all uppercase"
                      />
                    </div>
                  </div>

                  {/* Submission and saving indicators buttons */}
                  <button
                    type="submit"
                    disabled={updatingBanner}
                    className="self-start px-8 py-4 bg-[#FF4FA3] hover:bg-[#FF4FA3]/90 text-white font-mono text-xs uppercase tracking-widest font-black rounded-2xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(255,79,163,0.3)] hover:shadow-[0_4px_22px_rgba(255,79,163,0.5)] flex items-center gap-2"
                  >
                    {updatingBanner ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Saving parameters...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" /> Save Banner campaign config
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Lightbox Component Modal */}
      <ReceiptLightbox 
        url={activeReceiptUrl}
        isOpen={!!activeReceiptUrl}
        onClose={() => setActiveReceiptUrl(null)}
      />
    </div>
  );
}
