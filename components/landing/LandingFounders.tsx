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
import { motion } from 'framer-motion';
import { Star, Code } from 'lucide-react';

export default function LandingFounders() {
  return (
    <section className="py-24 bg-bg-primary px-6" id="founders">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">The Visionaries Behind Kutumbly</h2>
          <p className="text-text-secondary font-medium text-base md:text-lg max-w-2xl mx-auto">
            Bridging raw business intuition with elite, heavy-duty enterprise technology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pushpa D Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-bg-tertiary border border-border-light rounded-[3rem] p-10 relative overflow-hidden group hover:border-gold/30 transition-all flex flex-col"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-bl-[120px] -z-10 group-hover:bg-gold/10 transition-all" />
            <div className="flex items-center gap-3 mb-8">
              <Star className="text-gold" size={20} />
              <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">Founder & Principal Financier</h3>
            </div>
            
            <div className="mb-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-bg-primary border-2 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 text-3xl font-black text-text-primary">
                PD
              </div>
              <div>
                <h4 className="text-3xl font-black tracking-tight text-text-primary mb-1">Pushpa D.</h4>
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Head of Sales & Vision · Gorakhpur</p>
              </div>
            </div>

            <div className="text-sm font-medium text-text-secondary leading-[1.8] space-y-4">
              <p className="italic font-bold text-text-primary border-l-2 border-gold pl-4 opacity-90">
                "Real wisdom isn't inherited in a classroom; it’s forged in the village and tempered by raw experience."
              </p>
              <p>
                Hailing from Gorakhpur, Pushpa possesses a profound, intuitive understanding of complex operational and financial processes. Her "native intelligence" is the bedrock of Kutumbly's practical architecture.
              </p>
              <p>
                As the Founder and primary financier, she provided the financial backbone and the moral compass for the project. She ensures that every module—from Money to Nevata—resonates with the authentic needs and cultural nuances of Indian families.
              </p>
              <p>
                Her vision is simple: to bring elite-level data sovereignty to every household, ensuring that family memories and wealth remain private and protected for generations.
              </p>
            </div>
          </motion.div>

          {/* Jawahar M Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-bg-tertiary border border-border-light rounded-[3rem] p-10 relative overflow-hidden group hover:border-gold/30 transition-all flex flex-col"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-gold/5 rounded-bl-[120px] -z-10 group-hover:bg-gold/10 transition-all" />
            <div className="flex items-center gap-3 mb-8">
              <Code className="text-gold" size={20} />
              <h3 className="font-black uppercase tracking-widest text-[11px] text-text-primary">Founder & System Architect</h3>
            </div>
            
            <div className="mb-8 flex items-center gap-6">
              <div className="w-24 h-24 bg-bg-primary border-2 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0 text-3xl font-black text-text-primary">
                JM
              </div>
              <div>
                <h4 className="text-3xl font-black tracking-tight text-text-primary mb-1">Jawahar R. Mallah</h4>
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.2em]">Lead Engineer · 19+ Years Exp</p>
              </div>
            </div>

            <div className="text-sm font-medium text-text-secondary leading-[1.8] space-y-4">
              <p className="italic font-bold text-text-primary border-l-2 border-gold pl-4 opacity-90">
                "Bridging elite enterprise technology with uncompromising family software sovereignty."
              </p>
              <p>
                With 19+ years in SaaS engineering, Jawahar has delivered critical **Pan-India Retail and Warehouse solutions** for massive conglomerates like **Aditya Birla Group, Raymond, Adidas**, and **Nike**.
              </p>
              <p>
                He has architected tech infrastructure for the **Siddhivinayak Trust** and managed **GVK's Retail & Warehouse sections in Mumbai**. At Kutumbly, he pours this master-level experience into protecting the sovereign data of families.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
