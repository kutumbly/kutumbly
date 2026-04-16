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

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/forms.body https://www.googleapis.com/auth/forms.responses.readonly https://www.googleapis.com/auth/spreadsheets';
const FOLDER_NAME = 'Kutumbly_Sovereign_Backups';

let tokenClient: any = null;

/**
 * Fetch the email of the currently authenticated user
 */
export async function fetchUserEmail(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const data = await res.json();
    return data.email || null;
  } catch {
    return null;
  }
}

/**
 * Dynamically load Google Identity Services library
 */
export function loadGisScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve();
    if ((window as any).google) return resolve();
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

/**
 * Initialize Token Client (Implicit Flow)
 */
export async function initTokenClient(onTokenResponse: (token: any) => void) {
  await loadGisScript();
  if (!(window as any).google) return null;
  if (!CLIENT_ID) {
    console.warn("Google Drive: Missing required parameter client_id (NEXT_PUBLIC_GOOGLE_CLIENT_ID).");
    return null;
  }

  tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: onTokenResponse,
  });
  return tokenClient;
}

/**
 * Open Google Auth Popup
 */
export function requestAccessToken() {
  if (tokenClient) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }
}

/**
 * Drive API: Find or Create folder
 */
async function getOrCreateFolder(accessToken: string): Promise<string> {
  const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='${FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id)`;
  
  const res = await fetch(searchUrl, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  
  if (data.files && data.files.length > 0) {
    return data.files[0].id;
  }
  
  // Create it
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });
  const folder = await createRes.json();
  return folder.id;
}

/**
 * Drive API: Upload File
 */
export async function uploadVaultFile(accessToken: string, fileData: Uint8Array, filename: string): Promise<boolean> {
  try {
    const parentId = await getOrCreateFolder(accessToken);
    
    // Multi-part upload for metadata + body
    const metadata = {
      name: filename,
      parents: [parentId],
      mimeType: 'application/octet-stream'
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([fileData.buffer as any], { type: 'application/octet-stream' }));
    
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    });
    
    return res.ok;
  } catch (err) {
    console.error("GDrive Upload Error:", err);
    return false;
  }
}

/**
 * Drive API: List Backup Files
 */
export async function listVaultBackups(accessToken: string) {
  const parentId = await getOrCreateFolder(accessToken);
  const url = `https://www.googleapis.com/drive/v3/files?q='${parentId}' in parents and trashed=false&fields=files(id, name, createdTime, size)&orderBy=createdTime desc`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  const data = await res.json();
  return data.files || [];
}

/**
 * Drive API: Download File
 */
export async function downloadVaultFile(accessToken: string, fileId: string): Promise<Uint8Array> {
  const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  
  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}
