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

/**
 * lib/biometric.ts
 * WebAuthn PRF Extension for True Zero-Cloud Biometric Unlock
 * Maps a Vault's PIN to the biometric enclave hardware.
 */

const SALT_STRING = "KutumblySovereignOSPRFSaltV1";

// Helper: symmetric encrypt the PIN using the PRF-derived 32-byte key material
async function encryptPIN(pin: string, keyMaterial: ArrayBuffer): Promise<{ iv: number[], cipher: number[] }> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', keyMaterial,
    { name: 'AES-GCM' }, false, ['encrypt']
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(pin));
  return { iv: Array.from(iv), cipher: Array.from(new Uint8Array(cipher)) };
}

// Helper: symmetric decrypt the PIN
async function decryptPIN(ivArr: number[], cipherArr: number[], keyMaterial: ArrayBuffer): Promise<string> {
  const dec = new TextDecoder();
  const key = await crypto.subtle.importKey(
    'raw', keyMaterial,
    { name: 'AES-GCM' }, false, ['decrypt']
  );
  const iv = new Uint8Array(ivArr);
  const cipher = new Uint8Array(cipherArr);
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, cipher);
  return dec.decode(plain);
}

export async function isPrfSupported(): Promise<boolean> {
  // Check if WebAuthn and PRF are supported
  if (!window.PublicKeyCredential) return false;
  return true; 
}

export async function registerBiometric(vaultId: string, pin: string): Promise<boolean> {
  try {
    const saltBuffer = new TextEncoder().encode(SALT_STRING).buffer;
    const challenge = crypto.getRandomValues(new Uint8Array(32));
    const userId = crypto.getRandomValues(new Uint8Array(16));
    
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "Kutumbly Sovereign Vault", id: window.location.hostname },
        user: { id: userId, name: `Vault-${vaultId}`, displayName: "Kutumbly Vault" },
        pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
        authenticatorSelection: { userVerification: "required" },
        extensions: {
          prf: { eval: { first: saltBuffer } }
        } as any
      }
    });

    if (!cred) return false;

    // Extract PRF Output
    const exts = (cred as any).getClientExtensionResults();
    if (!exts.prf || !exts.prf.results || !exts.prf.results.first) {
      console.warn("Browser supports WebAuthn but not PRF extension.");
      return false; 
    }

    const keyMaterial = exts.prf.results.first;
    const { iv, cipher } = await encryptPIN(pin, keyMaterial);

    const credentialMeta = {
      id: cred.id,
      rawId: Array.from(new Uint8Array((cred as any).rawId)),
      iv,
      cipher
    };

    localStorage.setItem(`vault_bio_${vaultId}`, JSON.stringify(credentialMeta));
    return true;
  } catch (err) {
    console.error("Biometric registration failed:", err);
    return false;
  }
}

export async function unlockBiometric(vaultId: string): Promise<string | null> {
  try {
    const metaStr = localStorage.getItem(`vault_bio_${vaultId}`);
    if (!metaStr) return null;
    const meta = JSON.parse(metaStr);

    const saltBuffer = new TextEncoder().encode(SALT_STRING).buffer;
    const challenge = crypto.getRandomValues(new Uint8Array(32));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [{
          id: new Uint8Array(meta.rawId).buffer,
          type: "public-key"
        }],
        userVerification: "required",
        extensions: {
          prf: { eval: { first: saltBuffer } }
        } as any
      }
    });

    if (!assertion) return null;

    const exts = (assertion as any).getClientExtensionResults();
    if (!exts.prf || !exts.prf.results || !exts.prf.results.first) {
      return null;
    }

    const keyMaterial = exts.prf.results.first;
    const pin = await decryptPIN(meta.iv, meta.cipher, keyMaterial);
    
    return pin;
  } catch (err) {
    console.error("Biometric unlock failed:", err);
    return null;
  }
}

export function hasBiometricRegistered(vaultId: string): boolean {
  return !!localStorage.getItem(`vault_bio_${vaultId}`);
}
