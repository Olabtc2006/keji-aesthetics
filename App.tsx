/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Categories from './pages/Categories';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Wishlist from './pages/Wishlist';
import Account from './pages/Account';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AdminDashboard from './pages/AdminDashboard';
import { Product, OrderItem, UserProfile, CategorySlug } from './types';
import IntroAnimation from './components/IntroAnimation';
import { AnimatePresence } from 'motion/react';

export default function App() {
  // Intro splash animation state
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      const alreadyPlayed = sessionStorage.getItem('keji_has_played_intro_splash');
      return alreadyPlayed !== 'true';
    } catch {
      return true;
    }
  });

  // Routing & Parameters state
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<CategorySlug | 'all'>('all');
  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>('');
  const [activeFilterTab, setActiveFilterTab] = useState<'all' | 'flash-sale' | 'featured' | 'new-arrivals'>('all');

  // Shopping States (With local storage bindings for persistent clients)
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  // Initialize and load client persistent states
  useEffect(() => {
    try {
      const persistedCart = localStorage.getItem('keji_cart_items');
      const persistedWishlist = localStorage.getItem('keji_wishlist_ids');
      const persistedUser = localStorage.getItem('keji_user_profile');

      if (persistedCart) setCartItems(JSON.parse(persistedCart));
      if (persistedWishlist) setWishlistIds(JSON.parse(persistedWishlist));
      if (persistedUser) setUserProfile(JSON.parse(persistedUser));
    } catch (err) {
      console.error('Error parsing client cache:', err);
    }
  }, []);

  // Sync state helpers
  const saveCartToStorage = (items: OrderItem[]) => {
    setCartItems(items);
    localStorage.setItem('keji_cart_items', JSON.stringify(items));
  };

  const saveWishlistToStorage = (ids: string[]) => {
    setWishlistIds(ids);
    localStorage.setItem('keji_wishlist_ids', JSON.stringify(ids));
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, size?: string, color?: string) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    let updatedCart = [...cartItems];

    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: quantity,
        selectedSize: size,
        selectedColor: color
      });
    }

    saveCartToStorage(updatedCart);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, size?: string, color?: string) => {
    const updated = cartItems.map((item) => {
      if (
        item.productId === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
      ) {
        return { ...item, quantity: quantity };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  const handleRemoveFromCart = (productId: string, size?: string, color?: string) => {
    const updated = cartItems.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.selectedSize === size &&
          item.selectedColor === color
        )
    );
    saveCartToStorage(updated);
  };

  const handleSaveForLater = (productId: string, size?: string, color?: string) => {
    // 1. Find product info
    const cartItem = cartItems.find(
      (item) =>
        item.productId === productId &&
        item.selectedSize === size &&
        item.selectedColor === color
    );

    if (cartItem) {
      // Add to wishlist if not already bookmarked
      if (!wishlistIds.includes(productId)) {
        const updatedWish = [...wishlistIds, productId];
        saveWishlistToStorage(updatedWish);
      }
      // Remove from cart
      handleRemoveFromCart(productId, size, color);
    }
  };

  const handleClearCart = () => {
    saveCartToStorage([]);
  };

  // Wishlist operations
  const handleAddToWishlist = (product: Product) => {
    let updatedWishlist = [...wishlistIds];
    const index = updatedWishlist.indexOf(product.id);

    if (index > -1) {
      updatedWishlist.splice(index, 1); // remove
    } else {
      updatedWishlist.push(product.id); // add
    }

    saveWishlistToStorage(updatedWishlist);
  };

  const handleRemoveFromWishlist = (productId: string) => {
    const updated = wishlistIds.filter((id) => id !== productId);
    saveWishlistToStorage(updated);
  };

  const handleMoveFromWishlistToCart = (product: Product) => {
    // Add default sizes
    const size = product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined;
    const color = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;

    handleAddToCart(product, 1, size, color);
    handleRemoveFromWishlist(product.id);
  };

  // Auth Operations
  const handleLoginSuccess = (profile: UserProfile) => {
    setUserProfile(profile);
    localStorage.setItem('keji_user_profile', JSON.stringify(profile));
  };

  const handleLogout = () => {
    setUserProfile(null);
    localStorage.removeItem('keji_user_profile');
  };

  // Navigation router routing trigger
  const handleNavigate = (page: string) => {
    // Check if there are query parameters (e.g. shop?q=hoodie)
    if (page.includes('?')) {
      const [path, urlQuery] = page.split('?');
      const params = new URLSearchParams(urlQuery);
      
      if (path === 'shop') {
        const queryTerm = params.get('q');
        const filterTerm = params.get('filter');
        const catTerm = params.get('category');
        
        if (queryTerm) {
          setCurrentSearchQuery(decodeURIComponent(queryTerm));
          setSelectedCategorySlug('all');
          setActiveFilterTab('all');
        } else if (filterTerm) {
          setCurrentSearchQuery('');
          setSelectedCategorySlug('all');
          setActiveFilterTab(filterTerm as any);
        } else if (catTerm) {
          setCurrentSearchQuery('');
          setSelectedCategorySlug(catTerm as CategorySlug);
          setActiveFilterTab('all');
        }
      }
      
      setCurrentPage(path);
    } else {
      // Clear searches if clicking shop menu item with no parameters
      if (page === 'shop') {
        setCurrentSearchQuery('');
        setSelectedCategorySlug('all');
        setActiveFilterTab('all');
      }
      setCurrentPage(page);
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (productId: string) => {
    // Log recently viewed inside localStorage trace
    try {
      const viewed: string[] = JSON.parse(localStorage.getItem('keji_recently_viewed') || '[]');
      const filtered = [productId, ...viewed.filter((id) => id !== productId)].slice(0, 8);
      localStorage.setItem('keji_recently_viewed', JSON.stringify(filtered));
    } catch (e) {
      console.error(e);
    }

    setSelectedProductId(productId);
    setCurrentPage('product-details'); // directly update so query states don't conflict
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCategory = (slug: CategorySlug) => {
    setSelectedCategorySlug(slug);
    setCurrentSearchQuery('');
    setActiveFilterTab('all');
    handleNavigate('shop');
  };

  const handleSearchTrigger = (query: string) => {
    setCurrentSearchQuery(query);
    setSelectedCategorySlug('all');
    setActiveFilterTab('all');
    handleNavigate('shop');
  };

  // Calculate cart items total aggregates
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-[#0D0D0D] text-white min-h-screen flex flex-col font-sans selection:bg-[#FF4FA3] selection:text-white relative">
      
      {/* Cinematic Intro Splash Animation */}
      <AnimatePresence>
        {showIntro && (
          <IntroAnimation
            key="intro-animation"
            onComplete={() => {
              setShowIntro(false);
              sessionStorage.setItem('keji_has_played_intro_splash', 'true');
            }}
          />
        )}
      </AnimatePresence>

      {/* 1. Navbar Navigation Module */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        onSearchSelectProduct={handleSelectProduct}
        userEmail={userProfile?.email}
        userRole={userProfile?.role}
        onLogout={handleLogout}
      />

      {/* 2. Primary Page Components Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <Home
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlistProducts={wishlistIds}
            onNavigateCategory={handleNavigateCategory}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'shop' && (
          <Shop
            initialSearchQuery={currentSearchQuery}
            initialCategory={selectedCategorySlug}
            initialFilter={activeFilterTab}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlistProducts={wishlistIds}
          />
        )}

        {currentPage === 'categories' && (
          <Categories onNavigateCategory={handleNavigateCategory} />
        )}

        {currentPage === 'product-details' && (
          <ProductDetails
            productId={selectedProductId}
            onBack={() => handleNavigate('shop')}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
            wishlistProducts={wishlistIds}
            onSelectProduct={handleSelectProduct}
            userProfile={userProfile}
          />
        )}

        {currentPage === 'cart' && (
          <Cart
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={handleRemoveFromCart}
            onSaveForLater={handleSaveForLater}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'checkout' && (
          <Checkout
            cartItems={cartItems}
            onClearCart={handleClearCart}
            userEmail={userProfile?.email}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'wishlist' && (
          <Wishlist
            wishlistIds={wishlistIds}
            onRemoveFromWishlist={handleRemoveFromWishlist}
            onMoveToCart={handleMoveFromWishlistToCart}
            onSelectProduct={handleSelectProduct}
            onNavigate={handleNavigate}
          />
        )}

        {currentPage === 'account' && (
          <Account
            onNavigate={handleNavigate}
            onLoginSuccess={handleLoginSuccess}
            userProfile={userProfile}
            onLogout={handleLogout}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentPage === 'about-us' && <AboutUs />}

        {currentPage === 'contact-us' && <ContactUs />}

        {currentPage === 'admin' && (
          <AdminDashboard userProfile={userProfile} onNavigate={handleNavigate} />
        )}
      </main>

      {/* 3. Footer Segment */}
      <Footer onNavigate={handleNavigate} onNavigateCategory={handleNavigateCategory} />
    </div>
  );
}
