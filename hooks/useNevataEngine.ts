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
import { saveVault } from '@/lib/vault';
import { runQuery } from '@/lib/db';
import { useCallback, useState, useMemo } from 'react';
import { 
  NevataInventoryItem, 
  NevataVendor, 
  NevataActivityLog 
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

  // 4. Vendor Actions
  const addVendor = useCallback((vendor: Omit<NevataVendor, 'id' | 'rating' | 'reliability_score'>) => {
    if (!db) return;
    const id = crypto.randomUUID();
    
    db.run(
      `INSERT INTO nevata_vendors (id, name, service_type, contact, rating, reliability_score, advance_paid, total_amount, payment_status, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, vendor.name, vendor.service_type, vendor.contact || null, 5.0, 100.0, vendor.advance_paid || 0, vendor.total_amount || 0, 'PENDING', vendor.notes || null]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
    return id;
  }, [db, fileHandle, currentPin]);

  return {
    inventory,
    vendors,
    activityLogs,
    addInventoryItem,
    updateInventoryStatus,
    addVendor,
    refresh: () => setTick(t => t + 1)
  };
}
