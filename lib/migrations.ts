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

export const CURRENT_SCHEMA_VERSION = 2;

/** What changed in each version — shown in the migration modal */
export const MIGRATION_CHANGELOGS: Record<number, string[]> = {
  1: [
    "Initial Unified Schema: All modules (Saman, Cash, Vidya, Suvidha, Health, Utsav) merged into the baseline v1 database.",
  ],
  2: [
    "Sovereign Nomenclature Update: Renamed legacy tables (nevata, staff) to standard sovereign terminology (utsav, sewak).",
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
