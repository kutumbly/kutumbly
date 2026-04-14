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

const DB_NAME = "kutumbly_backups";
const STORE_NAME = "vault_snapshots";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = (e: any) => resolve(e.target.result);
    req.onerror = (e) => reject(e);
  });
}

export async function saveVaultBackup(bytes: Uint8Array, vaultId: string, type: 'auto' | 'manual' = 'auto') {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    
    // Generate today's date string (e.g., "2026-04-13")
    const today = new Date().toISOString().split('T')[0];
    const backupId = type === 'manual' 
      ? `${vaultId}_manual_${Date.now()}` 
      : `${vaultId}_auto_${today}`;
    
    // Perform cleanup for old backups for this specific vault
    const getAllReq = store.getAll();
    
    getAllReq.onsuccess = () => {
      const backups = getAllReq.result as { id: string; timestamp: number }[];
      // Filter backups that belong to THIS vault
      const vaultBackups = backups.filter(b => b.id.startsWith(vaultId + '_'));
      
      // Sort in descending order (newest first)
      vaultBackups.sort((a, b) => b.timestamp - a.timestamp);
      
      // Keep today + up to 6 older ones. Total max = 7. Delete anything beyond that.
      if (vaultBackups.length > 6) {
        const toDelete = vaultBackups.slice(6);
        for (const old of toDelete) {
          store.delete(old.id);
        }
      }
    };

    // Store today's backup
    store.put({
      id: backupId,
      vaultId,
      type,
      timestamp: Date.now(),
      data: bytes, // Uint8Array stored natively in IDB
    });

  } catch (err) {
    console.error("Backup Failed:", err);
  }
}

export async function getVaultBackups(vaultId: string): Promise<{ id: string; type: 'auto' | 'manual'; timestamp: number; data: Uint8Array }[]> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      
      req.onsuccess = () => {
        const backups = req.result;
        // Filter and sort for the requested vault
        const filtered = backups
          .filter((b: any) => b.vaultId === vaultId)
          .sort((a: any, b: any) => b.timestamp - a.timestamp);
        
        resolve(filtered);
      };
      req.onerror = () => reject([]);
    });
  } catch {
    return [];
  }
}

/**
 * COMPLETELY WIPE ALL BACKUPS: Used for Factory Reset
 */
export async function deleteAllSnapshots(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
    req.onblocked = () => resolve(false);
  });
}
