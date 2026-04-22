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

import { Database } from "sql.js";
import { runQuery } from "@/lib/db";
import { mutateVault } from "@/lib/vault";
import { VahanVehicle, VahanLog } from "@/types/db";

export const vahanRepo = (db: Database) => {
  return {
    // Vehicles
    getVehicles: (): VahanVehicle[] => {
      return runQuery<VahanVehicle>(db, "SELECT * FROM vahan_vehicles ORDER BY created_at DESC");
    },

    saveVehicle: async (vehicle: VahanVehicle) => {
      await mutateVault(
        db,
        `INSERT OR REPLACE INTO vahan_vehicles 
        (id, name, vehicle_number, owner_id, vehicle_type, fuel_type, insurance_expiry, puc_expiry, fitness_expiry, insurance_policy_no, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehicle.id,
          vehicle.name,
          vehicle.vehicle_number,
          vehicle.owner_id,
          vehicle.vehicle_type,
          vehicle.fuel_type,
          vehicle.insurance_expiry,
          vehicle.puc_expiry,
          vehicle.fitness_expiry,
          vehicle.insurance_policy_no,
          vehicle.notes,
          vehicle.created_at,
        ]
      );
    },

    deleteVehicle: async (id: string) => {
      await mutateVault(db, "DELETE FROM vahan_vehicles WHERE id = ?", [id]);
    },

    // Logs
    getLogs: (vehicleId?: string): VahanLog[] => {
      let sql = "SELECT * FROM vahan_logs";
      const params: any[] = [];
      if (vehicleId) {
        sql += " WHERE vehicle_id = ?";
        params.push(vehicleId);
      }
      sql += " ORDER BY date DESC, created_at DESC";
      return runQuery<VahanLog>(db, sql, params);
    },

    saveLog: async (log: VahanLog) => {
      await mutateVault(
        db,
        `INSERT OR REPLACE INTO vahan_logs 
        (id, vehicle_id, log_type, date, amount, odometer, notes, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          log.id,
          log.vehicle_id,
          log.log_type,
          log.date,
          log.amount,
          log.odometer,
          log.notes,
          log.created_at,
        ]
      );
    },

    deleteLog: async (id: string) => {
      await mutateVault(db, "DELETE FROM vahan_logs WHERE id = ?", [id]);
    },
    
    getAlerts: () => {
      const today = new Date().toISOString().split('T')[0];
      const thirtyDaysLater = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const sql = `
        SELECT id, name, 'puc' as type, puc_expiry as expiry FROM vahan_vehicles WHERE puc_expiry <= ?
        UNION
        SELECT id, name, 'insurance' as type, insurance_expiry as expiry FROM vahan_vehicles WHERE insurance_expiry <= ?
        ORDER BY expiry ASC
      `;
      const res = runQuery<{id: string; name: string; type: string; expiry: string}>(db, sql, [thirtyDaysLater, thirtyDaysLater]);
      return res.map(row => ({
        vehicleId: row.id,
        name: row.name,
        type: row.type,
        expiry: row.expiry,
        isCritical: row.expiry <= today
      }));
    }
  };
};
