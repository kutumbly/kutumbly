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

import { create } from 'zustand';
import { VaultMeta, VaultStore } from '@/types/vault';
import { getDevVault } from './vault';
import { saveDevState } from './dev';
import { saveFileHandle, getFileHandle } from './handles';

interface AppStore extends VaultStore {
  // Vault state
  recentVaults: VaultMeta[];
  activeVault: VaultMeta | null;
  isUnlocked: boolean;
  db: any | null; // Placeholder for sql.js Database
  fileHandle: FileSystemFileHandle | null;
  currentPin: string;             // NEVER persisted

  // Gateway UI state
  gatewayPanel: 'unlock' | 'create' | 'import' | 'success' | 'empty';
  selectedVaultIdx: number;

  // App UI state
  activeModule: string;
  hiddenModules: string[];
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  lang: 'en' | 'hi';

  // Dev helper
  isDevMode: boolean;

  // Actions
  loadRecentVaults: () => void;
  syncHandles: () => Promise<void>;
  addRecentVault: (vault: VaultMeta) => void;
  setActiveVault: (vault: VaultMeta | null) => void;
  setGatewayPanel: (p: 'unlock' | 'create' | 'import' | 'success' | 'empty') => void;
  setUnlocked: (db: any, handle?: FileSystemFileHandle) => void;
  lockVault: () => void;
  setCurrentPin: (pin: string) => void;
  setActiveModule: (id: string) => void;
  toggleModule: (id: string) => void;
  setTheme: (t: 'dark' | 'light') => void;
  setSidebarCollapsed: (v: boolean) => void;
  toggleLang: () => void;
  saveSettings: () => void;

  // Dev only
  devInit: () => Promise<void>;
}

export const useAppStore = create<AppStore>((set, get) => ({
  recentVaults: [],
  activeVault: null,
  isUnlocked: false,
  db: null,
  fileHandle: null,
  currentPin: '',
  gatewayPanel: 'empty',
  selectedVaultIdx: 0,
  activeModule: 'home',
  hiddenModules: [],
  theme: 'dark',
  sidebarCollapsed: false,
  lang: 'en',
  isDevMode: process.env.NODE_ENV === 'development',

  loadRecentVaults: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('kutumbly_vaults');
      if (raw) {
        const vaults = JSON.parse(raw);
        set({ recentVaults: vaults });
        // Trigger async sync of handles
        get().syncHandles();
      }

      // Restore theme
      const savedTheme = localStorage.getItem('kutumbly_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        set({ theme: savedTheme });
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      // Restore other settings
      const savedSettings = localStorage.getItem('kutumbly_settings');
      if (savedSettings) {
        const s = JSON.parse(savedSettings);
        if (s.hiddenModules) set({ hiddenModules: s.hiddenModules });
      }
    } catch {}
  },

  syncHandles: async () => {
    const vaults = get().recentVaults;
    if (!vaults.length) return;

    const updated = await Promise.all(vaults.map(async (v) => {
      const handle = await getFileHandle(v.id);
      return { ...v, fileHandle: handle || undefined };
    }));

    set({ recentVaults: updated });
  },

  addRecentVault: (vault) => {
    if (vault.id === 'dev-vault') return;
    
    // Save handle to IndexedDB for persistence across refreshes
    if (vault.fileHandle) {
      saveFileHandle(vault.id, vault.fileHandle as FileSystemFileHandle);
    }

    const existing = get().recentVaults.filter(v => v.id !== vault.id);
    const updated = [vault, ...existing].slice(0, 10);
    
    // We don't stringify the fileHandle into localStorage (it would be empty anyway)
    const serializable = updated.map(({ fileHandle, ...rest }) => rest);
    localStorage.setItem('kutumbly_vaults', JSON.stringify(serializable));
    
    set({ recentVaults: updated });
  },

  setActiveVault: (vault) => set({
    activeVault: vault,
    isUnlocked: false,
    currentPin: '',
    gatewayPanel: vault ? 'unlock' : 'empty',
  }),

  setGatewayPanel: (p) => set({ gatewayPanel: p }),

  setUnlocked: (db, handle) => {
    set({ isUnlocked: true, db, fileHandle: handle || null });
    if (process.env.NODE_ENV === 'development') {
      try { saveDevState(db.export()); } catch {}
    }
  },

  lockVault: () => {
    const currentDb = get().db;
    if (currentDb && typeof currentDb.close === 'function') {
      try { currentDb.close(); } catch {}
    }
    set({ isUnlocked: false, db: null, fileHandle: null, currentPin: '', activeModule: 'home' });
  },

  setCurrentPin: (pin) => set({ currentPin: pin }),

  setActiveModule: (id) => set({ activeModule: id }),

  toggleModule: (id) => {
    const hidden = get().hiddenModules;
    const updated = hidden.includes(id)
      ? hidden.filter(x => x !== id)
      : [...hidden, id];
    set({ hiddenModules: updated });
    get().saveSettings();
  },

  setTheme: (t) => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', t);
    }
    localStorage.setItem('kutumbly_theme', t);
    set({ theme: t });
  },

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  toggleLang: () => set((state) => ({ lang: state.lang === 'en' ? 'hi' : 'en' })),

  saveSettings: () => {
    localStorage.setItem('kutumbly_settings', JSON.stringify({
      hiddenModules: get().hiddenModules,
      theme: get().theme,
    }));
  },

  devInit: async () => {
    if (process.env.NODE_ENV !== 'development') return;
    const db = await getDevVault();
    set({
      db,
      isUnlocked: true,
      fileHandle: null,
      activeVault: { id: 'dev-vault', name: 'Dev Vault', path: 'memory', lastOpened: new Date().toISOString() },
    });
  },
}));
