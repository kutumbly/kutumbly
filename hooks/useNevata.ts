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

import { NevataEvent, ShagunRecord, GroceryItem, NevataLedgerEntry } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useAppStore } from '@/lib/store';
import { useCallback } from 'react';

export function useNevata() {
  const { db } = useAppStore();

  const getEvents = useCallback((direction?: string): NevataEvent[] => {
    const query = direction
      ? "SELECT * FROM nevata_events WHERE direction = ? ORDER BY event_date DESC"
      : "SELECT * FROM nevata_events ORDER BY event_date DESC";
    return runQuery<NevataEvent>(db, query, direction ? [direction] : []);
  }, [db]);

  const getUpcoming = useCallback((limit = 5): NevataEvent[] => {
    return runQuery<NevataEvent>(db, `
      SELECT * FROM nevata_events 
      WHERE event_date >= date('now') 
      ORDER BY event_date ASC 
      LIMIT ?
    `, [limit]);
  }, [db]);

  const getLedger = useCallback((): NevataLedgerEntry[] => {
    return runQuery<NevataLedgerEntry>(db, "SELECT * FROM nevata_family_ledger ORDER BY ABS(net) DESC");
  }, [db]);

  const getShagun = useCallback((eventId: string): ShagunRecord[] => {
    return runQuery<ShagunRecord>(db, "SELECT * FROM nevata_shagun WHERE event_id = ?", [eventId]);
  }, [db]);

  const getGiftRegistry = useCallback((eventId?: string): GroceryItem[] => {
    const query = eventId
      ? "SELECT * FROM nevata_gift_registry WHERE event_id = ?"
      : "SELECT * FROM nevata_gift_registry";
    return runQuery<any>(db, query, eventId ? [eventId] : []);
  }, [db]);

  /** Suggest shagun = last amount they gave us × 1.15, rounded to nearest ₹100 */
  const suggestShagun = useCallback((familyName: string): number => {
    if (!db) return 5100;
    try {
      const res = db.exec(
        "SELECT mila FROM nevata_family_ledger WHERE family_name = ? ORDER BY updated_at DESC LIMIT 1",
        [familyName]
      );
      if (!res[0]?.values[0]) return 5100;
      const lastMila = Number(res[0].values[0][0]);
      return Math.ceil((lastMila * 1.15) / 100) * 100;
    } catch { return 5100; }
  }, [db]);

  return {
    getEvents,
    getUpcoming,
    getLedger,
    getShagun,
    getGiftRegistry,
    suggestShagun,
  };
}
