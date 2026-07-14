/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  History,
  Trash2
} from 'lucide-react';
import { Product, CategorySlug } from '../types';
import { api } from '../lib/supabase';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  cartCount: number;
  wishlistCount: number;
  onSearchSelectProduct: (productId: string) => void;
  userRole?: 'admin' | 'customer';
  userEmail?: string;
  onLogout: () => void;
}

export default function Navbar({
  currentPage,
  onNavigate,
  cartCount,
  wishlistCount,
  onSearchSelectProduct,
  userRole,
  userEmail,
  onLogout
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('keji_recent_searches');
      return stored ? JSON.parse(stored) : ['Hoodie', 'Chain', 'Gift Box', 'Bralette'];
    } catch {
      return ['Hoodie', 'Chain', 'Gift Box'];
    }
  });

  const popularSearches = ['Unisex', 'Butterfly', 'Satin', 'Aura Sunglasses', 'Mystery Box', 'Digital Presets'];
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch products once to power instant search
  useEffect(() => {
    api.fetchProducts().then(setProducts).catch(console.error);
  }, [currentPage]);

  // Handle instant search results
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = products.filter(
      p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 5));
  }, [searchQuery, products]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Add to recents
    const queryTerm = searchQuery.trim();
    const updated = [queryTerm, ...recentSearches.filter(s => s !== queryTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('keji_recent_searches', JSON.stringify(updated));

    // Redirect to Shop with search filter
    onNavigate(`shop?q=${encodeURIComponent(queryTerm)}`);
    setSearchOpen(false);
  };

  const handleKeywordClick = (word: string) => {
    setSearchQuery(word);
    onNavigate(`shop?q=${encodeURIComponent(word)}`);
    setSearchOpen(false);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('keji_recent_searches');
  };

  const menuItems = [
    { label: 'Home', value: 'home' },
    { label: 'Shop', value: 'shop' },
    { label: 'Categories', value: 'categories' },
    { label: 'Wishlist', value: 'wishlist' },
    { label: 'Account', value: 'account' },
    { label: 'About Us', value: 'about' },
    { label: 'Contact', value: 'contact' },
  ];

  return (
    <>
      {/* Dynamic Header */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0D0D0D]/85 border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Logo Brand Frame */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF4FA3]/15 flex items-center justify-center border border-[#FF4FA3]/35 group-hover:scale-105 transition-all">
              <span className="text-[#FF4FA3] text-sm font-mono font-bold font-sans">K</span>
            </div>
            <span className="text-sm md:text-md font-sans tracking-[0.25em] font-black text-white group-hover:text-gray-200 transition-colors">
              KEJI<span className="text-[#FF4FA3]">_</span>AESTHETICS
            </span>
          </div>

          {/* Desktop Navigation Links (Centered) */}
          <nav className="hidden lg:flex items-center gap-7">
            {menuItems.map((item) => {
              const isCurrent = currentPage === item.value;
              return (
                <button
                  key={item.value}
                  onClick={() => onNavigate(item.value)}
                  className={`text-xs font-mono tracking-widest uppercase transition-all duration-300 relative py-1 cursor-pointer hover:text-[#FF4FA3] ${
                    isCurrent ? 'text-white' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                  {/* Pink bottom indicator */}
                  {isCurrent && (
                    <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#FF4FA3] shadow-[0_0_8px_#FF4FA3]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Hub Icons */}
          <div className="flex items-center gap-5">
            {/* Instant Search triggers */}
            <button
              onClick={() => setSearchOpen(true)}
              className="text-gray-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
              title="Search store"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link with bubble */}
            <button
              onClick={() => onNavigate('wishlist')}
              className="text-gray-400 hover:text-white transition-colors relative p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
              title="View Wishlist"
            >
              <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-[#FF4FA3] text-[#FF4FA3]' : ''}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 text-[8px] font-mono font-bold text-white flex items-center justify-center px-1 animate-pulse border border-[#0D0D0D]">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Icon trigger with active glow */}
            <button
              onClick={() => onNavigate('cart')}
              className="text-gray-400 hover:text-white transition-colors relative p-1.5 hover:bg-white/5 rounded-full cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className={`w-4 h-4 ${cartCount > 0 ? 'text-[#FFD84D]' : ''}`} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full bg-gradient-to-r from-[#FFD84D] to-orange-500 text-[8px] font-mono font-bold text-[#0D0D0D] flex items-center justify-center px-1 border border-[#0D0D0D]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account Icon Portal */}
            <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
              {userEmail ? (
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => onNavigate('account')}
                    className="flex flex-col items-end cursor-pointer"
                  >
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider max-w-28 truncate">
                      {userEmail}
                    </span>
                    <span className="text-[9px] text-[#FFD84D] font-mono uppercase tracking-[0.1em]">
                      {userRole === 'admin' ? 'Authorized Admin' : 'Profile Panel'}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="text-[9px] font-mono hover:text-[#FF4FA3] text-gray-500 transition-colors uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-md cursor-pointer border border-white/5"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onNavigate('account')}
                  className="flex items-center gap-1 text-gray-400 hover:text-[#FF4FA3] text-xs font-mono uppercase tracking-widest transition-colors cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </button>
              )}
            </div>

            {/* Hamburger (Mobile Main menu trigger) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide Panel */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-35 lg:hidden bg-black/95 backdrop-blur-xl pt-24 pb-8 flex flex-col justify-between">
          <div className="flex flex-col gap-6 px-8 select-none">
            {menuItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-lg font-sans uppercase tracking-[0.2em] font-semibold transition-all py-1.5 ${
                  currentPage === item.value ? 'text-[#FF4FA3] pl-2 border-l-2 border-[#FF4FA3]' : 'text-gray-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-8 flex flex-col gap-5 border-t border-white/5 pt-8 select-none">
            {userEmail ? (
              <div className="flex flex-col gap-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-mono">{userEmail}</span>
                  <span className="text-[10px] text-[#FFD84D] font-mono uppercase tracking-[0.1em] mt-0.5">
                    {userRole === 'admin' ? 'Authorized Admin' : 'Customer Account'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onNavigate('account');
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 bg-white/5 border border-white/10 text-xs text-white font-mono uppercase tracking-widest py-3 rounded-md uppercase"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-[#FF4FA3]/10 text-xs text-[#FF4FA3] font-mono uppercase tracking-widest py-3 px-6 rounded-md border border-[#FF4FA3]/25"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => {
                  onNavigate('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/70 hover:from-[#FF4FA3]/80 hover:to-[#FF4FA3]/50 text-white font-mono text-xs uppercase tracking-widest py-4 rounded-full transition-all uppercase"
              >
                Identify Portal (Login/Register)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Premium Fullscreen Search Overlay Drawer */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0A0A0AD0] backdrop-blur-xl flex items-start justify-center pt-24 px-6 md:px-12 select-none">
          <div
            ref={searchRef}
            className="w-full max-w-3xl bg-[#0D0D11] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden scale-in-animation flex flex-col"
          >
            {/* Header / Input Field */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 p-5 border-b border-white/5 relative bg-[#0F0F14]">
              <Search className="w-5 h-5 text-[#FF4FA3]" />
              <input
                type="text"
                autoFocus
                placeholder="Search Keji Aesthetics collections, categories, or digital products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder-gray-500 tracking-wide"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full cursor-pointer hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {/* Main Result and Suggestion Body */}
            <div className="p-8 grid grid-cols-1 md:grid-cols-5 md:divide-x md:divide-white/5 gap-8 overflow-y-auto max-h-[70vh]">
              
              {/* Left Column: Popular & Recents Searches */}
              <div className="md:col-span-2 flex flex-col gap-6 pr-4">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#FFD84D] flex items-center gap-1.5">
                        <History className="w-3 h-3 text-gold" />
                        Recent Searches
                      </h4>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[9px] font-mono text-gray-500 hover:text-[#FF4FA3] transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term, i) => (
                        <button
                          key={i}
                          onClick={() => handleKeywordClick(term)}
                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-xs text-gray-300 px-3 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <span className="text-[10px] text-gray-500">#{i + 1}</span>
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Keywords suggestions */}
                <div className="flex flex-col gap-3">
                  <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-gray-400 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-[#FF4FA3]" />
                    Trending Searches
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((word) => (
                      <button
                        key={word}
                        onClick={() => handleKeywordClick(word)}
                        className="bg-[#FF4FA3]/5 hover:bg-[#FF4FA3]/15 hover:border-[#FF4FA3]/40 border border-transparent text-xs text-gray-300 px-3 py-1.5 rounded-md transition-all cursor-pointer"
                      >
                        {word}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories Shortcuts */}
                <div className="flex flex-col gap-3 pt-2">
                  <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-gray-400">
                    Category Shortcuts
                  </h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: 'Unisex Apparel', slug: 'unisex-wears' },
                      { name: 'Luxe Jewelry', slug: 'jewelry' },
                      { name: 'Digital Templates', slug: 'digital-assets' },
                      { name: 'Luxury Surprises', slug: 'surprise-packages' }
                    ].map((c) => (
                      <button
                        key={c.slug}
                        onClick={() => {
                          onNavigate(`categories?category=${c.slug}`);
                          setSearchOpen(false);
                        }}
                        className="text-left py-2 px-3 bg-white/3 hover:bg-[#FF4FA3]/5 rounded-lg text-xs text-gray-300 hover:text-[#FF4FA3] transition-all flex items-center justify-between"
                      >
                        <span>{c.name}</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Instant Product Predictions */}
              <div className="md:col-span-3 flex flex-col gap-4 pl-4 md:pl-6">
                <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-gray-400">
                  {searchQuery ? 'Matching Products' : 'Aesthetic Drop Collection'}
                </h4>

                {searchResults.length > 0 ? (
                  <div className="flex flex-col gap-3.5">
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          onSearchSelectProduct(product.id);
                          setSearchOpen(false);
                        }}
                        className="flex items-center gap-4 p-2 bg-white/3 hover:bg-white/5 border border-white/5 hover:border-white/10 rounded-xl cursor-pointer transition-all"
                      >
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white text-xs font-semibold truncate">
                            {product.name}
                          </h5>
                          <span className="font-mono text-[10px] text-[#FF4FA3] uppercase tracking-wide">
                            {product.category.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-[#FFD84D] font-bold">
                            ₦{product.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchQuery ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
                    <Sparkles className="w-8 h-8 text-[#FF4FA3]/30 animate-pulse mb-3" />
                    <p className="text-xs font-light">No premium curations matched "{searchQuery}"</p>
                    <p className="text-[10px] font-mono text-gray-600 mt-1">Try another keyword or category</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3.5">
                    {/* Default recommendation items when search box is clean */}
                    {products.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSearchSelectProduct(p.id);
                          setSearchOpen(false);
                        }}
                        className="flex items-center gap-4 p-2.5 bg-white/3 hover:bg-white/5 border border-white/5 rounded-xl cursor-pointer transition-all"
                      >
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-white/5"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-white text-xs font-semibold truncate">
                            {p.name}
                          </h5>
                          <span className="font-mono text-[10px] text-gray-500 uppercase">
                            RECOMMENDED DROP
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-mono text-xs text-white">
                            ₦{p.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile App Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#0D0D0D]/90 border-t border-white/5 backdrop-blur-md z-30 lg:hidden flex items-center justify-around py-3 px-2 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] select-none">
        {[
          { label: 'Home', page: 'home', icon: 'Home' },
          { label: 'Shop', page: 'shop', icon: 'ShoppingBag' },
          { label: 'Categories', page: 'categories', icon: 'Menu' },
          { label: 'Wishlist', page: 'wishlist', icon: 'Heart' },
          { label: 'Account', page: 'account', icon: 'User' }
        ].map((btn) => {
          const isActive = currentPage === btn.page;
          return (
            <button
              key={btn.page}
              onClick={() => onNavigate(btn.page)}
              className="flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer transition-all relative"
            >
              {btn.icon === 'Home' && <span className={`text-xs p-1 ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>🏠</span>}
              {btn.icon === 'ShoppingBag' && <span className={`text-xs p-1 ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>🛍️</span>}
              {btn.icon === 'Menu' && <span className={`text-xs p-1 ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>📂</span>}
              {btn.icon === 'Heart' && <span className={`text-xs p-1 ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>💖</span>}
              {btn.icon === 'User' && <span className={`text-xs p-1 ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>👤</span>}
              {/* Badge markers if any */}
              {btn.page === 'cart' && cartCount > 0 && (
                <span className="absolute top-0 right-4 min-w-3.5 h-3.5 rounded-full bg-[#FFD84D] text-[7px] font-mono text-[#000] flex items-center justify-center font-bold px-0.5">
                  {cartCount}
                </span>
              )}
              {btn.page === 'wishlist' && wishlistCount > 0 && (
                <span className="absolute top-0 right-4 min-w-3.5 h-3.5 rounded-full bg-[#FF4FA3] text-[7px] font-mono text-white flex items-center justify-center font-bold px-0.5">
                  {wishlistCount}
                </span>
              )}
              <span className={`text-[8px] font-mono tracking-wider uppercase font-semibold ${isActive ? 'text-[#FF4FA3]' : 'text-gray-400'}`}>
                {btn.label}
              </span>
            </button>
          )
        })}
      </div>
    </>
  );
}
