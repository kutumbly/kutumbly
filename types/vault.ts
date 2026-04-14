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


export interface VaultMeta {
  id: string;
  name: string;
  icon?: string;                  // emoji e.g. "🏠"
  path?: string;                  // display string only (not sensitive)
  filePath?: string;              // native path if File System Access API
  fileHandle?: FileSystemFileHandle; 
  lastOpened: string;             // ISO date string
  memberCount?: number;
  createdAt?: string;
}

export interface VaultStore {
  recentVaults: VaultMeta[];
  activeVault: VaultMeta | null;
  isUnlocked: boolean;
  db: any | null;                 // Instance of sql.js Database
  fileHandle: FileSystemFileHandle | null; 
}

export type GatewayPanel = 'unlock' | 'create' | 'import' | 'success' | 'empty' | 'recover' | 'discovery';
