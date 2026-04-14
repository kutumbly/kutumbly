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

import DiscoveryPanel from '@/components/gateway/DiscoveryPanel';

export default function GatewayPage() {
  const { 
    loadRecentVaults, 
    recentVaults, 
    setActiveVault, 
    devInit,
    gatewayPanel,
    setGatewayPanel
  } = useAppStore();

  // Initial load
  useEffect(() => {
    loadRecentVaults();
  }, []);

  const handleDevBypass = async () => {
    await devInit();
    setGatewayPanel('success');
  };

  const renderPanel = () => {
    switch (gatewayPanel) {
      case 'discovery':
        return <DiscoveryPanel />;
      case 'unlock':
        return <UnlockPanel onSuccess={() => setGatewayPanel('success')} />;
      case 'create':
        return <CreateVaultPanel onBack={() => setGatewayPanel('discovery')} onSuccess={() => setGatewayPanel('success')} />;
      case 'import':
        return <ImportPanel onBack={() => setGatewayPanel('discovery')} onSuccess={() => setGatewayPanel('success')} />;
      case 'recover':
        return <RecoverPanel onBack={() => setGatewayPanel('discovery')} />;
      case 'success':
        return <SuccessPanel />;
      default:
        return <DiscoveryPanel />;
    }
  };

  return (
    <GatewayShell sidebar={<VaultList onPanelChange={setGatewayPanel} />}>
      <AnimatePresence mode="wait">
        <motion.div
          key={gatewayPanel}
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
