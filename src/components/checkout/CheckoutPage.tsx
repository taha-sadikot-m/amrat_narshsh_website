'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Package,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useCart } from '../../context/CartContext';
import { ProductPackshot, VegBadge, Since1956Badge } from '../../data/brandAssets';
import confetti from 'canvas-confetti';

type PaymentMethod = 'razorpay' | 'cod';

type RazorpaySuccessResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number | string;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  notes: { localOrderId: string };
  theme: { color: string };
  handler: (response: RazorpaySuccessResponse) => void | Promise<void>;
  modal: { ondismiss: () => void };
};

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

let razorpayScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Checkout is unavailable.'));
  if (window.Razorpay) return Promise.resolve();
  if (razorpayScriptPromise) return razorpayScriptPromise;

  razorpayScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      razorpayScriptPromise = null;
      reject(new Error('Could not load Razorpay Checkout.'));
    };
    document.head.appendChild(script);
  });
  return razorpayScriptPromise;
}

export const CheckoutPage: React.FC = () => {
  const { navigateTo, showToast, products } = useStore();
  const { items, subtotal, shipping, discount, total, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    firstName: 'Kavita',
    lastName: 'Patel',
    email: 'kavita.patel@example.com',
    phone: '9876543210',
    address: 'B-402, Shivalik High Street, Near Judges Bungalow Cross Road, Bodakdev',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380054',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
  const [couponInput, setCouponInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<any | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      showToast('Coupon Applied', res.message, 'success');
      setCouponInput('');
    } else {
      showToast('Invalid Coupon', res.message, 'warning');
    }
  };

  const checkoutPayload = (method: PaymentMethod | 'whatsapp') => ({
    items: items.map((item) => ({
      productId: item.productId,
      weight: item.weight,
      quantity: item.quantity,
    })),
    paymentMethod: method,
    couponCode: appliedCoupon?.code ?? null,
    address: {
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      addressLine1: formData.address,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
    },
  });

  const completeOrder = (order: any, method: PaymentMethod) => {
    setOrderComplete({
      orderId: order.id,
      date: new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: [...items],
      total: order.total,
      formData: { ...formData },
      paymentMethod: method,
      paymentStatus: order.paymentStatus,
    });
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    clearCart();
    showToast('Order placed', `Order ${order.id} confirmed.`, 'success');
  };

  const startRazorpayPayment = async () => {
    await loadRazorpayCheckout();
    const response = await fetch('/api/payments/razorpay/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutPayload('razorpay')),
    });
    const paymentOrder = await response.json();
    if (!response.ok) {
      throw new Error(paymentOrder.error || 'Could not start Razorpay checkout.');
    }
    if (!window.Razorpay) {
      throw new Error('Razorpay Checkout did not load correctly.');
    }

    let paymentHandled = false;
    const checkout = new window.Razorpay({
      key: paymentOrder.keyId,
      amount: paymentOrder.amount,
      currency: paymentOrder.currency,
      name: paymentOrder.name,
      description: paymentOrder.description,
      order_id: paymentOrder.razorpayOrderId,
      prefill: {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        contact: formData.phone,
      },
      notes: { localOrderId: paymentOrder.localOrderId },
      theme: { color: '#C90018' },
      handler: async (razorpayResponse) => {
        paymentHandled = true;
        try {
          const verification = await fetch('/api/payments/razorpay/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              localOrderId: paymentOrder.localOrderId,
              ...razorpayResponse,
            }),
          });
          const verified = await verification.json();
          if (!verification.ok) {
            throw new Error(verified.error || 'Payment verification failed.');
          }
          completeOrder(verified.order, 'razorpay');
        } catch (error) {
          showToast(
            'Payment verification failed',
            error instanceof Error ? error.message : 'Please contact support with your payment ID.',
            'warning',
          );
        } finally {
          setIsProcessing(false);
        }
      },
      modal: {
        ondismiss: () => {
          if (!paymentHandled) {
            setIsProcessing(false);
            showToast('Payment cancelled', 'Your basket is unchanged. You can try again.', 'warning');
          }
        },
      },
    });
    checkout.open();
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || isProcessing) {
      if (items.length === 0) {
        showToast('Empty Basket', 'Please add products before checking out.', 'warning');
      }
      return;
    }

    setIsProcessing(true);
    if (paymentMethod === 'razorpay') {
      try {
        await startRazorpayPayment();
      } catch (error) {
        setIsProcessing(false);
        showToast(
          'Razorpay unavailable',
          error instanceof Error ? error.message : 'Could not start online payment.',
          'warning',
        );
      }
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload('cod')),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not place order.');
      completeOrder(data.order, 'cod');
    } catch (error) {
      showToast(
        'Order failed',
        error instanceof Error ? error.message : 'Network error. Please try again.',
        'warning',
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleWhatsAppOrder = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.form?.reportValidity() || items.length === 0 || isProcessing) return;
    setIsProcessing(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkoutPayload('whatsapp')),
      });
      const data = await response.json();
      if (!response.ok || !data.whatsappUrl) {
        throw new Error(data.error || 'Could not prepare the WhatsApp order.');
      }
      clearCart();
      showToast('Order prepared', `Opening WhatsApp for order ${data.order.id}.`, 'success');
      window.location.assign(data.whatsappUrl);
    } catch (error) {
      setIsProcessing(false);
      showToast(
        'WhatsApp order failed',
        error instanceof Error ? error.message : 'Network error. Please try again.',
        'warning',
      );
    }
  };

  if (orderComplete) {
    return (
      <div id="order-success-screen" className="py-12 sm:py-16 bg-[#FCFAF5] min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFCB] shadow-xl text-center space-y-6">
            
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#C90018]">
                Order Confirmed
              </span>
              <h1 className="font-display font-black text-3xl sm:text-4xl text-gray-900 mt-1">
                Dhanyavaad for Your Order!
              </h1>
              <p className="font-gujarati text-base font-bold text-[#6F3E24] mt-1">
                અમરત નરસિંહ પરિવાર તરફથી આભાર
              </p>
            </div>

            <div className="p-4 bg-[#FFF8EC] rounded-2xl border border-[#F4C400]/50 max-w-md mx-auto space-y-1 text-xs">
              <div className="font-bold text-gray-900">
                Order ID: <span className="text-[#C90018] font-black">{orderComplete.orderId}</span>
              </div>
              <div className="text-gray-600">
                {orderComplete.paymentMethod === 'razorpay'
                  ? 'Razorpay Test Mode payment verified successfully.'
                  : `Cash on delivery selected for +91 ${orderComplete.formData.phone}.`}
              </div>
              <div className="text-green-700 font-bold pt-1">
                Estimated Delivery: 2–3 Business Days
              </div>
            </div>

            {/* Order Items List */}
            <div className="text-left space-y-3 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Items In This Dispatch:
              </h4>
              <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto">
                {orderComplete.items.map((item: any) => (
                  <div key={`${item.productId}-${item.weight}`} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-10">
                        <ProductPackshot
                          productId={item.productId}
                          src={products.find((product) => product.id === item.productId)?.imageUrl}
                          className="w-full h-full"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.name}</div>
                        <div className="text-[10px] text-gray-500 font-gujarati">{item.gujaratiName} ({item.weight})</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-black text-gray-900">₹{item.price * item.quantity}</span>
                      <div className="text-[10px] text-gray-400">Qty: {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => navigateTo('order-tracking', { orderId: orderComplete.orderId })}
                className="w-full sm:w-auto bg-[#C90018] hover:bg-[#A50014] text-white px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Track Live Shipment
              </button>

              <button
                onClick={() => navigateTo('shop')}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="checkout-flow-page" className="py-8 sm:py-12 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6">
          <button onClick={() => navigateTo('home')} className="hover:text-black">
            Home
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <button onClick={() => navigateTo('shop')} className="hover:text-black">
            Shop
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="font-bold text-gray-900">Secure Express Checkout</span>
        </nav>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#EADFCB] space-y-4 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-[#C90018] mx-auto" />
            <h2 className="font-display font-bold text-xl text-gray-900">Your Basket is Empty</h2>
            <p className="text-xs text-gray-500">
              Add some authentic Gujarati mixes to your basket before proceeding to checkout.
            </p>
            <button
              onClick={() => navigateTo('shop')}
              className="bg-[#C90018] text-white px-6 py-3 rounded-2xl text-xs font-bold cursor-pointer"
            >
              Browse 11 Mixes
            </button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Shipping & Payment Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. Contact Information */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-display font-bold text-base text-gray-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#C90018] text-white text-xs flex items-center justify-center font-bold">1</span>
                    <span>Contact Information</span>
                  </h3>
                  <span className="text-[11px] text-gray-400">For SMS &amp; Dispatch Updates</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Mobile Number (WhatsApp Enabled)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-display font-bold text-base text-gray-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#C90018] text-white text-xs flex items-center justify-center font-bold">2</span>
                    <span>Shipping Address</span>
                  </h3>
                  <span className="text-[11px] text-green-700 font-bold flex items-center">
                    <Truck className="w-3.5 h-3.5 mr-1" />
                    Pan-India Express
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Flat / House No. / Building / Street Address</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">City</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">State</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                      >
                        <option value="Gujarat">Gujarat</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Other">Other States</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Pincode</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        required
                        value={formData.pincode}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-medium text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Payment Method Selection */}
              <div className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-display font-bold text-base text-gray-900 flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-[#C90018] text-white text-xs flex items-center justify-center font-bold">3</span>
                    <span>Select Payment Option</span>
                  </h3>
                  <span className="text-[11px] text-gray-400 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" />
                    256-Bit Encrypted
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'razorpay'
                        ? 'border-[#C90018] bg-[#FFF8EC] shadow-xs'
                        : 'border-[#EADFCB] bg-[#FCFAF5] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <CreditCard className="w-5 h-5 text-[#C90018]" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="text-[#C90018]"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-bold text-gray-900">Online Payment</div>
                      <div className="text-[10px] text-gray-500">Razorpay Test Mode · UPI, cards &amp; wallets</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-[#C90018] bg-[#FFF8EC] shadow-xs'
                        : 'border-[#EADFCB] bg-[#FCFAF5] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <Banknote className="w-5 h-5 text-green-700" />
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="text-[#C90018]"
                      />
                    </div>
                    <div className="mt-3">
                      <div className="text-xs font-bold text-gray-900">Cash on Delivery</div>
                      <div className="text-[10px] text-gray-500">Pay at doorstep</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary & Placement (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="sticky top-28 bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-lg space-y-5">
                <h3 className="font-display font-black text-lg text-gray-900 border-b border-gray-100 pb-3">
                  Order Summary ({items.length} item{items.length > 1 ? 's' : ''})
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.weight}`} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-10 h-12 shrink-0">
                          <ProductPackshot
                            productId={item.productId}
                            src={products.find((product) => product.id === item.productId)?.imageUrl}
                            className="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 truncate">{item.name}</div>
                          <div className="text-[10px] text-gray-500 font-gujarati">{item.gujaratiName} ({item.weight})</div>
                          <div className="text-[10px] text-gray-400">Qty: {item.quantity} × ₹{item.price}</div>
                        </div>
                      </div>
                      <div className="font-black text-gray-900 shrink-0">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Code Section */}
                <div className="pt-3 border-t border-gray-100">
                  {appliedCoupon ? (
                    <div className="p-2.5 bg-green-50 rounded-xl border border-green-200 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1.5 text-green-800 font-bold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Code '{appliedCoupon.code}' Applied (-₹{discount})</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 font-bold text-[11px]"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                        placeholder="Coupon (e.g. GUJARAT10)"
                        className="flex-1 px-3 py-2 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs uppercase font-bold focus:outline-hidden focus:border-[#C90018]"
                      />
                      <button
                        type="button"
                        onClick={handleCouponSubmit}
                        className="px-3.5 py-2 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>

                {/* Pricing Calculation Breakdown */}
                <div className="space-y-2 text-xs pt-3 border-t border-gray-100">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span className="font-bold text-gray-900">₹{subtotal}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-green-700 font-semibold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-gray-600">
                    <span>Express Delivery:</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="font-bold text-green-700">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-3 border-t border-gray-200 text-base">
                    <span className="font-display font-black text-gray-900">Grand Total:</span>
                    <span className="font-display font-black text-2xl text-[#C90018]">
                      ₹{total}
                    </span>
                  </div>
                </div>

                {/* Final Order Placement Button */}
                <button
                  id="place-order-final-btn"
                  type="submit"
                  disabled={isProcessing}
                  className="w-full btn-vibrant-cta text-white py-4 rounded-2xl font-display font-black text-sm transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Confirming Fresh Batch Order...</span>
                    </div>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'razorpay' ? 'Pay Securely' : 'Place COD Order'} (₹{total})
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 before:h-px before:flex-1 before:bg-gray-200 after:h-px after:flex-1 after:bg-gray-200">
                  or
                </div>

                <button
                  id="place-order-whatsapp-btn"
                  type="button"
                  onClick={handleWhatsAppOrder}
                  disabled={isProcessing}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[#128C4A] bg-[#25D366] py-4 font-display text-sm font-black text-white shadow-[0_8px_20px_rgba(37,211,102,0.2)] transition-colors hover:bg-[#1DB954] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#128C4A] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Place Order on WhatsApp</span>
                </button>
                <p className="text-center text-[10px] leading-4 text-gray-500">
                  Creates order details first, then opens a prefilled message to +91 98251 31883.
                </p>

                <div className="text-center text-[10px] text-gray-400">
                  Razorpay Test Mode • Factory Fresh Dispatch
                </div>
              </div>

            </div>

          </form>
        )}

      </div>
    </div>
  );
};
