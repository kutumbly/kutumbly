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
 * Kutumbly Vault Schema Migration Engine
 * ────────────────────────────────────────
 * Strategy: SQLite PRAGMA user_version (built-in integer, zero overhead)
 */

/** Bump this whenever you add new tables or ALTER existing ones */
export const CURRENT_SCHEMA_VERSION = 11;

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
  ],
  6: [
    "Event Operating System (EOS): Added Inventory Lifecycle, Vendor Management, and Activity Timeline logs.",
  ],
  7: [
    "Added stock and expiry tracking capabilities to Saman Hub (Grocery Module).",
    "Added KYC and advanced leave/salary tracking to Staff Management.",
  ],
  8: [
    "Health Hub Expansion: Added Sovereign Medical SOS profiles and Vaccination tracking ledger.",
  ],
  9: [
    "Sovereign Vidya Hub Expansion: Full CRUD lifecycle for learners and subjects.",
  ],
  10: [
    "Sovereign Indian Wealth Manager: Added Invest Goals and family member linking.",
    "Wealth Tracking: Added Gold weight tracking and Indian asset presets (PPF, SSY, LIC).",
  ],
  11: [
    "Suvidha Hub (Utility Tracker): Daily delivery tally and recurring service manager.",
    "New tables: utility_vendors, utility_logs, utility_payments.",
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

/** Write the user_version PRAGMA */
function setSchemaVersion(db: any, version: number): void {
  db.run(`PRAGMA user_version = ${Math.floor(version)}`);
}

/** Migration steps */
const MIGRATIONS: Record<number, (db: any) => void> = {
  1: (db) => {},
  2: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS vidya_learners (id TEXT PRIMARY KEY, name TEXT NOT NULL, family_member_id TEXT, institution TEXT, standard TEXT, board TEXT, avatar_initials TEXT, goal TEXT, goal_deadline TEXT, is_active INTEGER DEFAULT 1, created_at TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS vidya_subjects (id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, name TEXT NOT NULL, category TEXT DEFAULT 'General', color TEXT DEFAULT '#c9971c', target_score TEXT, notes TEXT, created_at TEXT, FOREIGN KEY (learner_id) REFERENCES vidya_learners(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS vidya_resources (id TEXT PRIMARY KEY, subject_id TEXT NOT NULL, learner_id TEXT NOT NULL, title TEXT NOT NULL, resource_type TEXT NOT NULL, url TEXT, thumbnail_url TEXT, description TEXT, chapter TEXT, lesson TEXT, tags TEXT, is_bookmarked INTEGER DEFAULT 0, is_completed INTEGER DEFAULT 0, difficulty TEXT DEFAULT 'medium', duration_mins INTEGER, created_at TEXT, FOREIGN KEY (subject_id) REFERENCES vidya_subjects(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS vidya_sessions (id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, subject_id TEXT, resource_id TEXT, date TEXT NOT NULL, duration_mins INTEGER NOT NULL, notes TEXT, mood TEXT DEFAULT 'neutral', created_at TEXT, FOREIGN KEY (learner_id) REFERENCES vidya_learners(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS grocery_lists (id TEXT PRIMARY KEY, name TEXT, created_at TEXT, status TEXT DEFAULT 'active')`);
    try { db.run(`ALTER TABLE grocery_items ADD COLUMN checked INTEGER DEFAULT 0`); } catch {}
    try { db.run(`ALTER TABLE diary_entries ADD COLUMN mood_label TEXT`); } catch {}
  },
  3: (db) => {
    try { db.run(`ALTER TABLE tasks ADD COLUMN category TEXT DEFAULT 'Home'`); } catch {}
    db.run(`CREATE TABLE IF NOT EXISTS investment_transactions (id TEXT PRIMARY KEY, investment_id TEXT NOT NULL, type TEXT, amount REAL, date TEXT, notes TEXT, created_at TEXT, FOREIGN KEY (investment_id) REFERENCES investments(id))`);
  },
  4: (db) => {
    const addCol = (colDef: string) => { try { db.run(`ALTER TABLE diary_entries ADD COLUMN ${colDef}`); } catch {} };
    addCol('title TEXT'); addCol('subtitle TEXT'); addCol('tags TEXT'); addCol('weather TEXT'); addCol('location TEXT'); addCol('is_locked INTEGER DEFAULT 0');
  },
  5: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS nevata_events (id TEXT PRIMARY KEY, title TEXT NOT NULL, event_type TEXT NOT NULL, direction TEXT NOT NULL, family_name TEXT NOT NULL, event_date TEXT NOT NULL, location TEXT, our_count INTEGER DEFAULT 1, status TEXT DEFAULT 'upcoming', notes TEXT, created_at TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_shagun (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, direction TEXT NOT NULL, amount REAL DEFAULT 0, gift_desc TEXT, given_by TEXT, received_from TEXT, is_confirmed INTEGER DEFAULT 0, created_at TEXT, FOREIGN KEY (event_id) REFERENCES nevata_events(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_guest_list (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, guest_name TEXT NOT NULL, family_tag TEXT, guest_count INTEGER DEFAULT 1, rsvp_status TEXT DEFAULT 'pending', phone TEXT, FOREIGN KEY (event_id) REFERENCES nevata_events(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_gift_registry (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, item_name TEXT NOT NULL, description TEXT, estimated_price REAL, status TEXT DEFAULT 'baaki', source_url TEXT, FOREIGN KEY (event_id) REFERENCES nevata_events(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_family_ledger (id TEXT PRIMARY KEY, family_name TEXT NOT NULL, event_id TEXT, diya REAL DEFAULT 0, mila REAL DEFAULT 0, net REAL DEFAULT 0, notes TEXT, updated_at TEXT)`);
  },
  6: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS nevata_inventory (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, item_name TEXT NOT NULL, category TEXT NOT NULL, quantity_expected REAL DEFAULT 0, quantity_received REAL DEFAULT 0, quantity_used REAL DEFAULT 0, unit TEXT DEFAULT 'pcs', status TEXT DEFAULT 'ORDERED', vendor_id TEXT, assigned_to_id TEXT, backup_person_id TEXT, delivery_date_expected TEXT, delivery_date_actual TEXT, is_returnable INTEGER DEFAULT 0, return_deadline TEXT, cost_estimated REAL DEFAULT 0, cost_actual REAL DEFAULT 0, notes TEXT, created_at TEXT, FOREIGN KEY (event_id) REFERENCES nevata_events(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_vendors (id TEXT PRIMARY KEY, name TEXT NOT NULL, service_type TEXT, contact TEXT, rating REAL DEFAULT 5, reliability_score REAL DEFAULT 100, advance_paid REAL DEFAULT 0, total_amount REAL DEFAULT 0, payment_status TEXT DEFAULT 'PENDING', last_used_event TEXT, notes TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS nevata_activity_log (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, type TEXT NOT NULL, action TEXT NOT NULL, item_id TEXT, vendor_id TEXT, user_id TEXT, timestamp TEXT NOT NULL, metadata TEXT, FOREIGN KEY (event_id) REFERENCES nevata_events(id))`);
  },
  7: (db) => {
    const addCol = (colDef: string) => { try { db.run(`ALTER TABLE grocery_items ADD COLUMN ${colDef}`); } catch {} };
    addCol('current_stock REAL DEFAULT 0'); addCol('threshold REAL DEFAULT 1'); addCol('expiry_date TEXT'); addCol('last_purchased_date TEXT');
    const addStaffCol = (colDef: string) => { try { db.run(`ALTER TABLE staff_members ADD COLUMN ${colDef}`); } catch {} };
    addStaffCol('advance_balance REAL DEFAULT 0'); addStaffCol('paid_leaves_quota INTEGER DEFAULT 0'); addStaffCol(`kyc_status TEXT DEFAULT 'PENDING'`); addStaffCol('gov_id_number TEXT');
  },
  8: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS medical_profiles (id TEXT PRIMARY KEY, member_id TEXT NOT NULL, blood_group TEXT, allergies TEXT, chronic_conditions TEXT, primary_doctor TEXT, emergency_contact TEXT, insurance_details TEXT, updated_at TEXT, FOREIGN KEY (member_id) REFERENCES family_members(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS vaccinations (id TEXT PRIMARY KEY, member_id TEXT NOT NULL, name TEXT NOT NULL, date TEXT, provider TEXT, next_due_date TEXT, notes TEXT, created_at TEXT, FOREIGN KEY (member_id) REFERENCES family_members(id))`);
  },
  9: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS vidya_learners (id TEXT PRIMARY KEY, name TEXT NOT NULL, family_member_id TEXT, institution TEXT, standard TEXT, board TEXT, avatar_initials TEXT, goal TEXT, goal_deadline TEXT, is_active INTEGER DEFAULT 1, created_at TEXT)`);
  },
  10: (db) => {
    try { db.run(`ALTER TABLE investments ADD COLUMN goal_id TEXT`); } catch {}
  },
  11: (db) => {
    db.run(`CREATE TABLE IF NOT EXISTS utility_vendors (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL, rate_per_unit REAL DEFAULT 0, billing_cycle_day INTEGER DEFAULT 1, member_id TEXT, is_active INTEGER DEFAULT 1, created_at TEXT, FOREIGN KEY (member_id) REFERENCES family_members(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS utility_logs (id TEXT PRIMARY KEY, vendor_id TEXT NOT NULL, date TEXT NOT NULL, quantity REAL DEFAULT 1, quality INTEGER DEFAULT 5, notes TEXT, created_at TEXT, FOREIGN KEY (vendor_id) REFERENCES utility_vendors(id))`);
    db.run(`CREATE TABLE IF NOT EXISTS utility_payments (id TEXT PRIMARY KEY, vendor_id TEXT NOT NULL, amount REAL NOT NULL, date TEXT NOT NULL, period_month TEXT NOT NULL, period_year TEXT NOT NULL, notes TEXT, created_at TEXT, FOREIGN KEY (vendor_id) REFERENCES utility_vendors(id))`);
  },
};

export function needsMigration(db: any): boolean {
  return getSchemaVersion(db) < CURRENT_SCHEMA_VERSION;
}

export function runMigrations(db: any, onProgress?: (current: number, total: number, version: number) => void): void {
  const fromVersion = getSchemaVersion(db);
  if (fromVersion >= CURRENT_SCHEMA_VERSION) return;
  const steps = [];
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) { if (MIGRATIONS[v]) steps.push(v); }
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

export function getPendingChangelog(fromVersion: number): { version: number; changes: string[] }[] {
  const result = [];
  for (let v = fromVersion + 1; v <= CURRENT_SCHEMA_VERSION; v++) {
    if (MIGRATION_CHANGELOGS[v]) { result.push({ version: v, changes: MIGRATION_CHANGELOGS[v] }); }
  }
  return result;
}
