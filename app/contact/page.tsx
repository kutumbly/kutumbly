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

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, Globe, MapPin, Code } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
          <ArrowLeft size={16} /> Return to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">Reach Out</h1>
        <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
          AITDL Network — Sovereign Division
        </p>

        <div className="grid gap-12 md:grid-cols-2">
          <div className="space-y-10">
             <div>
                <p className="text-text-secondary font-medium leading-[1.8] mb-8">
                  Kutumbly is actively maintained by the AITDL Network engineering team. Because we prioritize the "Zero-Cloud" model, we do not have central customer support for password resets or data recovery. However, we are always eager to hear your feedback, bug reports, and features you’d like to see in the OS.
                </p>
             </div>

             <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-border-light bg-bg-secondary flex items-center justify-center text-gold">
                     <Mail size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text-tertiary">Direct Email</h3>
                    <a href="mailto:kutumbly@outlook.com" className="font-bold text-lg hover:text-gold transition-colors">kutumbly@outlook.com</a>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-border-light bg-bg-secondary flex items-center justify-center text-gold">
                     <Globe size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text-tertiary">Websites</h3>
                    <p className="font-bold text-sm text-text-secondary">
                      kutumbly.com <br/> aitdl.com | aitdl.in
                    </p>
                  </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-border-light bg-bg-secondary flex items-center justify-center text-gold">
                     <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="font-black text-sm uppercase tracking-widest text-text-tertiary">Headquarters</h3>
                    <p className="font-bold text-sm text-text-secondary">
                      AITDL Network <br/> Gorakhpur, Uttar Pradesh <br/> India
                    </p>
                  </div>
               </div>
             </div>
          </div>

          <div className="bg-bg-secondary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/5">
             <div className="flex items-center gap-3 mb-6">
                <Code className="text-gold" />
                <h3 className="font-black uppercase tracking-widest text-sm text-text-primary">System Architect</h3>
             </div>
             
             <div className="text-center mb-8 pt-4">
                <div className="w-24 h-24 bg-gold-light border-2 border-gold/30 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                   <span className="text-3xl font-black text-gold-text">JM</span>
                </div>
                <h4 className="text-xl font-black tracking-tight text-text-primary">Jawahar R. Mallah</h4>
                <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest mt-1">Lead Engineer & Architect</p>
             </div>

             <div className="text-sm font-medium text-text-secondary leading-relaxed text-center px-4">
                "Kutumbly was built to ensure that families can store their most vital information without passing their sovereignty to cloud corporations. Memory, Not Code."
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
