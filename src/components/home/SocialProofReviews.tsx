'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, Quote, Sparkles } from 'lucide-react';
import { Review } from '../../types';

const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Kavita Patel',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    date: 'Verified Buyer',
    productName: 'Bhajiya Instant Mix',
    title: 'Just like my Baa’s secret recipe!',
    comment: 'I have tried many instant mixes over the years, but Amrat Narsih Bhajiya mix has that genuine ajwain and hing balance that takes me back to our family monsoon gatherings in Maninagar.',
    verifiedPurchase: true,
  },
  {
    id: 'rev-2',
    author: 'Ramesh Shah',
    location: 'Surat, Gujarat',
    rating: 5,
    date: 'Verified Buyer',
    productName: 'Surti Locho Instant Mix',
    title: 'Surat level authentic taste at home',
    comment: 'Being a true Surti, I am extremely particular about Locho texture. This mix produces that exact melt-in-mouth soft consistency, and having the special masala included is pure perfection.',
    verifiedPurchase: true,
  },
  {
    id: 'rev-3',
    author: 'Pooja Mehta',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: 'Verified Buyer',
    productName: 'Dalwada Instant Mix',
    title: 'Crisp outside, fluffy inside',
    comment: 'Made 21 wadas in just 15 minutes for Sunday tea. The black pepper and ginger aroma was divine. My in-laws couldn’t believe it was made from an instant mix!',
    verifiedPurchase: true,
  },
  {
    id: 'rev-4',
    author: 'Jignesh Trivedi',
    location: 'Wembley, London (UK)',
    rating: 5,
    date: 'Verified Buyer',
    productName: 'Gulab Jamun Dessert Mix',
    title: 'A taste of Gujarat in London',
    comment: 'We ordered for Diwali celebrations. The jamuns swelled up so soft without a single crack and absorbed the rose saffron syrup beautifully. Ordering regularly now!',
    verifiedPurchase: true,
  },
];

export const SocialProofReviews: React.FC = () => {
  return (
    <section
      id="customer-reviews-section"
      className="py-20 sm:py-28 bg-[#FCFAF5] border-b border-[#EADFCB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-[#C90018] mb-2 bg-[#FFF8EC] px-3.5 py-1 rounded-full border border-[#F4C400]/40">
            <Sparkles className="w-3.5 h-3.5 text-[#F4C400]" />
            <span>Loved Across Generations</span>
          </div>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-[#191919]">
            Words from Family Kitchens
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Over 3,500+ five-star reviews from Gujarati food lovers across India and worldwide.
          </p>
        </motion.div>

        {/* 4 Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-6 border border-[#EADFCB] shadow-xs hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Star Rating */}
                <div className="flex items-center space-x-1 text-[#F4C400]">
                  {[...Array(review.rating)].map((_, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + i * 0.06, type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <Star className="w-4 h-4 fill-current" />
                    </motion.span>
                  ))}
                </div>

                <h4 className="font-display font-bold text-sm text-gray-900 leading-snug">
                  "{review.title}"
                </h4>

                <p className="text-xs text-gray-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              {/* Author Footer */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">
                      {review.author}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {review.location}
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-md">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                </div>

                <div className="mt-2 text-[10px] font-bold text-[#C90018]">
                  Product: {review.productName}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
