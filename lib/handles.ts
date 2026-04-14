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

const DB_NAME = "kutumbly_handles";
const STORE_NAME = "file_handles";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e: any) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = (e: any) => resolve(e.target.result);
    req.onerror = (e) => reject(e);
  });
}

export async function saveFileHandle(vaultId: string, handle: FileSystemFileHandle) {
  if (!vaultId || !handle) return;
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.put(handle, vaultId);
  } catch (err) {
    console.error("Failed to save handle to IDB:", err);
  }
}

export async function getFileHandle(vaultId: string): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(vaultId);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function removeFileHandle(vaultId: string) {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    store.delete(vaultId);
  } catch {}
}

/**
 * Browsers require explicit permission to use a handle restored from IDB.
 */
export async function verifyPermission(handle: FileSystemFileHandle, readWrite = true) {
  const options: any = { mode: readWrite ? 'readwrite' : 'read' };
  
  // Check if we already have permission
  if ((await (handle as any).queryPermission(options)) === 'granted') {
    return true;
  }
  
  // Request permission
  if ((await (handle as any).requestPermission(options)) === 'granted') {
    return true;
  }
  
  return false;
}

/**
 * COMPLETELY WIPE ALL HANDLES: Used for Factory Reset
 */
export async function clearAllHandles(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = indexedDB.deleteDatabase(DB_NAME);
    req.onsuccess = () => resolve(true);
    req.onerror = () => resolve(false);
    req.onblocked = () => resolve(false);
  });
}
