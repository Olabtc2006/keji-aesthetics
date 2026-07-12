/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  ShoppingBag,
  Star,
  Sparkles,
  RefreshCw,
  BadgePercent
} from 'lucide-react';
import { Product, CategorySlug } from '../types';
import { api } from '../lib/supabase';
import ThreeDCard from '../components/ThreeDCard';

interface ShopProps {
  initialSearchQuery?: string;
  initialCategory?: CategorySlug | 'all';
  initialFilter?: 'all' | 'flash-sale' | 'featured' | 'new-arrivals';
  onSelectProduct: (productId: string) => void;
  onAddToCart: (product: Product, quantity: number, size?: string, color?: string) => void;
  onAddToWishlist: (product: Product) => void;
  wishlistProducts: string[];
}

export default function Shop({
  initialSearchQuery = '',
  initialCategory = 'all',
  initialFilter = 'all',
  onSelectProduct,
  onAddToCart,
  onAddToWishlist,
  wishlistProducts
}: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering & Sorting State
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>(initialCategory);
  const [activeFilter, setActiveFilter] = useState<'all' | 'flash-sale' | 'featured' | 'new-arrivals'>(initialFilter);
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'rating'>('recent');
  const [maxPrice, setMaxPrice] = useState<number>(100000);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Parse URL queries on load/navigate
    setSearchQuery(initialSearchQuery);
    setSelectedCategory(initialCategory);
    setActiveFilter(initialFilter);
  }, [initialSearchQuery, initialCategory, initialFilter]);

  useEffect(() => {
    setLoading(true);
    api.fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories: { label: string; value: CategorySlug | 'all' }[] = [
    { label: 'All Premium Items', value: 'all' },
    { label: 'Unisex Apparel', value: 'unisex-wears' },
    { label: 'Intimate Wear', value: 'underwear' },
    { label: 'Designer Bags', value: 'bags' },
    { label: 'Luxe Jewelry', value: 'jewelry' },
    { label: 'Home Ornaments', value: 'home-decor' },
    { label: 'Aura Accessories', value: 'accessories' },
    { label: 'Head Wears', value: 'head-wears' },
    { label: 'Digital Assets', value: 'digital-assets' },
    { label: 'Surprise Packages', value: 'surprise-packages' },
  ];

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveFilter('all');
    setSortBy('recent');
    setMaxPrice(100000);
  };

  // Perform client side query pipeline
  const filteredProducts = products
    .filter((p) => {
      // 1. Search Query text check
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      // 2. CategorySlug filter check
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // 3. Campaign Type filter check (Flash Sales, Featured, etc)
      if (activeFilter === 'flash-sale' && !p.isFlashSale) return false;
      if (activeFilter === 'featured' && !p.isFeatured) return false;
      if (activeFilter === 'new-arrivals' && !p.isNewArrival) return false;

      // 4. Maximum Price constraints
      if (p.price > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      // 5. Apply sorting metric
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // default recent ordering
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      {/* Visual neon light splashes */}
      <div className="absolute top-12 left-0 w-80 h-80 bg-[#FF4FA3]/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-0 w-96 h-96 bg-[#FFD84D]/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 select-none">
        
        {/* Editorial Heading Grid */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-10 mb-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-[#FF4FA3] uppercase font-bold">
            The Digital High Store
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase leading-none">
            AESTHETIC <span className="text-[#FFD84D]">COLLECTIONS</span>
          </h1>
          <p className="text-gray-400 text-xs md:text-sm font-light max-w-xl">
            Explore our comprehensive inventory of unisex fashion apparel, cozy lingerie, structured modular bags, jewelry charms, home décor, digital presets, and mystery packages.
          </p>
        </div>

        {/* Filters Top Control Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#0F0F13]/55 border border-white/5 p-4 rounded-2xl mb-8 backdrop-blur-md">
          {/* Quick Category tabs roll */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0 scrollbar-none max-w-full">
            <button
              onClick={() => {
                setShowFilters(!showFilters);
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all border ${
                showFilters
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/3 border-transparent text-gray-400 hover:text-white'
              } cursor-pointer`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Configure</span>
            </button>

            {/* Main filter categories shortcut buttons */}
            <div className="h-4 w-[1px] bg-white/10" />

            {['all', 'flash-sale', 'featured', 'new-arrivals'].map((opt) => (
              <button
                key={opt}
                onClick={() => setActiveFilter(opt as any)}
                className={`py-2 px-4 rounded-xl text-[10px] font-mono tracking-widest uppercase shrink-0 transition-colors cursor-pointer border ${
                  activeFilter === opt
                    ? 'bg-[#FF4FA3] border-[#FF4FA3] text-white shadow-[0_0_10px_rgba(255,79,163,0.25)]'
                    : 'bg-white/3 border-transparent hover:bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {opt.replace('-', ' ')}
              </button>
            ))}
          </div>

          {/* Quick Search and sort bounds */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Inner dynamic pricing sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-xs font-mono text-gray-300 focus:outline-none focus:border-[#FF4FA3]/50 cursor-pointer"
            >
              <option value="recent">Sort: New Drop</option>
              <option value="price-asc">Sort: Price Low → High</option>
              <option value="price-desc">Sort: Price High → Low</option>
              <option value="rating">Sort: High Ratings</option>
            </select>

            {/* Layout gauge indicator */}
            <div className="flex items-center gap-2 p-1 bg-black/40 border border-white/10 rounded-xl text-gray-500">
              <span className="p-1 text-white bg-white/15 rounded-lg">
                <LayoutGrid className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Deep Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-[#0F0F14]/50 border border-white/5 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-8 scale-in-animation select-none">
            {/* Category column */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#FFD84D]">
                Select Department
              </h4>
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`text-left text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer ${
                      selectedCategory === cat.value
                        ? 'text-[#FF4FA3] bg-[#FF4FA3]/5 font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/3'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter input inside box */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#FF4FA3]">
                Keywords Search
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="e.g. Hoodie, silk, bag, gold..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-4 pr-10 text-xs text-white focus:outline-none focus:border-[#FF4FA3]/50 focus:ring-none"
                />
                <Search className="w-4 h-4 text-gray-500 absolute right-3 top-3" />
              </div>
            </div>

            {/* Price slider constraints */}
            <div className="flex flex-col gap-3">
              <h4 className="text-[10px] uppercase font-mono tracking-[0.2em] text-gray-400">
                Max Price: <span className="font-mono text-[#FFD84D] font-bold">₦{maxPrice.toLocaleString()}</span>
              </h4>
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#FF4FA3]"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>₦5,000</span>
                <span>₦100,000</span>
              </div>
            </div>

            {/* Clear Filters Reset */}
            <div className="flex flex-col items-center justify-center border-l md:border-l border-white/5 pl-4 gap-3">
              <span className="text-[10px] text-gray-500 text-center">
                Refine back to initial brand specifications.
              </span>
              <button
                onClick={resetAllFilters}
                className="w-full flex items-center justify-center gap-1.5 bg-white/5 border border-white/10 text-xs font-mono text-white py-2.5 rounded-xl uppercase tracking-widest hover:bg-white/10 hover:text-[#FF4FA3] hover:border-[#FF4FA3]/30 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Values
              </button>
            </div>
          </div>
        )}

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-8 h-8 rounded-full border-t-2 border-[#FF4FA3] border-r-2 border-transparent animate-spin mb-4" />
            <span className="text-xs font-mono text-gray-500">Loading Keji catalog assets...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div>
            {/* Products grid count tag */}
            <div className="text-[10px] font-mono text-gray-500 mb-6 uppercase tracking-widest">
              Displaying {filteredProducts.length} Premium curations
            </div>

            {/* Storefront Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((p) => {
                const wishlisted = wishlistProducts.includes(p.id);
                return (
                  <ThreeDCard
                    key={p.id}
                    id={`shop-card-${p.id}`}
                    className="group relative bg-[#0D0D11] border border-white/5 hover:border-[#FF4FA3]/20 rounded-2xl p-4 flex flex-col gap-4 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transition-all h-full"
                  >
                    {/* Campaign ribbon badge */}
                    {p.isFlashSale && (
                      <div className="absolute top-6 left-6 z-10 bg-[#FF4FA3] text-white text-[8px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                        Flame Drop
                      </div>
                    )}
                    {p.isNewArrival && !p.isFlashSale && (
                      <div className="absolute top-6 left-6 z-10 bg-[#FFD84D] text-[#000] text-[8px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full uppercase">
                        New
                      </div>
                    )}

                    {/* Image frame */}
                    <div
                      onClick={() => onSelectProduct(p.id)}
                      className="relative h-64 rounded-xl overflow-hidden bg-neutral-900 border border-white/5 cursor-pointer"
                    >
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 border border-white/20 bg-black/40 rounded-full text-[10px] font-mono tracking-widest uppercase text-white hover:border-white transition-all">
                          Quick View
                        </span>
                      </div>
                    </div>

                    {/* Detail descriptors */}
                    <div className="flex flex-col gap-1 flex-1">
                      <span className="text-gray-500 text-[9px] uppercase font-mono tracking-widest">
                        {p.category.replace('-', ' ')}
                      </span>
                      <h3
                        onClick={() => onSelectProduct(p.id)}
                        className="text-white text-xs font-semibold uppercase tracking-wider truncate hover:text-[#FF4FA3] cursor-pointer transition-colors"
                      >
                        {p.name}
                      </h3>

                      {/* Stars */}
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-[#FFD84D] fill-[#FFD84D]" />
                        <span className="text-[10px] font-mono text-gray-400">
                          {p.rating}
                        </span>
                      </div>

                      {/* Display Pricing */}
                      <div className="flex items-baseline gap-2 mt-2">
                        <span className="font-mono text-[#FF4FA3] font-black text-sm">
                          ₦{p.price.toLocaleString()}
                        </span>
                        {p.originalPrice && (
                          <span className="font-mono text-gray-600 line-through text-[10px]">
                            ₦{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Shopping Trigger items */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => onAddToCart(p, 1)}
                        className="flex-1 bg-white/5 hover:bg-[#FF4FA3]/15 hover:border-[#FF4FA3]/30 border border-white/10 rounded-xl py-2.5 text-[10px] font-mono tracking-widest uppercase text-white transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer animate-fade-in"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#FF4FA3]" />
                        Buy
                      </button>
                      <button
                        onClick={() => onAddToWishlist(p)}
                        className={`px-3 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:border-[#FF4FA3] ${
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
        ) : (
          /* Empty storefront state */
          <div className="text-center py-32 flex flex-col items-center justify-center gap-4 bg-[#0F0F13]/20 border border-white/5 rounded-3xl p-8">
            <Sparkles className="w-10 h-10 text-gray-600 animate-pulse" />
            <h3 className="text-lg uppercase tracking-widest font-mono text-[#FFD84D] font-bold">
              Collections Empty
            </h3>
            <p className="text-xs text-gray-500 max-w-sm leading-relaxed">
              We couldn't search or find any premium curations matching your specific filters. Try expanding your search queries or resetting filters.
            </p>
            <button
              onClick={resetAllFilters}
              className="mt-2 px-6 py-2.5 bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest uppercase rounded-full hover:text-[#FF4FA3] hover:border-[#FF4FA3]/40 transition-all cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
