/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 * Contact     :  kutumbly@outlook.com
 * Web         :  kutumbly.com | aitdl.com | aitdl.in
 *
 * © 2026 Kutumbly.com — All Rights Reserved
 * Unauthorized use or distribution is prohibited.
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Globe, MapPin, Shield } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-20">
            {/* Left side: Content */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-12"
            >
              <div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-text-primary leading-tight">Get in touch with the team</h1>
                <p className="text-text-secondary text-lg font-medium leading-[1.8] max-w-xl">
                  Whether you have feedback, bug reports, or partnership inquiries, we are always eager to hear from you. 
                </p>
              </div>

              <div className="space-y-8">
                 <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-3xl border border-border-light bg-bg-secondary flex items-center justify-center text-gold shadow-sm group-hover:border-gold/30 transition-all shrink-0">
                       <Mail size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-text-tertiary mb-1">Direct Email</h3>
                      <a href="mailto:kutumbly@outlook.com" className="font-bold text-xl hover:text-gold transition-colors">kutumbly@outlook.com</a>
                      <p className="text-xs text-text-tertiary mt-1">We typically respond within 24-48 hours.</p>
                    </div>
                 </div>

                 <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-3xl border border-border-light bg-bg-secondary flex items-center justify-center text-gold shadow-sm group-hover:border-gold/30 transition-all shrink-0">
                       <MapPin size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-text-tertiary mb-1">Headquarters</h3>
                      <p className="font-bold text-lg text-text-secondary leading-tight">
                        AITDL Network — Sovereign Division<br/>
                        Gorakhpur, Uttar Pradesh, India
                      </p>
                    </div>
                 </div>

                 <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 rounded-3xl border border-border-light bg-bg-secondary flex items-center justify-center text-gold shadow-sm group-hover:border-gold/30 transition-all shrink-0">
                       <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="font-black text-sm uppercase tracking-widest text-text-tertiary mb-1">Digital Ecosystem</h3>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm font-bold text-text-secondary">
                        <span className="hover:text-gold transition-colors cursor-pointer">kutumbly.com</span>
                        <span className="opacity-30">|</span>
                        <span className="hover:text-gold transition-colors cursor-pointer">aitdl.com</span>
                        <span className="opacity-30">|</span>
                        <span className="hover:text-gold transition-colors cursor-pointer">aitdl.in</span>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-border-light flex gap-6 items-center">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 rounded-full border-2 border-bg-primary bg-bg-secondary flex items-center justify-center text-[10px] font-black">JM</div>
                  <div className="w-10 h-10 rounded-full border-2 border-bg-primary bg-bg-secondary flex items-center justify-center text-[10px] font-black">PD</div>
                </div>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-widest">
                  Direct communication with the founders
                </p>
              </div>
            </motion.div>

            {/* Right side: Mock Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-bg-secondary border border-border-light rounded-[3rem] p-10 md:p-14 relative shadow-2xl shadow-black/5"
            >
              <h2 className="text-2xl font-black text-text-primary mb-8 tracking-tight">Sovereign Feedback Form</h2>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Vishwa Patel"
                    className="w-full h-14 px-6 rounded-2xl bg-bg-primary border border-border-light focus:border-gold outline-none font-bold text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="vishwa@example.com"
                    className="w-full h-14 px-6 rounded-2xl bg-bg-primary border border-border-light focus:border-gold outline-none font-bold text-sm transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Category</label>
                  <select className="w-full h-14 px-6 rounded-2xl bg-bg-primary border border-border-light focus:border-gold outline-none font-bold text-sm transition-all appearance-none cursor-pointer">
                    <option>General Feedback</option>
                    <option>Bug Report</option>
                    <option>Feature Request</option>
                    <option>Tech Support Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-text-tertiary ml-1">Message</label>
                  <textarea 
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full p-6 rounded-2xl bg-bg-primary border border-border-light focus:border-gold outline-none font-bold text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <button className="w-full h-16 bg-gold text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-gold/20 hover:opacity-90 active:scale-95 transition-all mt-4 flex items-center justify-center gap-3">
                  Send Message
                </button>
              </div>

              <div className="mt-10 flex items-center gap-3 text-[10px] font-bold text-text-tertiary uppercase tracking-widest opacity-60">
                <Shield size={12} />
                <span>Encrypted transit · Your data stays local</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
