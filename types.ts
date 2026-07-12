/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CategorySlug =
  | 'unisex-wears'
  | 'underwear'
  | 'bags'
  | 'jewelry'
  | 'home-decor'
  | 'accessories'
  | 'head-wears'
  | 'digital-assets'
  | 'surprise-packages';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  iconName: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: CategorySlug;
  price: number; // local naira currency ₦
  originalPrice?: number; // for flash sales
  discountPercentage?: number; // for flash sales (e.g. 25% OFF)
  imageUrl: string;
  additionalImages?: string[];
  videoUrl?: string; // product video if any
  isFlashSale: boolean;
  isFeatured: boolean;
  isNewArrival: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  stock: number;
  rating: number;
  reviewCount: number;
  sizes?: string[];
  colors?: string[];
  specifications?: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string; // helpers
  reviewerName: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  imageUrl?: string; // customer photo showing purchase/review
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Payment Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Delivered';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  customerName: string;
  phoneNumber: string;
  deliveryAddress: string;
  totalAmount: number;
  status: OrderStatus;
  paymentReceiptUrl?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface WishlistItem {
  productId: string;
  addedAt: string;
}

export interface RecentlyViewedItem {
  productId: string;
  viewedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  shippingAddress?: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

export interface FlashSaleBannerConfig {
  isActive: boolean;
  title: string;
  subtitle: string;
  discountBadge: string;
  promoCode?: string;
  imageUrl?: string;
  targetUrl?: string;
  buttonText: string;
  countdownDate?: string; // Format: YYYY-MM-DDTHH:mm or similar
}
