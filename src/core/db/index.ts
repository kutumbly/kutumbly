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
 * SOVEREIGN DB CORE
 * ─────────────────────────────────────────────────────────────
 * All raw sql.js interaction is funneled through here.
 * UI components and module services NEVER call db.exec() directly.
 *
 * Dependency Chain (enforced by ESLint):
 *   UI → module.service → module.repo → db (this file)
 * ─────────────────────────────────────────────────────────────
 */

// Re-export the core db utilities — single source of truth
export { runQuery, mapRows } from '@/lib/db';

/**
 * Typed transaction wrapper.
 * Use this for any multi-step write operation to ensure atomicity.
 */
export function withTransaction(db: any, operations: (db: any) => void): void {
  if (!db) return;
  try {
    db.run('BEGIN TRANSACTION');
    operations(db);
    db.run('COMMIT');
  } catch (err) {
    db.run('ROLLBACK');
    console.error('[Sovereign DB] Transaction failed, rolled back:', err);
    throw err;
  }
}

/**
 * Safe single-row fetch. Returns null instead of throwing on empty.
 */
export function fetchOne<T>(db: any, query: string, params: any[] = []): T | null {
  if (!db) return null;
  try {
    const res = db.exec(query, params);
    if (!res?.[0]?.values?.[0]) return null;
    const columns = res[0].columns;
    const row = res[0].values[0];
    const obj: any = {};
    columns.forEach((col: string, i: number) => { obj[col] = row[i]; });
    return obj as T;
  } catch (err) {
    console.error('[Sovereign DB] fetchOne failed:', query, err);
    return null;
  }
}
