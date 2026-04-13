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
 * lib/dev.ts
 * Development-only utilities for bypassing security friction.
 */

const DEV_STORAGE_KEY = 'kutumbly_dev_db_state';

/**
 * Persist the in-memory DB to localStorage for rapid iteration.
 * This is only used in development.
 */
export function saveDevState(bytes: Uint8Array) {
  if (process.env.NODE_ENV !== 'development') return;
  try {
    // Chunk to avoid "Maximum call stack size exceeded" with large arrays
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    localStorage.setItem(DEV_STORAGE_KEY, btoa(binary));
  } catch (e) {
    console.warn("Failed to save dev state:", e);
  }
}

/**
 * Load the persisted DB state from localStorage.
 */
export function loadDevState(): Uint8Array | null {
  if (process.env.NODE_ENV !== 'development') return null;
  const raw = localStorage.getItem(DEV_STORAGE_KEY);
  if (!raw) return null;
  try {
    const binary = atob(raw);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if Dev Bypass should be active.
 */
export function isDevBypassEnabled(): boolean {
  return process.env.NODE_ENV === 'development';
}
