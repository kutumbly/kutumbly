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

"use client";

import { useAppStore } from '@/lib/store';
import { useCallback } from 'react';

// Column order for nevata_events:
// 0:id 1:title 2:event_type 3:direction 4:family_name 5:event_date 6:location 7:our_count 8:status 9:notes 10:created_at

function rowToEvent(v: any[]) {
  return {
    id:          v[0],
    title:       v[1],
    event_type:  v[2],
    direction:   v[3],
    family_name: v[4],
    event_date:  v[5],
    location:    v[6],
    our_count:   v[7],
    status:      v[8],
    notes:       v[9],
    created_at:  v[10],
  };
}

export function useNevata() {
  const { db } = useAppStore();

  const getEvents = useCallback((direction?: string) => {
    if (!db) return [];
    try {
      const query = direction
        ? "SELECT * FROM nevata_events WHERE direction = ? ORDER BY event_date DESC"
        : "SELECT * FROM nevata_events ORDER BY event_date DESC";
      const res = db.exec(query, direction ? [direction] : []);
      return res[0]?.values.map(rowToEvent) || [];
    } catch { return []; }
  }, [db]);

  const getUpcoming = useCallback(() => {
    if (!db) return [];
    try {
      const res = db.exec(
        "SELECT * FROM nevata_events WHERE event_date >= date('now') ORDER BY event_date ASC"
      );
      return res[0]?.values.map(rowToEvent) || [];
    } catch { return []; }
  }, [db]);

  const getLedger = useCallback(() => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM nevata_family_ledger ORDER BY ABS(net) DESC");
      return res[0]?.values.map(v => ({
        id:          v[0],
        family_name: v[1],
        event_id:    v[2],
        diya:        v[3],
        mila:        v[4],
        net:         v[5],
        notes:       v[6],
        updated_at:  v[7],
      })) || [];
    } catch { return []; }
  }, [db]);

  const getShagun = useCallback((eventId: string) => {
    if (!db) return [];
    try {
      const res = db.exec("SELECT * FROM nevata_shagun WHERE event_id = ?", [eventId]);
      return res[0]?.values.map(v => ({
        id:           v[0],
        event_id:     v[1],
        direction:    v[2],
        amount:       Number(v[3]),
        gift_desc:    v[4],
        given_by:     v[5],
        received_from: v[6],
        is_confirmed: v[7],
        created_at:   v[8],
      })) || [];
    } catch { return []; }
  }, [db]);

  const getGiftRegistry = useCallback((eventId?: string) => {
    if (!db) return [];
    try {
      const query = eventId
        ? "SELECT * FROM nevata_gift_registry WHERE event_id = ?"
        : "SELECT * FROM nevata_gift_registry";
      const res = db.exec(query, eventId ? [eventId] : []);
      return res[0]?.values.map(v => ({
        id:              v[0],
        event_id:        v[1],
        item_name:       v[2],
        description:     v[3],
        estimated_price: Number(v[4]),
        status:          v[5],
        source_url:      v[6],
      })) || [];
    } catch { return []; }
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
