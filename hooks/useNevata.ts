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
import { saveVault } from '@/lib/vault';
import { useCallback, useMemo, useState } from 'react';

export function useNevata() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const stats = useMemo(() => {
    if (!db) return { totalDiya: 0, totalMila: 0 };
    try {
      const diyaRes = runQuery<{val: number}>(db, "SELECT SUM(amount) as val FROM nevata_shagun WHERE direction='diya'");
      const milaRes = runQuery<{val: number}>(db, "SELECT SUM(amount) as val FROM nevata_shagun WHERE direction='mila'");
      return {
        totalDiya: Number(diyaRes[0]?.val || 0),
        totalMila: Number(milaRes[0]?.val || 0)
      };
    } catch {
      return { totalDiya: 0, totalMila: 0 };
    }
  }, [db, tick]);

  const getEvents = useCallback((direction?: string): NevataEvent[] => {
    const query = direction
      ? "SELECT * FROM nevata_events WHERE direction = ? ORDER BY event_date DESC"
      : "SELECT * FROM nevata_events ORDER BY event_date DESC";
    return runQuery<NevataEvent>(db, query, direction ? [direction] : []);
  }, [db, tick]);

  const getUpcoming = useCallback((limit = 5): NevataEvent[] => {
    return runQuery<NevataEvent>(db, `
      SELECT * FROM nevata_events 
      WHERE event_date >= date('now') 
      ORDER BY event_date ASC 
      LIMIT ?
    `, [limit]);
  }, [db, tick]);

  const getLedger = useCallback((): NevataLedgerEntry[] => {
    return runQuery<NevataLedgerEntry>(db, "SELECT * FROM nevata_family_ledger ORDER BY ABS(net) DESC");
  }, [db, tick]);

  const getShagun = useCallback((eventId: string): ShagunRecord[] => {
    return runQuery<ShagunRecord>(db, "SELECT * FROM nevata_shagun WHERE event_id = ?", [eventId]);
  }, [db, tick]);

  const addEvent = useCallback((event: Omit<NevataEvent, 'id' | 'created_at' | 'status'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      "INSERT INTO nevata_events (id, title, event_type, direction, family_name, event_date, location, our_count, status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, event.title, event.event_type, event.direction, event.family_name, event.event_date, event.location || null, event.our_count || 1, 'upcoming', event.notes || null, created_at]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addShagun = useCallback((shagun: Omit<ShagunRecord, 'id' | 'created_at' | 'is_confirmed'> & { family_name: string }) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();

    db.run(
      "INSERT INTO nevata_shagun (id, event_id, direction, amount, gift_desc, given_by, received_from, is_confirmed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, shagun.event_id, shagun.direction, shagun.amount, shagun.gift_desc || null, shagun.given_by || null, shagun.received_from || null, 1, created_at]
    );

    // Update Family Ledger
    const ledger = runQuery<NevataLedgerEntry>(db, "SELECT * FROM nevata_family_ledger WHERE family_name = ?", [shagun.family_name]);
    const amount = Number(shagun.amount);
    
    if (ledger.length > 0) {
      const newDiya = shagun.direction === 'given' ? (ledger[0].diya + amount) : ledger[0].diya;
      const newMila = shagun.direction === 'received' ? (ledger[0].mila + amount) : ledger[0].mila;
      db.run("UPDATE nevata_family_ledger SET diya = ?, mila = ?, net = ?, updated_at = ? WHERE id = ?", 
        [newDiya, newMila, (newMila - newDiya), created_at, ledger[0].id]);
    } else {
      const lid = crypto.randomUUID();
      const diya = shagun.direction === 'given' ? amount : 0;
      const mila = shagun.direction === 'received' ? amount : 0;
      db.run("INSERT INTO nevata_family_ledger (id, family_name, diya, mila, net, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [lid, shagun.family_name, diya, mila, (mila - diya), created_at]);
    }

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const updateEventStatus = useCallback((id: string, status: string) => {
    if (!db) return;
    db.run("UPDATE nevata_events SET status = ? WHERE id = ?", [status, id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const suggestShagun = useCallback((familyName: string): number => {
    if (!db) return 501;
    try {
      const res = db.exec(
        "SELECT mila FROM nevata_family_ledger WHERE family_name = ? ORDER BY updated_at DESC LIMIT 1",
        [familyName]
      );
      if (!res[0]?.values[0]) return 501;
      const lastMila = Number(res[0].values[0][0]);
      // Inflation 15% + Roundup to nearest 100 + add ₹1 for shagun
      const inflation = Math.ceil((lastMila * 1.15) / 100) * 100;
      return inflation + 1;
    } catch { return 501; }
  }, [db]);

  return {
    getEvents,
    getUpcoming,
    getLedger,
    getShagun,
    addEvent,
    addShagun,
    updateEventStatus,
    suggestShagun,
    ...stats
  };
}
