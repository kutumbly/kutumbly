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

import React, { useState } from 'react';
import { Play, ExternalLink, Globe, Info, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Custom Youtube Icon for Sovereign OS
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

interface SovereignMediaBridgeProps {
  url: string;
}

export default function SovereignMediaBridge({ url }: SovereignMediaBridgeProps) {
  const [loadMedia, setLoadMedia] = useState(false);
  
  // YouTube Detection
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const ytId = getYoutubeId(url);
  const domain = new URL(url).hostname.replace('www.', '');

  if (ytId) {
    return (
      <div className="my-6 group">
        <div className="bg-bg-secondary border border-border-light rounded-[2rem] overflow-hidden shadow-xl shadow-black/[0.03] transition-all group-hover:border-gold/30">
          {!loadMedia ? (
            <div 
              className="relative aspect-video bg-bg-tertiary cursor-pointer flex flex-col items-center justify-center p-8 group/inner"
              onClick={() => setLoadMedia(true)}
            >
              {/* Thumbnail Placeholder with Privacy Mask */}
              <div className="absolute inset-0 opacity-20 transition-opacity group-hover/inner:opacity-40">
                <img 
                  src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover grayscale brightness-50"
                  onError={(e) => (e.currentTarget.src = `https://img.youtube.com/vi/${ytId}/0.jpg`)}
                />
              </div>
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gold/90 text-white flex items-center justify-center transition-transform group-hover/inner:scale-110 shadow-2xl">
                   <Play size={32} fill="currentColor" />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-xs font-black text-text-primary uppercase tracking-widest">
                     <YoutubeIcon size={14} className="text-red-500" /> YouTube
                  </div>
                  <p className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest mt-1">Click to load securely</p>
                </div>
              </div>
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
          
          <div className="p-4 border-t border-border-light flex items-center justify-between bg-bg-primary/50">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border-light">
                   <YoutubeIcon size={16} className="text-text-tertiary" />
                </div>
                <div>
                   <div className="text-[10px] font-black uppercase text-text-primary tracking-widest line-clamp-1">{url}</div>
                   <div className="text-[9px] font-bold text-text-tertiary uppercase">Inbuilt Sovereign Player</div>
                </div>
             </div>
             <a href={url} target="_blank" rel="noopener noreferrer" className="p-2 text-text-tertiary hover:text-gold transition-colors">
                <ExternalLink size={16} />
             </a>
          </div>
        </div>
      </div>
    );
  }

  // Generic Link Card
  return (
    <div className="my-6">
      <div className="bg-bg-secondary border border-border-light rounded-2xl overflow-hidden group hover:border-gold/30 transition-all shadow-sm">
         <div className="flex items-center gap-4 p-5">
            <div className="w-12 h-12 rounded-xl bg-bg-tertiary flex items-center justify-center border border-border-light flex-shrink-0">
               <img 
                 src={`https://www.google.com/s2/favicons?domain=${domain}&sz=128`} 
                 alt="favicon" 
                 className="w-6 h-6 rounded-md opacity-80 group-hover:opacity-100 transition-opacity"
                 onError={(e) => (e.currentTarget.style.display = 'none')}
               />
               <Globe className="w-6 h-6 text-text-tertiary hidden" /> {/* Fallback if needed */}
            </div>
            
            <div className="flex-1 min-w-0">
               <div className="text-xs font-black text-text-primary uppercase tracking-widest line-clamp-1 truncate">{domain}</div>
               <div className="text-[10px] text-text-tertiary font-bold truncate opacity-60">{url}</div>
            </div>
            
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-bg-tertiary border border-border-light rounded-xl text-[10px] font-black uppercase tracking-widest text-text-secondary hover:text-gold hover:border-gold transition-all flex items-center gap-2"
            >
               Visit <ExternalLink size={12} />
            </a>
         </div>
         
         <div className="h-1.5 w-full bg-border-light/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 h-full w-1/4 bg-gold opacity-20 group-hover:translate-x-[400%] transition-transform duration-[2s] ease-in-out" />
         </div>
      </div>
    </div>
  );
}
