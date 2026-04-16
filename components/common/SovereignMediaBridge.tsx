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

import React, { useState } from 'react';
import { 
  Play, ExternalLink, Globe, Info, 
  MapPin, Navigation, Share2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Icons for Sovereign OS
const YoutubeIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 2-2h15a2 2 0 0 1 2 2 24.12 24.12 0 0 1 0 10 2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2Z" />
    <path d="m10 15 5-3-5-3v6Z" />
  </svg>
);

const GithubIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.28 1.15-.28 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface SovereignMediaBridgeProps {
  url: string;
}

export default function SovereignMediaBridge({ url }: SovereignMediaBridgeProps) {
  const [loadMedia, setLoadMedia] = useState(false);
  
  // ── Parsers & Logic ───────────────────────────────────────────
  
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isMapUrl = (url: string) => {
    const lower = url.toLowerCase();
    return lower.includes('google.com/maps') || 
           lower.includes('maps.app.goo.gl') || 
           lower.includes('apple.com/maps') ||
           lower.includes('openstreetmap.org');
  };

  const isGithubUrl = (url: string) => {
    return url.toLowerCase().includes('github.com');
  };

  const ytId = getYoutubeId(url);
  const isMap = isMapUrl(url);
  const isGithub = isGithubUrl(url);
  
  let domain = "";
  try {
    const urlObj = new URL(url);
    domain = urlObj.hostname.replace('www.', '');
  } catch (e) {
    domain = "Internal";
  }

  // ── Renderers ────────────────────────────────────────────────

  // 1. YouTube Player
  if (ytId) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        <div className="bg-bg-secondary border border-border-light rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/[0.04] transition-all group-hover:border-gold/40">
          {!loadMedia ? (
            <div 
              className="relative aspect-video bg-bg-tertiary cursor-pointer overflow-hidden group/inner"
              onClick={() => setLoadMedia(true)}
            >
              <img 
                src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                alt="Thumbnail" 
                className="absolute inset-0 w-full h-full object-cover grayscale brightness-50 transition-all duration-700 group-hover/inner:scale-105 group-hover/inner:grayscale-0 group-hover/inner:brightness-[0.7]"
                onError={(e) => (e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/0.jpg`)}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10 pointer-events-none">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gold text-white flex items-center justify-center transition-all duration-500 group-hover/inner:scale-110 shadow-2xl group-hover/inner:shadow-gold/40">
                   <Play size={32} fill="currentColor" />
                </div>
                <div className="text-center mt-6">
                  <div className="flex items-center justify-center gap-2 text-[10px] font-black text-white/90 uppercase tracking-[0.3em]">
                     <YoutubeIcon size={14} className="text-red-500" /> YouTube Preview
                  </div>
                  <p className="text-[9px] text-white/60 font-black uppercase tracking-[0.2em] mt-2">Sovereign Stream Protocol</p>
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          ) : (
            <div className="relative aspect-video bg-black">
               <iframe 
                src={`https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1`}
                title="YouTube video player" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
               />
            </div>
          )}
          
          <div className="p-5 flex items-center justify-between bg-bg-primary">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-bg-tertiary flex items-center justify-center border border-border-light shadow-inner text-text-tertiary">
                   <YoutubeIcon size={20} />
                </div>
                <div className="min-w-0">
                   <div className="text-[10px] font-black uppercase text-text-primary tracking-widest line-clamp-1 opacity-80">{url}</div>
                   <div className="text-[8px] font-bold text-text-tertiary uppercase tracking-wider mt-1">Encrypted Sandbox Mode</div>
                </div>
             </div>
             <div className="flex items-center gap-2">
               <a href={url} target="_blank" rel="noopener noreferrer" className="p-2.5 text-text-tertiary hover:text-gold transition-all bg-bg-tertiary rounded-lg border border-border-light">
                  <ExternalLink size={14} />
               </a>
             </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. Map Bridge
  if (isMap) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="group relative"
      >
        <div className="bg-bg-secondary border border-border-light rounded-[2rem] overflow-hidden shadow-xl shadow-black/[0.03] transition-all group-hover:border-gold/30">
           <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 aspect-square md:aspect-auto bg-bg-tertiary relative flex items-center justify-center overflow-hidden">
                 <div className="absolute inset-0 opacity-10 bg-[url('https://api.dicebear.com/7.x/gridy/svg?seed=maps')] grayscale" />
                 <MapPin size={40} className="text-gold/40 relative z-10" />
                 <Navigation size={80} className="text-gold/5 absolute -bottom-4 -right-4 rotate-12" />
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between bg-bg-primary">
                 <div>
                    <div className="flex items-center gap-2 mb-2">
                       <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em] bg-gold/10 px-2 py-0.5 rounded-full">Location Card</span>
                    </div>
                    <h4 className="text-sm font-black text-text-primary mb-2 line-clamp-2">Sovereign Map Bridge</h4>
                    <p className="text-[10px] text-text-tertiary font-bold line-clamp-2 mb-4 leading-relaxed">
                       External navigation reference detected. Tap to open in your default locally-trusted map provider.
                    </p>
                 </div>
                 
                 <div className="flex gap-2">
                   <a 
                     href={url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex-1 h-11 bg-bg-tertiary border border-border-light rounded-xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-gold hover:text-gold transition-all"
                   >
                     Get Directions <Navigation size={14} />
                   </a>
                 </div>
              </div>
           </div>
        </div>
      </motion.div>
    );
  }

  // 3. GitHub Bridge
  if (isGithub) {
    return (
      <div className="bg-bg-secondary border border-border-light rounded-2xl p-5 flex items-center gap-5 group hover:border-gold/30 transition-all shadow-sm">
         <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center shadow-lg">
            <GithubIcon size={24} />
         </div>
         <div className="flex-1 min-w-0">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1">Github Repository</div>
            <div className="text-sm font-black text-text-primary truncate">{domain === 'github.com' ? url.split('github.com/')[1] : domain}</div>
         </div>
         <a href={url} target="_blank" rel="noopener noreferrer" className="p-3 bg-bg-tertiary border border-border-light rounded-xl text-text-tertiary hover:text-gold transition-all">
            <ExternalLink size={16} />
         </a>
      </div>
    );
  }

  // 4. Fallback Link Card
  return (
    <div className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden group hover:border-gold/30 transition-all shadow-sm">
       <div className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl bg-bg-tertiary border border-border-light flex items-center justify-center flex-shrink-0">
             <img 
               src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
               alt="favicon" 
               className="w-6 h-6 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
               onError={(e) => (e.currentTarget.style.display = 'none')}
             />
             <Globe className="w-6 h-6 text-text-tertiary opacity-40 group-hover:opacity-100" />
          </div>
          
          <div className="flex-1 min-w-0">
             <div className="text-xs font-black text-text-primary uppercase tracking-widest line-clamp-1 truncate">
               {domain}
             </div>
             <div className="text-[10px] text-text-tertiary font-bold truncate opacity-60 leading-tight">{url}</div>
          </div>
          
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2.5 bg-bg-tertiary border border-border-light rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-text-secondary hover:text-gold hover:border-gold transition-all flex items-center gap-2"
          >
             Open <ExternalLink size={12} />
          </a>
       </div>
    </div>
  );
}
