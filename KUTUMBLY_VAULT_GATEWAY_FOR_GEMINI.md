# KUTUMBLY LITE — VAULT GATEWAY IMPLEMENTATION PROMPT
# For: Google Gemini / Gemini CLI / Gemini Code Assist
# Purpose: Build the Enterprise-style Vault Selection + PIN screen for Kutumbly Lite
# Paste this entire file as your first prompt to Gemini.

---

## CONTEXT & GOAL

You are building **Kutumbly Lite** — an Indian family Personal OS that provides enterprise-grade offline data portability. The app stores ALL data in an AES-256-GCM encrypted `.kutumb` file on the user's local device — no cloud, no servers, zero tracking.

**Your specific task:** Build the **Vault Gateway Screen** — the first screen the user sees when they open the app. Think of it as an enterprise vault selection screen, but for Indian families.

After this screen, the rest of the app is already built in `kutumbly-ui.html` (the existing UI). Your job is ONLY this gateway layer.

---

## REFERENCE DESIGN (implement exactly this layout)

### Screen Layout
```
┌─────────────────────────────────────────────────────┐
│  🛡️ Kutumbly  कुटुंबली          v1.0-alpha · AITDL │  ← Top bar
├──────────────────┬──────────────────────────────────┤
│                  │                                  │
│  Aapke Vaults   │     [Dynamic Right Panel]        │
│  ─────────────  │                                  │
│  🏠 Sharma      │   Shows one of:                  │
│     Parivar  🔒 │   A) PIN unlock numpad           │
│                  │   B) Create new vault form       │
│  💼 Ramesh's    │   C) Import .kutumb file         │
│     Business 🔒 │   D) Success / unlocked state    │
│                  │                                  │
│  👨‍👩‍👧 Joint     │                                  │
│     Fund     🔒 │                                  │
│                  │                                  │
│  [+ Naya Vault] │                                  │
│  [📂 File Kholo]│                                  │
├──────────────────┴──────────────────────────────────┤
│  🟢 Offline · AES-256-GCM encrypted · Zero cloud   │  ← Status bar
└─────────────────────────────────────────────────────┘
```

---

## TECH STACK

```
Framework:     Next.js 15 (App Router, static export)
Language:      TypeScript
Styling:       Tailwind CSS v3.4 (NOT v4 — still unstable)
Icons:         Lucide React
Animations:    Framer Motion
DB Engine:     sql.js (SQLite WASM) — npm install sql.js
Encryption:    Web Crypto API (built-in browser, no extra lib needed)
State:         Zustand
File Access:   File System Access API (Chrome/Edge) + download fallback
```

---

## FILE STRUCTURE TO CREATE

```
kutumbly-lite/
├── app/
│   ├── layout.tsx           # Root layout, fonts, metadata
│   ├── page.tsx             # Gateway screen (this entire feature)
│   └── dashboard/
│       └── page.tsx         # After unlock → load kutumbly-ui.html content
│
├── components/
│   └── gateway/
│       ├── GatewayShell.tsx      # Top bar + 2-column layout + status bar
│       ├── VaultList.tsx         # Left panel: list of recent vaults
│       ├── VaultItem.tsx         # Single vault row (icon, name, meta, lock)
│       ├── UnlockPanel.tsx       # Right panel: PIN numpad
│       ├── CreateVaultPanel.tsx  # Right panel: new vault form
│       ├── ImportPanel.tsx       # Right panel: open .kutumb file
│       └── SuccessPanel.tsx      # Right panel: unlocked confirmation
│
├── lib/
│   ├── vault.ts             # Core vault logic (see spec below)
│   ├── store.ts             # Zustand store
│   └── crypto.ts            # AES-256-GCM helpers
│
├── types/
│   └── vault.ts             # TypeScript interfaces
│
└── next.config.ts
```

---

## DESIGN SYSTEM — implement exactly

### Colors (CSS Variables in globals.css)
```css
:root {
  /* Backgrounds */
  --bg-primary:    #FFFFFF;
  --bg-secondary:  #F9FAFB;
  --bg-tertiary:   #F3F4F6;

  /* Text */
  --text-primary:   #111827;
  --text-secondary: #6B7280;
  --text-tertiary:  #9CA3AF;

  /* Borders */
  --border-light:   #E5E7EB;
  --border-medium:  #D1D5DB;

  /* Gold accent — Kutumbly brand */
  --gold:           #c9971c;
  --gold-light:     #FAEEDA;
  --gold-dim:       #7a5a0e;

  /* Semantic */
  --success:        #22c55e;
  --danger:         #ef4444;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

/* Dark mode */
[data-theme="dark"] {
  --bg-primary:    #1F2937;
  --bg-secondary:  #111827;
  --bg-tertiary:   #0F172A;
  --text-primary:  #F9FAFB;
  --text-secondary:#9CA3AF;
  --text-tertiary: #6B7280;
  --border-light:  #374151;
  --border-medium: #4B5563;
}
```

### Typography
- Font: `Geist` (Next.js default) — clean, modern
- Logo: `font-weight: 600, color: #c9971c` for "Kutumbly"
- Devanagari sub-label: `कुटुंबली` in `text-tertiary`, smaller size

### Key Design Rules
- Max width: `880px`, centered, `border-radius: 12px`
- All borders: `0.5px solid var(--border-light)` — thin, premium feel
- Active vault: left border `3px solid #c9971c` + gold background tint
- Buttons: Gold primary `(bg: #c9971c, color: white)`, outline secondary
- PIN dots: 4 circles, filled gold when digit entered
- Numpad: 3×4 grid, each button `border-radius: 8px`

---

## TYPESCRIPT INTERFACES (types/vault.ts)

```typescript
export interface VaultMeta {
  id: string;                    // uuid
  name: string;                  // "Sharma Parivar"
  icon: string;                  // emoji "🏠"
  filePath?: string;             // native path if File System Access API
  fileHandle?: FileSystemFileHandle; // for re-opening without picker
  lastOpened: string;            // ISO date string
  memberCount: number;
  createdAt: string;
}

export interface VaultStore {
  recentVaults: VaultMeta[];
  activeVault: VaultMeta | null;
  isUnlocked: boolean;
  db: any | null;                // sql.js Database instance
}

export type GatewayPanel = 'unlock' | 'create' | 'import' | 'success' | 'empty';
```

---

## lib/crypto.ts — AES-256-GCM

```typescript
// PIN → key using PBKDF2
export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt DB bytes → .kutumb file bytes
// Format: [4 bytes magic "KUTB"] [16 bytes salt] [12 bytes IV] [encrypted data]
export async function encryptDB(dbBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(pin, salt);
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, dbBytes);
  
  const magic = new TextEncoder().encode('KUTB');
  const result = new Uint8Array(4 + 16 + 12 + encrypted.byteLength);
  result.set(magic,                    0);
  result.set(salt,                     4);
  result.set(iv,                       20);
  result.set(new Uint8Array(encrypted),32);
  return result;
}

// Decrypt .kutumb file bytes → DB bytes
export async function decryptDB(fileBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const magic = new TextDecoder().decode(fileBytes.slice(0, 4));
  if (magic !== 'KUTB') throw new Error('Invalid .kutumb file');
  
  const salt      = fileBytes.slice(4, 20);
  const iv        = fileBytes.slice(20, 32);
  const encrypted = fileBytes.slice(32);
  const key       = await deriveKey(pin, salt);
  
  try {
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    return new Uint8Array(decrypted);
  } catch {
    throw new Error('WRONG_PIN'); // caller uses i18n to show translation
  }
}
```

---

## lib/vault.ts — File Operations

```typescript
import { encryptDB, decryptDB } from './crypto';

// CREATE: Initialize new SQLite DB, encrypt, save as .kutumb
export async function createVault(name: string, pin: string): Promise<FileSystemFileHandle | null> {
  // 1. Init sql.js with empty DB
  const SQL = await initSqlJs({ locateFile: (f: string) => `/sql-wasm/${f}` });
  const db = new SQL.Database();
  
  // 2. Run schema migrations (all CREATE TABLE IF NOT EXISTS)
  db.run(SCHEMA_SQL); // define SCHEMA_SQL as a constant with all tables
  db.run(`INSERT INTO settings VALUES ('vault_name', '${name}')`);
  db.run(`INSERT INTO settings VALUES ('created_at', '${new Date().toISOString()}')`);
  
  // 3. Export DB bytes
  const dbBytes = db.export();
  db.close();
  
  // 4. Encrypt
  const fileBytes = await encryptDB(dbBytes, pin);
  
  // 5. Save via File System Access API (or fallback to download)
  if ('showSaveFilePicker' in window) {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`,
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    });
    const writable = await handle.createWritable();
    await writable.write(fileBytes);
    await writable.close();
    return handle;
  } else {
    // Fallback: trigger download
    const blob = new Blob([fileBytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`;
    a.click();
    URL.revokeObjectURL(url);
    return null;
  }
}

// OPEN: Pick .kutumb file, decrypt with PIN, return sql.js DB
export async function openVault(pin: string, handle?: FileSystemFileHandle) {
  let fileBytes: Uint8Array;
  
  if (handle) {
    const file = await handle.getFile();
    fileBytes = new Uint8Array(await file.arrayBuffer());
  } else if ('showOpenFilePicker' in window) {
    const [picked] = await (window as any).showOpenFilePicker({
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    });
    const file = await picked.getFile();
    fileBytes = new Uint8Array(await file.arrayBuffer());
  } else {
    throw new Error('USE_FILE_INPUT'); // caller shows <input type="file">
  }
  
  const dbBytes = await decryptDB(fileBytes, pin); // throws 'WRONG_PIN' if bad
  const SQL = await initSqlJs({ locateFile: (f: string) => `/sql-wasm/${f}` });
  return new SQL.Database(dbBytes);
}

// SAVE: Encrypt current DB state and write back to file
export async function saveVault(db: any, pin: string, handle: FileSystemFileHandle) {
  const dbBytes = db.export();
  const fileBytes = await encryptDB(dbBytes, pin);
  const writable = await handle.createWritable();
  await writable.write(fileBytes);
  await writable.close();
}
```

---

## lib/store.ts — Zustand

```typescript
import { create } from 'zustand';
import { VaultMeta, VaultStore } from '@/types/vault';

interface AppStore extends VaultStore {
  // Recent vaults from localStorage
  loadRecentVaults: () => void;
  addRecentVault: (vault: VaultMeta) => void;

  // Unlock flow
  setActiveVault: (vault: VaultMeta) => void;
  setUnlocked: (db: any) => void;
  lockVault: () => void;

  // Current PIN (in memory only, never persisted)
  currentPin: string;
  setCurrentPin: (pin: string) => void;
}

export const useAppStore = create<AppStore>((set, get) => ({
  recentVaults: [],
  activeVault: null,
  isUnlocked: false,
  db: null,
  currentPin: '',

  loadRecentVaults: () => {
    try {
      const raw = localStorage.getItem('kutumbly_recent_vaults');
      if (raw) set({ recentVaults: JSON.parse(raw) });
    } catch {}
  },

  addRecentVault: (vault) => {
    const existing = get().recentVaults.filter(v => v.id !== vault.id);
    const updated = [vault, ...existing].slice(0, 10); // keep last 10
    localStorage.setItem('kutumbly_recent_vaults', JSON.stringify(updated));
    set({ recentVaults: updated });
  },

  setActiveVault: (vault) => set({ activeVault: vault, isUnlocked: false }),
  setUnlocked: (db) => set({ isUnlocked: true, db }),
  lockVault: () => set({ isUnlocked: false, db: null, currentPin: '' }),
  setCurrentPin: (pin) => set({ currentPin: pin }),
}));
```

---

## DB SCHEMA (inside vault.ts as SCHEMA_SQL constant)

```sql
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  dob TEXT,
  avatar_initials TEXT
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY,
  date TEXT,
  content TEXT,
  mood INTEGER,
  mood_label TEXT,
  title TEXT, subtitle TEXT, tags TEXT, weather TEXT, location TEXT, is_locked INTEGER DEFAULT 0,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  title TEXT,
  priority TEXT,
  status TEXT,
  assigned_to TEXT,
  due_date TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY,
  date TEXT,
  amount REAL,
  type TEXT,
  category TEXT,
  description TEXT,
  member_id TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT,
  date TEXT,
  type TEXT,
  budget REAL,
  description TEXT,
  recurring INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY,
  member_id TEXT,
  date TEXT,
  bp_systolic INTEGER,
  bp_diastolic INTEGER,
  blood_sugar REAL,
  pulse INTEGER
);
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  monthly_salary REAL
);
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY,
  staff_id TEXT,
  date TEXT,
  status TEXT
);
CREATE TABLE IF NOT EXISTS grocery_items (
  id TEXT PRIMARY KEY,
  name TEXT,
  quantity TEXT,
  checked INTEGER DEFAULT 0,
  category TEXT
);
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY,
  name TEXT,
  type TEXT,
  principal REAL,
  current_value REAL,
  monthly_sip REAL
);
```

---

## GATEWAY SCREEN BEHAVIOUR (app/page.tsx)

### States & Transitions
```
App Load
  → loadRecentVaults() from localStorage
  → if vaults exist: show VaultList + select first vault → UnlockPanel
  → if no vaults:    show empty state → prompt to create or import

VaultList (left panel)
  → click vault → select it → show UnlockPanel on right
  → "Naya Vault Banao" → show CreateVaultPanel on right
  → ".kutumb File Kholo" → show ImportPanel on right

UnlockPanel
  → user enters 4-digit PIN via numpad
  → on 4th digit: auto-attempt unlock
  → SUCCESS → decrypt DB → setUnlocked(db) → show SuccessPanel
  → FAIL    → show i18n error message, clear PIN dots
  → after 5 wrong attempts → show cooldown timer

CreateVaultPanel
  → vault name input (text)
  → location: File System Access API showDirectoryPicker / fallback message
  → PIN setup: 4-digit numpad (enter twice to confirm)
  → "Vault Banao" → createVault() → addRecentVault() → show SuccessPanel

ImportPanel
  → "File Select Karo" button → showOpenFilePicker()
  → file selected → show PIN entry
  → decrypt → show SuccessPanel

SuccessPanel
  → "App mein Jao →" button
  → router.push('/dashboard')
  → dashboard loads kutumbly-ui.html content with DB injected
```

### PIN Numpad Layout
```
[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
[ 7 ] [ 8 ] [ 9 ]
[ ⌫ ] [ 0 ] [ ✓ ]
```

---

## next.config.ts

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',           // static export for portability
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false };
    config.experiments = { ...config.experiments, asyncWebAssembly: true };
    // Copy sql-wasm files to public/sql-wasm/
    return config;
  },
};

export default nextConfig;
```

---

## IMPORTANT IMPLEMENTATION NOTES FOR GEMINI

1. **sql.js WASM setup**: After `npm install sql.js`, copy `node_modules/sql.js/dist/sql-wasm.wasm` to `public/sql-wasm/sql-wasm.wasm`. The `locateFile` in initSqlJs points there.

2. **File System Access API fallback**: Always check `'showSaveFilePicker' in window` before using. On mobile/Firefox, fall back to `<a download>` for save and `<input type="file" accept=".kutumb">` for open.

3. **FileSystemFileHandle persistence**: Store `handle` in Zustand (in-memory only). For "remember recent vaults", store only metadata (name, path string) in localStorage — NOT the handle itself (handles can't be serialized). User will need to re-pick the file on next session (this is the correct security behaviour, same as enterprise systems requiring you to navigate to the data folder).

4. **PIN security**: 
   - Never store PIN anywhere (not localStorage, not DB)
   - Keep in Zustand memory only during session
   - On `lockVault()`, clear PIN from store immediately
   - The DB itself is the only proof of correct PIN (AES-GCM auth tag fails on wrong key)

5. **Auto-save**: After every DB write operation, call `saveVault()` to re-encrypt and write back to file. Show a small "Saving..." indicator in status bar.

6. **Tailwind CSS v3.4**: Use `tailwind.config.ts` with `content: ['./app/**/*.tsx', './components/**/*.tsx']`. Do NOT use v4 — it has breaking changes with Next.js 15 App Router.

7. **After unlock → Dashboard**: The dashboard (`app/dashboard/page.tsx`) should receive the sql.js `db` instance from Zustand store and use it to power all the modules from `kutumbly-ui.html`. Convert the existing HTML modules to React components one by one.

---

## GEMINI EXECUTION ORDER

Execute in this exact order. Do not skip steps.

```
Step 1:  npx create-next-app@latest kutumbly-lite --typescript --tailwind --app --no-src-dir
Step 2:  cd kutumbly-lite
Step 3:  npm install sql.js zustand framer-motion lucide-react
Step 4:  npm install --save-dev @types/sql.js
Step 5:  Copy sql-wasm.wasm to public/sql-wasm/
Step 6:  Create types/vault.ts
Step 7:  Create lib/crypto.ts
Step 8:  Create lib/vault.ts (with SCHEMA_SQL)
Step 9:  Create lib/store.ts
Step 10: Create components/gateway/ (all 6 components)
Step 11: Create app/page.tsx (GatewayScreen)
Step 12: Create app/dashboard/page.tsx (stub, loads after unlock)
Step 13: Update next.config.ts
Step 14: Update app/globals.css (CSS variables + base styles)
Step 15: npm run dev → verify gateway loads
Step 16: Test: Create vault → enter PIN → unlock → success screen
Step 17: Test: Wrong PIN → error message → retry
Step 18: Test: Reload page → re-enter PIN → same DB state
Step 19: npm run build → verify static export in /out folder
```

---

## VERIFICATION CHECKLIST

- [ ] Gateway loads at localhost:3000 with vault list on left
- [ ] PIN numpad works — 4 dots fill as digits entered
- [ ] Wrong PIN shows "Galat PIN" error in Hindi
- [ ] Create vault: name + PIN → .kutumb file downloaded/saved
- [ ] Open .kutumb file → enter PIN → decrypts successfully
- [ ] After unlock → "App mein Jao" → navigates to /dashboard
- [ ] Reload page → vault shows in recent list → PIN required again
- [ ] `npm run build` succeeds with zero TypeScript errors
- [ ] No network calls in browser DevTools Network tab (truly offline)

---

*Built for Kutumbly — India's Sovereign Family OS*
*Stack: Next.js 15 · TypeScript · sql.js · AES-256-GCM · File System Access API*
*© 2026 AITDL Network · aitdl.in*
