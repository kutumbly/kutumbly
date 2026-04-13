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
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
          <ArrowLeft size={16} /> Return to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">Terms of Service</h1>
        <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
        </p>

        <div className="prose prose-invert prose-p:text-text-secondary prose-p:font-medium prose-p:leading-[1.8] prose-headings:font-black prose-headings:text-text-primary max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By downloading, compiling, or accessing the Kutumbly Sovereign OS ("Software"), you agree to the following terms and conditions. Due to the local-first nature of this software, these terms govern the licensing of the core application rather than a subscription to a cloud service.
          </p>

          <h2>2. Description of Software</h2>
          <p>
            Kutumbly is a decentralized, browser-based operating system designed to securely store and manage family data locally using WebAssembly, SQLite, and WebCrypto APIs. The developers (AITDL Network) provide this software as an interface to manage your own local database constraint.
          </p>

          <h2>3. Ultimate Responsibility</h2>
          <p>
            Because the software is "Zero-Cloud" and operates exclusively on the client-side (your device):
          </p>
          <ul>
            <li><strong>You are strictly responsible</strong> for creating physical or external backups of your `.kutumb` vault file.</li>
            <li>We cannot, under any legal or technical circumstances, retrieve lost data or recover forgotten PIN codes, as the encryption keys are never transmitted to us.</li>
          </ul>

          <h2>4. Liability Limitations</h2>
          <p>
            THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. In no event shall the authors, creators, or AITDL Network be held legally liable for any loss of data, corrupted files, hardware failures, or financial miscalculations resulting from the use of Kutumbly. Use the financial modules (Wealth, SIP tracking) purely as a reference, not as professional financial advice.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            While Kutumbly provides sovereignty over your data, the Kutumbly application architecture, logos, UI assets, and proprietary code logic remain the intellectual property of Jawahar R. Mallah and AITDL Network. Unauthorized redistribution, commercial white-labeling, or resale is strictly prohibited.
          </p>

          <h2>6. Data Sovereignty Right</h2>
          <p>
            We guarantee your right to cleanly end your usage of the software at any time. Your `.kutumb` file contains standard SQLite data that you can technically decrypt and migrate away from our interface format if you choose to no longer use our open software.
          </p>

        </div>
      </div>
    </div>
  );
}
