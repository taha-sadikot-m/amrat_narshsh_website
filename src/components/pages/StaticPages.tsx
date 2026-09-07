'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Truck,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Package,
  Sparkles,
  Building2,
  ExternalLink,
  Star,
  Navigation,
  Copy,
  Check,
  Compass,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Since1956Badge, VegBadge } from '../../data/brandAssets';

// --- CONTACT & INQUIRIES PAGE ---
export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });

  const VERIFIED_ADDRESS = '3/2273, Ground Floor, Balabhai Ni Sheri, Salabatpura, Surat, Gujarat - 395003, India';
  const GOOGLE_MAPS_URL = 'https://maps.app.goo.gl/tenQVorx1d1EG8KQA';

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(VERIFIED_ADDRESS);
    setCopied(true);
    showToast('Address Copied', 'Physical store address copied to clipboard.', 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        showToast('Could not send', 'Please try again in a moment.', 'warning');
        return;
      }
      setSubmitted(true);
      showToast('Message Sent', 'Thank you! The Amrat Narsih team in Surat will respond within 24 business hours.', 'success');
    } catch {
      showToast('Could not send', 'Network error. Please try again.', 'warning');
    }
  };

  return (
    <div id="contact-page" className="py-12 sm:py-16 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full border border-[#EADFCB] shadow-2xs">
            <MapPin className="w-3.5 h-3.5 text-[#C90018]" />
            <span className="text-[11px] font-black uppercase tracking-widest text-[#6F3E24]">
              VERIFIED PHYSICAL LOCATION • SURAT FLAGSHIP
            </span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-[#191919] tracking-tight">
            Visit Our Surat Flagship
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Visit our historic heritage store in Salabatpura, Surat to purchase fresh factory batches directly from the counter, or reach out to our team for online orders and retail distribution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Column: Verified Location & Operating Info (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary Verified Location Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCB] shadow-xs space-y-6">
              
              {/* Header with Google Maps Rating */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C90018] block">
                    Flagship Store &amp; Direct Counter
                  </span>
                  <h3 className="font-display font-black text-xl text-gray-900">
                    Amrat Narsih
                  </h3>
                  <div className="text-xs text-gray-500 font-medium">
                    Salabatpura Central Facility
                  </div>
                </div>

                {/* Google Maps Rating Badge */}
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 bg-[#FFF8EC] px-3 py-1.5 rounded-full border border-[#F4C400]/60 text-xs font-bold text-[#6F3E24] hover:bg-[#F4C400]/20 transition-all shadow-2xs group"
                >
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>4.2</span>
                  <span className="text-[10px] text-gray-500 hidden sm:inline">(80+ reviews)</span>
                  <ExternalLink className="w-3 h-3 text-gray-400 group-hover:text-[#C90018]" />
                </a>
              </div>

              {/* Verified Details List */}
              <div className="space-y-4 text-xs text-gray-700">
                
                {/* Physical Address Block */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#FFF8EC] text-[#C90018] rounded-2xl border border-[#F4C400]/40 shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center justify-between">
                      <strong className="block text-gray-900 font-bold text-sm">
                        Verified Physical Address:
                      </strong>
                      <button
                        onClick={handleCopyAddress}
                        className="text-[10px] font-bold text-[#C90018] hover:underline flex items-center space-x-1 cursor-pointer bg-red-50 px-2 py-0.5 rounded-md"
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3 text-green-600" />
                            <span className="text-green-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-gray-800 leading-relaxed font-semibold">
                      3/2273, Ground Floor, Balabhai Ni Sheri,<br />
                      Salabatpura, Surat, Gujarat – 395003, India.
                    </p>
                    <div className="text-[11px] text-gray-500 font-medium flex items-center space-x-1">
                      <Compass className="w-3 h-3 text-gray-400" />
                      <span>Landmark: Balabhai Ni Sheri, Salabatpura</span>
                    </div>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#FFF8EC] text-[#C90018] rounded-2xl border border-[#F4C400]/40 shrink-0 mt-0.5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="block text-gray-900 font-bold text-sm">Store &amp; Counter Hours:</strong>
                    <div className="text-gray-700 leading-snug">
                      <div className="flex justify-between gap-4">
                        <span>Monday – Saturday:</span>
                        <span className="font-bold text-gray-900">9:00 AM – 8:30 PM IST</span>
                      </div>
                      <div className="flex justify-between gap-4 mt-0.5">
                        <span>Sunday:</span>
                        <span className="font-bold text-gray-900">9:00 AM – 2:00 PM IST</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Direct Phone & WhatsApp */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#FFF8EC] text-[#C90018] rounded-2xl border border-[#F4C400]/40 shrink-0 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="block text-gray-900 font-bold text-sm">Direct Phone &amp; Orders:</strong>
                    <a
                      href="tel:+919825131883"
                      className="text-[#C90018] font-black text-sm hover:underline block"
                    >
                      +91 98251 31883
                    </a>
                    <p className="text-[11px] text-gray-500 font-medium">
                      Direct Store Counter &amp; Bulk Dispatch Helpline
                    </p>
                  </div>
                </div>

                {/* Official Email */}
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 bg-[#FFF8EC] text-[#C90018] rounded-2xl border border-[#F4C400]/40 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="block text-gray-900 font-bold text-sm">Customer Care Email:</strong>
                    <a
                      href="mailto:care@amratnarsih.com"
                      className="text-gray-800 hover:text-[#C90018] font-bold block"
                    >
                      care@amratnarsih.com
                    </a>
                  </div>
                </div>

              </div>

              {/* Action Buttons for Google Maps */}
              <div className="pt-2 border-t border-gray-100 space-y-2.5">
                <a
                  id="google-maps-directions-btn"
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-vibrant-cta text-white px-4 py-3.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md group cursor-pointer"
                >
                  <Navigation className="w-4 h-4 text-[#F4C400] group-hover:rotate-12 transition-transform" />
                  <span>Open in Google Maps / Get Directions</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                {/* Verified Store Features */}
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] font-semibold text-gray-700">
                  <div className="flex items-center space-x-1.5 bg-[#FCFAF5] p-2 rounded-xl border border-[#EADFCB]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                    <span>In-Store Shopping</span>
                  </div>
                  <div className="flex items-center space-x-1.5 bg-[#FCFAF5] p-2 rounded-xl border border-[#EADFCB]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-700 shrink-0" />
                    <span>Wheelchair Accessible</span>
                  </div>
                </div>
              </div>

              {/* Heritage Seal */}
              <div className="pt-2 flex items-center space-x-3 text-[11px] text-[#6F3E24] font-medium bg-[#FCFAF5] p-3 rounded-2xl border border-[#EADFCB]">
                <Since1956Badge className="w-8 h-8 shrink-0" />
                <span>
                  <strong>Amrat Narsih</strong> • Preserving authentic Surat food traditions in Salabatpura since 1956.
                </span>
              </div>

            </div>

            {/* B2B / Distributorship Box */}
            <div className="bg-[#FFF8EC] rounded-3xl p-6 border border-[#F4C400]/60 space-y-2">
              <div className="flex items-center space-x-2 text-[#C90018]">
                <Building2 className="w-4 h-4" />
                <h4 className="font-display font-bold text-sm">
                  Distributor &amp; Retail Partnerships
                </h4>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">
                Interested in stocking authentic Amrat Narsih instant mixes in your supermarket, grocery chain, or retail outlet? Reach out directly via phone or the inquiry form.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive Map Embed & Message Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Visual Map Card */}
            <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EADFCB] shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#C90018] animate-pulse" />
                  <span className="text-xs font-bold text-gray-900">
                    Live Map Location (Salabatpura, Surat)
                  </span>
                </div>
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#C90018] hover:underline flex items-center space-x-1"
                >
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Map Embed Container */}
              <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#EADFCB] relative bg-gray-100">
                <iframe
                  title="Amrat Narsih Salabatpura Surat Location Map"
                  src="https://maps.google.com/maps?q=3/2273%20Balabhai%20Ni%20Sheri%20Salabatpura%20Surat%20395003&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  3/2273, Ground Floor, Balabhai Ni Sheri, Salabatpura
                </span>
                <span className="font-bold text-[#6F3E24]">PIN: 395003</span>
              </div>
            </div>

            {/* Message / Inquiry Form Container */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-xs">
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-gray-900">
                    Thank You for Your Enquiry
                  </h3>
                  <p className="text-xs text-gray-600 max-w-sm mx-auto">
                    The team at Amrat Narsih has received your message and will get back to you at <strong>{form.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-vibrant-cta text-white px-6 py-2.5 rounded-xl text-xs font-bold"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-gray-900">
                      Send Us an Online Inquiry
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Whether you have questions about our ingredients, order delivery, or bulk orders.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Full Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. Priyesh Shah"
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. priyesh@example.com"
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">Enquiry Type</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-3 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs font-bold text-gray-900 focus:outline-hidden"
                      >
                        <option value="General Enquiry">General Customer Enquiry</option>
                        <option value="Business Enquiry">Business / Wholesale Enquiry</option>
                        <option value="Distributor / Partnership">Distributor / Retail Partnership</option>
                        <option value="Order Status">Online Order &amp; Delivery Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 block mb-1">Your Message</label>
                    <textarea
                      rows={4}
                      required
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us how we can help you..."
                      className="w-full px-3.5 py-2.5 bg-[#FCFAF5] border border-[#EADFCB] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:border-[#C90018]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-vibrant-cta text-white py-3.5 rounded-2xl font-display font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Submit Enquiry to Amrat Narsih
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// --- ORDER TRACKING PAGE ---
export const OrderTrackingPage: React.FC = () => {
  const { currentParams, navigateTo } = useStore();
  const [orderQuery, setOrderQuery] = useState(currentParams?.orderId || '');
  const [result, setResult] = useState<{
    order: { id: string; status: string; estimatedDelivery: string; trackingNumber: string };
    timeline: { label: string; detail: string }[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loadOrder = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (!res.ok) {
        setResult(null);
        setError(data.error || 'Order not found');
      } else {
        setResult(data);
      }
    } catch {
      setError('Could not load tracking. Try again.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentParams?.orderId) {
      setOrderQuery(currentParams.orderId);
      void loadOrder(currentParams.orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentParams?.orderId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderQuery.trim()) {
      navigateTo('order-tracking', { orderId: orderQuery.trim() });
    }
  };

  return (
    <div id="order-tracking-page" className="py-12 sm:py-16 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C90018]">
            Live Dispatch Tracking
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#191919]">
            Track Your Amrat Narsih Parcel
          </h1>
          <p className="text-xs text-gray-600">
            Enter your Order ID (e.g. AN-849201) or registered phone number to view live courier status.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EADFCB] shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              required
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. AN-849201)"
              className="flex-1 px-4 py-3 bg-[#FCFAF5] border border-[#EADFCB] rounded-2xl text-xs font-bold text-gray-900 focus:outline-hidden focus:border-[#C90018]"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-vibrant-cta text-white px-6 py-3 rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Tracking…' : 'Track Shipment'}
            </button>
          </form>
        </div>

        {error && (
          <p className="text-center text-sm font-semibold text-[#C90018]">{error}</p>
        )}

        {result && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EADFCB] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-green-700 bg-green-50 px-2.5 py-1 rounded-md">
                  {result.order.status}
                </span>
                <h3 className="font-display font-bold text-lg text-gray-900 mt-2">
                  Order #{result.order.id}
                </h3>
                <p className="text-xs text-gray-500">
                  Tracking {result.order.trackingNumber} • Dispatched from Surat Facilities
                </p>
              </div>

              <div className="text-left sm:text-right">
                <div className="text-[11px] text-gray-400">Estimated Delivery:</div>
                <div className="text-sm font-black text-[#C90018]">{result.order.estimatedDelivery}</div>
              </div>
            </div>

            <div className="space-y-6 relative pl-6 border-l-2 border-[#C90018] ml-3">
              {result.timeline.map((step) => (
                <div className="relative" key={step.label}>
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow-xs" />
                  <div className="text-xs font-bold text-gray-900">{step.label}</div>
                  <div className="text-[11px] text-gray-500">{step.detail}</div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- FAQ PAGE ---
export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const FAQS = [
    {
      q: 'What is the company behind Amrat Narsih?',
      a: 'Amrat Narsih is the flagship heritage brand of Modi Foods Pvt. Ltd., founded in 1956 in Surat, Gujarat. The company was founded by Late Amrutlal Narsihdas Modi and is now led by Amit Mukeshchandra Modi.',
    },
    {
      q: 'What makes Amrat Narsih instant mixes authentic?',
      a: 'Since 1956, our recipes have stayed faithful to authentic Gujarati heritage formulations. We use only high-grade lentils, stone-milled grains, pure traditional whole spices, and zero artificial colors or chemical fillers.',
    },
    {
      q: 'Do I need to add separate salt or spices when making Bhajiya or Dalwada?',
      a: 'No! All Amrat Narsih mixes are complete blends. Salt, seasonings, and natural leavening agents are pre-calibrated in exact traditional ratios. You only need to add water and follow the packet directions.',
    },
    {
      q: 'How long do Amrat Narsih instant mixes stay fresh?',
      a: 'Our products have a shelf life of 6 to 9 months from the date of manufacture. We package all mixes in nitrogen-flushed, triple-layer moisture-barrier pouches to lock in freshness and aroma.',
    },
    {
      q: 'Are all Amrat Narsih products 100% vegetarian?',
      a: 'Yes, 100% of our products and milling facilities are strictly pure vegetarian.',
    },
  ];

  return (
    <div id="faq-page" className="py-12 sm:py-16 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="text-xs font-extrabold uppercase tracking-widest text-[#C90018]">
            Got Questions?
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-[#191919]">
            Frequently Asked Questions
          </h1>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#EADFCB] overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-display font-bold text-sm sm:text-base text-gray-900 hover:text-[#C90018] transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-[#C90018] text-lg font-black ml-4 shrink-0">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

// --- POLICIES (Privacy, Terms, Shipping, Returns) ---
export const PolicyPage: React.FC<{ type: 'privacy' | 'terms' | 'shipping' | 'returns' }> = ({ type }) => {
  const titles = {
    privacy: 'Privacy Policy',
    terms: 'Terms of Service',
    shipping: 'Shipping & Delivery Policy',
    returns: 'Refund & Return Policy',
  };

  return (
    <div id="legal-policy-page" className="py-12 sm:py-16 bg-[#FCFAF5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#EADFCB] shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#C90018]">
              Modi Foods Pvt. Ltd. • Amrat Narsih
            </span>
            <h1 className="font-display font-black text-2xl sm:text-4xl text-gray-900 mt-1">
              {titles[type]}
            </h1>
            <div className="text-xs text-gray-400 mt-1">
              Governed by the Laws of India • Surat, Gujarat
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
            {type === 'shipping' && (
              <>
                <p>
                  At Amrat Narsih (Modi Foods Pvt. Ltd.), we dispatch fresh factory batches directly from our facilities in Gujarat.
                </p>
                <h4 className="font-bold text-gray-900 text-sm pt-2">Shipping Charges:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Orders of value ₹499 and above enjoy <strong>FREE Shipping</strong> all across India.</li>
                  <li>Orders below ₹499 carry a nominal delivery fee of ₹49.</li>
                </ul>
              </>
            )}

            {type === 'returns' && (
              <>
                <p>
                  Due to food safety hygiene standards, we do not accept returns once a packet has been opened.
                </p>
                <h4 className="font-bold text-gray-900 text-sm pt-2">Damaged or Defective Items:</h4>
                <p>
                  If you receive a package physically damaged in transit, please notify us at <strong>care@amratnarsih.com</strong> within 48 hours of delivery with a photo. We will immediately dispatch a fresh replacement.
                </p>
              </>
            )}

            {type === 'privacy' && (
              <>
                <p>
                  We value your trust. Modi Foods Pvt. Ltd. collects customer data (such as name, delivery address, phone number, and email) solely to process your orders and deliver shipments safely.
                </p>
                <p>
                  We do not sell or trade your personal information.
                </p>
              </>
            )}

            {type === 'terms' && (
              <>
                <p>
                  Welcome to Amrat Narsih. By browsing our website and ordering our traditional mixes, you agree to comply with our terms and conditions. All product images, descriptions, and packaging representations are property of Modi Foods Pvt. Ltd.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
