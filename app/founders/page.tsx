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
import Link from 'next/link';
import { ArrowLeft, Code, Star } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';
import { motion } from 'framer-motion';

export default function FoundersPage() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          
          <div className="text-center mb-24">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-text-primary"
            >
              Visionaries Behind Kutumbly
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-text-secondary text-sm md:text-base font-bold uppercase tracking-[0.3em] opacity-80 max-w-2xl mx-auto"
            >
              Bridging deep enterprise technology with family software sovereignty
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Pushpa D Card */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-bg-secondary border border-border-light rounded-[3rem] p-10 md:p-14 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-[200px] -z-10 group-hover:bg-gold/10 transition-all"></div>
               <div className="flex items-center gap-3 mb-10">
                  <Star className="text-gold" />
                  <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">Founder & Principal Financier</h3>
               </div>
               
               <div className="mb-10 flex items-center gap-8">
                  <div className="w-28 h-28 bg-bg-primary border-4 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 scale-110">
                     <span className="text-4xl font-black text-text-primary">PD</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black tracking-tight text-text-primary mb-1">Pushpa D.</h4>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em]">Head of Sales & Vision · Gorakhpur</p>
                  </div>
               </div>

               <div className="text-base font-medium text-text-secondary leading-[1.8] space-y-6">
                  <p className="italic font-bold text-text-primary border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                    "Real wisdom isn't inherited in a classroom or a boardroom; it’s forged in the village and tempered by raw experience."
                  </p>
                  <p>
                    Hailing from a small village in Gorakhpur, Pushpa formally attended school only up to the 1st standard. Yet, she shattered conventional corporate barriers by possessing a profound, intuitive understanding of the complex operational and financial processes that drive major global corporations today. 
                  </p>
                  <p>
                    As the Founder, primary financier, and head of Sales & Marketing, Pushpa single-handedly provided the financial backbone that made Kutumbly a reality. Her leadership goes far beyond funding; she brings relentless practical insight to the table.
                  </p>
                  <p>
                    Pushpa has been deeply involved in the granular architecture of this project—meticulously reviewing and guiding the "real-world" flow of every single module. She ensures that Kutumbly doesn't just function for engineers, but genuinely serves the daily realities and privacy needs of Indian families at its core.
                  </p>
               </div>
            </motion.div>

            {/* Jawahar M Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-bg-secondary border border-border-light rounded-[3rem] p-10 md:p-14 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all"
            >
               <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-bl-[200px] -z-10 group-hover:bg-gold/10 transition-all"></div>
               <div className="flex items-center gap-3 mb-10">
                  <Code className="text-gold" />
                  <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">Founder & System Architect</h3>
               </div>
               
               <div className="mb-10 flex items-center gap-8">
                  <div className="w-28 h-28 bg-bg-primary border-4 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 scale-110">
                     <span className="text-4xl font-black text-text-primary">JM</span>
                  </div>
                  <div>
                    <h4 className="text-4xl font-black tracking-tight text-text-primary mb-1">Jawahar R. Mallah</h4>
                    <p className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em]">Lead Engineer · 19+ Years Exp</p>
                  </div>
               </div>

               <div className="text-base font-medium text-text-secondary leading-[1.8] space-y-6">
                  <p className="italic font-bold text-text-primary border-l-4 border-gold pl-6 py-2 bg-gold/5 rounded-r-2xl">
                    "Bridging elite, heavy-duty enterprise technology with uncompromising family software sovereignty."
                  </p>
                  <p>
                    With over 19 years of deep, hands-on engineering experience in Software as a Service (SaaS), Jawahar is the technical mastermind behind the Sovereign OS. His legendary career is cemented by architecting and delivering critical, high-availability software solutions for some of the most massive conglomerates in the country.
                  </p>
                  <p>
                    His enterprise portfolio boasts core architectural and integrations work for <strong>Tally Solutions</strong> (defining local-first systems long before the cloud era), the <strong>Aditya Birla Group, Titan Eye Plus, Madura Garments</strong>, <strong>Raymond, Adidas, Nike</strong>, and <strong>Ram Fashion Export</strong>.
                  </p>
                  <p>
                    Beyond corporate giants, Jawahar has executed high-stakes public trust tech infrastructure. He architected software solutions for the massive <strong>Siddhivinayak Trust</strong> and implemented heavy-duty systems for <strong>GVK</strong>, smoothly handling operations across Pan-India infrastructure. 
                  </p>
                  <p>
                    At Kutumbly, Jawahar pours his master-level enterprise capabilities—from advanced AES encryption algorithms to complex, offline local data processing—into a product designed not for corporations, but for protecting the sovereign data of everyday families.
                  </p>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
      <LandingFooter />
    </>
  );
}
