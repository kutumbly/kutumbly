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
 * Kutumbly Vault Schema Migration Engine
 * ────────────────────────────────────────
 * Strategy: SQLite PRAGMA user_version (built-in integer, zero overhead)
 *
 * Rules:
 *  1. Every schema change bumps CURRENT_SCHEMA_VERSION by 1.
 *  2. Each migration step in MIGRATIONS[n] is idempotent — safe to re-run.
 *  3. A pre-migration backup (encrypted) is offered to the user before any run.
 *  4. Migrations run sequentially: if stored v=1 and current=3,
 *     steps 2 then 3 both execute in order.
 *
 * Reading version: PRAGMA user_version   → returns integer
 * Writing version: PRAGMA user_version = N  (must be integer literal — no bind params)
 */

/** Bump this whenever you add new tables or ALTER existing ones */
export const CURRENT_SCHEMA_VERSION = 6;

/** What changed in each version — shown in the migration modal */
export const MIGRATION_CHANGELOGS: Record<number, string[]> = {
  1: [
    "Initial schema: family members, diary, tasks, money, health, grocery, staff, nevata.",
  ],
  2: [
    "Vidya Study Buddy module — track studies for every family member.",
    "New tables: vidya_learners, vidya_subjects, vidya_resources, vidya_sessions.",
    "Grocery module — full write support (add, check, delete items).",
    "Diary module — full write support (save & delete entries).",
    "StaffMember type fix — monthly_salary column alignment.",
  ],
  3: [
    "Task manager category field support added.",
    "Investment transactions tracking added for robust ledger.",
  ],
  5: [
    "Nevata Module schema hardening and repair.",
    "Ensures all required tables for events, shagun, and family ledger are present.",
  ],
  6: [
    "Event Operating System (EOS): Added Inventory Lifecycle, Vendor Management, and Activity Timeline logs.",
  ],
};

/** Read the user_version PRAGMA from a sql.js Database */
export function getSchemaVersion(db: any): number {
  try {
    const res = db.exec("PRAGMA user_version");
    return Number(res?.[0]?.values?.[0]?.[0] ?? 0);
  } catch {
    return 0;
  }
}

/** Write the user_version PRAGMA (must be a literal — cannot use bind params) */
function setSchemaVersion(db: any, version: number): void {
  // PRAGMA user_version does NOT support parameterized statements in sql.js
  db.run(`PRAGMA user_version = ${Math.floor(version)}`);
}

/**
 * Migration steps — keyed by the VERSION they bring the DB to.
 * e.g. MIGRATIONS[2] upgrades from v1 → v2.
 * Each step uses CREATE TABLE IF NOT EXISTS / ALTER TABLE (when safe)
 * so it is always idempotent.
 */
const MIGRATIONS: Record<number, (db: any) => void> = {

  // ── V1: Stamp existing vaults that pre-date versioning ────────────
  1: (db) => {
    // Tables already created by SCHEMA_SQL at vault creation.
    // This step just exists so version 0 (unversioned) vaults get stamped.
    // No-op beyond setting the version stamp at the end of runMigrations().
  },

  // ── V2: Vidya Study Buddy + write-capable grocery/diary ──────────
  2: (db) => {
    // --- vidya_learners ---
    db.run(`CREATE TABLE IF NOT EXISTS vidya_learners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      family_member_id TEXT,
      institution TEXT,
      standard TEXT,
      board TEXT,
      avatar_initials TEXT,
      goal TEXT,
      goal_deadline TEXT,
      is_active INTEGER DEFAULT 1,
      created_at TEXT
    )`);

    // --- vidya_subjects ---
    db.run(`CREATE TABLE IF NOT EXISTS vidya_subjects (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT DEFAULT 'General',
      color TEXT DEFAULT '#c9971c',
      target_score TEXT,
      notes TEXT,
      created_at TEXT
    )`);

    // --- vidya_resources ---
    db.run(`CREATE TABLE IF NOT EXISTS vidya_resources (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL,
      learner_id TEXT NOT NULL,
      title TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      url TEXT,
      thumbnail_url TEXT,
      description TEXT,
      chapter TEXT,
      lesson TEXT,
      tags TEXT,
      is_bookmarked INTEGER DEFAULT 0,
      is_completed INTEGER DEFAULT 0,
      difficulty TEXT DEFAULT 'medium',
      duration_mins INTEGER,
      created_at TEXT
    )`);

    // --- vidya_sessions ---
    db.run(`CREATE TABLE IF NOT EXISTS vidya_sessions (
      id TEXT PRIMARY KEY,
      learner_id TEXT NOT NULL,
      subject_id TEXT,
      resource_id TEXT,
      date TEXT NOT NULL,
      duration_mins INTEGER NOT NULL,
      notes TEXT,
      mood TEXT DEFAULT 'neutral',
      created_at TEXT
    )`);

    // Ensure grocery_lists exists (older vaults may be missing it)
    db.run(`CREATE TABLE IF NOT EXISTS grocery_lists (
      id TEXT PRIMARY KEY,
      name TEXT,
      created_at TEXT,
      status TEXT DEFAULT 'active'
    )`);

    // Ensure grocery_items.checked column exists (was missing in some early builds)
    try {
      db.run(`ALTER TABLE grocery_items ADD COLUMN checked INTEGER DEFAULT 0`);
    } catch {
      // Column already exists — safe to ignore
    }

    // Ensure diary_entries.mood_label exists
    try {
      db.run(`ALTER TABLE diary_entries ADD COLUMN mood_label TEXT`);
    } catch {
      // Already exists — safe to ignore
    }
  },

  // ── V3: Tasks Category & Investment Ledger ──────────
  3: (db) => {
    // --- tasks category ---
    try {
      db.run(`ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT 'Home'`);
    } catch {
      // Already exists
    }

    // --- investment_transactions ---
    db.run(`CREATE TABLE IF NOT EXISTS investment_transactions (
      id TEXT PRIMARY KEY,
      investment_id TEXT NOT NULL,
      type TEXT,
      amount REAL,
      date TEXT,
      notes TEXT,
      created_at TEXT,
      FOREIGN KEY (investment_id) REFERENCES investments(id)
    )`);
  },

  4: (db) => {
    // --- diary columns ---
    const addCol = (colDef: string) => {
      try {
        db.run(`ALTER TABLE diary_entries ADD COLUMN ${colDef}`);
      } catch {
        // column exists
      }
    };
    addCol('title TEXT');
    addCol('subtitle TEXT');
    addCol('tags TEXT');
    addCol('weather TEXT');
    addCol('location TEXT');
    addCol('is_locked INTEGER DEFAULT 0');
  },

  // ── V5: Nevata Module Schema Hardening ──────────
  5: (db) => {
    // Ensure all Nevata tables exist (idempotent repair)
    db.run(`CREATE TABLE IF NOT EXISTS nevata_events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      event_type TEXT NOT NULL,
      direction TEXT NOT NULL,
      family_name TEXT NOT NULL,
      event_date TEXT NOT NULL,
      location TEXT,
      our_count INTEGER DEFAULT 1,
      status TEXT DEFAULT 'upcoming',
      notes TEXT,
      created_at TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS nevata_shagun (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      direction TEXT NOT NULL,
      amount REAL DEFAULT 0,
      gift_desc TEXT,
      given_by TEXT,
      received_from TEXT,
      is_confirmed INTEGER DEFAULT 0,
      created_at TEXT,
      FOREIGN KEY (event_id) REFERENCES nevata_events(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS nevata_guest_list (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      guest_name TEXT NOT NULL,
      family_tag TEXT,
      guest_count INTEGER DEFAULT 1,
      rsvp_status TEXT DEFAULT 'pending',
      phone TEXT,
      FOREIGN KEY (event_id) REFERENCES nevata_events(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS nevata_gift_registry (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      description TEXT,
      estimated_price REAL,
      status TEXT DEFAULT 'baaki',
      source_url TEXT,
      FOREIGN KEY (event_id) REFERENCES nevata_events(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS nevata_family_ledger (
      id TEXT PRIMARY KEY,
      family_name TEXT NOT NULL,
      event_id TEXT,
      diya REAL DEFAULT 0,
      mila REAL DEFAULT 0,
      net REAL DEFAULT 0,
      notes TEXT,
      updated_at TEXT
    )`);
  },
  6: (db: any) => {
    // 1. Inventory Lifecycle Table
    db.run(`CREATE TABLE IF NOT EXISTS nevata_inventory (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      category TEXT NOT NULL,       -- 'Catering' | 'Decor' | 'Logistics' | 'Gift'
      quantity_expected REAL DEFAULT 0,
      quantity_received REAL DEFAULT 0,
      quantity_used REAL DEFAULT 0,
      unit TEXT DEFAULT 'pcs',      -- 'kg' | 'pcs' | 'sets'
      status TEXT DEFAULT 'ORDERED', -- 'ORDERED' | 'DISPATCHED' | 'RECEIVED' | 'IN_USE' | 'RETURNED' | 'LOST'
      vendor_id TEXT,
      assigned_to_id TEXT,          -- linked to family_members.id or name
      backup_person_id TEXT,
      delivery_date_expected TEXT,
      delivery_date_actual TEXT,
      is_returnable INTEGER DEFAULT 0,
      return_deadline TEXT,
      cost_estimated REAL DEFAULT 0,
      cost_actual REAL DEFAULT 0,
      notes TEXT,
      created_at TEXT,
      FOREIGN KEY (event_id) REFERENCES nevata_events(id)
    )`);

    // 2. Vendor Management Table
    db.run(`CREATE TABLE IF NOT EXISTS nevata_vendors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      service_type TEXT,            -- 'Catering' | 'Decor' | 'DJ' | 'Transport'
      contact TEXT,
      rating REAL DEFAULT 5,
      reliability_score REAL DEFAULT 100,
      advance_paid REAL DEFAULT 0,
      total_amount REAL DEFAULT 0,
      payment_status TEXT DEFAULT 'PENDING',
      last_used_event TEXT,
      notes TEXT
    )`);

    // 3. Activity Timeline Brain
    db.run(`CREATE TABLE IF NOT EXISTS nevata_activity_log (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL,
      type TEXT NOT NULL,           -- 'ITEM' | 'PAYMENT' | 'TASK' | 'ALERT'
      action TEXT NOT NULL,         -- 'CREATED' | 'UPDATED' | 'RECEIVED' | 'PAID' | 'ASSIGNED'
      item_id TEXT,                 -- optional link to inventory
      vendor_id TEXT,               -- optional link to vendor
      user_id TEXT,                 -- family member who did it
      timestamp TEXT NOT NULL,
      metadata TEXT,                -- JSON string for extra info
      FOREIGN KEY (event_id) REFERENCES nevata_events(id)
    )`);
  },
};

/**
 * Check if migration is needed — call immediately after vault decrypt.
 * @returns true if the DB needs upgrading
 */
export function needsMigration(db: any): boolean {
  return getSchemaVersion(db) < CURRENT_SCHEMA_VERSION;
}

/**
 * Run all pending migration steps sequentially.
 * Each step is wrapped in a savepoint (sub-transaction) so a failure
 * in step N does not corrupt the steps already applied.
 *
 * @param db - open sql.js Database
 * @param onProgress - optional callback with (currentStep, totalSteps, versionBeingApplied)
 */
export function runMigrations(
  db: any,
  onProgress?: (current: number, total: number, version: number) => void
): void {
  const fromVersion = getSchemaVersion(db);

  if (fromVersion >= CURRENT_SCHEMA_VERSION) return; // already up to date

  const steps = [];
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (MIGRATIONS[v]) steps.push(v);
  }

  steps.forEach((version, idx) => {
    onProgress?.(idx + 1, steps.length, version);

    try {
      db.run("SAVEPOINT migration_step");
      MIGRATIONS[version](db);
      setSchemaVersion(db, version);
      db.run("RELEASE SAVEPOINT migration_step");
    } catch (err) {
      db.run("ROLLBACK TO SAVEPOINT migration_step");
      throw new Error(`Migration to v${version} failed: ${String(err)}`);
    }
  });
}

/**
 * Build a human-readable changelog for versions fromVersion+1 → CURRENT
 */
export function getPendingChangelog(fromVersion: number): { version: number; changes: string[] }[] {
  const result = [];
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (MIGRATION_CHANGELOGS[v]) {
      result.push({ version: v, changes: MIGRATION_CHANGELOGS[v] });
    }
  }
  return result;
}
