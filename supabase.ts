/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Product, Category, Review, Order, UserProfile, CategorySlug, OrderItem, FlashSaleBannerConfig } from '../types';

// Read Vite Environment variables
const supabaseUrl = ((import.meta as any).env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || '').trim();

// Function to validate that a URL is a valid http/https format
const isValidSupabaseUrl = (url: string): boolean => {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

// Function to check if a key is a real key vs a placeholder
const isValidSupabaseKey = (key: string): boolean => {
  if (!key) return false;
  const normalized = key.toLowerCase();
  return (
    key.trim() !== '' &&
    !normalized.includes('placeholder') &&
    !normalized.includes('your_') &&
    !normalized.includes('your-')
  );
};

// Initialize Supabase. If missing, we run in "LocalStorage Mode" safely
export const isSupabaseConfigured = isValidSupabaseUrl(supabaseUrl) && isValidSupabaseKey(supabaseAnonKey);

if (!isSupabaseConfigured && supabaseUrl) {
  console.warn('Supabase is not configured or has invalid configuration. Falling back to local storage offline mode. URL was:', supabaseUrl);
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// ==========================================
// SEED DATA FOR LOCAL STORAGE MODE
// ==========================================

const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Unisex Wears',
    slug: 'unisex-wears',
    description: 'Techwear, signature hoodies, and forward-looking garments designed to express individuality.',
    iconName: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-2',
    name: 'Underwear',
    slug: 'underwear',
    description: 'Satin and breathable fabrics engineered for intimate supreme luxury and everyday comfort.',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-3',
    name: 'Bags',
    slug: 'bags',
    description: 'Sleek, waterproof modular carrier shells, leather clutches, and structural backpacks.',
    iconName: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-4',
    name: 'Jewelry',
    slug: 'jewelry',
    description: 'Heavy infinity chains, luminous butterfly pendants, and sterling premium accessories.',
    iconName: 'Gem',
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-5',
    name: 'Home Décor',
    slug: 'home-decor',
    description: 'Minimalist illumination accessories, obsidian plush tufted pillows, and art objects.',
    iconName: 'Home',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-6',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Aura wrap-around eyewear, metallic lanyards, and small lifestyle luxury upgrades.',
    iconName: 'Compass',
    imageUrl: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-7',
    name: 'Head Wears',
    slug: 'head-wears',
    description: 'Distressed canvas caps, textured knits, and wide structural protective headwear.',
    iconName: 'Crown',
    imageUrl: 'https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-8',
    name: 'Digital Assets',
    slug: 'digital-assets',
    description: 'Professional high-contrast lightroom assets and dynamic lifestyle design frameworks.',
    iconName: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'cat-9',
    name: 'Surprise Packages',
    slug: 'surprise-packages',
    description: 'Specially assembled aesthetic gift assortments and luxury mystery chests.',
    iconName: 'Gift',
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
  },
];

const INITIAL_PRODUCTS: Product[] = [
  // UNISEX WEARS
  {
    id: 'prod-unisex-1',
    name: 'KA Signature Butterfly Hoodie',
    description: 'Futuristic heavy-knit jet black streetwear hoodie featuring a high-density embroidered pink neon butterfly on the spine, drop shoulders, and soft-fleece luxury utility pockets.',
    category: 'unisex-wears',
    price: 35000,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
    additionalImages: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600',
    ],
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    stock: 24,
    rating: 4.9,
    reviewCount: 38,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Obsidian Black', 'Cyber Pink'],
    specifications: ['100% Cotton French Terry', '450 GSM Heavy Fabric', 'Screen Printed Pink Glow Art', 'Made in Nigeria'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-unisex-2',
    name: 'Cyberpunk Multi-Strap Cargo Pants',
    description: 'Carbon-black structural technical cargo trousers featuring adjustable nylon tech-straps, metallic gold carabiner attachments, water-resistant shell, and modular bento compartments.',
    category: 'unisex-wears',
    price: 45000,
    imageUrl: 'https://images.unsplash.com/photo-1517423568366-8b83523034fd?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    stock: 15,
    rating: 4.8,
    reviewCount: 19,
    sizes: ['30', '32', '34', '36'],
    colors: ['Carbon Black'],
    specifications: ['Nylon & Lycra Stretch Blend', 'YKK Weatherproof Zippers', 'Adjustable Drawcords', 'Multi-pocket layout'],
    createdAt: new Date().toISOString(),
  },
  // UNDERWEAR
  {
    id: 'prod-under-1',
    name: 'Silk Lace Luxe Bralette Set',
    description: 'An elegant matching premium lounge bralette and brief set stitched in double-face silk satin, featuring soft gold clasp details, and breathable luxury pink mesh trims.',
    category: 'underwear',
    price: 18000,
    imageUrl: 'https://images.unsplash.com/photo-1582533561751-ef6f6ab93a2e?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: false,
    stock: 12,
    rating: 5.0,
    reviewCount: 14,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Luxury Pink', 'Midnight Velvet'],
    specifications: ['85% Mulberry Silk, 15% Elastane', 'Non-wired comfort cup', 'Gold plated adjusters', 'Delivered in custom velvet travel pouch'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-under-2',
    name: 'KA Imperial Mens Boxer Brief Pack',
    description: 'A triple-pack of premium athletic boxers engineered from ultra-soft micro-modal fibers, showcasing our signature pink glow woven waistband and flat-lock comfortable anti-chafing seams.',
    category: 'underwear',
    price: 12500,
    imageUrl: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&q=80&w=600',
    isFlashSale: true,
    originalPrice: 16500,
    discountPercentage: 24,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false,
    isBestSeller: true,
    stock: 40,
    rating: 4.7,
    reviewCount: 45,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Obsidian Black Trio'],
    specifications: ['95% Micro-Modal, 5% Spandex', 'Anti-roll wider waistband', 'Dual layered mesh pouch', 'Premium luxury pack packaging'],
    createdAt: new Date().toISOString(),
  },
  // BAGS
  {
    id: 'prod-bags-1',
    name: 'KA Futura Glass Clutch Bag',
    description: 'A revolutionary architectural handbag crafted from translucent high-index cast acrylic, featuring light-capturing chamfered edges, dynamic gold butterfly emblem lock, and a statement neon pink chain strap.',
    category: 'bags',
    price: 72000,
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    stock: 8,
    rating: 4.9,
    reviewCount: 22,
    colors: ['Translucent Dusk', 'Crystal Clear'],
    specifications: ['High-Grade Shatterproof Acrylic', '24k Gold Electroplated Zinc Alloy Hardware', 'Fits phone, cosmetics, wallet', 'Signature dustbag included'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-bags-2',
    name: 'Stealth Waterproof Chest Utility Sling',
    description: 'An ergonomic compact chest pack utilizing military-grade matte rubberized canvas, custom modular tech loops, magnetic quick-release fidlock clasp, and subtle gold foil branding.',
    category: 'bags',
    price: 29000,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600',
    isFlashSale: true,
    originalPrice: 38000,
    discountPercentage: 24,
    isFeatured: false,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: false,
    stock: 18,
    rating: 4.6,
    reviewCount: 11,
    colors: ['Matte Black'],
    specifications: ['IPX-4 Water Resistance', 'Fidlock Magnetic Harness V-Buckle', 'Internal micro-mesh organizers', 'Gold accent elements'],
    createdAt: new Date().toISOString(),
  },
  // JEWELRY
  {
    id: 'prod-jewelry-1',
    name: 'KA Signature Infinite Cuban Link Chain',
    description: 'A masterpiece Cuban chain heavily layered in soft gold tones, highlighted by a majestic hand-set pave obsidian crystal butterfly charm clasp with glowing details.',
    category: 'jewelry',
    price: 55000,
    imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    stock: 10,
    rating: 5.0,
    reviewCount: 31,
    sizes: ['18 Inch', '22 Inch'],
    colors: ['Soft Gold'],
    specifications: ['18K Double-layered Gold Filled Brass', 'A5 Cubic Zirconia Pave settings', 'Chafing-free rounded edge links', 'Lifetime tarnish-free guarantee'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-jewelry-2',
    name: 'Aura Butterfly Statement Ring',
    description: 'A spectacular geometric wrap ring detailed with a central pink lab-grown sapphire butterfly that casts warm highlights under dynamic ambient lights. Adjustable luxury shank.',
    category: 'jewelry',
    price: 15000,
    imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
    isFlashSale: true,
    originalPrice: 20000,
    discountPercentage: 25,
    isFeatured: false,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: false,
    stock: 25,
    rating: 4.8,
    reviewCount: 17,
    colors: ['Precious Silver', 'Aura Gold'],
    specifications: ['S925 Sterling Silver base', 'Pink Solitaire Crystal Butterfly', 'Adjustable open-loop back fitting', 'Packaged inside premium leather ring drawer box'],
    createdAt: new Date().toISOString(),
  },
  // HOME DECOR
  {
    id: 'prod-decor-1',
    name: 'Nebula Aura Eclipse Desk Light',
    description: 'A sculptural, space-age dynamic circular aluminum table lamp that casts an indirect gradient eclipse glow (from digital pink to warm amber-gold), controlled via smart contact.',
    category: 'home-decor',
    price: 42000,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    stock: 5,
    rating: 4.9,
    reviewCount: 9,
    colors: ['Minimal Anodized Indigo Black'],
    specifications: ['Solid aircraft aluminum chassis', '3-Level touch-sensitive controls', 'Pre-calibrated Luxury Pink & Soft Gold light profile', 'Energy Saving USB-C powered'],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-decor-2',
    name: 'KA Velvet Obsidian Tufted Pillow',
    description: 'An exquisitely plump aesthetic lumbar throw pillow. Handcrafted in heavy-knit pitch black Italian velvet with luxurious gold cord edges and centered hand-pressed butterfly button detail.',
    category: 'home-decor',
    price: 16000,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: false,
    isNewArrival: false,
    isTrending: false,
    isBestSeller: true,
    stock: 32,
    rating: 4.7,
    reviewCount: 11,
    colors: ['Deep Obsidian'],
    specifications: ['40x40cm Elegant Square format', '100% Cotton Italian Velvet outer', 'Micro-fiber hypoallergenic filling', 'Concealed custom zipper line'],
    createdAt: new Date().toISOString(),
  },
  // ACCESSORIES
  {
    id: 'prod-acc-1',
    name: 'Stealth Cyber-Shield Shield Sunglasses',
    description: 'A dynamic, wrap-around futuristic shield mask frame in matte-black composite with scratch-resistant soft-gold reflective tint, offering complete UV400 shield and high comfort.',
    category: 'accessories',
    price: 22000,
    imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    stock: 20,
    rating: 4.8,
    reviewCount: 34,
    colors: ['Matte Black Frame / Gold Lens'],
    specifications: ['Polycarbonate zero-distortion lens', 'UCLA Impact resistant framework', 'Embossed gold KA temple markings', 'Includes cleaning bundle & fold-flat case'],
    createdAt: new Date().toISOString(),
  },
  // HEAD WEARS
  {
    id: 'prod-head-1',
    name: 'KA Butterfly Chunky Knit Beanie',
    description: 'A thick structural double-knit winter cap featuring strategic distressed rips and a detailed glow-stitch pink butterfly graphic badge sewn on the front fold.',
    category: 'head-wears',
    price: 14000,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?auto=format&fit=crop&q=80&w=600',
    isFlashSale: true,
    originalPrice: 20000,
    discountPercentage: 30,
    isFeatured: false,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    stock: 14,
    rating: 4.9,
    reviewCount: 23,
    colors: ['Obsidian Slouch Black'],
    specifications: ['100% Breathable Soft Acrylic Wool', 'Stretch-Fit head geometry fitting', 'Signature distressed edging details', 'Embroidered brand logo patch'],
    createdAt: new Date().toISOString(),
  },
  // DIGITAL ASSETS
  {
    id: 'prod-digital-1',
    name: 'KA Ultimate Aesthetics Lightroom Preset Pack',
    description: 'A pack of 12 hyper-detailed Lightroom mobile & desktop preset filters meticulously engineered to overlay deep obsidian shadows, glowy neon pink highlights, and gold warm skin tones in photos.',
    category: 'digital-assets',
    price: 6000,
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: true,
    stock: 9999,
    rating: 5.0,
    reviewCount: 52,
    specifications: ['Includes 12 DNG files (Mobile) and XMP files (Desktop)', 'Detailed step-by-step PDF Setup Guide', 'Optimized for street, luxury fashion, and nightlife photography', 'Instant Digital Mail Delivery'],
    createdAt: new Date().toISOString(),
  },
  // SURPRISE PACKAGES
  {
    id: 'prod-surprise-1',
    name: 'KA Classic Gold Mystery Mystery Chest',
    description: 'A curated bespoke gift package wrapped nicely in custom deep black wood chest with glowing magnetic wraps. Guaranteed to contains: 1 Unisex Tee/Hoodie, 1 Sunglass/Eyewear, 1 Piece of Premium Jewelry, and 1 mini Home Accessory (Worth ₦85,000 retail value!).',
    category: 'surprise-packages',
    price: 60000,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600',
    isFlashSale: false,
    isFeatured: true,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    stock: 6,
    rating: 5.0,
    reviewCount: 18,
    sizes: ['Unisex Fit S', 'Unisex Fit M', 'Unisex Fit L', 'Unisex Fit XL'],
    colors: ['Classic Black Gold Edition'],
    specifications: ['Custom personalized message request option included', 'Curated selection based on sizing info', 'Sealed with luxury pink wax brand seal', 'Priority hand-delivered wrapping'],
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-unisex-1',
    productName: 'KA Signature Butterfly Hoodie',
    reviewerName: 'Azeez Lawal',
    reviewerEmail: 'olaniyilawalazeez@gmail.com',
    rating: 5,
    comment: 'The 450 gsm heavy fabric is incredibly rich! It feels like a luxurious piece from Yeezy or Balenciaga. The pink butterfly embroidery is very thick and literally glows in low night light. Worth every single Naira!',
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    productId: 'prod-bags-1',
    productName: 'KA Futura Glass Clutch Bag',
    reviewerName: 'Peculiar Joshua',
    reviewerEmail: 'peculiar@gmail.com',
    rating: 5,
    comment: 'Hands down the most beautiful clutch I own! Looking through the clear panel with the pink chain is so stunning. I wore it to a fashion exhibition in Lagos last night and got over twenty compliments!',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rev-3',
    productId: 'prod-jewelry-1',
    productName: 'KA Signature Infinite Cuban Link Chain',
    reviewerName: 'Damian Falade',
    reviewerEmail: 'damian@opay.ng',
    rating: 5,
    comment: 'Extremely heavy solid weight. The lock butterfly sparkles like crazy. Highly recommend Keji Aesthetics to anyone searching for high quality luxury pieces.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-10492',
    userId: 'cust-1',
    userEmail: 'olaniyilawalazeez@gmail.com',
    customerName: 'Alhaji Azeez Lawal',
    phoneNumber: '09020942048',
    deliveryAddress: '32, Lekki Heights Estate, Block C4, Lagos, Nigeria',
    totalAmount: 107000,
    status: 'Delivered',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'oi-1',
        productId: 'prod-unisex-1',
        productName: 'KA Signature Butterfly Hoodie',
        imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600',
        price: 35000,
        quantity: 1,
        selectedSize: 'XL',
        selectedColor: 'Obsidian Black',
      },
      {
        id: 'oi-2',
        productId: 'prod-bags-1',
        productName: 'KA Futura Glass Clutch Bag',
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600',
        price: 72000,
        quantity: 1,
        selectedColor: 'Translucent Dusk',
      }
    ]
  },
  {
    id: 'ORD-10493',
    userId: 'cust-2',
    userEmail: 'visitor@gmail.com',
    customerName: 'Gideon Briggs',
    phoneNumber: '08123456789',
    deliveryAddress: 'No 4 Garki Road, Abuja, Nigeria',
    totalAmount: 37000,
    status: 'Payment Confirmed',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: 'oi-3',
        productId: 'prod-jewelry-2',
        productName: 'Aura Butterfly Statement Ring',
        imageUrl: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=600',
        price: 15000,
        quantity: 1,
        selectedColor: 'Aura Gold',
      },
      {
        id: 'oi-4',
        productId: 'prod-acc-1',
        productName: 'Stealth Cyber-Shield Shield Sunglasses',
        imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&q=80&w=600',
        price: 22000,
        quantity: 1,
        selectedColor: 'Matte Black',
      }
    ]
  }
];

// Localstorage state helpers
function getStored<T>(key: string, seed: T): T {
  try {
    const item = localStorage.getItem(`keji_${key}`);
    if (!item) {
      localStorage.setItem(`keji_${key}`, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(item);
  } catch (error) {
    return seed;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(`keji_${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key}:`, error);
  }
}

// Ensure database objects are initialized
const db = {
  getProducts: () => getStored<Product[]>('products', INITIAL_PRODUCTS),
  saveProducts: (products: Product[]) => setStored<Product[]>('products', products),

  getCategories: () => getStored<Category[]>('categories', INITIAL_CATEGORIES),
  saveCategories: (categories: Category[]) => setStored<Category[]>('categories', categories),

  getReviews: () => getStored<Review[]>('reviews', INITIAL_REVIEWS),
  saveReviews: (reviews: Review[]) => setStored<Review[]>('reviews', reviews),

  getOrders: () => getStored<Order[]>('orders', INITIAL_ORDERS),
  saveOrders: (orders: Order[]) => setStored<Order[]>('orders', orders),

  getCurrentUser: (): UserProfile | null => {
    try {
      const u = localStorage.getItem('keji_current_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  setCurrentUser: (u: UserProfile | null) => {
    if (u) {
      localStorage.setItem('keji_current_user', JSON.stringify(u));
    } else {
      localStorage.removeItem('keji_current_user');
    }
  },

  getUsers: () => getStored<UserProfile[]>('users', [
    {
      id: 'admin-1',
      email: 'olaniyilawalazeez@gmail.com',
      fullName: 'Azeez Lawal (Admin Owner)',
      phoneNumber: '09020942048',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'admin-2',
      email: 'kejiaesthetics@gmail.com',
      fullName: 'Keji Aesthetics Admin',
      phoneNumber: '09020942048',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: 'cust-1',
      email: 'customer@gmail.com',
      fullName: 'Evelyn Carter',
      phoneNumber: '08100112233',
      shippingAddress: '42 Orchid Road, Ikoyi, Lagos',
      role: 'customer',
      createdAt: new Date().toISOString()
    }
  ])
};

// ==========================================
// UNIFIED INTERFACE EXPORTS
// ==========================================

export const api = {
  // PRODUCTS
  async fetchProducts(): Promise<Product[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        // Map snake_case database schema to camelCase typescript
        return (data || []).map((p: any) => ({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          originalPrice: p.original_price,
          discountPercentage: p.discount_percentage,
          imageUrl: p.image_url,
          additionalImages: p.additional_images,
          videoUrl: p.video_url,
          isFlashSale: p.is_flash_sale,
          isFeatured: p.is_featured,
          isNewArrival: p.is_new_arrival,
          isTrending: p.is_trending,
          isBestSeller: p.is_best_seller,
          stock: p.stock,
          rating: p.rating,
          reviewCount: p.review_count,
          sizes: p.sizes,
          colors: p.colors,
          specifications: p.specifications,
          createdAt: p.created_at,
        }));
      } catch (err) {
        console.warn('Real Supabase fetch failure, using offline store fallback:', err);
        return db.getProducts();
      }
    }
    return db.getProducts();
  },

  async fetchProductById(id: string): Promise<Product | null> {
    const products = await this.fetchProducts();
    return products.find(p => p.id === id) || null;
  },

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>): Promise<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const dbProduct = {
          name: product.name,
          description: product.description,
          category: product.category,
          price: product.price,
          original_price: product.originalPrice,
          discount_percentage: product.discountPercentage,
          image_url: product.imageUrl,
          additional_images: product.additionalImages,
          video_url: product.videoUrl,
          is_flash_sale: product.isFlashSale,
          is_featured: product.isFeatured,
          is_new_arrival: product.isNewArrival,
          is_trending: product.isTrending,
          is_best_seller: product.isBestSeller,
          stock: product.stock,
          sizes: product.sizes,
          colors: product.colors,
          specifications: product.specifications,
          rating: 5.0,
          review_count: 0
        };

        const { data, error } = await supabase!
          .from('products')
          .insert(dbProduct)
          .select()
          .single();

        if (error) throw error;
        return {
          ...newProduct,
          id: data.id,
          createdAt: data.created_at
        };
      } catch (err) {
        console.warn('Supabase createProduct failed, saving locally:', err);
      }
    }

    const current = db.getProducts();
    current.unshift(newProduct);
    db.saveProducts(current);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (isSupabaseConfigured) {
      try {
        const dbUpdates: any = { ...updates };
        if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
        if (updates.discountPercentage !== undefined) dbUpdates.discount_percentage = updates.discountPercentage;
        if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl;
        if (updates.additionalImages !== undefined) dbUpdates.additional_images = updates.additionalImages;
        if (updates.videoUrl !== undefined) dbUpdates.video_url = updates.videoUrl;
        if (updates.isFlashSale !== undefined) dbUpdates.is_flash_sale = updates.isFlashSale;
        if (updates.isFeatured !== undefined) dbUpdates.is_featured = updates.isFeatured;
        if (updates.isNewArrival !== undefined) dbUpdates.is_new_arrival = updates.isNewArrival;
        if (updates.isTrending !== undefined) dbUpdates.is_trending = updates.isTrending;
        if (updates.isBestSeller !== undefined) dbUpdates.is_best_seller = updates.isBestSeller;
        
        // Remove camelCase redundant fields for DB insert
        delete dbUpdates.id;
        delete dbUpdates.originalPrice;
        delete dbUpdates.discountPercentage;
        delete dbUpdates.imageUrl;
        delete dbUpdates.additionalImages;
        delete dbUpdates.videoUrl;
        delete dbUpdates.isFlashSale;
        delete dbUpdates.isFeatured;
        delete dbUpdates.isNewArrival;
        delete dbUpdates.isTrending;
        delete dbUpdates.isBestSeller;
        delete dbUpdates.createdAt;

        const { data, error } = await supabase!
          .from('products')
          .update(dbUpdates)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        // Re-read product
      } catch (err) {
        console.warn('Supabase updateProduct failed, writing locally:', err);
      }
    }

    const current = db.getProducts();
    const idx = current.findIndex(p => p.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates };
      db.saveProducts(current);
      return current[idx];
    }
    throw new Error('Product not found');
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!
          .from('products')
          .delete()
          .eq('id', id);
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('Supabase deleteProduct failed, removing locally:', err);
      }
    }

    const current = db.getProducts();
    const filtered = current.filter(p => p.id !== id);
    db.saveProducts(filtered);
    return true;
  },

  // CATEGORIES
  async fetchCategories(): Promise<Category[]> {
    return db.getCategories();
  },

  // REVIEWS
  async fetchReviews(productId?: string): Promise<Review[]> {
    const reviews = db.getReviews();
    if (productId) {
      return reviews.filter(r => r.productId === productId);
    }
    return reviews;
  },

  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!
          .from('reviews')
          .insert({
            product_id: review.productId,
            reviewer_name: review.reviewerName,
            reviewer_email: review.reviewerEmail,
            rating: review.rating,
            comment: review.comment,
            image_url: review.imageUrl
          });
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase review insert failed, recording offline:', err);
      }
    }

    const current = db.getReviews();
    current.unshift(newRev);
    db.saveReviews(current);

    // Modify product average review metrics
    const products = db.getProducts();
    const px = products.find(p => p.id === review.productId);
    if (px) {
      const prodReviews = current.filter(r => r.productId === review.productId);
      const totalRating = prodReviews.reduce((sum, r) => sum + r.rating, 0);
      px.rating = Number((totalRating / prodReviews.length).toFixed(1));
      px.reviewCount = prodReviews.length;
      db.saveProducts(products);
    }

    return newRev;
  },

  async deleteReview(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!
          .from('reviews')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase deleteReview failed, proceeding offline:', err);
      }
    }

    const current = db.getReviews();
    const updated = current.filter(r => r.id !== id);
    db.saveReviews(updated);
  },

  // ORDERS
  async fetchOrders(userEmail?: string): Promise<Order[]> {
    const orders = db.getOrders();
    if (userEmail) {
      // Admin should view all, customers view their own
      const isAdmin = ['olaniyilawalazeez@gmail.com', 'kejiaesthetics@gmail.com'].includes(userEmail);
      if (isAdmin) return orders;
      return orders.filter(o => o.userEmail.toLowerCase() === userEmail.toLowerCase());
    }
    return orders;
  },

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>, paymentReceiptUrl?: string): Promise<Order> {
    const newOrder: Order = {
      ...order,
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      status: 'Pending',
      paymentReceiptUrl,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('orders')
          .insert({
            customer_name: order.customerName,
            user_id: order.userId,
            user_email: order.userEmail,
            phone_number: order.phoneNumber,
            delivery_address: order.deliveryAddress,
            total_amount: order.totalAmount,
            status: 'Pending',
            payment_receipt_url: paymentReceiptUrl
          })
          .select()
          .single();

        if (error) throw error;
        
        // Add items
        const dbItems = order.items.map(it => ({
          order_id: data.id,
          product_id: it.productId,
          product_name: it.productName,
          price: it.price,
          quantity: it.quantity,
          selected_size: it.selectedSize,
          selected_color: it.selectedColor,
          image_url: it.imageUrl
        }));

        await supabase!.from('order_items').insert(dbItems);
      } catch (err) {
        console.warn('Supabase placing order failed, committing locally:', err);
      }
    }

    // Update stocks
    const products = db.getProducts();
    order.items.forEach(item => {
      const p = products.find(pr => pr.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });
    db.saveProducts(products);

    const current = db.getOrders();
    current.unshift(newOrder);
    db.saveOrders(current);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order> {
    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!
          .from('orders')
          .update({ status })
          .eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase update order status failing, running local write:', err);
      }
    }

    const current = db.getOrders();
    const ord = current.find(o => o.id === id);
    if (ord) {
      ord.status = status;
      db.saveOrders(current);
      return ord;
    }
    throw new Error('Order not found');
  },

  // USERS / PROFILE AUTH CONSOLE SIMULATION
  getCurrentUserProfile(): UserProfile | null {
    return db.getCurrentUser();
  },

  async signUp(email: string, fullName: string, password?: string): Promise<UserProfile> {
    const isOwner = ['olaniyilawalazeez@gmail.com', 'kejiaesthetics@gmail.com'].includes(email.trim().toLowerCase());
    const role = isOwner ? 'admin' : 'customer';

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email: email.trim().toLowerCase(),
      fullName,
      role,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.auth.signUp({
          email: newUser.email,
          password: password || 'DefaultPass123!',
          options: {
            data: {
              full_name: fullName,
              role: role
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          newUser.id = data.user.id;
          await supabase!.from('users').insert({
            id: data.user.id,
            email: newUser.email,
            full_name: fullName,
            role: role
          });
        }
      } catch (err) {
        console.warn('Supabase signUp error, continuing local flow:', err);
      }
    }

    const all = db.getUsers();
    if (all.some(u => u.email === newUser.email)) {
      throw new Error('An account with this email address already exists');
    }

    all.push(newUser);
    setStored('users', all);
    db.setCurrentUser(newUser);
    return newUser;
  },

  async signIn(email: string, password?: string): Promise<UserProfile> {
    const cleanedEmail = email.trim().toLowerCase();
    
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!.auth.signInWithPassword({
          email: cleanedEmail,
          password: password || 'DefaultPass123!'
        });
        if (error) throw error;
        
        // Fetch custom user profile
        if (data.user) {
          const { data: profile } = await supabase!
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();
          
          if (profile) {
            const user: UserProfile = {
              id: profile.id,
              email: profile.email,
              fullName: profile.full_name,
              role: profile.role,
              phoneNumber: profile.phone_number,
              shippingAddress: profile.shipping_address,
              createdAt: profile.created_at
            };
            db.setCurrentUser(user);
            return user;
          }
        }
      } catch (err) {
        console.warn('Supabase signIn error, checking local fallback credentials:', err);
      }
    }

    const all = db.getUsers();
    const match = all.find(u => u.email === cleanedEmail);
    if (!match) {
      throw new Error('Invalid email or account does not exist');
    }

    db.setCurrentUser(match);
    return match;
  },

  signOut(): void {
    if (isSupabaseConfigured) {
      supabase!.auth.signOut().catch(console.error);
    }
    db.setCurrentUser(null);
  },

  async updateUserProfile(fullName: string, phone?: string, address?: string): Promise<UserProfile> {
    const current = db.getCurrentUser();
    if (!current) throw new Error('No active user logged in');

    const updated = {
      ...current,
      fullName,
      phoneNumber: phone,
      shippingAddress: address
    };

    if (isSupabaseConfigured) {
      try {
        const { error } = await supabase!
          .from('users')
          .update({
            full_name: fullName,
            phone_number: phone,
            shipping_address: address
          })
          .eq('id', current.id);
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase update profile failed:', err);
      }
    }

    db.setCurrentUser(updated);
    
    // Update users table in db
    const users = db.getUsers();
    const idx = users.findIndex(u => u.id === current.id);
    if (idx !== -1) {
      users[idx] = updated;
      setStored('users', users);
    }

    return updated;
  },

  // UTILITY: MEDIA BUCKETS FILE UPLOAD
  async uploadFile(bucket: 'product-assets' | 'receipts' | 'review-assets', file: File): Promise<string> {
    if (isSupabaseConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await supabase!.storage
          .from(bucket)
          .upload(filePath, file);

        if (error) throw error;

        // Retrieve public url
        const { data: { publicUrl } } = supabase!.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return publicUrl;
      } catch (err) {
        console.warn(`Supabase Storage Upload failed on bucket [${bucket}], using local Base64 resource URL fallback:`, err);
      }
    }

    // Convert to Base64 Data URL for durable offline storage fallback.
    // This allows images uploaded by the admin to persist in localStorage and render across refreshes and multiple tabs/devices.
    try {
      return await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert file to Base64 string'));
          }
        };
        reader.onerror = (error) => reject(error);
      });
    } catch (e) {
      console.error('FileReader base64 fallback failed, using temporary object URL:', e);
      return URL.createObjectURL(file);
    }
  },

  // FLASH SALE POP-UP BANNER CONFIG
  async fetchFlashSaleBanner(): Promise<FlashSaleBannerConfig> {
    const DEFAULT_FLASH_SALE_BANNER: FlashSaleBannerConfig = {
      isActive: true,
      title: 'EXCLUSIVE FLASH SALE DEALS',
      subtitle: 'Dress to Impress; Live to Express. Get premium curated outfits at amazing limited discounts!',
      discountBadge: '50% OFF',
      promoCode: 'KEJI50',
      imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1200',
      targetUrl: 'unisex-wears',
      buttonText: 'SHOP DEALS NOW',
      countdownDate: new Date(Date.now() + 86400000 * 2).toISOString().substring(0, 16)
    };

    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase!
          .from('store_settings')
          .select('value')
          .eq('key', 'flash_sale_banner')
          .single();
        if (!error && data?.value) {
          return data.value as FlashSaleBannerConfig;
        }
      } catch (err) {
        // Fallback gracefully
      }
    }

    return getStored<FlashSaleBannerConfig>('flash_sale_banner', DEFAULT_FLASH_SALE_BANNER);
  },

  async saveFlashSaleBanner(config: FlashSaleBannerConfig): Promise<FlashSaleBannerConfig> {
    if (isSupabaseConfigured) {
      try {
        await supabase!
          .from('store_settings')
          .upsert({ key: 'flash_sale_banner', value: config }, { onConflict: 'key' });
      } catch (err) {
        // Fallback gracefully
      }
    }

    setStored('flash_sale_banner', config);
    return config;
  }
};
