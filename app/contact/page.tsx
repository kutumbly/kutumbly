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
import { ArrowLeft, Mail, Globe, MapPin, Code, Star } from 'lucide-react';
import LandingHeader from '@/components/landing/LandingHeader';
import LandingFooter from '@/components/landing/LandingFooter';

export default function Contact() {
  return (
    <>
      <LandingHeader />
      <div className="min-h-screen bg-bg-primary text-text-primary pt-24">
        <div className="max-w-4xl mx-auto px-6 py-20 pb-32">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
            <ArrowLeft size={16} /> Return to Home
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">Reach Out</h1>
          <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
            AITDL Network — Sovereign Division
          </p>

          <div className="grid gap-12 md:grid-cols-2 mb-20">
            <div className="space-y-10">
               <div>
                  <p className="text-text-secondary font-medium leading-[1.8] mb-8 pr-4">
                    Kutumbly is actively maintained by the AITDL Network engineering team. Because we prioritize the "Zero-Cloud" model, we do not have central customer support for password resets or data recovery. However, we are always eager to hear your feedback, bug reports, and features you’d like to see in the OS.
                  </p>
               </div>
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

          {/* The Visionaries Behind Kutumbly */}
          <div className="border-t border-border-light pt-20">
             <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 text-text-primary">The Visionaries Behind Kutumbly</h2>
                <p className="text-text-tertiary font-bold uppercase tracking-widest text-xs">Bridging deep enterprise technology with family sovereignty</p>
             </div>

             <div className="grid md:grid-cols-2 gap-8">
                {/* Pushpa D Card */}
                <div className="bg-bg-secondary border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-gold/10 transition-all"></div>
                   <div className="flex items-center gap-3 mb-8">
                      <Star className="text-gold" />
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-text-primary">Founder & Principal Financier</h3>
                   </div>
                   
                   <div className="mb-6 flex items-center gap-6">
                      <div className="w-20 h-20 bg-bg-primary border-2 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0">
                         <span className="text-2xl font-black text-text-primary">PD</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight text-text-primary mb-1">Pushpa D.</h4>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Head of Sales & Vision</p>
                      </div>
                   </div>

                   <div className="text-sm font-medium text-text-secondary leading-[1.8] space-y-4">
                      <p className="italic font-semibold text-text-primary border-l-2 border-gold pl-4 opacity-90">
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
                </div>

                {/* Jawahar M Card */}
                <div className="bg-bg-secondary border border-border-light rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-black/5 relative overflow-hidden group hover:border-gold/30 transition-all">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-bl-[100px] -z-10 group-hover:bg-gold/10 transition-all"></div>
                   <div className="flex items-center gap-3 mb-8">
                      <Code className="text-gold" />
                      <h3 className="font-black uppercase tracking-widest text-[10px] text-text-primary">Founder & System Architect</h3>
                   </div>
                   
                   <div className="mb-6 flex items-center gap-6">
                      <div className="w-20 h-20 bg-bg-primary border-2 border-border-light rounded-full flex items-center justify-center shadow-inner shrink-0">
                         <span className="text-2xl font-black text-text-primary">JM</span>
                      </div>
                      <div>
                        <h4 className="text-2xl font-black tracking-tight text-text-primary mb-1">Jawahar R. Mallah</h4>
                        <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Lead Engineer</p>
                      </div>
                   </div>

                   <div className="text-sm font-medium text-text-secondary leading-[1.8] space-y-4">
                      <p className="italic font-semibold text-text-primary border-l-2 border-gold pl-4 opacity-90">
                        "Bridging elite, heavy-duty enterprise technology with uncompromising family software sovereignty."
                      </p>
                      <p>
                        With over 19 years of deep, hands-on engineering experience in Software as a Service (SaaS), Jawahar is the technical mastermind behind the Sovereign OS. His legendary career is cemented by architecting and delivering critical, high-availability software solutions for some of the most massive conglomerates in the country.
                      </p>
                      <p>
                        His enterprise portfolio boasts core architectural and integrations work for <strong>Tally Solutions</strong> (defining local-first systems long before the cloud era), the <strong>Aditya Birla Group, Titan Eye Plus, Madura Garments</strong> (powering backend operations for Allen Solly, Van Heusen, Peter England), <strong>Raymond, Adidas, Nike, Krishan Textiles, GTN Textile</strong>, and <strong>Ram Fashion Export</strong>.
                      </p>
                      <p>
                        Beyond corporate giants, Jawahar has executed high-stakes public trust tech infrastructure. He architected software solutions for the massive <strong>Siddhivinayak Trust</strong> and implemented heavy-duty systems for <strong>GVK</strong> through Parth Infotech, smoothly handling operations across Pan-India infrastructure. 
                      </p>
                      <p>
                        At Kutumbly, Jawahar pours his master-level enterprise capabilities—from advanced AES encryption algorithms to complex, offline WebAssembly local compilation—into a product designed not for corporations, but for protecting the sovereign data of everyday families.
                      </p>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
      <LandingFooter />
    </>
  );
}
