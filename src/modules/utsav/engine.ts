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
import { mutateVault } from '@/lib/vault';
import { runQuery } from '@/lib/db';
import { useCallback, useState, useMemo } from 'react';
import { 
  UtsavInventoryItem, 
  UtsavVendor, 
  UtsavActivityLog,
  UtsavFamilyLedger,
  UtsavGuest
} from '@/types/db';

export function useUtsavEngine(eventId?: string) {
  const { db } = useAppStore();
  const [tick, setLocalTick] = useState(0);
  
  const refresh = useCallback(() => {
    setLocalTick(t => t + 1);
  }, []);

  // 1. Data Fetchers
  const inventory = useMemo<UtsavInventoryItem[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<UtsavInventoryItem>(db, 
      "SELECT * FROM utsav_inventory WHERE event_id = ? ORDER BY created_at DESC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const vendors = useMemo<UtsavVendor[]>(() => {
    if (!db) return [];
    return runQuery<UtsavVendor>(db, "SELECT * FROM utsav_vendors ORDER BY name ASC");
  }, [db, tick]);

  const activityLogs = useMemo<UtsavActivityLog[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<UtsavActivityLog>(db, 
      "SELECT * FROM utsav_activity_log WHERE event_id = ? ORDER BY timestamp DESC LIMIT 50", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const missionLedger = useMemo<UtsavFamilyLedger[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<UtsavFamilyLedger>(db, 
      "SELECT * FROM utsav_ledger WHERE event_id = ? OR event_id IS NULL ORDER BY updated_at DESC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const guests = useMemo<UtsavGuest[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<UtsavGuest>(db, 
      "SELECT * FROM utsav_guests WHERE event_id = ? ORDER BY guest_name ASC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  // 2. Log Activity Helper (Private-style)
  const logActivity = useCallback(async (log: Omit<UtsavActivityLog, 'id' | 'timestamp'>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const timestamp = new Date().toISOString();
    
    await mutateVault(
      db,
      `INSERT INTO utsav_activity_log (id, event_id, type, action, item_id, vendor_id, user_id, timestamp, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, log.event_id, log.type, log.action, log.item_id || null, log.vendor_id || null, log.user_id || null, timestamp, log.metadata || null]
    );
  }, [db]);

  // 3. Inventory Lifecycle Actions
  const addInventoryItem = useCallback(async (item: Omit<UtsavInventoryItem, 'id' | 'created_at' | 'status' | 'event_id'>) => {
    if (!db || !eventId) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const created_at = new Date().toISOString();
    
    await mutateVault(
      db,
      `INSERT INTO utsav_inventory (
        id, event_id, item_name, category, quantity_expected, quantity_received, quantity_used, 
        unit, status, vendor_id, assigned_to_id, backup_person_id, delivery_date_expected, 
        is_returnable, return_deadline, cost_estimated, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, eventId, item.item_name, item.category, item.quantity_expected, 0, 0, 
        item.unit || 'pcs', 'ORDERED', item.vendor_id || null, item.assigned_to_id || null, 
        item.backup_person_id || null, item.delivery_date_expected || null, 
        item.is_returnable ? 1 : 0, item.return_deadline || null, item.cost_estimated || 0, created_at
      ]
    );

    await logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'CREATED',
      item_id: id,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ item_name: item.item_name })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  const updateInventoryStatus = useCallback(async (id: string, newStatus: UtsavInventoryItem['status'], metadata?: any) => {
    if (!db || !eventId) return;
    
    await mutateVault(db, "UPDATE utsav_inventory SET status = ? WHERE id = ?", [newStatus, id]);

    await logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'UPDATED',
      item_id: id,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ new_status: newStatus, ...metadata })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  const ingestFulfillment = useCallback(async (id: string, qty: number, price: number) => {
    if (!db || !eventId) return;

    const items = runQuery<UtsavInventoryItem>(db, "SELECT * FROM utsav_inventory WHERE id = ?", [id]);
    const item = items[0];
    
    const actualDate = new Date();
    await mutateVault(
      db,
      `UPDATE utsav_inventory 
       SET quantity_received = ?, cost_actual = ?, status = 'RECEIVED', delivery_date_actual = ?
       WHERE id = ?`,
      [qty, price, actualDate.toISOString(), id]
    );

    if (item?.vendor_id && item.delivery_date_expected) {
      if (actualDate > new Date(item.delivery_date_expected)) {
        await mutateVault(db, "UPDATE utsav_vendors SET reliability_score = MAX(0, reliability_score - 5) WHERE id = ?", [item.vendor_id]);
      } else {
        await mutateVault(db, "UPDATE utsav_vendors SET reliability_score = MIN(100, reliability_score + 1) WHERE id = ?", [item.vendor_id]);
      }
    }

    await logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'RECEIVED',
      item_id: id,
      user_id: 'WORKER_BRIDGE',
      metadata: JSON.stringify({ qty_received: qty, cost_actual: price })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  // 4. Intelligence Aggregators
  const budgetStats = useMemo(() => {
    const forecasted = inventory.reduce((acc, item) => acc + (item.cost_estimated || 0), 0);
    const actual = inventory.reduce((acc, item) => acc + (item.cost_actual || 0), 0);
    return { forecasted, actual };
  }, [inventory]);

  // 5. Vendor Actions
  const addVendor = useCallback(async (vendor: Omit<UtsavVendor, 'id' | 'reliability_score' | 'rating' | 'advance_paid' | 'total_amount' | 'payment_status'>) => {
    if (!db) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    await mutateVault(
       db,
       "INSERT INTO utsav_vendors (id, name, contact, service_type, rating, reliability_score, advance_paid, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
       [id, vendor.name, vendor.contact || null, vendor.service_type || 'general', 0, 100, 0, 0, 'PENDING']
    );
    refresh();
  }, [db, refresh]);

  // 6. Ledger / Shagun Actions
  const addLedgerEntry = useCallback(async (entry: { family_name: string; amount: number; direction: 'diya' | 'mila'; notes?: string }) => {
    if (!db || !eventId) return;

    const families = runQuery<UtsavFamilyLedger>(db, "SELECT * FROM utsav_ledger WHERE family_name = ?", [entry.family_name]);
    const timestamp = new Date().toISOString();

    if (families.length > 0) {
      const f = families[0];
      const newDiya = entry.direction === 'diya' ? (f.diya || 0) + entry.amount : (f.diya || 0);
      const newMila = entry.direction === 'mila' ? (f.mila || 0) + entry.amount : (f.mila || 0);
      const newNet = newMila - newDiya;

      await mutateVault(
        db,
        "UPDATE utsav_ledger SET diya = ?, mila = ?, net = ?, event_id = ?, notes = ?, updated_at = ? WHERE family_name = ?",
        [newDiya, newMila, newNet, eventId, entry.notes || f.notes, timestamp, entry.family_name]
      );
    } else {
      const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
      const diya = entry.direction === 'diya' ? entry.amount : 0;
      const mila = entry.direction === 'mila' ? entry.amount : 0;
      await mutateVault(
        db,
        "INSERT INTO utsav_ledger (id, family_name, event_id, diya, mila, net, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, entry.family_name, eventId, diya, mila, mila - diya, entry.notes || null, timestamp]
      );
    }

    await logActivity({
      event_id: eventId,
      type: 'LEDGER',
      action: entry.direction.toUpperCase() as any,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ family: entry.family_name, amount: entry.amount })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  const suggestParampara = useCallback((familyName: string) => {
    if (!db) return 0;
    const families = runQuery<UtsavFamilyLedger>(db, "SELECT * FROM utsav_ledger WHERE family_name = ?", [familyName]);
    if (families.length === 0) return 0;
    return (families[0].mila || 0) > 0 ? families[0].mila + 1 : 0;
  }, [db]);

  // 7. Guest / Atithi Actions
  const addGuest = useCallback(async (payload: Omit<UtsavGuest, 'id' | 'event_id'>) => {
    if (!db || !eventId) return;
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);

    await mutateVault(
      db,
      "INSERT INTO utsav_guests (id, event_id, guest_name, family_tag, guest_count, rsvp_status, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, eventId, payload.guest_name, payload.family_tag || null, payload.guest_count || 1, payload.rsvp_status || 'pending', payload.phone || null]
    );

    await logActivity({
      event_id: eventId,
      type: 'GUEST',
      action: 'ADDED',
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ guest_name: payload.guest_name, count: payload.guest_count })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  const updateGuestRSVP = useCallback(async (id: string, status: UtsavGuest['rsvp_status']) => {
    if (!db || !eventId) return;

    await mutateVault(db, "UPDATE utsav_guests SET rsvp_status = ? WHERE id = ?", [status, id]);

    await logActivity({
      event_id: eventId,
      type: 'GUEST',
      action: 'RSVP_UPDATED',
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ guest_id: id, status })
    });

    refresh();
  }, [db, eventId, logActivity, refresh]);

  return {
    inventory,
    vendors,
    activityLogs,
    budgetStats,
    missionLedger,
    guests,
    addInventoryItem,
    updateInventoryStatus,
    ingestFulfillment,
    addVendor,
    addLedgerEntry,
    suggestParampara,
    addGuest,
    updateGuestRSVP,
    findInventoryItem: (id: string) => inventory.find(i => i.id === id || (i as any).sku?.toUpperCase() === id.toUpperCase()),
    refresh
  };
}
