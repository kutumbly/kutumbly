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

import { create } from 'zustand';
import { VaultMeta, VaultStore, GatewayPanel } from '@/types/vault';
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
  gatewayPanel: GatewayPanel;
  selectedVaultIdx: number;
  discoveryEmail: string;

  // App UI state
  activeModule: string;
  hiddenModules: string[];
  theme: 'dark' | 'light';
  sidebarCollapsed: boolean;
  lang: 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'ta' | 'bho' | 'kn' | 'te' | 'ne' | 'bn' | 'mni';
  
  // Cloud-Syncript state
  lastSyncDate: string | null;
  isSyncing: boolean;
  gdriveToken: string | null;  // Memory only
  pendingSync: boolean;

  // Dev helper
  isDevMode: boolean;

  // Actions
  loadRecentVaults: () => void;
  syncHandles: () => Promise<void>;
  addRecentVault: (vault: VaultMeta) => void;
  setActiveVault: (vault: VaultMeta | null) => void;
  setGatewayPanel: (p: GatewayPanel) => void;
  setDiscoveryEmail: (email: string) => void;
  setUnlocked: (db: any, handle?: FileSystemFileHandle) => void;
  lockVault: () => void;
  setCurrentPin: (pin: string) => void;
  setActiveModule: (id: string) => void;
  toggleModule: (id: string) => void;
  setTheme: (t: 'dark' | 'light') => void;
  setSidebarCollapsed: (v: boolean) => void;
  setLang: (l: 'en' | 'hi' | 'mr' | 'gu' | 'pa' | 'ta' | 'bho' | 'kn' | 'te' | 'ne' | 'bn' | 'mni') => void;
  setGDriveToken: (t: string | null) => void;
  setSyncStatus: (s: { lastSync?: string, isSyncing?: boolean, pendingSync?: boolean }) => void;
  unlinkCloud: () => void;
  factoryReset: () => Promise<void>;
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
  gatewayPanel: 'discovery',
  selectedVaultIdx: 0,
  discoveryEmail: '',
  activeModule: 'home',
  hiddenModules: [],
  theme: 'light',
  sidebarCollapsed: false,
  lang: 'en',
  lastSyncDate: null,
  isSyncing: false,
  gdriveToken: null,
  pendingSync: false,
  isDevMode: process.env.NODE_ENV === 'development',

  loadRecentVaults: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('kutumbly_vaults');
      if (raw && raw.trim()) {
        const vaults = JSON.parse(raw);
        set({ recentVaults: vaults, gatewayPanel: (vaults && vaults.length > 0) ? 'unlock' : 'discovery' });
        get().syncHandles();
      } else {
        set({ gatewayPanel: 'discovery' });
      }

      // Restore theme
      const savedTheme = localStorage.getItem('kutumbly_theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        set({ theme: savedTheme });
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
      }

      // Restore other settings
      const savedSettings = localStorage.getItem('kutumbly_settings');
      if (savedSettings && savedSettings.trim()) {
        try {
          const s = JSON.parse(savedSettings);
          if (s.hiddenModules) set({ hiddenModules: s.hiddenModules });
          if (s.lastSyncDate) set({ lastSyncDate: s.lastSyncDate });
          if (s.pendingSync) set({ pendingSync: s.pendingSync });
          if (s.lang) set({ lang: s.lang });
        } catch (e) {
          console.error("Failed to parse settings", e);
        }
      }

      // Individual lang fallback if settings missing
      const savedLang = localStorage.getItem('kutumbly_lang') as any;
      if (savedLang) set({ lang: savedLang });
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
  setDiscoveryEmail: (email) => set({ discoveryEmail: email }),

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

  setLang: (l) => {
    localStorage.setItem('kutumbly_lang', l);
    set({ lang: l });
    get().saveSettings();
  },

  setGDriveToken: (t) => set({ gdriveToken: t }),

  setSyncStatus: (s) => {
    set((state) => ({
      lastSyncDate: s.lastSync !== undefined ? s.lastSync : state.lastSyncDate,
      isSyncing: s.isSyncing !== undefined ? s.isSyncing : state.isSyncing,
      pendingSync: s.pendingSync !== undefined ? s.pendingSync : state.pendingSync,
    }));
    get().saveSettings();
  },

  unlinkCloud: () => {
    set({ gdriveToken: null, lastSyncDate: null, pendingSync: false });
    get().saveSettings();
  },

  factoryReset: async () => {
    // 1. Clear memory variables explicitly
    set({ db: null, currentPin: '', activeVault: null, isUnlocked: false });
    
    // 2. Wipe IndexedDBs
    const { deleteAllSnapshots } = await import('./backup');
    const { clearAllHandles } = await import('./handles');
    await Promise.all([deleteAllSnapshots(), clearAllHandles()]);
    
    // 3. Wipe LocalStorage
    localStorage.clear();
    
    // 4. Ultimate Memory Wipe: Reload
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },

  saveSettings: () => {
    localStorage.setItem('kutumbly_settings', JSON.stringify({
      hiddenModules: get().hiddenModules,
      theme: get().theme,
      lang: get().lang,
      lastSyncDate: get().lastSyncDate,
      pendingSync: get().pendingSync,
    }));
  },

  devInit: async () => {
    if (process.env.NODE_ENV !== 'development') return;
    const db = await getDevVault();
    set({
      db,
      isUnlocked: true,
      fileHandle: null,
      activeVault: { id: 'dev-vault', name: 'Dev Vault', icon: '🛠️', lastOpened: new Date().toISOString(), createdAt: new Date().toISOString(), memberCount: 1 },
    });
  },
}));
