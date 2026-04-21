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

/**
 * SOVEREIGN AUTH CORE
 * ─────────────────────────────────────────────────────────────
 * Single gateway for vault lock/unlock operations.
 * All modules check auth state from here — never from global state directly.
 * ─────────────────────────────────────────────────────────────
 */

// Re-export vault and crypto utilities — single source of truth
export { saveVault } from '@/lib/vault';
export { encryptDB, decryptDB, deriveKey } from '@/lib/crypto';
export { hasBiometricRegistered } from '@/lib/biometric';

/**
 * Auth guard helper.
 * Wraps any vault mutation to ensure the vault is open before executing.
 * 
 * Usage inside a module repo:
 *   withAuth({ db, currentPin, fileHandle }, () => {
 *     db.run('INSERT INTO ...');
 *   });
 */
export function withAuth(
  ctx: { db: any; currentPin: string | null; fileHandle: FileSystemFileHandle | null },
  operation: () => void
): void {
  if (!ctx.db || !ctx.currentPin) {
    console.warn('[Sovereign Auth] Operation blocked — vault is locked.');
    return;
  }
  operation();
}
