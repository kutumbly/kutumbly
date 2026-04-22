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

import { SCHEMA_SQL } from "./schema";

/**
 * Kutumbly Vault Schema Migration Engine
 * ────────────────────────────────────────
 * Strategy: SQLite PRAGMA user_version (built-in integer, zero overhead)
 */

export const CURRENT_SCHEMA_VERSION = 9;

/** What changed in each version — shown in the migration modal */
export const MIGRATION_CHANGELOGS: Record<number, string[]> = {
  1: [
    "Initial Unified Schema: All modules (Saman, Cash, Vidya, Suvidha, Health, Utsav) merged into the baseline v1 database.",
  ],
  2: [
    "Sovereign Nomenclature Update: Renamed legacy tables (nevata, staff) to standard sovereign terminology (utsav, sewak).",
  ],
  3: [
    "Staff Module Expansion: Introduced Advances, Welfare tracking, and RWA Document vaults natively into the Sewak schema.",
  ],
  4: [
    "Vault Stability & Hub Alignment: Provisioned missing Invest Hub tables and deployed global performance indexes across all ledgers.",
    "Memory Protocol: Standardized archiving status (is_active) across all Family, Vendor, and Learner profiles.",
  ],
  5: [
    "Sewak Hub Stability: Provisioned missing 'is_active' column for existing staff profiles to support archiving operations.",
  ],
  6: [
    "Sovereign Expansion: Deployed Vahan Hub (Fleet Management) and Sanskriti Hub (Heritage) schemas.",
    "Integrated Governance: Provisioned missing registries for Utsav gifts and Health prescriptions.",
    "Global Performance: Added vehicle-specific indexing for faster fleet log retrieval.",
  ],
  7: [
    "Self-Healing: Synchronized master schema to ensure all hub tables (Investments, Guests, Shagun) exist across all legacy vaults.",
  ],
  8: [
    "Utility Tally Hardening: Added 'unit' support for Suvidha logs (Litres, Kg, Pieces).",
    "Audit Ready: Integrated 'payment_mode' and 'member_id' tracking for utility payments.",
    "System Consistency: Standardized payment registries across Suvidha and Sewak modules.",
  ],
  9: [
    "Self-healing: Repaired legacy Investment registers missing audit columns.",
    "Force synchronization of audit columns across all active modules."
  ]
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
  1: (db) => {
    // All tables are natively created by SCHEMA_SQL when a vault is initialized.
    // We squash all old structural ALTERs and CREATEs here for a fresh state.
  },
  2: (db) => {
    // Rename tables
    const renames = [
      "ALTER TABLE utsav_nevata_events RENAME TO utsav_events",
      "ALTER TABLE utsav_nevata_guests RENAME TO utsav_guests",
      "ALTER TABLE utsav_nevata_ledger RENAME TO utsav_ledger",
      "ALTER TABLE utsav_nevata_inventory RENAME TO utsav_inventory",
      "ALTER TABLE utsav_nevata_vendors RENAME TO utsav_vendors",
      "ALTER TABLE utsav_nevata_activity_log RENAME TO utsav_activity_log",
      "ALTER TABLE staff_members RENAME TO sewak_members",
      "ALTER TABLE staff_attendance RENAME TO sewak_attendance",
      "ALTER TABLE staff_payments RENAME TO sewak_payments"
    ];
    for (const stmt of renames) {
      try {
        db.run(stmt);
      } catch (e) {
        // Ignore if table doesn't exist (e.g. fresh DB init)
      }
    }
  },
  3: (db) => {
    // 1. Add columns to sewak_members. Use safe execution in case they already exist (idempotent)
    const alters = [
      "ALTER TABLE sewak_members ADD COLUMN emergency_contact TEXT;",
      "ALTER TABLE sewak_members ADD COLUMN shift_timing TEXT;"
    ];
    for (const stmt of alters) {
      try { db.run(stmt); } catch (e) { /* ignore if already exists */ }
    }
    
    // 2. Create the new Advanced/Important Tier tables for Sewak Hub!
    const creates = [
      `CREATE TABLE IF NOT EXISTS sewak_advances (
        id TEXT PRIMARY KEY, sewak_id TEXT, amount REAL, 
        date TEXT, reason TEXT, status TEXT DEFAULT 'ACTIVE',
        FOREIGN KEY (sewak_id) REFERENCES sewak_members(id)
      );`,
      `CREATE TABLE IF NOT EXISTS sewak_welfare (
        id TEXT PRIMARY KEY, sewak_id TEXT, welfare_type TEXT,
        amount REAL, event_date TEXT, notes TEXT,
        FOREIGN KEY (sewak_id) REFERENCES sewak_members(id)
      );`,
      `CREATE TABLE IF NOT EXISTS sewak_documents (
        id TEXT PRIMARY KEY, sewak_id TEXT, doc_type TEXT,
        vault_ref TEXT, expiry_date TEXT, verification_status TEXT DEFAULT 'PENDING',
        FOREIGN KEY (sewak_id) REFERENCES sewak_members(id)
      );`
    ];
    for (const stmt of creates) {
      db.run(stmt);
    }
  },
  4: (db) => {
    // 1. Backfill Invest Hub (Self-Healing)
    const investCreates = [
      `CREATE TABLE IF NOT EXISTS cash_investments (
          id TEXT PRIMARY KEY, member_id TEXT, goal_id TEXT, name TEXT NOT NULL, type TEXT NOT NULL,
          principal REAL DEFAULT 0, current_value REAL DEFAULT 0, units REAL DEFAULT 0,
          monthly_sip REAL DEFAULT 0, start_date TEXT, maturity_date TEXT, notes TEXT, created_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS cash_investment_txs (
          id TEXT PRIMARY KEY, investment_id TEXT NOT NULL, type TEXT NOT NULL, amount REAL NOT NULL,
          date TEXT NOT NULL, notes TEXT, created_at TEXT,
          FOREIGN KEY (investment_id) REFERENCES cash_investments(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS cash_wealth_goals (
          id TEXT PRIMARY KEY, name TEXT NOT NULL, target_amount REAL NOT NULL, member_id TEXT,
          deadline TEXT, category TEXT, is_completed INTEGER DEFAULT 0, created_at TEXT
      );`
    ];
    for (const stmt of investCreates) { db.run(stmt); }

    // 2. Provision Performance Indexes
    const indexes = [
      "CREATE INDEX IF NOT EXISTS idx_cash_tx_date ON cash_transactions(date);",
      "CREATE INDEX IF NOT EXISTS idx_cash_tx_member ON cash_transactions(member_id);",
      "CREATE INDEX IF NOT EXISTS idx_sewak_attendance_date ON sewak_attendance(date);",
      "CREATE INDEX IF NOT EXISTS idx_sewak_payout_sewak ON sewak_payments(sewak_id);",
      "CREATE INDEX IF NOT EXISTS idx_suvidha_logs_date ON suvidha_logs(date);",
      "CREATE INDEX IF NOT EXISTS idx_suvidha_logs_vendor ON suvidha_logs(vendor_id);",
      "CREATE INDEX IF NOT EXISTS idx_vidya_sessions_learner ON vidya_sessions(learner_id);",
      "CREATE INDEX IF NOT EXISTS idx_health_readings_member ON health_readings(member_id);",
      "CREATE INDEX IF NOT EXISTS idx_health_readings_date ON health_readings(date);"
    ];
    for (const stmt of indexes) { db.run(stmt); }

    // 3. Backfill Memory Policy (is_active)
    const alters = [
      "ALTER TABLE family_members ADD COLUMN is_active INTEGER DEFAULT 1;",
      "ALTER TABLE suvidha_vendors ADD COLUMN is_active INTEGER DEFAULT 1;",
      "ALTER TABLE vidya_learners ADD COLUMN is_active INTEGER DEFAULT 1;"
    ];
    for (const stmt of alters) {
      try { db.run(stmt); } catch (e) { /* ignore if already exists */ }
    }
  },
  5: (db) => {
    // Critical Fix: Provision is_active for Sewak Hub (Missed in v4)
    const alters = [
      "ALTER TABLE sewak_members ADD COLUMN is_active INTEGER DEFAULT 1;"
    ];
    for (const stmt of alters) {
      try { db.run(stmt); } catch (e) { /* ignore if already exists */ }
    }
  },
  6: (db) => {
    // 1. Vahan Hub Provisioning
    const vahanTables = [
      `CREATE TABLE IF NOT EXISTS vahan_vehicles (
        id TEXT PRIMARY KEY, name TEXT NOT NULL, vehicle_number TEXT, owner_id TEXT,
        vehicle_type TEXT DEFAULT 'Car', fuel_type TEXT, insurance_expiry TEXT,
        puc_expiry TEXT, fitness_expiry TEXT, insurance_policy_no TEXT, notes TEXT, created_at TEXT,
        FOREIGN KEY (owner_id) REFERENCES family_members(id) ON DELETE SET NULL
      );`,
      `CREATE TABLE IF NOT EXISTS vahan_logs (
        id TEXT PRIMARY KEY, vehicle_id TEXT NOT NULL, log_type TEXT NOT NULL,
        date TEXT NOT NULL, amount REAL DEFAULT 0, odometer INTEGER, notes TEXT, created_at TEXT,
        FOREIGN KEY (vehicle_id) REFERENCES vahan_vehicles(id) ON DELETE CASCADE
      );`,
      "CREATE INDEX IF NOT EXISTS idx_vahan_logs_vehicle ON vahan_logs(vehicle_id);",
      "CREATE INDEX IF NOT EXISTS idx_vahan_logs_date ON vahan_logs(date);"
    ];
    for (const stmt of vahanTables) { db.run(stmt); }

    // 2. Sanskriti Hub Provisioning
    const sanskritiTables = [
      `CREATE TABLE IF NOT EXISTS sanskriti_dharma_profile (
        id TEXT PRIMARY KEY, gotra TEXT, pravar TEXT, kuldevta TEXT, kuldevi TEXT,
        kulguru TEXT, shaakha TEXT, veda TEXT, upadevyas TEXT, is_locked INTEGER DEFAULT 0, updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS sanskriti_village_roots (
        id TEXT PRIMARY KEY, village_name TEXT NOT NULL, district TEXT, state TEXT,
        gramdevi_name TEXT, gramdevi_rituals TEXT, sthan_address TEXT, notes TEXT, updated_at TEXT
      );`,
      `CREATE TABLE IF NOT EXISTS sanskriti_ritual_logs (
        id TEXT PRIMARY KEY, date TEXT NOT NULL, type TEXT NOT NULL, name TEXT NOT NULL,
        performer_id TEXT, sankalpa_text TEXT, notes TEXT, created_at TEXT,
        FOREIGN KEY (performer_id) REFERENCES family_members(id) ON DELETE SET NULL
      );`
    ];
    for (const stmt of sanskritiTables) { db.run(stmt); }

    // 3. Expansion Gaps (Missed registries)
    const expansionTables = [
      `CREATE TABLE IF NOT EXISTS utsav_gift_registry (
        id TEXT PRIMARY KEY, event_id TEXT NOT NULL, item_name TEXT NOT NULL,
        description TEXT, estimated_price REAL, status TEXT DEFAULT 'baaki', source_url TEXT,
        FOREIGN KEY (event_id) REFERENCES utsav_events(id) ON DELETE CASCADE
      );`,
      `CREATE TABLE IF NOT EXISTS health_prescriptions (
        id TEXT PRIMARY KEY, member_id TEXT NOT NULL, doctor_name TEXT, 
        generic_name TEXT NOT NULL, brand_name TEXT, medicine_type TEXT NOT NULL,
        dosage TEXT, schedule_code TEXT NOT NULL, meal_instruction TEXT, purpose TEXT,
        start_date TEXT NOT NULL, end_date TEXT, stock_remaining INTEGER DEFAULT 0, 
        notes TEXT, created_at TEXT,
        FOREIGN KEY (member_id) REFERENCES family_members(id) ON DELETE CASCADE
      );`
    ];
    for (const stmt of expansionTables) { db.run(stmt); }
  },
  7: (db) => {
    // Structural Integrity: Run current SCHEMA_SQL to ensure any missing tables exist.
    db.run(SCHEMA_SQL);
  },
  9: (db) => {
    // 1. Force Repair: Investment Hub (Ensures created_at exists for sorting)
    const investAlters = [
      "ALTER TABLE cash_investments ADD COLUMN created_at TEXT;",
      "ALTER TABLE cash_wealth_goals ADD COLUMN created_at TEXT;"
    ];
    for (const stmt of investAlters) {
      try { db.run(stmt); } catch (e) { /* ignore if already exists */ }
    }

    // 2. Force Repair: Suvidha Hub (Ensures audit consistency)
    const suvidhaAlters = [
      "ALTER TABLE suvidha_logs ADD COLUMN unit TEXT DEFAULT 'unit';",
      "ALTER TABLE suvidha_payments ADD COLUMN payment_mode TEXT DEFAULT 'CASH';",
      "ALTER TABLE suvidha_payments ADD COLUMN member_id TEXT;",
      "ALTER TABLE suvidha_payments ADD COLUMN paid_on TEXT;"
    ];
    for (const stmt of suvidhaAlters) {
      try { db.run(stmt); } catch (e) { /* ignore if already exists */ }
    }

    // 3. Final Synchronization
    db.run(SCHEMA_SQL);
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
