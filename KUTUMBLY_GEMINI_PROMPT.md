# KUTUMBLY — GEMINI CLI MASTER PROMPT
# Paste this entire file as your FIRST message to Gemini CLI.
# Works with: Gemini CLI, Gemini 2.5 Pro, AI Studio
# NO clarification needed. NO pausing. Build end-to-end.

---

## ROLE

You are the lead fullstack engineer for **Kutumbly Family OS** — India's first
offline-first, privacy-centric Personal Operating System for Indian families.

Repo: `https://github.com/kutumbly/kutumbly`

Clone it, read every existing file, then build the complete app end-to-end.
The existing `kutumbly-ui.html` in the repo root is the **reference UI** —
replicate its exact look, feel, tab structure, and module layout in React/Next.js.

The app opens with an **Enterprise-style Vault Gateway** as the default first screen
(PIN lock + vault selection). After unlocking, the user lands on the main
kutumbly-ui.html style interface. All data lives in an encrypted `.kutumb` file.

---

## STEP 0 — BOOTSTRAP

```bash
git clone https://github.com/kutumbly/kutumbly.git
cd kutumbly
```

Read ALL of these before writing one line of code:
- `README.md`
- `SOVEREIGN_PROTOCOL.md`
- `SOVEREIGN_AI_PROTOCOL.md`
- `kutumbly-ui.html` — THE REFERENCE UI (replicate exactly)
- `frontend/`, `src/`, `docs/` — every file

Then:
```bash
cd frontend
npm install
# If empty:
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
npm install sql.js zustand framer-motion lucide-react @types/sql.js
cp node_modules/sql.js/dist/sql-wasm.wasm public/sql-wasm/sql-wasm.wasm
```

---

## TECH STACK

| Layer       | Choice                                           |
|-------------|--------------------------------------------------|
| Framework   | Next.js 15 (App Router, static export)           |
| Language    | TypeScript                                       |
| Database    | sql.js (SQLite WASM) — `.kutumb` encrypted file  |
| Encryption  | Web Crypto API — AES-256-GCM + PBKDF2            |
| Styling     | Tailwind CSS v3.4 + CSS Variables                |
| State       | Zustand                                          |
| Animations  | Framer Motion                                    |
| Icons       | Lucide React                                     |
| Deploy      | Static export → GitHub Pages (`out/`)            |

---

## APP FLOW

```
User opens app
      │
      ▼
┌─────────────────┐
│  VAULT GATEWAY  │  ← DEFAULT FIRST SCREEN
│  (app/page.tsx) │
│                 │
│  Left: Vault    │  → Select vault → PIN → Unlock
│  List           │  → Create new vault → Set name + PIN → Create
│                 │  → Open .kutumb file → PIN → Unlock
└────────┬────────┘
         │ PIN correct
         ▼
┌──────────────────────────────────────────┐
│  MAIN APP  (app/dashboard/page.tsx)      │
│  Sidebar + Tabs: Home | Diary | Tasks |  │
│  Money | Nevata | Health | Invest |      │
│  Grocery | HomeStaff | Setup             │
└──────────────────────────────────────────┘
```

---

## FILE STRUCTURE

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # VaultGateway
│   ├── globals.css
│   └── dashboard/page.tsx          # Main app
├── components/
│   ├── gateway/
│   │   ├── GatewayShell.tsx
│   │   ├── VaultList.tsx
│   │   ├── VaultItem.tsx
│   │   ├── UnlockPanel.tsx
│   │   ├── CreateVaultPanel.tsx
│   │   ├── ImportPanel.tsx
│   │   └── SuccessPanel.tsx
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   └── Topbar.tsx
│   ├── ui/
│   │   ├── Card.tsx
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Toggle.tsx
│   │   ├── MetricCard.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── DonutChart.tsx          # Pure SVG
│   │   ├── SparkLine.tsx           # Pure SVG
│   │   ├── RupeesDisplay.tsx       # Always ₹ Indian format
│   │   └── ShieldLogo.tsx
│   ├── modules/
│   │   ├── home/
│   │   ├── diary/
│   │   ├── tasks/
│   │   ├── money/
│   │   ├── health/
│   │   ├── nevata/                 # SEE DETAILED SPEC BELOW
│   │   ├── grocery/
│   │   ├── invest/
│   │   ├── staff/
│   │   └── sovereign/
│   └── providers/
│       ├── VaultProvider.tsx
│       └── ThemeProvider.tsx
├── lib/
│   ├── crypto.ts
│   ├── vault.ts
│   ├── schema.ts
│   ├── seed.ts
│   ├── store.ts
│   └── utils.ts
├── hooks/
│   ├── useVault.ts
│   ├── useDiary.ts
│   ├── useTasks.ts
│   ├── useMoney.ts
│   ├── useHealth.ts
│   ├── useNevata.ts               # SEE SPEC BELOW
│   ├── useGrocery.ts
│   ├── useInvest.ts
│   ├── useStaff.ts
│   └── useSettings.ts
└── types/
    ├── vault.ts
    └── index.ts
```

---

## PART 1 — VAULT GATEWAY

### Layout
```
┌──────────────────────────────────────────────────────────┐
│ 🛡️ Kutumbly  कुटुंबली              v1.0 · AITDL Network │
├───────────────────┬──────────────────────────────────────┤
│  Aapke Vaults     │  [Right panel — changes by state]    │
│  ─────────────    │                                      │
│  🏠 Mallah  🔒    │  STATE A — UnlockPanel:              │
│  Parivar          │    Vault name + path                 │
│                   │    4 PIN dots                        │
│  💼 Business 🔒   │    Numpad (1-9, ⌫, 0, ✓)           │
│                   │    "Fingerprint se kholo" btn        │
│  [+ Naya Vault]   │  STATE B — CreateVaultPanel          │
│  [📂 File Kholo]  │  STATE C — ImportPanel               │
│                   │  STATE D — SuccessPanel              │
├───────────────────┴──────────────────────────────────────┤
│ 🟢 Offline · AES-256-GCM · Zero cloud · Sovereign       │
└──────────────────────────────────────────────────────────┘
```

### PIN Numpad
```
[ 1 ] [ 2 ] [ 3 ]
[ 4 ] [ 5 ] [ 6 ]
[ 7 ] [ 8 ] [ 9 ]
[ ⌫ ] [ 0 ] [ ✓ ]
```
- 4 digits only. Auto-attempt on 4th digit (180ms delay).
- Wrong PIN → "Galat PIN — dobara try karo" in red, dots clear.
- 5 wrong attempts → 30 second cooldown.

### State Transitions
```typescript
type GatewayPanel = 'unlock' | 'create' | 'import' | 'success'
// vault click → 'unlock'
// "Naya Vault Banao" → 'create'
// ".kutumb File Kholo" → 'import'
// correct PIN → 'success'
// "App mein Jao" → router.push('/dashboard')
```

### VaultMeta (localStorage — NOT sensitive)
```typescript
interface VaultMeta {
  id: string
  name: string        // "Mallah Parivar"
  icon: string        // emoji "🏠"
  lastOpened: string  // ISO date
  memberCount: number
  createdAt: string
}
```

---

## PART 2 — ENCRYPTION ENGINE (lib/crypto.ts)

```typescript
// .kutumb binary format:
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
  out.set(salt, 4); out.set(iv, 20)
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
    return new Uint8Array(await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data))
  } catch {
    throw new Error('WRONG_PIN')
  }
}
```

---

## PART 3 — VAULT FILE OPS (lib/vault.ts)

```typescript
export async function createVault(name: string, pin: string) {
  const SQL = await initSqlJs({ locateFile: f => `/sql-wasm/${f}` })
  const db = new SQL.Database()
  db.run(SCHEMA_SQL)
  db.run(`INSERT INTO settings VALUES ('vault_name', ?)`, [name])
  db.run(`INSERT INTO settings VALUES ('created_at', ?)`, [new Date().toISOString()])
  seedDatabase(db)
  const fileBytes = await encryptDB(db.export(), pin)
  db.close()
  if ('showSaveFilePicker' in window) {
    const handle = await (window as any).showSaveFilePicker({
      suggestedName: `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`,
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    })
    const w = await handle.createWritable()
    await w.write(fileBytes); await w.close()
    return { handle, fileBytes }
  } else {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([fileBytes], { type: 'application/octet-stream' }))
    a.download = `${name.replace(/\s+/g, '-').toLowerCase()}.kutumb`
    a.click()
    return { handle: null, fileBytes }
  }
}

export async function openVault(pin: string, existingHandle?: any) {
  let fileBytes: Uint8Array, handle: any = null
  if (existingHandle) {
    fileBytes = new Uint8Array(await (await existingHandle.getFile()).arrayBuffer())
    handle = existingHandle
  } else {
    const [picked] = await (window as any).showOpenFilePicker({
      types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
    })
    fileBytes = new Uint8Array(await (await picked.getFile()).arrayBuffer())
    handle = picked
  }
  const dbBytes = await decryptDB(fileBytes, pin)
  const SQL = await initSqlJs({ locateFile: f => `/sql-wasm/${f}` })
  return { db: new SQL.Database(dbBytes), handle }
}

export async function saveVault(db: any, pin: string, handle: any) {
  const fileBytes = await encryptDB(db.export(), pin)
  if (handle) {
    const w = await handle.createWritable()
    await w.write(fileBytes); await w.close()
  }
}
```

---

## PART 4 — ZUSTAND STORE (lib/store.ts)

```typescript
import { create } from 'zustand'

interface AppStore {
  recentVaults: VaultMeta[]
  activeVault: VaultMeta | null
  isUnlocked: boolean
  db: any | null
  fileHandle: any | null
  currentPin: string          // NEVER persisted
  gatewayPanel: 'unlock' | 'create' | 'import' | 'success'
  selectedVaultIdx: number
  activeModule: string
  hiddenModules: string[]
  theme: 'dark' | 'light'
  sidebarCollapsed: boolean
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
}

export const useAppStore = create<AppStore>((set, get) => ({
  recentVaults: [], activeVault: null, isUnlocked: false,
  db: null, fileHandle: null, currentPin: '',
  gatewayPanel: 'unlock', selectedVaultIdx: 0,
  activeModule: 'home', hiddenModules: [], theme: 'dark', sidebarCollapsed: false,

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
  setActiveVault: (v, idx) => set({ activeVault: v, selectedVaultIdx: idx, isUnlocked: false, currentPin: '', gatewayPanel: 'unlock' }),
  setGatewayPanel: (p) => set({ gatewayPanel: p as any }),
  unlock: (db, handle) => set({ isUnlocked: true, db, fileHandle: handle }),
  lock: () => set({ isUnlocked: false, db: null, fileHandle: null, currentPin: '' }),
  setCurrentPin: (pin) => set({ currentPin: pin }),
  setActiveModule: (id) => set({ activeModule: id }),
  toggleModule: (id) => {
    const h = get().hiddenModules
    const updated = h.includes(id) ? h.filter(x => x !== id) : [...h, id]
    set({ hiddenModules: updated })
    localStorage.setItem('kutumbly_settings', JSON.stringify({ hiddenModules: updated, theme: get().theme }))
  },
  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t)
    localStorage.setItem('kutumbly_theme', t)
    set({ theme: t })
  },
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}))
```

---

## PART 5 — DATABASE SCHEMA (lib/schema.ts)

```typescript
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
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
  assigned_to TEXT, due_date TEXT, created_at TEXT, completed_at TEXT
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, date TEXT, amount REAL,
  type TEXT, category TEXT, description TEXT,
  member_id TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS budgets (
  id TEXT PRIMARY KEY, category TEXT, monthly_limit REAL, month TEXT
);
CREATE TABLE IF NOT EXISTS health_readings (
  id TEXT PRIMARY KEY, member_id TEXT, date TEXT,
  bp_systolic INTEGER, bp_diastolic INTEGER,
  blood_sugar REAL, pulse INTEGER, weight REAL, notes TEXT, created_at TEXT
);
CREATE TABLE IF NOT EXISTS medications (
  id TEXT PRIMARY KEY, member_id TEXT, name TEXT,
  dosage TEXT, frequency TEXT, start_date TEXT, end_date TEXT
);
CREATE TABLE IF NOT EXISTS staff_members (
  id TEXT PRIMARY KEY, name TEXT, role TEXT,
  monthly_salary REAL, join_date TEXT, phone TEXT
);
CREATE TABLE IF NOT EXISTS attendance (
  id TEXT PRIMARY KEY, staff_id TEXT, date TEXT, status TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS salary_payments (
  id TEXT PRIMARY KEY, staff_id TEXT, month TEXT,
  gross REAL, deductions REAL, net REAL, paid_on TEXT, advance REAL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS investments (
  id TEXT PRIMARY KEY, name TEXT, type TEXT,
  principal REAL, current_value REAL, units REAL,
  monthly_sip REAL, start_date TEXT, maturity_date TEXT, notes TEXT
);
CREATE TABLE IF NOT EXISTS grocery_lists (
  id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active'
);
CREATE TABLE IF NOT EXISTS grocery_items (
  id TEXT PRIMARY KEY, list_id TEXT, name TEXT,
  quantity TEXT, unit TEXT, estimated_price REAL, checked INTEGER DEFAULT 0, category TEXT
);

-- NEVATA MODULE TABLES (extended schema — see Nevata spec below)
CREATE TABLE IF NOT EXISTS nevata_events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  event_type TEXT NOT NULL,       -- 'shaadi' | 'janmdin' | 'tilak' | 'mundan' | 'janeu' | 'sagai' | 'pooja' | 'other'
  direction TEXT NOT NULL,        -- 'bheja' (we invited) | 'aaya' (we received invite)
  family_name TEXT NOT NULL,
  event_date TEXT NOT NULL,
  location TEXT,
  our_count INTEGER DEFAULT 1,    -- how many from our side going
  status TEXT DEFAULT 'upcoming', -- 'upcoming' | 'attended' | 'skipped'
  notes TEXT,
  created_at TEXT
);
CREATE TABLE IF NOT EXISTS nevata_shagun (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  direction TEXT NOT NULL,        -- 'diya' (we gave) | 'mila' (we received)
  amount REAL DEFAULT 0,
  gift_desc TEXT,
  given_by TEXT,                  -- family member name
  received_from TEXT,
  is_confirmed INTEGER DEFAULT 0,
  created_at TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_guest_list (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,         -- only for direction='bheja' events
  guest_name TEXT NOT NULL,
  family_tag TEXT,                -- 'ladki waale' | 'ladke waale' | 'dost' | 'relative'
  guest_count INTEGER DEFAULT 1,
  rsvp_status TEXT DEFAULT 'pending', -- 'aa_rahe' | 'nahi_aayenge' | 'pending'
  phone TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_gift_registry (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL,
  item_name TEXT NOT NULL,
  description TEXT,
  estimated_price REAL,
  status TEXT DEFAULT 'baaki',    -- 'liya' | 'baaki' | 'suggest'
  source_url TEXT,
  FOREIGN KEY (event_id) REFERENCES nevata_events(id)
);
CREATE TABLE IF NOT EXISTS nevata_family_ledger (
  id TEXT PRIMARY KEY,
  family_name TEXT NOT NULL,
  event_id TEXT,
  diya REAL DEFAULT 0,
  mila REAL DEFAULT 0,
  net REAL DEFAULT 0,             -- mila - diya (positive = they owe us)
  notes TEXT,
  updated_at TEXT
);
`
```

---

## PART 6 — SEED DATA (lib/seed.ts)

```typescript
export function seedDatabase(db: any) {
  // Family
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
    ('t5','2026-04-05',6000,'expense','Staff','Kamla Devi salary','jm','2026-04-05'),
    ('t6','2026-04-05',12000,'expense','Staff','Ramesh Kumar salary','jm','2026-04-05')`)

  // Nevata seed
  db.run(`INSERT OR IGNORE INTO nevata_events VALUES
    ('ne1','Rahul ki Shaadi','shaadi','aaya','Mallah Parivar','2026-04-22','Agra',4,'upcoming',NULL,'2026-04-13'),
    ('ne2','Chotu ka Mundan','mundan','aaya','Verma Khaandaan','2026-02-02','Lucknow',3,'attended',NULL,'2026-02-03'),
    ('ne3','Hamari Beti ki Sagai','sagai','bheja','Agarwal Parivar','2026-03-10','Ghar',0,'attended',NULL,'2026-03-11')`)

  db.run(`INSERT OR IGNORE INTO nevata_shagun VALUES
    ('ns1','ne1','diya',21000,'Cash envelope','Jawahar Mallah',NULL,0,'2026-04-13'),
    ('ns2','ne2','diya',15000,'Silver bowl set + cash','Sunita Mallah',NULL,1,'2026-02-03'),
    ('ns3','ne3','mila',51000,'Cash + Saree Set',NULL,'Mallah Parivar',1,'2026-03-11')`)

  db.run(`INSERT OR IGNORE INTO nevata_family_ledger VALUES
    ('nl1','Mallah Parivar','ne3',21000,51000,30000,NULL,'2026-04-13'),
    ('nl2','Verma Khaandaan','ne2',15000,0,-15000,'Unka shagun abhi nahi aaya','2026-04-13')`)

  // Investments
  db.run(`INSERT OR IGNORE INTO investments VALUES
    ('i1','Parag Parikh Flexi Cap','Mutual Fund',240000,280000,NULL,5000,'2022-01-01',NULL,NULL),
    ('i2','SBI Nifty 50 Index','Mutual Fund',160000,190000,NULL,5000,'2022-06-01',NULL,NULL),
    ('i3','PPF Account','PPF',180000,210000,NULL,NULL,'2020-04-01',NULL,NULL),
    ('i4','SBI Fixed Deposit','FD',100000,107000,NULL,NULL,'2023-08-15','2026-08-15',NULL)`)

  // Health
  db.run(`INSERT OR IGNORE INTO health_readings VALUES
    ('h1','jm','2026-04-12',118,76,98,72,NULL,NULL,'2026-04-12'),
    ('h2','sm','2026-04-12',138,88,112,78,NULL,'BP elevated — monitor','2026-04-12')`)

  // Diary
  db.run(`INSERT OR IGNORE INTO diary_entries VALUES
    ('d1','2026-04-12','Aaj family ke saath nashta kiya. Priya ke exam results aye — 94% in Maths. Bahut khushi hui aaj.',4,'Happy','2026-04-12')`)

  // Tasks
  db.run(`INSERT OR IGNORE INTO tasks VALUES
    ('tk1','Renew car insurance','Expires May 1','high','pending','jm','2026-04-28','2026-04-12',NULL),
    ('tk2','Book dentist for Mom',NULL,'medium','pending','sm','2026-05-05','2026-04-12',NULL),
    ('tk3','File ITR FY 2025-26',NULL,'medium','pending','jm','2026-07-31','2026-04-12',NULL)`)

  // Grocery
  db.run(`INSERT OR IGNORE INTO grocery_lists VALUES ('gl1','Kirana List','2026-04-12','active')`)
  db.run(`INSERT OR IGNORE INTO grocery_items VALUES
    ('gi1','gl1','Atta (whole wheat)','5','kg',210,0,'Grains'),
    ('gi2','gl1','Toor Dal','1','kg',140,0,'Grains'),
    ('gi3','gl1','Amul Ghee','500','g',290,0,'Dairy'),
    ('gi4','gl1','Tomatoes','2','kg',80,1,'Vegetables')`)
}
```

---

## PART 7 — DESIGN SYSTEM (globals.css)

```css
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
  --text-success:   #065F46;
  --text-warning:   #92400E;
  --text-danger:    #991B1B;
  --text-info:      #1E40AF;
  --border-light:   #E5E7EB;
  --gold:           #c9971c;
  --gold-light:     #FAEEDA;
  --gold-text:      #633806;
  --radius-md: 8px;
  --radius-lg: 12px;
}
[data-theme="dark"] {
  --bg-primary:    #1F2937;
  --bg-secondary:  #111827;
  --bg-tertiary:   #0F172A;
  --text-primary:   #F9FAFB;
  --text-secondary: #9CA3AF;
  --border-light:   #374151;
  --gold:           #e8b84b;
  --gold-light:     rgba(201,151,28,0.15);
  --gold-text:      #FAEEDA;
}
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--bg-tertiary); color: var(--text-primary); }
.app-shell { max-width: 880px; margin: 0 auto; background: var(--bg-tertiary); min-height: 100vh; }
.active-gold { border-left: 2px solid var(--gold); color: var(--gold); background: var(--gold-light); }
.border-thin { border: 0.5px solid var(--border-light); }
```

---

## PART 8 — NEVATA MODULE — FULL SPEC

### Overview
Nevata module has two flows, toggled at the top:

**Flow A — "Nevata Bhejna" (Hamari Shaadi):**
We sent invites. Track guest list, RSVP, shagun received.

**Flow B — "Nevata Aana" (Unki Shaadi):**
We received an invite. Track what to bring, shagun to give, suggest amount based on history.

### Component: `components/modules/nevata/NevataModule.tsx`

```
NevataModule
  ├── NevataToggle         — "Nevata Bhejna" / "Nevata Aana" top switch
  ├── NevataStats          — 3 stat cards (events count, diya, mila / upcoming count, ja rahe, kharcha)
  │
  ├── [Nevata Bhejna view]
  │   ├── GuestList        — guest rows with RSVP badges (Aa Rahe / Nahi Aayenge / Pata Nahi)
  │   ├── ShagunReceived   — who gave what, total progress bar
  │   └── ReminderList     — pending confirmations with reminder button
  │
  └── [Nevata Aana view]
      ├── EventCard        — event details + "Ja Rahe / Nahi Jayenge" badge
      ├── ShagunSuggester  — auto-calculates suggested amount from ledger history
      ├── LeJaanelist      — checklist (cash, gift, mithai) with checkboxes
      └── UpcomingEvents   — future events not yet confirmed
```

### Shagun Suggester Logic (useNevata.ts)

```typescript
// Given family_name, look up nevata_family_ledger
// Suggest = last amount they gave us + 10-20% uplift (rivaaj)
export function suggestShagun(familyName: string, db: any): number {
  const result = db.exec(
    `SELECT mila FROM nevata_family_ledger WHERE family_name = ? ORDER BY updated_at DESC LIMIT 1`,
    [familyName]
  )
  if (!result[0]?.values[0]) return 5100  // default
  const lastMila = result[0].values[0][0] as number
  return Math.ceil((lastMila * 1.15) / 100) * 100  // 15% up, round to nearest 100
}
```

### Tab Structure inside Nevata
```
Kaaryakram | Hisaab | Aane Waale | Gift Registry
```

**Kaaryakram tab:**
- Filter chips: Sab / Shaadi / Janm Din / Tilak / Mundan / Janeu
- Event cards with:
  - Title, date, family name
  - Status badge (Aa Rahe / Ja Rahe / Pending / Nahi Aaye)
  - Shagun row: "Humne Diya" + "Unka Nevata" — amount + check mark
  - Mini progress bar (mila vs diya balance)

**Hisaab tab:**
- Family-wise ledger from `nevata_family_ledger`
- Net amount: green (owed to us) / red (we owe) / gray (barabar)

**Aane Waale tab:**
- Upcoming events sorted by date
- Days remaining badge (color: amber < 30 days, red < 7 days)
- Suggested shagun shown inline

**Gift Registry tab:**
- Per-event wish lists
- Item status: Liya (green) / Baaki (amber) / Suggest (blue)

### Badges used in Nevata
```typescript
const RSVP_BADGES = {
  aa_rahe:      { label: 'Aa Rahe',      style: 'b-green' },
  nahi_aayenge: { label: 'Nahi Aayenge', style: 'b-red' },
  pending:      { label: 'Pata Nahi',    style: 'b-amber' },
}
const DIRECTION_BADGES = {
  bheja: { label: 'Hamari Shaadi',  style: 'b-pink' },
  aaya:  { label: 'Unki Shaadi',    style: 'b-blue' },
}
const EVENT_TYPES = ['shaadi','sagai','tilak','janmdin','mundan','janeu','pooja','other']
```

### hook: useNevata.ts

```typescript
export function useNevata() {
  const { db } = useAppStore()

  const getEvents = (direction?: string) =>
    db.exec(`SELECT * FROM nevata_events ${direction ? "WHERE direction=?" : ""} ORDER BY event_date DESC`,
      direction ? [direction] : [])

  const getGuestList = (eventId: string) =>
    db.exec(`SELECT * FROM nevata_guest_list WHERE event_id = ?`, [eventId])

  const getShagun = (eventId: string) =>
    db.exec(`SELECT * FROM nevata_shagun WHERE event_id = ?`, [eventId])

  const getLedger = () =>
    db.exec(`SELECT * FROM nevata_family_ledger ORDER BY ABS(net) DESC`)

  const getUpcoming = () =>
    db.exec(`SELECT * FROM nevata_events WHERE event_date >= date('now') ORDER BY event_date ASC`)

  const addEvent = (event: Partial<NevataEvent>) => { /* INSERT + saveVault */ }
  const updateRSVP = (guestId: string, status: string) => { /* UPDATE + saveVault */ }
  const addShagun = (shagun: Partial<NevataShgun>) => { /* INSERT + updateLedger + saveVault */ }
  const addGiftItem = (item: Partial<GiftRegistryItem>) => { /* INSERT + saveVault */ }

  return { getEvents, getGuestList, getShagun, getLedger, getUpcoming,
           addEvent, updateRSVP, addShagun, addGiftItem, suggestShagun }
}
```

---

## PART 9 — MAIN DASHBOARD (app/dashboard/page.tsx)

### Header
```
┌──────────────────────────────────────────────────────┐
│  🛡️ kutumbly  ·  [Vault Name]        offline·AES-256 │
└──────────────────────────────────────────────────────┘
```
- Left: shield + "kutumbly" + dot + vault name from DB `settings` table
- Right: "offline · AES-256" label + green dot
- Lock icon button → `store.lock()` → redirect to `/`

### Tab Navigation
```
Home | Diary | Tasks | Money | Nevata | Health | Invest | Grocery | HomeStaff | Setup
```
- Horizontal scrollable (scrollbar hidden)
- Active: `border-bottom: 2px solid var(--gold); color: var(--gold)`
- Hidden modules filtered via Zustand `hiddenModules`

### All 10 Modules
Match kutumbly-ui.html exactly. Data from sql.js. Wired buttons.

---

## PART 10 — MODULE DATA QUERIES

```typescript
// useDiary.ts
db.exec(`SELECT * FROM diary_entries ORDER BY date DESC`)

// useTasks.ts
db.exec(`SELECT * FROM tasks ORDER BY
  CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, due_date ASC`)

// useMoney.ts
db.exec(`SELECT * FROM transactions WHERE strftime('%Y-%m', date) = ? ORDER BY date DESC`, [month])
db.exec(`SELECT
  SUM(CASE WHEN type='income' THEN amount ELSE 0 END) as income,
  SUM(CASE WHEN type='expense' THEN amount ELSE 0 END) as expense
  FROM transactions WHERE strftime('%Y-%m', date) = ?`, [month])

// useStaff.ts — salary calc
// (monthly_salary / 26) * present_days  (half day = 0.5)

// useInvest.ts — XIRR simple
// ((current/principal)^(1/years) - 1) * 100
```

---

## PART 11 — next.config.ts

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

## PART 12 — GITHUB ACTIONS

```yaml
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

| # | Phase | What |
|---|-------|------|
| 1 | setup | next.config, tailwind, fonts, types, globals.css |
| 2 | crypto | lib/crypto.ts — AES-256-GCM |
| 3 | vault | lib/vault.ts — create/open/save .kutumb |
| 4 | schema | lib/schema.ts + lib/seed.ts (incl. Nevata tables) |
| 5 | store | lib/store.ts — Zustand |
| 6 | gateway | All gateway/ components + app/page.tsx |
| 7 | appshell | Sidebar, Topbar, AppShell |
| 8 | home | Home module |
| 9 | diary | Diary CRUD + mood |
| 10 | tasks | Tasks CRUD |
| 11 | money | Transactions + summary |
| 12 | health | Vitals + medications |
| 13 | nevata | Full Nevata module — both flows (Bhejna + Aana) |
| 14 | grocery | Lists + items |
| 15 | invest | Portfolio + XIRR |
| 16 | staff | Attendance + salary |
| 17 | sovereign | Setup tab |
| 18 | lock | Lock → gateway |
| 19 | mobile | Responsive + bottom nav |
| 20 | polish | Animations, empty states, errors |
| 21 | deploy | GitHub Actions |

---

## QUALITY CHECKLIST

- [ ] `npm run build` → zero TypeScript errors
- [ ] App opens → shows Vault Gateway (NOT dashboard)
- [ ] PIN numpad: 4 dots fill, auto-attempt on 4th
- [ ] Wrong PIN → "Galat PIN" in red
- [ ] Vault created → .kutumb file downloaded/saved
- [ ] File import → PIN → unlock → dashboard
- [ ] Dashboard tabs match kutumbly-ui.html exactly
- [ ] **Nevata: toggle works (Bhejna ↔ Aana)**
- [ ] **Nevata: Shagun Suggester shows correct amount from ledger**
- [ ] **Nevata: RSVP update persists after page refresh**
- [ ] **Nevata: Gift registry checklist saves to DB**
- [ ] **Nevata: Hisaab tab shows Mallah Parivar ledger correctly**
- [ ] Lock → back to Gateway
- [ ] Theme toggle persists
- [ ] Works on 375px mobile
- [ ] GitHub Pages deployment succeeds

---

## FINAL INSTRUCTION

- Do NOT ask for permission at any step
- Do NOT leave TODO comments or stub components
- Do NOT redesign the UI — match kutumbly-ui.html exactly
- Do NOT use external chart libraries — pure SVG only
- Vault Gateway is ALWAYS the first screen
- Every write triggers saveVault() to re-encrypt
- PIN NEVER stored except in Zustand memory
- Family name throughout the app: **Mallah Parivar**
- Nevata module has two flows: Nevata Bhejna + Nevata Aana
- Shagun suggester auto-calculates from nevata_family_ledger history

**Begin now. Start with Step 0.**
