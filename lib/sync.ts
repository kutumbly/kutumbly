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

"use client";

import { uploadVaultFile } from "./gdrive";

const INDIAN_DAY_PREFIXES = ['rav', 'som', 'mAn', 'bud', 'gur', 'shu', 'sha'];

/**
 * Generate filename: K-[DayPrefix]-[YYYYMMDD]-[HHMM].kutumb
 */
export function generateBackupFilename(): string {
  const d = new Date();
  const dayPrefix = INDIAN_DAY_PREFIXES[d.getDay()];
  
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  
  return `K-${dayPrefix}-${yyyy}${mm}${dd}-${hh}${min}.kutumb`;
}

/**
 * Check if the last sync was more than 24 hours ago
 */
export function isSyncDue(lastSyncStr: string | null): boolean {
  if (!lastSyncStr) return true;
  const lastSync = new Date(lastSyncStr).getTime();
  const now = new Date().getTime();
  return (now - lastSync) > 24 * 60 * 60 * 1000;
}

/**
 * Orchestrate the Cloud-Syncript push
 */
export async function performCloudSync(
  accessToken: string, 
  db: any, 
  pin: string,
  onProgress: (status: 'syncing' | 'success' | 'error' | 'unauthorized') => void
): Promise<boolean> {
  if (!accessToken || !db || !pin) return false;
  
  onProgress('syncing');
  try {
    // 1. IDENTITY VERIFICATION (STRICT)
    const { fetchUserEmail } = await import("./gdrive");
    const userEmail = await fetchUserEmail(accessToken);
    
    const authListRaw = db.exec("SELECT value FROM settings WHERE key = 'gdrive_auth_emails'");
    const authorizedEmails: string[] = authListRaw.length > 0 ? JSON.parse(authListRaw[0].values[0][0]) : [];

    if (authorizedEmails.length > 0) {
      if (!userEmail || !authorizedEmails.includes(userEmail.toLowerCase())) {
        console.warn("Cloud-Syncript Blocked: Unauthorized Google Account", userEmail);
        onProgress('unauthorized');
        return false;
      }
    }

    // 2. Export and encrypt
    const dbBytes = db.export();
    const { encryptDB } = await import("./crypto");
    const encryptedBytes = await encryptDB(dbBytes, pin);
    
    // 3. Upload
    const filename = generateBackupFilename();
    const success = await uploadVaultFile(accessToken, encryptedBytes, filename);
    
    onProgress(success ? 'success' : 'error');
    return success;
  } catch (err) {
    console.error("Cloud-Syncript Failed:", err);
    onProgress('error');
    return false;
  }
}
