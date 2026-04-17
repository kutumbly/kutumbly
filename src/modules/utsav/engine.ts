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

import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { runQuery } from '@/lib/db';
import { useCallback, useState, useMemo } from 'react';
import { 
  NevataInventoryItem, 
  NevataVendor, 
  NevataActivityLog,
  NevataFamilyLedger,
  NevataGuest
} from '@/types/db';

export function useNevataEngine(eventId?: string) {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  // 1. Data Fetchers
  const inventory = useMemo<NevataInventoryItem[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<NevataInventoryItem>(db, 
      "SELECT * FROM nevata_inventory WHERE event_id = ? ORDER BY created_at DESC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const vendors = useMemo<NevataVendor[]>(() => {
    if (!db) return [];
    return runQuery<NevataVendor>(db, "SELECT * FROM nevata_vendors ORDER BY name ASC");
  }, [db, tick]);

  const activityLogs = useMemo<NevataActivityLog[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<NevataActivityLog>(db, 
      "SELECT * FROM nevata_activity_log WHERE event_id = ? ORDER BY timestamp DESC LIMIT 50", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const missionLedger = useMemo<NevataFamilyLedger[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<NevataFamilyLedger>(db, 
      "SELECT * FROM nevata_family_ledger WHERE event_id = ? OR event_id IS NULL ORDER BY updated_at DESC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  const guests = useMemo<NevataGuest[]>(() => {
    if (!db || !eventId) return [];
    return runQuery<NevataGuest>(db, 
      "SELECT * FROM nevata_guest_list WHERE event_id = ? ORDER BY guest_name ASC", 
      [eventId]
    );
  }, [db, eventId, tick]);

  // 2. Log Activity Helper (Private-style)
  const logActivity = useCallback((log: Omit<NevataActivityLog, 'id' | 'timestamp'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    db.run(
      `INSERT INTO nevata_activity_log (id, event_id, type, action, item_id, vendor_id, user_id, timestamp, metadata)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, log.event_id, log.type, log.action, log.item_id || null, log.vendor_id || null, log.user_id || null, timestamp, log.metadata || null]
    );
  }, [db]);

  // 3. Inventory Lifecycle Actions
  const addInventoryItem = useCallback((item: Omit<NevataInventoryItem, 'id' | 'created_at' | 'status' | 'event_id'>) => {
    if (!db || !eventId) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    
    db.run(
      `INSERT INTO nevata_inventory (
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

    logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'CREATED',
      item_id: id,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ item_name: item.item_name })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

  const updateInventoryStatus = useCallback((id: string, newStatus: NevataInventoryItem['status'], metadata?: any) => {
    if (!db || !eventId) return;
    
    db.run("UPDATE nevata_inventory SET status = ? WHERE id = ?", [newStatus, id]);

    logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'UPDATED',
      item_id: id,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ new_status: newStatus, ...metadata })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

  const ingestFulfillment = useCallback((id: string, qty: number, price: number) => {
    if (!db || !eventId) return;

    // Reliability Check: If actual date is greater than expected, it's late.
    // We'll perform this before the update to compare.
    const items = runQuery<NevataInventoryItem>(db, "SELECT * FROM nevata_inventory WHERE id = ?", [id]);
    const item = items[0];
    
    const actualDate = new Date();
    db.run(
      `UPDATE nevata_inventory 
       SET quantity_received = ?, cost_actual = ?, status = 'RECEIVED', delivery_date_actual = ?
       WHERE id = ?`,
      [qty, price, actualDate.toISOString(), id]
    );

    // If item has a vendor and was late, decrease score
    if (item?.vendor_id && item.delivery_date_expected) {
      if (actualDate > new Date(item.delivery_date_expected)) {
        db.run("UPDATE nevata_vendors SET reliability_score = MAX(0, reliability_score - 5) WHERE id = ?", [item.vendor_id]);
      } else {
        db.run("UPDATE nevata_vendors SET reliability_score = MIN(100, reliability_score + 1) WHERE id = ?", [item.vendor_id]);
      }
    }

    logActivity({
      event_id: eventId,
      type: 'ITEM',
      action: 'RECEIVED',
      item_id: id,
      user_id: 'WORKER_BRIDGE',
      metadata: JSON.stringify({ qty_received: qty, cost_actual: price })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

  // 4. Intelligence Aggregators
  const budgetStats = useMemo(() => {
    const forecasted = inventory.reduce((acc, item) => acc + (item.cost_estimated || 0), 0);
    const actual = inventory.reduce((acc, item) => acc + (item.cost_actual || 0), 0);
    return { forecasted, actual };
  }, [inventory]);

  // 5. Vendor Actions
  const addVendor = useCallback((vendor: Omit<NevataVendor, 'id' | 'reliability_score' | 'rating' | 'advance_paid' | 'total_amount' | 'payment_status'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    db.run(
       "INSERT INTO nevata_vendors (id, name, contact, service_type, rating, reliability_score, advance_paid, total_amount, payment_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
       [id, vendor.name, vendor.contact || null, vendor.service_type || 'general', 0, 100, 0, 0, 'PENDING']
    );
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, fileHandle, currentPin]);

  // 6. Ledger / Shagun Actions
  const addLedgerEntry = useCallback((entry: { family_name: string; amount: number; direction: 'diya' | 'mila'; notes?: string }) => {
    if (!db || !eventId) return;

    const families = runQuery<NevataFamilyLedger>(db, "SELECT * FROM nevata_family_ledger WHERE family_name = ?", [entry.family_name]);
    const timestamp = new Date().toISOString();

    if (families.length > 0) {
      const f = families[0];
      const newDiya = entry.direction === 'diya' ? (f.diya || 0) + entry.amount : (f.diya || 0);
      const newMila = entry.direction === 'mila' ? (f.mila || 0) + entry.amount : (f.mila || 0);
      const newNet = newMila - newDiya;

      db.run(
        "UPDATE nevata_family_ledger SET diya = ?, mila = ?, net = ?, event_id = ?, notes = ?, updated_at = ? WHERE family_name = ?",
        [newDiya, newMila, newNet, eventId, entry.notes || f.notes, timestamp, entry.family_name]
      );
    } else {
      const id = crypto.randomUUID();
      const diya = entry.direction === 'diya' ? entry.amount : 0;
      const mila = entry.direction === 'mila' ? entry.amount : 0;
      db.run(
        "INSERT INTO nevata_family_ledger (id, family_name, event_id, diya, mila, net, notes, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [id, entry.family_name, eventId, diya, mila, mila - diya, entry.notes || null, timestamp]
      );
    }

    logActivity({
      event_id: eventId,
      type: 'LEDGER',
      action: entry.direction.toUpperCase() as any,
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ family: entry.family_name, amount: entry.amount })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

  const suggestParampara = useCallback((familyName: string) => {
    if (!db) return 0;
    const families = runQuery<NevataFamilyLedger>(db, "SELECT * FROM nevata_family_ledger WHERE family_name = ?", [familyName]);
    if (families.length === 0) return 0;
    // Simple intelligence: suggest their last Mila + 1
    return (families[0].mila || 0) > 0 ? families[0].mila + 1 : 0;
  }, [db]);

  // 7. Guest / Atithi Actions
  const addGuest = useCallback((payload: Omit<NevataGuest, 'id' | 'event_id'>) => {
    if (!db || !eventId) return;
    const id = crypto.randomUUID();

    db.run(
      "INSERT INTO nevata_guest_list (id, event_id, guest_name, family_tag, guest_count, rsvp_status, phone) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, eventId, payload.guest_name, payload.family_tag || null, payload.guest_count || 1, payload.rsvp_status || 'pending', payload.phone || null]
    );

    logActivity({
      event_id: eventId,
      type: 'GUEST',
      action: 'ADDED',
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ guest_name: payload.guest_name, count: payload.guest_count })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

  const updateGuestRSVP = useCallback((id: string, status: NevataGuest['rsvp_status']) => {
    if (!db || !eventId) return;

    db.run("UPDATE nevata_guest_list SET rsvp_status = ? WHERE id = ?", [status, id]);

    logActivity({
      event_id: eventId,
      type: 'GUEST',
      action: 'RSVP_UPDATED',
      user_id: 'SYSTEM',
      metadata: JSON.stringify({ guest_id: id, status })
    });

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, eventId, fileHandle, currentPin, logActivity]);

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
    refresh: () => setTick(t => t + 1)
  };
}
