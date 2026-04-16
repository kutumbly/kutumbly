# KUTUMBLY — MASTER AI AGENT COMMAND v2
# Works with: Claude Code, Cursor, Gemini CLI, Copilot Workspace, Windsurf
# Paste this entire file as your FIRST prompt. Agent will do everything.
# NO clarification needed. NO pausing. Build and commit end-to-end.

---

## MISSION

You are the lead fullstack engineer for **Kutumbly Family OS** — India's first
offline-first, privacy-centric Personal Operating System for Indian families.

Repo: `https://github.com/kutumbly/kutumbly`

Clone it, read every existing file, then build the complete app end-to-end.
The existing `kutumbly-ui.html` in the repo root is the **reference UI** —
replicate its exact look, feel, tab structure, and module layout in React/Next.js.

**The new addition in v2:** The app must open with an **Enterprise-style Vault Gateway**
as the default first screen (PIN lock + vault selection), exactly like a professional
enterprise vault environment. After unlocking, the user lands on the main kutumbly-ui.html
style interface. All data lives in an encrypted `.kutumb` file on the user's device.

---

## STEP 0 — BOOTSTRAP

```bash
git clone https://github.com/kutumbly/kutumbly.git
cd kutumbly
```

Read ALL of these before writing one line of code:
- `README.md` — vision, stack, design system
- `SOVEREIGN_PROTOCOL.md` — privacy philosophy
- `SOVEREIGN_AI_PROTOCOL.md` — AI integration notes
- `kutumbly-ui.html` — THE REFERENCE UI (replicate this exactly)
- `frontend/` — every existing file
- `src/` — every existing file
- `docs/` — every existing file

Then initialize the Next.js project inside `frontend/`:
```bash
cd frontend
npm install
```

If `frontend/` is empty or missing a Next.js setup, run:
```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install sql.js zustand framer-motion lucide-react @types/sql.js
cp node_modules/sql.js/dist/sql-wasm.wasm public/sql-wasm/sql-wasm.wasm
```

---

## TECH STACK (do not change)

| Layer       | Choice                                          |
|-------------|-------------------------------------------------|
| Framework   | Next.js 15 (App Router, static export)          |
| Language    | TypeScript                                      |
| Database    | sql.js (SQLite WASM) — `.kutumb` encrypted file |
| Encryption  | Web Crypto API — AES-256-GCM + PBKDF2           |
| Styling     | Tailwind CSS v3.4 + CSS Variables               |
| Fonts       | Fraunces (headings) + Newsreader (body)         |
| State       | Zustand                                         |
| Animations  | Framer Motion                                   |
| Icons       | Lucide React                                    |
| Deploy      | Static export → GitHub Pages (`out/`)           |

---

## APP FLOW — READ THIS FIRST

```
User opens app
      │
      ▼
┌─────────────────┐
│  VAULT GATEWAY  │  ← DEFAULT FIRST SCREEN (Enterprise-grade Gateway)
│  (app/page.tsx) │
│                 │
│  Left: Vault    │  → Select existing vault → Enter PIN → Unlock
│  List           │  → Create new vault      → Set name + PIN → Create
│                 │  → Open .kutumb file     → Enter PIN → Unlock
└────────┬────────┘
         │ PIN correct → vault decrypted
         ▼
┌─────────────────────────────────────────────────────┐
│         MAIN APP  (app/dashboard/page.tsx)          │
│  Exact layout from kutumbly-ui.html:                │
│  ┌──────────┬──────────────────────────────────┐   │
│  │ Sidebar  │  Tab Nav + Module Content        │   │
│  │ 9 modules│  (Home, Diary, Tasks, Money...)  │   │
│  └──────────┴──────────────────────────────────┘   │
│  All data reads/writes → encrypted .kutumb file    │
└─────────────────────────────────────────────────────┘
```

---

## FULL FILE STRUCTURE

```
frontend/
├── app/
│   ├── layout.tsx                    # Root: fonts, ThemeProvider, metadata
│   ├── page.tsx                      # → VaultGateway (DEFAULT first screen)
│   ├── globals.css                   # CSS variables, base styles
│   └── dashboard/
│       └── page.tsx                  # Main app after unlock
│
├── components/
│   │
│   ├── gateway/                      # VAULT GATEWAY COMPONENTS
│   │   ├── GatewayShell.tsx          # Topbar + 2-col layout + status bar
│   │   ├── VaultList.tsx             # Left panel: recent vaults list
│   │   ├── VaultItem.tsx             # Single vault row
│   │   ├── UnlockPanel.tsx           # Right: PIN numpad to unlock
│   │   ├── CreateVaultPanel.tsx      # Right: new vault form
│   │   ├── ImportPanel.tsx           # Right: open .kutumb file
│   │   └── SuccessPanel.tsx          # Right: unlocked → enter app
│   │
│   ├── layout/                       # MAIN APP SHELL
│   │   ├── AppShell.tsx              # Sidebar + Topbar wrapper
│   │   ├── Sidebar.tsx               # Collapsible sidebar, 9 modules
│   │   └── Topbar.tsx                # Title, search, avatar, theme toggle
│   │
│   ├── ui/                           # REUSABLE PRIMITIVES
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Toggle.tsx
│   │   ├── MetricCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DonutChart.tsx            # Pure SVG, no library
│   │   ├── SparkLine.tsx             # Pure SVG sparkline
│   │   ├── RupeesDisplay.tsx         # Always ₹ Indian format
│   │   └── ShieldLogo.tsx            # SVG Sovereign Shield
│   │
│   ├── modules/                      # ALL 9 APP MODULES
│   │   ├── home/                     # Aangan dashboard
│   │   ├── diary/                    # Diary entries + mood
│   │   ├── tasks/                    # Task list + priorities
│   │   ├── money/                    # Transactions + budgets
│   │   ├── health/                   # Vitals + medications
│   │   ├── nevata/                   # Events + gift registry
│   │   ├── grocery/                  # Shopping lists
│   │   ├── invest/                   # Portfolio tracker
│   │   ├── staff/                    # HomeStaff attendance
│   │   └── sovereign/                # OS settings + vault controls
│   │
│   └── providers/
│       ├── VaultProvider.tsx         # Provides db instance app-wide
│       └── ThemeProvider.tsx         # Dark/Light theme
│
├── lib/
│   ├── crypto.ts                     # AES-256-GCM encrypt/decrypt
│   ├── vault.ts                      # Create/open/save .kutumb file
│   ├── schema.ts                     # All SQL CREATE TABLE statements
│   ├── seed.ts                       # Seed data for first launch
│   ├── store.ts                      # Zustand: vault state + app state
│   └── utils.ts                      # formatINR, formatDate, generateId
│
├── hooks/
│   ├── useVault.ts                   # Vault open/lock/save operations
│   ├── useDiary.ts
│   ├── useTasks.ts
│   ├── useMoney.ts
│   ├── useHealth.ts
│   ├── useNevata.ts
│   ├── useGrocery.ts
│   ├── useInvest.ts
│   ├── useStaff.ts
│   └── useSettings.ts
│
├── types/
│   ├── vault.ts                      # VaultMeta, VaultStore, GatewayPanel
│   └── index.ts                      # All app data interfaces
│
└── public/
    ├── sql-wasm/
    │   └── sql-wasm.wasm             # Copied from node_modules
    └── branding/                     # Existing logos, keep as-is
```

---

## PART 1 — VAULT GATEWAY (app/page.tsx)

### Layout (implement exactly)

```
┌──────────────────────────────────────────────────────────┐
│ 🛡️ Kutumbly  कुटुंबली              v1.0 · AITDL Network │
├───────────────────┬──────────────────────────────────────┤
│                   │                                      │
│  Aapke Vaults     │   [Right panel — changes by state]   │
│  ─────────────    │                                      │
│  🏠 Sharma  🔒    │   STATE A — UnlockPanel:             │
│  Parivar          │     Vault name + path                │
│                   │     4 PIN dots                       │
│  💼 Business 🔒   │     Numpad (1-9, ⌫, 0, ✓)          │
│                   │     "Fingerprint se kholo" btn       │
│  👨‍👩‍👧 Joint  🔒  │                                      │
│  Fund             │   STATE B — CreateVaultPanel:        │
│                   │     Vault name input                 │
│                   │     File location + Browse btn       │
│  [+ Naya Vault]   │     PIN setup numpad (confirm twice) │
│  [📂 File Kholo]  │     "Vault Banao" button             │
│                   │                                      │
│                   │   STATE C — ImportPanel:             │
│                   │     "Select .kutumb file" button     │
│                   │     Then shows PIN entry             │
│                   │                                      │
│                   │   STATE D — SuccessPanel:            │
│                   │     Shield icon + vault name         │
│                   │     "App mein Jao →" button          │
├───────────────────┴──────────────────────────────────────┤
│ 🟢 Offline · AES-256-GCM · Zero cloud · Sovereign       │
└──────────────────────────────────────────────────────────┘
```

### PIN Numpad Layout
```
[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
[ 7 ] [ 8 ] [ 9 ]
[ ⌫ ] [ 0 ] [ ✓ ]
```
- 4 digits only
- Auto-attempt unlock on 4th digit (180ms delay)
- Wrong PIN → "Galat PIN — dobara try karo" in red, clear dots
- 5 wrong attempts → 30 second cooldown timer shown

### State Transitions
```typescript
type GatewayPanel = 'unlock' | 'create' | 'import' | 'success'

// Transitions:
// vault click → 'unlock'
// "Naya Vault Banao" → 'create'
// ".kutumb File Kholo" → 'import'
// correct PIN → 'success'
// "App mein Jao" → router.push('/dashboard')
```

### Vault Meta (stored in localStorage — NOT sensitive data)
```typescript
interface VaultMeta {
  id: string               // uuid
  name: string             // "Sharma Parivar"
  icon: string             // emoji "🏠"
  lastOpened: string       // ISO date
  memberCount: number
  createdAt: string
  // Note: file path stored as display string only
  // FileSystemFileHandle NOT serialized (security)
}
```

---

## PART 2 — ENCRYPTION ENGINE (lib/crypto.ts)

```typescript
// .kutumb file binary format:
// [4 bytes]  magic: "KUTB"
// [16 bytes] salt  (random per file creation)
// [12 bytes] IV    (random per save)
// [N bytes]  AES-256-GCM encrypted SQLite DB

export async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), 'PBKDF2', false, ['deriveKey']
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptDB(dbBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv   = crypto.getRandomValues(new Uint8Array(12))
  const key  = await deriveKey(pin, salt)
  const enc  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, dbBytes)
  const out  = new Uint8Array(4 + 16 + 12 + enc.byteLength)
  out.set(new TextEncoder().encode('KUTB'), 0)
  out.set(salt, 4)
  out.set(iv,   20)
  out.set(new Uint8Array(enc), 32)
  return out
}

export async function decryptDB(fileBytes: Uint8Array, pin: string): Promise<Uint8Array> {
  const magic = new TextDecoder().decode(fileBytes.slice(0, 4))
  if (magic !== 'KUTB') throw new Error('INVALID_FILE')
  const salt = fileBytes.slice(4, 20)
  const iv   = fileBytes.slice(20, 32)
  const data = fileBytes.slice(32)
  const key  = await deriveKey(pin, salt)
  try {
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
    return new Uint8Array(dec)
  } catch {
    throw new Error('WRONG_PIN')
  }
}
```

---

## PART 3 — VAULT FILE OPERATIONS (lib/vault.ts)

```typescript
import { encryptDB, decryptDB } from './crypto'
import { SCHEMA_SQL } from './schema'
import { seedDatabase } from './seed'

// CREATE new vault → encrypt → save as .kutumb
export async function createVault(name: string, pin: string) {
  const SQL = await initSqlJs({ locateFile: f => `/sql-wasm/${f}` })
  const db = new SQL.Database()
  db.run(SCHEMA_SQL)
  db.run(`INSERT INTO settings VALUES ('vault_name', ?)`, [name])
  db.run(`INSERT INTO settings VALUES ('created_at', ?)`, [new Date().toISOString()])
  seedDatabase(db)   // insert sample Indian family data
  const dbBytes = db.export()
  db.close()
  const fileBytes = await encryptDB(dbBytes, pin)

  // Save via File System Access API (Chrome/Edge) or download fallback
  if ('showSaveFilePicker' in window) {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`,
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    })
    const w = await handle.createWritable()
    await w.write(fileBytes)
    await w.close()
    return { handle, fileBytes }
  } else {
    // Mobile / Firefox fallback
    const blob = new Blob([fileBytes], { type: 'application/octet-stream' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`
    a.click()
    return { handle: null, fileBytes }
  }
}

// OPEN existing .kutumb file → decrypt → return sql.js db
export async function openVault(pin: string, existingHandle?: any) {
  let fileBytes: Uint8Array
  let handle: any = null

  if (existingHandle) {
    const file = await existingHandle.getFile()
    fileBytes = new Uint8Array(await file.arrayBuffer())
    handle = existingHandle
  } else if ('showOpenFilePicker' in window) {
    const [picked] = await (window as any).showOpenFilePicker({
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    })
    const file = await picked.getFile()
    fileBytes = new Uint8Array(await file.arrayBuffer())
    handle = picked
  } else {
    throw new Error('USE_INPUT')  // caller shows <input type="file">
  }

  const dbBytes = await decryptDB(fileBytes, pin)  // throws WRONG_PIN or INVALID_FILE
  const SQL = await initSqlJs({ locateFile: f => `/sql-wasm/${f}` })
  const db = new SQL.Database(dbBytes)
  return { db, handle }
}

// SAVE — re-encrypt and write back after every write operation
export async function saveVault(db: any, pin: string, handle: any) {
  const dbBytes = db.export()
  const fileBytes = await encryptDB(dbBytes, pin)
  if (handle) {
    const w = await handle.createWritable()
    await w.write(fileBytes)
    await w.close()
  }
  // Always also save to IndexedDB as session backup
  const idb = indexedDB.open('kutumbly_session', 1)
  // ... store fileBytes in IndexedDB key 'current_vault'
}
```

---

## PART 4 — ZUSTAND STORE (lib/store.ts)

```typescript
import { create } from 'zustand'

interface AppStore {
  // Vault state
  recentVaults: VaultMeta[]
  activeVault: VaultMeta | null
  isUnlocked: boolean
  db: any | null            // sql.js Database — in memory only
  fileHandle: any | null    // FileSystemFileHandle — in memory only
  currentPin: string        // in memory only, never persisted

  // Gateway UI state
  gatewayPanel: 'unlock' | 'create' | 'import' | 'success'
  selectedVaultIdx: number

  // App UI state
  activeModule: string      // 'home' | 'diary' | 'tasks' | ...
  hiddenModules: string[]   // from Sovereign settings
  theme: 'dark' | 'light'
  sidebarCollapsed: boolean

  // Actions
  loadRecentVaults: () => void
  addRecentVault: (v: VaultMeta) => void
  setActiveVault: (v: VaultMeta, idx: number) => void
  setGatewayPanel: (p: string) => void
  unlock: (db: any, handle: any) => void
  lock: () => void
  setCurrentPin: (pin: string) => void
  setActiveModule: (id: string) => void
  toggleModule: (id: string) => void
  setTheme: (t: 'dark' | 'light') => void
  setSidebarCollapsed: (v: boolean) => void
  saveSettings: () => void   // persists hiddenModules, theme to localStorage
}

export const useAppStore = create<AppStore>((set, get) => ({
  recentVaults: [],
  activeVault: null,
  isUnlocked: false,
  db: null,
  fileHandle: null,
  currentPin: '',
  gatewayPanel: 'unlock',
  selectedVaultIdx: 0,
  activeModule: 'home',
  hiddenModules: [],
  theme: 'dark',
  sidebarCollapsed: false,

  loadRecentVaults: () => {
    try {
      const raw = localStorage.getItem('kutumbly_vaults')
      if (raw) set({ recentVaults: JSON.parse(raw) })
    } catch {}
  },

  addRecentVault: (v) => {
    const list = [v, ...get().recentVaults.filter(x => x.id !== v.id)].slice(0, 10)
    localStorage.setItem('kutumbly_vaults', JSON.stringify(list))
    set({ recentVaults: list })
  },

  setActiveVault: (v, idx) => set({
    activeVault: v, selectedVaultIdx: idx,
    isUnlocked: false, currentPin: '', gatewayPanel: 'unlock'
  }),

  setGatewayPanel: (p) => set({ gatewayPanel: p as any }),

  unlock: (db, handle) => set({ isUnlocked: true, db, fileHandle: handle }),

  lock: () => set({
    isUnlocked: false, db: null, fileHandle: null, currentPin: ''
  }),

  setCurrentPin: (pin) => set({ currentPin: pin }),
  setActiveModule: (id) => set({ activeModule: id }),

  toggleModule: (id) => {
    const h = get().hiddenModules
    const updated = h.includes(id) ? h.filter(x => x !== id) : [...h, id]
    set({ hiddenModules: updated })
    get().saveSettings()
  },

  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('kutumbly_theme', t)
    set({ theme: t })
  },

  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

  saveSettings: () => {
    localStorage.setItem('kutumbly_settings', JSON.stringify({
      hiddenModules: get().hiddenModules,
      theme: get().theme,
    }))
  },
}))
```

---

## PART 5 — DATABASE SCHEMA (lib/schema.ts)

```typescript
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY, value TEXT
);
CREATE TABLE IF NOT EXISTS family_members (
  id TEXT PRIMARY KEY, name TEXT NOT NULL,
  role TEXT, dob TEXT, avatar_initials TEXT
);
CREATE TABLE IF NOT EXISTS diary_entries (
  id TEXT PRIMARY KEY, date TEXT, content TEXT,
  mood INTEGER, mood_label TEXT,
  title TEXT, subtitle TEXT, tags TEXT, weather TEXT, location TEXT, is_locked INTEGER DEFAULT 0,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY, title TEXT, description TEXT,
  priority TEXT, status TEXT DEFAULT 'pending',
  assigned_to TEXT, due_date TEXT,
  created_at TEXT, completed_at TEXT
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, date TEXT, amount REAL,
  type TEXT, category TEXT, description TEXT,
  member_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY, category TEXT,
  monthly_limit REAL, month TEXT
);
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY, member_id TEXT, date TEXT,
  bp_systolic INTEGER, bp_diastolic INTEGER,
  blood_sugar REAL, pulse INTEGER, weight REAL,
  notes TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY, member_id TEXT, name TEXT,
  dosage TEXT, frequency TEXT, start_date TEXT, end_date TEXT
);
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY, title TEXT, date TEXT,
  type TEXT, description TEXT, budget REAL,
  gift_idea TEXT, recurring INTEGER DEFAULT 0
);
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY, name TEXT, role TEXT,
  monthly_salary REAL, join_date TEXT, phone TEXT
);
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY, staff_id TEXT, date TEXT,
  status TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS salary_payments (
  id TEXT PRIMARY KEY, staff_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL,
  paid_on TEXT, advance REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY, name TEXT, type TEXT,
  principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT,
  maturity_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS grocery_lists (
  id TEXT PRIMARY KEY, name TEXT,
  created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS grocery_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL,
  checked INTEGER DEFAULT 0, category TEXT
);
`
```

---

## PART 6 — SEED DATA (lib/seed.ts)

```typescript
export function seedDatabase(db: any) {
  // Family members
  db.run(`INSERT OR IGNORE INTO family_members VALUES
    ('jm','Jawahar Mallah','Papa','1981-03-15','JM'),
    ('sm','Sunita Mallah','Maa','1984-07-22','SM'),
    ('pj','Priya Mallah','Beti','2012-05-12','PJ')`)

  // Staff
  db.run(`INSERT OR IGNORE INTO staff_members VALUES
    ('st1','Kamla Devi','Bai (Housekeeping)',4000,'2022-01-10',NULL),
    ('st2','Ramesh Kumar','Driver',12000,'2020-03-15',NULL)`)

  // Transactions
  db.run(`INSERT OR IGNORE INTO transactions VALUES
    ('t1','2026-04-01',95000,'income','Salary','Monthly salary — Jawahar','jm','2026-04-01'),
    ('t2','2026-04-09',3240,'expense','Grocery','D-Mart grocery','sm','2026-04-09'),
    ('t3','2026-04-07',1820,'expense','Utilities','MSEB electricity','jm','2026-04-07'),
    ('t4','2026-04-10',4500,'expense','Housing','Society maintenance','jm','2026-04-10'),
    ('t5','2026-04-08',1200,'expense','Education','School books — Priya','sm','2026-04-08'),
    ('t6','2026-04-05',6000,'expense','Staff','Kamla Devi salary','jm','2026-04-05'),
    ('t7','2026-04-05',12000,'expense','Staff','Ramesh Kumar salary','jm','2026-04-05')`)

  // Events
  db.run(`INSERT OR IGNORE INTO events VALUES
    ('e1','Akshaya Tritiya','2026-04-30','Pooja','Auspicious — gold purchase',5000,NULL,1),
    ('e2',"Priya's Birthday",'2026-05-12','Birthday','Gift + celebration at home',2000,'Sketch pad + art supplies',0),
    ('e3','Sunita-Jawahar Anniversary','2026-05-22','Anniversary','20th year — plan dinner',5000,'Dinner at Yauatcha',0),
    ('e4','Rakshabandhan','2026-08-09','Festival',NULL,3000,NULL,1)`)

  // Investments
  db.run(`INSERT OR IGNORE INTO investments VALUES
    ('i1','Parag Parikh Flexi Cap','Mutual Fund',240000,280000,NULL,5000,'2022-01-01',NULL,NULL),
    ('i2','SBI Nifty 50 Index','Mutual Fund',160000,190000,NULL,5000,'2022-06-01',NULL,NULL),
    ('i3','PPF Account','PPF',180000,210000,NULL,NULL,'2020-04-01',NULL,NULL),
    ('i4','SBI Fixed Deposit','FD',100000,107000,NULL,NULL,'2023-08-15','2026-08-15',NULL),
    ('i5','Gold Physical + SGB','Gold',160000,198000,NULL,NULL,'2021-11-01',NULL,'28g physical + SGBs')`)

  // Health readings
  db.run(`INSERT OR IGNORE INTO health_readings VALUES
    ('h1','jm','2026-04-12',118,76,98,72,NULL,NULL,'2026-04-12'),
    ('h2','sm','2026-04-12',138,88,112,78,NULL,'BP elevated — monitor','2026-04-12'),
    ('h3','pj','2026-04-12',108,70,88,68,NULL,NULL,'2026-04-12')`)

  // Diary entry
  db.run(`INSERT OR IGNORE INTO diary_entries VALUES
    ('d1','2026-04-12','Aaj family ke saath nashta kiya. Priya ke exam results aye — 94% in Maths. Bahut khushi hui aaj. Shaam ko puja karni chahiye.',4,'Happy','2026-04-12')`)

  // Tasks
  db.run(`INSERT OR IGNORE INTO tasks VALUES
    ('tk1','Renew car insurance','Expires May 1 — call agent','high','pending','jm','2026-04-28','2026-04-12',NULL),
    ('tk2','Book dentist for Mom',NULL,'medium','pending','sm','2026-05-05','2026-04-12',NULL),
    ('tk3','File ITR FY 2025-26',NULL,'medium','pending','jm','2026-07-31','2026-04-12',NULL),
    ('tk4','Pay society maintenance',NULL,'high','done','jm','2026-04-10','2026-04-10','2026-04-10')`)

  // Grocery list
  db.run(`INSERT OR IGNORE INTO grocery_lists VALUES ('gl1','Kirana List','2026-04-12','active')`)
  db.run(`INSERT OR IGNORE INTO grocery_items VALUES
    ('gi1','gl1','Atta (whole wheat)','5','kg',210,0,'Grains & Dal'),
    ('gi2','gl1','Toor Dal','1','kg',140,0,'Grains & Dal'),
    ('gi3','gl1','Basmati Rice','5','kg',380,0,'Grains & Dal'),
    ('gi4','gl1','Amul Ghee','500','g',290,0,'Dairy'),
    ('gi5','gl1','Mustard Oil','1','L',180,0,'Oils & Spices'),
    ('gi6','gl1','Tomatoes','2','kg',80,1,'Vegetables'),
    ('gi7','gl1','Coriander + Mint','1','bunch',30,1,'Vegetables'),
    ('gi8','gl1','Mother Dairy Curd','500','g',65,0,'Dairy')`)
}
```

---

## PART 7 — DESIGN SYSTEM (globals.css)

```css
/* Based exactly on kutumbly-ui.html color system */
:root {
  --bg-primary:    #FFFFFF;
  --bg-secondary:  #F9FAFB;
  --bg-tertiary:   #F3F4F6;
  --bg-success:    #ECFDF5;
  --bg-warning:    #FFFBEB;
  --bg-danger:     #FEF2F2;
  --bg-info:       #EFF6FF;

  --text-primary:   #111827;
  --text-secondary: #6B7280;
  --text-tertiary:  #9CA3AF;
  --text-success:   #065F46;
  --text-warning:   #92400E;
  --text-danger:    #991B1B;
  --text-info:      #1E40AF;

  --border-light:   #E5E7EB;
  --border-medium:  #D1D5DB;

  /* Kutumbly Gold — brand color */
  --gold:           #c9971c;
  --gold-light:     #FAEEDA;
  --gold-dim:       #7a5a0e;
  --gold-text:      #633806;

  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}

[data-theme="dark"] {
  --bg-primary:    #1F2937;
  --bg-secondary:  #111827;
  --bg-tertiary:   #0F172A;
  --bg-success:    #064E3B;
  --bg-warning:    #78350F;
  --bg-danger:     #7F1D1D;
  --bg-info:       #1E3A8A;

  --text-primary:   #F9FAFB;
  --text-secondary: #9CA3AF;
  --text-tertiary:  #6B7280;
  --text-success:   #A7F3D0;
  --text-warning:   #FDE68A;
  --text-danger:    #FECACA;
  --text-info:      #BFDBFE;

  --border-light:   #374151;
  --border-medium:  #4B5563;

  --gold:           #e8b84b;
  --gold-light:     rgba(201,151,28,0.15);
  --gold-dim:       #c9971c;
  --gold-text:      #FAEEDA;
}

/* Typography — match kutumbly-ui.html */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: var(--bg-tertiary);
  color: var(--text-primary);
}

/* App shell — 880px max width centered */
.app-shell {
  max-width: 880px;
  margin: 0 auto;
  background: var(--bg-tertiary);
  min-height: 100vh;
}

/* Gold active state — used in sidebar + tabs */
.active-gold {
  border-left: 2px solid var(--gold);
  color: var(--gold);
  background: var(--gold-light);
}

/* All borders — 0.5px thin premium feel */
.border-thin { border: 0.5px solid var(--border-light); }
```

---

## PART 8 — MAIN APP (app/dashboard/page.tsx)

After vault unlock, this page loads. It must **exactly replicate kutumbly-ui.html**:

### Header
```
┌──────────────────────────────────────────────────────┐
│  🛡️ kutumbly  ·  [Vault Name]        offline·AES-256 │
└──────────────────────────────────────────────────────┘
```
- Left: shield + "kutumbly" + dot + vault name (from DB `settings` table)
- Right: "offline · AES-256" label + green dot
- Add: Lock icon button → calls `store.lock()` → redirects to `/`

### Tab Navigation
```
Home | Diary | Tasks | Money | Nevata | Health | Invest | Grocery | HomeStaff | Setup
```
- Horizontal scrollable tabs (scrollbar hidden)
- Active tab: `border-bottom: 2px solid var(--gold); color: var(--gold)`
- Hidden modules (from Sovereign) not shown in tabs
- Tabs read from Zustand `hiddenModules` array

### All 10 Modules — implement exactly as in kutumbly-ui.html

Study `kutumbly-ui.html` line by line and port each VIEWS function to a React component.
Do NOT redesign. Match the existing HTML exactly, pixel for pixel:
- Same card structure
- Same stats grid (4 cells)
- Same list-row pattern
- Same badge variants (success/warning/danger/info/secondary)
- Same setting-row pattern in Setup tab
- Same toggle switch component

The only changes allowed vs kutumbly-ui.html:
1. Data comes from sql.js DB (not hardcoded arrays)
2. Buttons are wired (checkboxes work, toggles persist, "+ Add" opens forms)
3. Active tab border is gold (#c9971c) not black

### Add Forms (modal for each module)
Each "+ Add" button opens a modal with the form. After submit:
1. Insert into sql.js DB
2. Call `saveVault(db, pin, handle)` to re-encrypt and write
3. Update local React state to show new item immediately

---

## PART 9 — MODULE SPECS (data layer)

Each module reads from sql.js DB via a custom hook. Here are the queries:

```typescript
// useDiary.ts
const entries = db.exec(`SELECT * FROM diary_entries ORDER BY date DESC`)

// useTasks.ts
const tasks = db.exec(`SELECT * FROM tasks ORDER BY
  CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
  due_date ASC`)

// useMoney.ts
const txns = db.exec(`SELECT * FROM transactions WHERE
  strftime('%Y-%m', date) = ? ORDER BY date DESC`, [currentMonth])
const summary = db.exec(`SELECT
  SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
  SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
  FROM transactions WHERE strftime('%Y-%m', date) = ?`, [currentMonth])

// useHealth.ts
const readings = db.exec(`SELECT hr.*, fm.name FROM health_readings hr
  JOIN family_members fm ON hr.member_id = fm.id
  ORDER BY hr.date DESC`)

// useStaff.ts
const staff = db.exec(`SELECT * FROM staff_members`)
const attendance = db.exec(`SELECT * FROM attendance WHERE
  strftime('%Y-%m', date) = ?`, [currentMonth])
// Salary calc: (monthly_salary / 26) * present_days (half = 0.5)

// useInvest.ts
const holdings = db.exec(`SELECT * FROM investments ORDER BY current_value DESC`)
// XIRR simple: ((current/principal)^(1/years) - 1) * 100
```

---

## PART 10 — NEXT.CONFIG.TS

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/kutumbly' : '',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, crypto: false }
    config.experiments = { ...config.experiments, asyncWebAssembly: true }
    return config
  },
}

export default nextConfig
```

---

## PART 11 — GITHUB ACTIONS

```yaml
# .github/workflows/deploy.yml
name: Deploy Kutumbly to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json
      - run: npm ci
        working-directory: frontend
      - run: npm run build
        working-directory: frontend
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./frontend/out
```

---

## COMMIT STRATEGY

```bash
# One commit per phase — no skipping
git add -A && git commit -m "feat: [phase] — [description]"
```

| # | Phase | What |
|---|-------|------|
| 1 | setup | next.config, tailwind, fonts, types, globals.css |
| 2 | crypto | lib/crypto.ts — AES-256-GCM encrypt/decrypt |
| 3 | vault | lib/vault.ts — create/open/save .kutumb |
| 4 | schema | lib/schema.ts + lib/seed.ts |
| 5 | store | lib/store.ts — Zustand with vault + app state |
| 6 | gateway | All gateway/ components + app/page.tsx |
| 7 | appshell | Sidebar, Topbar, AppShell — match kutumbly-ui.html |
| 8 | home | Home module with live DB data |
| 9 | diary | Diary CRUD + mood picker |
| 10 | tasks | Tasks CRUD + filters + checkbox |
| 11 | money | Transactions + monthly summary |
| 12 | health | Vitals + medications |
| 13 | nevata | Events + gift registry |
| 14 | grocery | Lists + items + check-off |
| 15 | invest | Portfolio + XIRR |
| 16 | staff | Attendance grid + salary calc |
| 17 | sovereign | Setup tab — module toggles + vault export |
| 18 | lock | Lock button → back to gateway |
| 19 | mobile | Responsive + bottom nav |
| 20 | polish | Animations, empty states, error handling |
| 21 | deploy | GitHub Actions verified |

---

## QUALITY CHECKLIST

- [ ] `npm run build` → zero TypeScript errors, zero ESLint errors
- [ ] App opens at `localhost:3000` → shows Vault Gateway (not dashboard)
- [ ] Vault list shows recent vaults from localStorage
- [ ] PIN numpad works — 4 dots fill, auto-attempt on 4th
- [ ] Wrong PIN → "Galat PIN" error in Hindi, dots clear
- [ ] "Naya Vault Banao" → form → creates `.kutumb` file download/save
- [ ] ".kutumb File Kholo" → file picker → PIN → unlock
- [ ] After unlock → "App mein Jao" → loads dashboard
- [ ] Dashboard tabs match kutumbly-ui.html exactly
- [ ] All 10 tabs navigate correctly
- [ ] Lock button → back to Gateway → vault still in list
- [ ] Add diary entry → shows immediately → refresh → data still there
- [ ] Add task → complete it → checkbox works
- [ ] Add expense → appears in money module
- [ ] Setup tab module toggle → hides tab from nav
- [ ] Theme toggle (dark/light) → persists after reload
- [ ] Export .kutumb file → re-import → all data restored
- [ ] Works on mobile 375px width
- [ ] GitHub Pages deployment succeeds
- [ ] App loads at `https://kutumbly.github.io/kutumbly/`
- [ ] Zero network calls in DevTools after initial load

---

## FINAL INSTRUCTION TO AGENT

- Do NOT ask for permission at any step
- Do NOT leave TODO comments or stub components
- Do NOT redesign the UI — match kutumbly-ui.html exactly
- Do NOT use external chart libraries — pure SVG only
- Vault Gateway is the DEFAULT first screen — never skip it
- Every module must be fully wired to sql.js DB
- Every write must trigger saveVault() to re-encrypt the file
- PIN must NEVER be stored anywhere except Zustand memory
- Build it like a craftsman. This is a family heirloom.

**Begin now. Start with Step 0.**
