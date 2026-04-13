/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
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
import LandingHero from '@/components/landing/LandingHero';
import LandingVaultPreview from '@/components/landing/LandingVaultPreview';
import LandingFeatures from '@/components/landing/LandingFeatures';
import LandingPrivacy from '@/components/landing/LandingPrivacy';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { motion } from 'framer-motion';
import { ArrowRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { isInstallable, installApp } = usePWAInstall();

  return (
    <main className="min-h-screen bg-[#FAF9F6]">
      <LandingHero />
      
      <div className="-mt-20 relative z-20">
        <LandingVaultPreview />
      </div>

      <LandingFeatures />
      
      <LandingPrivacy />

      {/* Waitlist Section */}
      <section className="py-24 bg-[#FAF9F6] px-6">
        <div className="max-w-4xl mx-auto">
           <div className="bg-white p-10 md:p-16 rounded-[3rem] border border-border-light shadow-xl shadow-black/[0.02] text-center">
              <div className="flex items-center justify-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100">
                    <Globe size={24} />
                 </div>
                 <div className="text-2xl text-text-tertiary">→</div>
                 <div className="w-12 h-12 bg-gold-light/20 rounded-2xl flex items-center justify-center text-gold border border-gold/10">
                    <span>📱</span>
                 </div>
              </div>

              <h2 className="text-2xl font-black text-text-primary mb-4">Browser now · App soon</h2>
              <p className="text-text-secondary font-medium leading-relaxed max-w-xl mx-auto mb-10 text-sm md:text-base">
                 Kutumbly runs fully in your browser today. Native installable apps for Android and iOS are on the way — your .kutumb vault file will work across both.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                 <input 
                   type="email" 
                   placeholder="aapka@email.com" 
                   className="flex-1 h-14 px-6 rounded-2xl bg-[#FAF9F6] border border-border-light focus:border-gold outline-none font-bold text-sm transition-all"
                 />
                 <button className="h-14 px-8 bg-gold text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-gold/20 hover:opacity-90 active:scale-95 transition-all">
                    Notify me
                 </button>
              </div>

              <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-8">
                 Join the waitlist to get notified when the app launches
              </p>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center px-6">
         <h2 className="text-3xl md:text-5xl font-black text-text-primary mb-4 tracking-tighter">Start your family vault today</h2>
         <p className="text-text-secondary font-medium text-base mb-12">Free forever. Works on any browser. No account needed.</p>
         
         <Link href="/os" className="inline-flex h-16 px-10 bg-white border-2 border-border-light rounded-[2rem] items-center gap-3 font-black text-base text-text-primary hover:border-gold transition-all shadow-xl shadow-black/[0.02] mx-auto">
            Open Kutumbly — Free
            <ArrowRight size={20} />
         </Link>

         {isInstallable && (
           <button 
             onClick={installApp}
             className="block mt-8 mx-auto text-[11px] font-black text-gold uppercase tracking-[0.3em] hover:underline"
           >
             Install PWA as Native App
           </button>
         )}
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border-light mx-8 text-center bg-[#FAF9F6]">
         <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-[0.2em] flex flex-col items-center gap-4">
            <span>Built with ❤️ by AITDL Network · Gorakhpur, India</span>
            <div className="flex gap-6">
               <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-gold transition-colors">Contact</a>
            </div>
            <div className="mt-4 opacity-50">
               © 2026 Kutumbly Sovereign. India&apos;s Family OS.
            </div>
         </div>
      </footer>
    </main>
  );
}
