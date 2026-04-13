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
 * lib/crypto.ts
 * AES-256-GCM encryption/decryption using the Web Crypto API.
 * 
 * .kutumb file binary format:
 * [4 bytes]  magic: "KUTB"
 * [16 bytes] salt  (random per file creation)
 * [12 bytes] IV    (random per save)
 * [N bytes]  AES-256-GCM encrypted SQLite DB
 * 
 * NOTE: 'as any' casts are used when passing Uint8Arrays to SubtleCrypto.
 * Modern TypeScript environments sometimes mismatch Uint8Array with BufferSource
 * because of SharedArrayBuffer considerations.
 */

const MAGIC = "KUTB";
const PBKDF2_ITERATIONS = 100000;

/**
 * Derives a CryptoKey from a PIN and salt using PBKDF2 with SHA-256.
 */
export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as any, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a SQLite database (binary) using a PIN.
 * Output includes SALT and IV for persistence.
 */
export async function encryptDB(dbBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(pin, salt);
  // Cast iv and dbBytes to any to satisfy strict subtle crypto types
  const enc  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv as any }, key, dbBytes as any);
  
  const out  = new Uint8Array(4 + 16 + 12 + enc.byteLength);
  out.set(new TextEncoder().encode(MAGIC), 0);
  out.set(salt, 4);
  out.set(iv,   20);
  out.set(new Uint8Array(enc), 32);
  
  return out;
}

/**
 * Decrypts a ".kutumb" file into a raw SQLite database.
 * Throws 'INVALID_FILE' or 'WRONG_PIN' errors on failure.
 */
export async function decryptDB(fileBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const magic = new TextDecoder().decode(fileBytes.slice(0, 4));
  if (magic !== MAGIC) throw new Error('INVALID_FILE');
  
  const salt = fileBytes.slice(4, 20);
  const iv   = fileBytes.slice(20, 32);
  const data = fileBytes.slice(32);
  
  const key  = await deriveKey(pin, salt);
  try {
    // Cast iv and data to any to satisfy strict subtle crypto types
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv as any }, key, data as any);
    return new Uint8Array(dec);
  } catch (err) {
    throw new Error('WRONG_PIN');
  }
}
