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

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { GatewayPanel } from '@/types/vault';
import { isDevBypassEnabled } from '@/lib/dev';
import GatewayShell from '@/components/gateway/GatewayShell';
import VaultList from '@/components/gateway/VaultList';
import UnlockPanel from '@/components/gateway/UnlockPanel';
import CreateVaultPanel from '@/components/gateway/CreateVaultPanel';
import ImportPanel from '@/components/gateway/ImportPanel';
import SuccessPanel from '@/components/gateway/SuccessPanel';
import RecoverPanel from '@/components/gateway/RecoverPanel';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function GatewayPage() {
  const { loadRecentVaults, recentVaults, setActiveVault, devInit } = useAppStore();
  const [panel, setPanel] = useState<GatewayPanel>('empty');

  // Initial load
  useEffect(() => {
    loadRecentVaults();
  }, []);

  // Decide initial panel based on recent vaults
  useEffect(() => {
    if (recentVaults.length > 0) {
      setActiveVault(recentVaults[0]);
      setPanel('unlock');
    } else {
      setPanel('empty');
    }
  }, [recentVaults.length]);

  const handleDevBypass = async () => {
    await devInit();
    setPanel('success');
  };

  const renderPanel = () => {
    switch (panel) {
      case 'unlock':
        return <UnlockPanel onSuccess={() => setPanel('success')} />;
      case 'create':
        return <CreateVaultPanel onBack={() => setPanel('unlock')} onSuccess={() => setPanel('success')} />;
      case 'import':
        return <ImportPanel onBack={() => setPanel('unlock')} onSuccess={() => setPanel('success')} />;
      case 'recover':
        return <RecoverPanel onBack={() => setPanel('unlock')} />;
      case 'success':
        return <SuccessPanel />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-secondary/20">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border-[0.5px] border-border-light">
              <Image src="/favicon.svg" alt="Kutumbly Logo" width={36} height={36} className="brightness-110" />
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">Swagat Hai!</h2>
            <p className="text-sm text-text-secondary max-w-[280px] mb-8 leading-relaxed">
              Kutumbly setup karne ke liye ek naya vault banayein ya apni puraani file kholiye.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              <button 
                onClick={() => setPanel('create')}
                className="btn btn-primary w-full"
              >
                Naya Vault Banao
              </button>
              <button 
                onClick={() => setPanel('import')}
                className="btn w-full"
              >
                File Kholo
              </button>
              
              {isDevBypassEnabled() && (
                <button 
                  onClick={handleDevBypass}
                  className="mt-4 text-xs font-semibold text-gold hover:underline"
                >
                  ⚡ Developer Bypass (DX)
                </button>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <GatewayShell sidebar={<VaultList onPanelChange={setPanel} />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={panel}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="h-full"
        >
          {renderPanel()}
        </motion.div>
      </AnimatePresence>
    </GatewayShell>
  );
}
