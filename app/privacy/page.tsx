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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <div className="max-w-3xl mx-auto px-6 py-20 pb-32">
        <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:text-gold transition-colors mb-12">
          <ArrowLeft size={16} /> Return to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-text-primary">100% Privacy by Design</h1>
        <p className="text-text-secondary text-sm font-bold uppercase tracking-widest mb-16 opacity-80 border-b border-border-light pb-8">
          Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric'})}
        </p>

        <div className="prose prose-invert prose-p:text-text-secondary prose-p:font-medium prose-p:leading-[1.8] prose-headings:font-black prose-headings:text-text-primary max-w-none">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Kutumbly Sovereign OS. From day one, Kutumbly was architected to solve a fundamental problem with modern software: the loss of digital sovereignty. This Privacy Policy is uniquely short because our architecture inherently limits what we can do with your data. We operate on a "Zero-Cloud" and "Local First" philosophy.
          </p>

          <h2>2. Your Data Stays Yours</h2>
          <p>
            <strong>We do not collect, read, or monetize your family data.</strong>
            Everything you enter into Kutumbly—from wealth metrics to secure diary entries—is encrypted and stored directly within a `.kutumb` vault file that never leaves your device unless you explicitly move it.
          </p>

          <h2>3. Encryption & Access</h2>
          <p>
            Your vault is encrypted using military-grade WebCrypto APIs (AES-GCM). The PIN you use to lock your vault acts as the encryption key. Because we do not store this key anywhere on a central server, we cannot help you recover your data if you forget your PIN. You are genuinely the sole owner of your access.
          </p>

          <h2>4. No Telemetry & No Trackers</h2>
          <p>
            Kutumbly does not embed third-party advertising trackers, session recording tools, or invasive analytics. The software runs almost entirely within your browser using WebAssembly (WASM), processing logic locally.
          </p>

          <h2>5. Cookies & Local Storage</h2>
          <p>
            We use your browser's IndexedDB and LocalStorage APIs strictly to facilitate the functional operations of the application (such as keeping your OS theme preference or caching file handles for seamless re-entry). We do not use these technologies for cross-site tracking or advertising profiling.
          </p>

          <h2>6. Data Portability</h2>
          <p>
            Since your entire Kutumbly environment is contained within a single SQLite-based `.kutumb` file, you can infinitely export, backup, or transfer it to another hardware device without requiring our permission to do so.
          </p>

          <h2>7. Updates to this Policy</h2>
          <p>
            If we ever launch synchronized cloud backup features in the future, it will be strictly opt-in and end-to-end encrypted (E2EE), meaning even then we will never hold the keys to read your data. Any changes to this doctrine will be prominently announced in future operating system updates.
          </p>

          <div className="mt-16 p-8 bg-bg-tertiary border border-gold/20 rounded-[2rem] text-center">
            <h3 className="text-sm font-black text-gold uppercase tracking-widest mb-2 mt-0">The Sovereign Guarantee</h3>
            <p className="text-xs mb-0">Your memory, your rules. No one else has the keys.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
