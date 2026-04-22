/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. Mallah
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

import { Database } from 'sql.js';
import { runQuery } from '@/lib/db';
import { mutateVault } from '@/lib/vault';
import { UtsavEvent, UtsavShagun, UtsavLedgerEntry } from '@/types/db';

/**
 * UTSAV HUB REPOSITORY
 * Pure SQL operations for Events and Shagun (Nevata) management.
 */

export const utsavRepo = {
  getStats: (db: Database | null) => {
    if (!db) return { totalDiya: 0, totalMila: 0 };
    const diyaRes = runQuery<{val: number}>(db, "SELECT SUM(amount) as val FROM utsav_shagun WHERE direction='diya'");
    const milaRes = runQuery<{val: number}>(db, "SELECT SUM(amount) as val FROM utsav_shagun WHERE direction='mila'");
    return {
      totalDiya: Number(diyaRes[0]?.val || 0),
      totalMila: Number(milaRes[0]?.val || 0)
    };
  },

  getEvents: (db: Database | null, direction?: string): UtsavEvent[] => {
    if (!db) return [];
    const query = direction
      ? "SELECT * FROM utsav_events WHERE direction = ? ORDER BY event_date DESC"
      : "SELECT * FROM utsav_events ORDER BY event_date DESC";
    return runQuery<UtsavEvent>(db, query, direction ? [direction] : []);
  },

  getUpcomingEvents: (db: Database | null, limit: number): UtsavEvent[] => {
    if (!db) return [];
    return runQuery<UtsavEvent>(db, `
      SELECT * FROM utsav_events 
      WHERE event_date >= date('now') 
      ORDER BY event_date ASC 
      LIMIT ?
    `, [limit]);
  },

  getFamilyLedger: (db: Database | null): UtsavLedgerEntry[] => {
    if (!db) return [];
    return runQuery<UtsavLedgerEntry>(db, "SELECT * FROM utsav_ledger ORDER BY ABS(net) DESC");
  },

  getShagunForEvent: (db: Database | null, eventId: string): UtsavShagun[] => {
    if (!db) return [];
    return runQuery<UtsavShagun>(db, "SELECT * FROM utsav_shagun WHERE event_id = ?", [eventId]);
  },

  createEvent: async (db: Database | null, event: UtsavEvent) => {
    if (!db) return;
    await mutateVault(
      db,
      "INSERT INTO utsav_events (id, title, event_type, direction, family_name, event_date, location, our_count, status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [event.id, event.title, event.event_type, event.direction, event.family_name, event.event_date, event.location || null, event.our_count || 1, event.status, event.notes || null, event.created_at]
    );
  },

  createShagun: async (db: Database | null, shagun: UtsavShagun, familyName?: string) => {
    if (!db) return;
    await mutateVault(
      db,
      "INSERT INTO utsav_shagun (id, event_id, direction, amount, gift_desc, given_by, received_from, is_confirmed, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [shagun.id, shagun.event_id, shagun.direction, shagun.amount, shagun.gift_desc || null, shagun.given_by || null, shagun.received_from || null, 1, shagun.created_at]
    );

    // Auto-update Family Ledger if familyName is provided
    if (familyName) {
      const dir = shagun.direction === 'diya' ? 'given' : 'received';
      await utsavRepo.updateFamilyLedger(db, familyName, shagun.amount, dir);
    }
  },

  updateFamilyLedger: async (db: Database | null, familyName: string, amount: number, direction: 'given' | 'received') => {
    if (!db) return;
    const updatedAt = new Date().toISOString();
    const ledger = runQuery<UtsavLedgerEntry>(db, "SELECT * FROM utsav_ledger WHERE family_name = ?", [familyName]);
    
    if (ledger.length > 0) {
      const newDiya = direction === 'given' ? (ledger[0].diya + amount) : ledger[0].diya;
      const newMila = direction === 'received' ? (ledger[0].mila + amount) : ledger[0].mila;
      await mutateVault(db, "UPDATE utsav_ledger SET diya = ?, mila = ?, net = ?, updated_at = ? WHERE id = ?", 
        [newDiya, newMila, (newMila - newDiya), updatedAt, ledger[0].id]);
    } else {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      const diya = direction === 'given' ? amount : 0;
      const mila = direction === 'received' ? amount : 0;
      await mutateVault(db, "INSERT INTO utsav_ledger (id, family_name, diya, mila, net, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [id, familyName, diya, mila, (mila - diya), updatedAt]);
    }
  },

  // --- INVENTORY & GIFTS ---
  getInventory: (db: Database | null, eventId: string) => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM utsav_inventory WHERE event_id = ?", [eventId]);
  },

  updateInventoryItem: async (db: Database | null, item: any) => {
    if (!db) return;
    await mutateVault(db, `
      UPDATE utsav_inventory SET 
        quantity_received = ?, status = ?, cost_actual = ? 
      WHERE id = ?`, 
      [item.quantity_received, item.status, item.cost_actual, item.id]
    );
  },

  getGiftRegistry: (db: Database | null, eventId: string) => {
    if (!db) return [];
    return runQuery(db, "SELECT * FROM utsav_gift_registry WHERE event_id = ?", [eventId]);
  },

  updateEventStatus: async (db: Database | null, id: string, status: string) => {
    if (!db) return;
    await mutateVault(db, "UPDATE utsav_events SET status = ? WHERE id = ?", [status, id]);
  },

  getHistoricalDebt: (db: Database | null, familyName: string): { diya: number; mila: number } | null => {
    if (!db) return null;
    const res = runQuery<UtsavLedgerEntry>(db, "SELECT diya, mila FROM utsav_ledger WHERE family_name = ? LIMIT 1", [familyName]);
    if (!res[0]) return null;
    return { diya: Number(res[0].diya), mila: Number(res[0].mila) };
  }
};
