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
 * Maps sql.js result values to an array of objects based on column names
 */
export function mapRows<T>(res: any): T[] {
  if (!res || !res[0] || !res[0].columns || !res[0].values) return [];

  const columns = res[0].columns;
  const values = res[0].values;

  return values.map((row: any[]) => {
    const obj: any = {};
    columns.forEach((col: string, idx: number) => {
      obj[col] = row[idx];
    });
    return obj as T;
  });
}

/**
 * Standardized query runner for hooks
 */
export function runQuery<T>(db: any, query: string, params: any[] = []): T[] {
  if (!db) return [];
  try {
    const res = db.exec(query, params);
    return mapRows<T>(res);
  } catch (err) {
    console.error(`[DB Query Error]: ${query}`, err);
    return [];
  }
}
