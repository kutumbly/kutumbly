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
import { SamanItem } from '@/types/db';

/**
 * SAMAN HUB REPOSITORY
 * Pure SQL operations for Household Supply Chain (Grocery) management.
 */

export const samanRepo = {
  getItems: (db: Database | null): SamanItem[] => {
    if (!db) return [];
    return runQuery<SamanItem>(
      db,
      "SELECT * FROM saman_items ORDER BY (current_stock <= threshold) DESC, checked ASC, category ASC, name ASC"
    );
  },

  createItem: (db: Database | null, item: any) => {
    if (!db) return;
    
    // Ensure we have a list
    let listId: string;
    const existingList = db.exec("SELECT id FROM saman_lists LIMIT 1");
    if (existingList[0]?.values?.[0]?.[0]) {
      listId = existingList[0].values[0][0] as string;
    } else {
      listId = crypto.randomUUID();
      db.run("INSERT INTO saman_lists (id, name, created_at, status) VALUES (?, ?, ?, ?)", [listId, "Main List", new Date().toISOString(), "active"]);
    }

    const id = crypto.randomUUID();
    db.run(
      `INSERT INTO saman_items 
        (id, list_id, name, quantity, unit, estimated_price, checked, category, current_stock, threshold, expiry_date, last_purchased_date) 
       VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?)`,
      [
        id, 
        listId, 
        item.name.trim(), 
        item.quantity || '1', 
        item.unit || 'pcs', 
        item.estimated_price || 0, 
        item.category || 'General', 
        item.current_stock || 0, 
        item.threshold || 1, 
        item.expiry_date || null, 
        new Date().toISOString()
      ]
    );
    return id;
  },

  updateItem: (db: Database | null, id: string, updates: Partial<SamanItem>) => {
    if (!db) return;
    const setChunks: string[] = [];
    const values: any[] = [];
    
    for (const [key, val] of Object.entries(updates)) {
      if (val !== undefined && key !== 'id') {
        setChunks.push(`${key} = ?`);
        values.push(typeof val === 'boolean' ? (val ? 1 : 0) : val);
      }
    }
    
    if (setChunks.length === 0) return;
    values.push(id);
    const query = `UPDATE saman_items SET ${setChunks.join(', ')} WHERE id = ?`;
    db.run(query, values);
  },

  checkItem: (db: Database | null, id: string, checked: number) => {
    if (!db) return;
    if (checked === 1) {
      db.run("UPDATE saman_items SET checked = ?, last_purchased_date = ? WHERE id = ?", [checked, new Date().toISOString(), id]);
    } else {
      db.run("UPDATE saman_items SET checked = ? WHERE id = ?", [checked, id]);
    }
  },

  deleteItem: (db: Database | null, id: string) => {
    if (!db) return;
    db.run("DELETE FROM saman_items WHERE id = ?", [id]);
  },

  clearAllChecked: (db: Database | null) => {
    if (!db) return;
    db.run("DELETE FROM saman_items WHERE checked = 1");
  }
};
