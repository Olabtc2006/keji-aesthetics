/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Upload,
  ArrowRight,
  PhoneCall,
  Sparkles,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { OrderItem, Order } from '../types';
import { api } from '../lib/supabase';
import { COUNTRIES, NIGERIAN_STATES } from '../lib/shipping';

interface CheckoutProps {
  cartItems: OrderItem[];
  onClearCart: () => void;
  userEmail?: string;
  onNavigate: (page: string) => void;
}

export default function Checkout({
  cartItems,
  onClearCart,
  userEmail = 'guest_buyer@gmail.com',
  onNavigate
}: CheckoutProps) {
  // Forms inputs
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Nigeria');
  const [selectedState, setSelectedState] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  
  // States
  const [isUploading, setIsUploading] = useState(false);
  const [copingAccount, setCopingAccount] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal;

  const accountNumber = '8114232724';

  const handleCopyAccount = () => {
    try {
      navigator.clipboard.writeText(accountNumber);
      setCopingAccount(true);
      setTimeout(() => setCopingAccount(false), 2500);
    } catch {
      setCopingAccount(true);
      setTimeout(() => setCopingAccount(false), 2500);
    }
  };

  const handleConfirmCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phoneNumber || !selectedCountry || !selectedState || !streetAddress) {
      alert('Please fill out all missing delivery details including country and state!');
      return;
    }

    setIsUploading(true);

    try {
      const formattedAddress = `[Country: ${selectedCountry}, State: ${selectedState}] ${streetAddress}`;

      // 2. Compile order details object
      const draftOrder = {
        userId: userEmail,
        userEmail: userEmail,
        customerName,
        phoneNumber,
        deliveryAddress: formattedAddress,
        totalAmount,
        items: cartItems
      };

      const finalOrder = await api.createOrder(draftOrder);
      setOrderComplete(finalOrder);

      // Trigger automatic WhatsApp redirect generator
      generateWhatsAppInvoice(finalOrder);

      // Clean local shopping state cart
      onClearCart();
    } catch (err) {
      console.error('Order creation failure:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // WhatsApp formatted string anchor generator
  const generateWhatsAppInvoice = (orderObj: Order) => {
    const brandWhatsAppNumber = '2349020942048'; // official WhatsApp formatting (country country without +)
    
    // Create items details formatted structure
    const itemsText = orderObj.items
      .map(
        (it) =>
          `• ${it.productName} (x${it.quantity})${
            it.selectedSize ? ` [Size: ${it.selectedSize}]` : ''
          }${it.selectedColor ? ` [Style: ${it.selectedColor}]` : ''} - ₦${(
            it.price * it.quantity
          ).toLocaleString()}`
      )
      .join('\n');

    const rawMessage = `Hello Keji Aesthetics 👋

I would like to place an order.

Order ID: *${orderObj.id}*

Order Details:
${itemsText}

*Total Amount: ₦${orderObj.totalAmount.toLocaleString()}*

Customer Name: ${orderObj.customerName}
Phone Number: ${orderObj.phoneNumber}
Delivery Address: ${orderObj.deliveryAddress}

*📄 I will attach my transaction proof/receipt of payment to this chat.*

Thank you.`;

    const encodedMsg = encodeURIComponent(rawMessage);
    const whatsappUrl = `https://wa.me/${brandWhatsAppNumber}?text=${encodedMsg}`;

    // Force Open WhatsApp Link in user tab
    window.open(whatsappUrl, '_blank');
  };

  const triggerManualWhatsAppSend = () => {
    if (orderComplete) {
      generateWhatsAppInvoice(orderComplete);
    }
  };

  return (
    <div className="bg-[#0D0D0D] min-h-screen text-white pt-24 pb-16 relative">
      <div className="absolute top-12 left-0 w-80 h-80 bg-[#FF4FA3]/2 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 select-none">
        
        {/* Navigation link */}
        {!orderComplete && (
          <button
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white mb-8 group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO MY BASKET/CART</span>
          </button>
        )}

        {orderComplete ? (
          /* SUCCESS GREETINGS VIEW */
          <div className="max-w-xl mx-auto bg-[#0F0F13]/60 border border-white/5 rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] scroll-in-animation">
            <span className="text-4xl text-green-400 animate-pulse">💖</span>
            <span className="text-[10px] tracking-[0.25em] font-mono text-[#FF4FA3] uppercase font-black">
              ORDER DISPATCHED SUCCESS
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white leading-tight">
              PROPOSAL COMMITTED!
            </h2>
            <p className="text-gray-400 text-xs font-light leading-relaxed">
              We have received your payment request, and recorded order ID: <span className="font-mono text-[#FFD84D] font-semibold">{orderComplete.id}</span>. We are now preparing your luxury package!
            </p>

            {/* Invoicing summary box */}
            <div className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-left font-mono text-xs flex flex-col gap-2 relative">
              <span className="absolute top-4 right-4 text-[9px] text-[#FF4FA3] animate-pulse">● pending approval</span>
              <div>
                <span className="text-gray-500">Bill To Name:</span> <span className="text-white">{orderComplete.customerName}</span>
              </div>
              <div>
                <span className="text-gray-500">Destination Address:</span> <span className="text-white">{orderComplete.deliveryAddress}</span>
              </div>
              <div className="border-t border-white/5 pt-2 mt-2 flex justify-between font-bold">
                <span className="text-gray-400 text-[10px]">PRODUCTS TOTAL:</span>
                <span className="text-[#FFD84D]">₦{orderComplete.totalAmount.toLocaleString()}</span>
              </div>
              <div className="text-[10px] text-[#FFD84D] mt-1 text-center font-bold">
                * Delivery fee will be calculated by vendor on WhatsApp *
              </div>
            </div>

            {/* WhatsApp triggering button explicitly */}
            <button
              onClick={triggerManualWhatsAppSend}
              className="w-full bg-green-500 hover:bg-green-600 rounded-xl py-3.5 text-xs font-mono font-bold tracking-widest uppercase text-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-[0.98]"
            >
              <PhoneCall className="w-4 h-4" />
              WhatsApp Confirmation invoice
            </button>

            <button
              onClick={() => onNavigate('shop')}
              className="mt-2 text-xs font-mono text-gray-500 hover:text-[#FF4FA3] transition-colors uppercase tracking-widest"
            >
              Back To Store Showroom
            </button>
          </div>
        ) : cartItems.length > 0 ? (
          /* REGULAR CHECKOUT FLOW LAYOUT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* LEFT 7 COLUMNS: PAYMENT SUMMARY & FORMS */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* Checkout Greetings Frame */}
              <div className="bg-[#0F0F13]/60 border border-[#FF4FA3]/15 rounded-3xl p-6 relative overflow-hidden flex flex-col gap-3 shadow-lg select-text">
                {/* Decorative glow ambient shine */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF4FA3]/10 rounded-full blur-xl pointer-events-none" />
                
                <h3 className="text-[#FF4FA3] text-[10px] uppercase font-mono tracking-[0.25em] font-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF4FA3] animate-pulse" />
                  Keji Aesthetics Checkout Greeting
                </h3>
                
                <p className="text-gray-200 text-xs font-light leading-relaxed mt-1 italic">
                  "Thank you for choosing KEJI AESTHETICS 💖
                  We are delighted to be part of your style journey.
                  Please review your order details below and complete your payment using the account information provided.
                  Once payment is made, kindly upload your payment receipt or send proof of payment through WhatsApp.
                  We appreciate your trust in us and look forward to delivering excellence."
                </p>
              </div>

              {/* Bank Account credentials Details */}
              <div className="bg-black/50 border border-white/5 rounded-3xl p-6 flex flex-col gap-4 shadow-md select-text">
                <h3 className="text-xs uppercase font-mono text-[#FFD84D] tracking-[0.2em] font-bold">
                  Bespoke Transfer Details
                </h3>

                <div className="grid grid-cols-3 gap-y-3.5 mt-2 font-mono text-xs">
                  <div className="text-gray-500">BANK PARTNER:</div>
                  <div className="col-span-2 text-white font-bold">Opay</div>

                  <div className="text-gray-500">BENEFICIARY:</div>
                  <div className="col-span-2 text-white font-bold">Oluwapelumi Falade</div>

                  <div className="text-gray-500">ACCOUNT NUMBER:</div>
                  <div className="col-span-2 flex items-center gap-3">
                    <span className="text-[#FF4FA3] text-sm font-black tracking-wider">{accountNumber}</span>
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      className="p-1.5 hover:bg-white/5 rounded-lg border border-white/5 text-gray-400 hover:text-[#FFD84D] transition-colors cursor-pointer"
                      title="Copy Card Details Account Number"
                    >
                      {copingAccount ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="text-gray-500 font-bold">TOTAL TO PAY:</div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-[#FF4FA3] text-lg font-black tracking-wider">₦{totalAmount.toLocaleString()}</span>
                    <span className="text-[10px] text-[#FFD84D] font-mono leading-normal font-semibold">
                      *(Excludes delivery. Delivery fee will be calculated & arranged by the vendor on WhatsApp)*
                    </span>
                  </div>
                </div>

                {copingAccount && (
                  <span className="text-[10px] font-mono text-green-400 tracking-wide animate-fade-in">
                    ✓ Account number copied! Go complete your bank app transfer!
                  </span>
                )}
              </div>

              {/* Delivery client parameters */}
              <form onSubmit={handleConfirmCheckout} className="bg-[#0F0F13]/40 border border-white/5 rounded-3xl p-6 flex flex-col gap-5">
                <h3 className="text-xs uppercase font-mono text-gray-300 tracking-[0.2em] font-bold">
                  Delivery Details Information
                </h3>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alhaji Azeez Lawal"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4FA3]/50"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Active Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 09020942048"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4FA3]/50 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Shipping Country
                      </label>
                      <select
                        required
                        value={selectedCountry}
                        onChange={(e) => {
                          setSelectedCountry(e.target.value);
                          setSelectedState(''); // reset state selection on country change
                        }}
                        className="bg-black/40 border border-[#FF4FA3]/20 hover:border-[#FF4FA3]/40 rounded-xl px-4 py-3 text-xs text-white bg-[#0F0F13] focus:outline-none focus:border-[#FF4FA3]/50"
                      >
                        <option value="" disabled className="bg-[#111] text-gray-400">Select Country...</option>
                        {COUNTRIES.map(c => (
                          <option key={c.name} value={c.name} className="bg-[#111] text-white">
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                        Shipping State / Region
                      </label>
                      {selectedCountry === 'Nigeria' ? (
                        <select
                          required
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="bg-black/40 border border-[#FF4FA3]/20 hover:border-[#FF4FA3]/40 rounded-xl px-4 py-3 text-xs text-white bg-[#0F0F13] focus:outline-none focus:border-[#FF4FA3]/50"
                        >
                          <option value="" className="bg-[#111] text-gray-400">Select State...</option>
                          {NIGERIAN_STATES.map(s => (
                            <option key={s.name} value={s.name} className="bg-[#111] text-white">
                              {s.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          required
                          placeholder="e.g. Surrey, London, California"
                          value={selectedState}
                          onChange={(e) => setSelectedState(e.target.value)}
                          className="bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4FA3]/50"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                      Detailed Street Address & Landmarks
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Street name, Estate name, House number, landmarks, City"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#FF4FA3]/50 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Receipt Notice Warning Box */}
                <div className="mt-3 bg-[#FF4FA3]/5 border border-[#FF4FA3]/20 rounded-2xl p-5 flex flex-col gap-2 text-center items-center">
                  <div className="w-8 h-8 rounded-full bg-[#FF4FA3]/10 flex items-center justify-center text-[#FF4FA3]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#FF4FA3] font-bold">
                    Important Instruction
                  </span>
                  <p className="text-xs text-gray-300 font-light max-w-sm leading-relaxed">
                    Please kindly attach your receipt in the WhatsApp chat when submitting your final invoice details!
                  </p>
                </div>

                {/* Dynamic Payment trigger CTA */}
                <button
                  type="submit"
                  disabled={isUploading}
                  className="w-full bg-gradient-to-r from-[#FF4FA3] to-[#FF4FA3]/80 hover:from-[#FF4FA3]/90 rounded-xl py-3.5 text-xs font-mono tracking-widest uppercase font-bold text-white transition-all shadow-[0_0_20px_rgba(255,79,163,0.2)] hover:shadow-[0_0_35px_rgba(255,79,163,0.4)] flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>Placing Order Invoice...</span>
                    </>
                  ) : (
                    <>
                      <span>Confirm Payment & Checkout</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* RIGHT 5 COLUMNS: ORDER SUMMARY BRIEFING */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-[#0F0F13]/80 border border-white/5 rounded-3xl p-6 backdrop-blur-md shadow-lg flex flex-col gap-5">
                <h3 className="text-xs uppercase font-mono text-[#FFD84D] tracking-[0.2em] font-bold pb-3 border-b border-white/5">
                  Invoice Briefing
                </h3>

                {/* Items checklist */}
                <div className="flex flex-col gap-4 max-h-[30vh] overflow-y-auto pr-2 divide-y divide-white/5">
                  {cartItems.map((it, i) => (
                    <div key={i} className="flex items-center gap-4 pt-3 first:pt-0">
                      <img
                        src={it.imageUrl}
                        alt={it.productName}
                        className="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-white/5"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-xs font-semibold truncate uppercase">
                          {it.productName}
                        </h4>
                        <span className="text-[10px] font-mono text-gray-500">
                          QTY: {it.quantity} {it.selectedSize ? `• SIZE: ${it.selectedSize}` : ''}
                        </span>
                      </div>
                      <div className="font-mono text-xs font-bold text-white">
                        ₦{(it.price * it.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing breaks */}
                <div className="border-t border-white/5 pt-4 flex flex-col gap-2.5 font-mono text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal:</span>
                    <span className="text-white">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#FFD84D]">
                    <span>Transit & Delivery:</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      To be calculated on WhatsApp
                    </span>
                  </div>
                  <div className="border-t border-white/5 pt-3 mt-1 flex justify-between font-sans items-baseline">
                    <span className="text-xs font-bold text-white uppercase">Checkout Total:</span>
                    <span className="text-xl font-mono font-black text-[#FF4FA3]">
                      ₦{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty checkout state */
          <div className="text-center py-32 flex flex-col items-center justify-center gap-4 bg-[#0F0F13]/25 border border-white/5 rounded-3xl p-8 max-w-xl mx-auto select-none">
            <span className="text-3xl">🛍️</span>
            <h3 className="text-lg uppercase tracking-widest font-mono text-[#FFD84D]">Empty Checkout</h3>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              There are no active draft items inside your cart bag. Go back to our storefront showroom to select custom premium accessories.
            </p>
            <button
              onClick={() => onNavigate('shop')}
              className="mt-2 px-6 py-2.5 bg-[#FF4FA3] text-white font-mono text-xs uppercase tracking-widest rounded-full transition-all cursor-pointer"
            >
              Browse Shop Catalog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
