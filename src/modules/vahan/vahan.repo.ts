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
import { VahanVehicle, VahanLog } from "@/types/db";

export const vahanRepo = (db: Database) => {
  return {
    // Vehicles
    getVehicles: (): VahanVehicle[] => {
      try {
        const res = db.exec("SELECT * FROM vahan_vehicles ORDER BY created_at DESC");
        if (res.length === 0) return [];
        return res[0].values.map((row) => ({
          id: row[0] as string,
          name: row[1] as string,
          vehicle_number: row[2] as string,
          owner_id: row[3] as string,
          vehicle_type: row[4] as string,
          fuel_type: row[5] as string,
          insurance_expiry: row[6] as string,
          puc_expiry: row[7] as string,
          fitness_expiry: row[8] as string,
          insurance_policy_no: row[9] as string,
          notes: row[10] as string,
          created_at: row[11] as string,
        }));
      } catch (e) {
        console.error("vahanRepo.getVehicles Error:", e);
        return [];
      }
    },

    saveVehicle: (vehicle: VahanVehicle) => {
      db.run(
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

    deleteVehicle: (id: string) => {
      db.run("DELETE FROM vahan_vehicles WHERE id = ?", [id]);
    },

    // Logs
    getLogs: (vehicleId?: string): VahanLog[] => {
      try {
        let sql = "SELECT * FROM vahan_logs";
        const params: any[] = [];
        if (vehicleId) {
          sql += " WHERE vehicle_id = ?";
          params.push(vehicleId);
        }
        sql += " ORDER BY date DESC, created_at DESC";
        const res = db.exec(sql, params);
        if (res.length === 0) return [];
        return res[0].values.map((row) => ({
          id: row[0] as string,
          vehicle_id: row[1] as string,
          log_type: row[2] as string,
          date: row[3] as string,
          amount: row[4] as number,
          odometer: row[5] as number,
          notes: row[6] as string,
          created_at: row[7] as string,
        }));
      } catch (e) {
        console.error("vahanRepo.getLogs Error:", e);
        return [];
      }
    },

    saveLog: (log: VahanLog) => {
      db.run(
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

    deleteLog: (id: string) => {
      db.run("DELETE FROM vahan_logs WHERE id = ?", [id]);
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
      try {
        const res = db.exec(sql, [thirtyDaysLater, thirtyDaysLater]);
        if (res.length === 0) return [];
        return res[0].values.map(row => ({
          vehicleId: row[0] as string,
          name: row[1] as string,
          type: row[2] as string,
          expiry: row[3] as string,
          isCritical: (row[3] as string) <= today
        }));
      } catch {
        return [];
      }
    }
  };
};
