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

import initSqlJs, { Database, SqlJsStatic } from "sql.js";
import { encryptDB, decryptDB } from "./crypto";
import { SCHEMA_SQL } from "./schema";
import { seedDatabase } from "./seed";
import { loadDevState } from "./dev";
import { saveVaultBackup } from "./backup";
import { CURRENT_SCHEMA_VERSION } from "./migrations";
import { useAppStore } from "./store";
import { isSyncDue, performCloudSync } from "./sync";

let SQL_ENGINE: SqlJsStatic | null = null;

async function getEngine(): Promise<SqlJsStatic> {
  if (SQL_ENGINE) return SQL_ENGINE;
  SQL_ENGINE = await initSqlJs({
    locateFile: (file) => `/sql-wasm/${file}`,
  });
  return SQL_ENGINE;
}

/**
 * CREATE: Initialize new SQLite DB, encrypt, save as .kutumb
 */
export async function createVault(name: string, pin: string, authorizedEmails: string[] = []): Promise<{ handle: FileSystemFileHandle | null, vaultId: string }> {
  // 1. Init sql.js with empty DB
  const SQL = await getEngine();
  const db = new SQL.Database();
  
  const vaultId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
  // 2. Run schema + stamp version so migration is never triggered on new vaults
  db.run(SCHEMA_SQL);
  db.run(`PRAGMA user_version = ${CURRENT_SCHEMA_VERSION}`);
  db.run(`INSERT INTO settings (key, value) VALUES ('vault_id', ?)`, [vaultId]);
  db.run(`INSERT INTO settings (key, value) VALUES ('vault_name', ?)`, [name]);
  db.run(`INSERT INTO settings (key, value) VALUES ('created_at', ?)`, [new Date().toISOString()]);
  
  // Save authorized emails
  if (authorizedEmails.length > 0) {
    db.run(`INSERT INTO settings (key, value) VALUES ('gdrive_auth_emails', ?)`, [JSON.stringify(authorizedEmails)]);
  }
  
  // Seed with initial data
  seedDatabase(db);
  
  // 3. Export DB bytes
  const dbBytes = db.export();
  db.close();
  
  // 4. Encrypt
  const fileBytes = await encryptDB(dbBytes, pin);
  
  // 5. Save via File System Access API (or fallback to download)
  if (typeof window !== 'undefined' && 'showSaveFilePicker' in window) {
    try {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`,
        types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
      });
      const writable = await handle.createWritable();
      await writable.write(fileBytes);
      await writable.close();
      
      saveVaultBackup(fileBytes, handle.name).catch(e => console.warn(e));

      return { handle, vaultId };
    } catch (err) {
      console.error("Save file picker failed or cancelled:", err);
      return { handle: null, vaultId };
    }
  } else {
    // Fallback: trigger download
    const blob = new Blob([fileBytes as any], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`;
    a.click();
    URL.revokeObjectURL(url);
    return { handle: null, vaultId };
  }
}

import { verifyPermission } from "./handles";

/**
 * OPEN: Pick .kutumb file, decrypt with PIN, return sql.js DB
 */
export async function openVault(pin: string, handle?: FileSystemFileHandle) {
  let fileBytes: Uint8Array;
  let finalHandle = handle;
  
  if (handle) {
    // SECURITY: Browser requires a fresh user gesture to re-authorize handles after refresh.
    // verifyPermission will return true if already granted, or trigger the browser prompt.
    const hasPermission = await verifyPermission(handle);
    if (!hasPermission) {
      throw new Error('PERMISSION_DENIED');
    }

    let file: File;
    try {
      file = await handle.getFile();
    } catch (e: any) {
      if (e.name === 'NotFoundError' || e.name === 'NotAllowedError') {
        throw new Error('INVALID_FILE');
      }
      throw e;
    }
    fileBytes = new Uint8Array(await file.arrayBuffer());
  } else if (typeof window !== 'undefined' && 'showOpenFilePicker' in window) {
    try {
      const [picked] = await (window as any).showOpenFilePicker({
        types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
      });
      finalHandle = picked;
      const file = await picked.getFile();
      fileBytes = new Uint8Array(await file.arrayBuffer());
    } catch (err) {
      console.error("Open file picker failed or cancelled:", err);
      throw err;
    }
  } else {
    throw new Error('USE_FILE_INPUT'); // caller should show <input type="file">
  }
  
  const dbBytes = await decryptDB(fileBytes, pin); // throws 'WRONG_PIN' if bad auth
  const SQL = await getEngine();
  const db = new SQL.Database(dbBytes);
  
  return { db, handle: finalHandle };
}

/**
 * OPEN FROM BYTES: For cloud restoration or other non-file-handle sources
 */
export async function openVaultFromBytes(bytes: Uint8Array, pin: string) {
  const dbBytes = await decryptDB(bytes, pin);
  const SQL = await getEngine();
  const db = new SQL.Database(dbBytes);
  return db;
}

/**
 * SAVE: Encrypt current DB state and write back to file
 */
export async function saveVault(db: Database, pin: string, handle: FileSystemFileHandle) {
  if (!db || !pin || !handle) return;
  
  const dbBytes = db.export();
  const fileBytes = await encryptDB(dbBytes, pin);
  
  // Background backup triggered silently (7-day rolling)
  saveVaultBackup(fileBytes, handle.name).catch(e => console.warn("Backup skip:", e));
  
  if (typeof (handle as any).createWritable === 'function') {
    const writable = await (handle as any).createWritable();
    await writable.write(fileBytes);
    await writable.close();
  } else {
    // Fallback for non-writable handles (e.g. mobile) might need a download trigger
    // but typically FileSystemFileHandle will have createWritable in Chrome.
    console.warn("Handle not writable. Auto-save failed.");
  }

  // Cloud-Syncript Orchestration: Once-a-day push
  const store = useAppStore.getState();
  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;

  if (isSyncDue(store.lastSyncDate)) {
    if (isOnline && store.gdriveToken && store.currentPin) {
      performCloudSync(store.gdriveToken, db, store.currentPin, (status) => {
        if (status === 'success') {
          store.setSyncStatus({ lastSync: new Date().toISOString(), pendingSync: false });
        }
      });
    } else {
      // If offline or no auth, queue it
      store.setSyncStatus({ pendingSync: true });
    }
  }
}

/**
 * DEV ONLY: Instant in-memory DB or loaded from dev state
 */
export async function getDevVault(): Promise<Database> {
  const SQL = await getEngine();
  const saved = loadDevState();
  
  if (saved) {
    return new SQL.Database(saved);
  }
  
  const db = new SQL.Database();
  db.run(SCHEMA_SQL);
  db.run(`PRAGMA user_version = ${CURRENT_SCHEMA_VERSION}`);
  db.run(`INSERT INTO settings (key, value) VALUES ('vault_name', 'Dev Vault')`);
  seedDatabase(db);
  return db;
}

/**
 * MANUAL BACKUP: Encrypt and store instantly in IndexedDB without overwriting the native handle
 */
export async function triggerManualBackup(db: any, pin: string, vaultId: string) {
  if (!db || !pin || !vaultId) throw new Error("Missing params for manual backup");
  const dbBytes = db.export();
  const fileBytes = await encryptDB(dbBytes, pin);
  await saveVaultBackup(fileBytes, vaultId, 'manual');
}

/**
 * PRE-MIGRATION BACKUP:
 * Encrypts the current DB state and triggers a browser download
 * so users have a safe copy before schema migration is applied.
 *
 * @param db       - open sql.js Database (already decrypted in memory)
 * @param pin      - current vault PIN to re-encrypt the backup
 * @param vaultName - used to name the downloaded file
 * @param fromVersion - the old schema version being migrated from
 */
export async function exportPreMigrationBackup(
  db: any,
  pin: string,
  vaultName: string,
  fromVersion: number
): Promise<void> {
  const dbBytes = db.export();
  const fileBytes = await encryptDB(dbBytes, pin);
  const ts = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const safeName = vaultName.replace(/\s+/g, '-').toLowerCase();
  const filename = `${safeName}_pre-v${fromVersion + 1}_backup_${ts}.kutumb`;

  const blob = new Blob([fileBytes as any], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
