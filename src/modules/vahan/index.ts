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

import { useState, useMemo, useCallback } from "react";
import { useAppStore } from "@/lib/store";
import { vahanRepo } from "./vahan.repo";
import { VahanVehicle, VahanLog } from "@/types/db";
import { saveVault } from "@/lib/vault";

export const useVahan = () => {
  const { db, fileHandle, currentPin } = useAppStore();
  const [tick, setTick] = useState(0);

  const repo = useMemo(() => (db ? vahanRepo(db) : null), [db]);

  const vehicles = useMemo(() => (repo ? repo.getVehicles() : []), [repo, tick]);
  const logs = useMemo(() => (repo ? repo.getLogs() : []), [repo, tick]);
  const alerts = useMemo(() => (repo ? repo.getAlerts() : []), [repo, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  const addVehicle = useCallback(
    (vehicle: Omit<VahanVehicle, "id" | "created_at">) => {
      if (!repo || !db) return;
      const newVehicle: VahanVehicle = {
        ...vehicle,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      repo.saveVehicle(newVehicle);
      if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle);
      reload();
    },
    [repo, db, fileHandle, currentPin, reload]
  );

  const updateVehicle = useCallback(
    (vehicle: VahanVehicle) => {
      if (!repo || !db) return;
      repo.saveVehicle(vehicle);
      if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle);
      reload();
    },
    [repo, db, fileHandle, currentPin, reload]
  );

  const removeVehicle = useCallback(
    (id: string) => {
      if (!repo || !db) return;
      repo.deleteVehicle(id);
      if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle);
      reload();
    },
    [repo, db, fileHandle, currentPin, reload]
  );

  const addLog = useCallback(
    (log: Omit<VahanLog, "id" | "created_at">) => {
      if (!repo || !db) return;
      const newLog: VahanLog = {
        ...log,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
      };
      repo.saveLog(newLog);
      if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle);
      reload();
    },
    [repo, db, fileHandle, currentPin, reload]
  );

  const removeLog = useCallback(
    (id: string) => {
      if (!repo || !db) return;
      repo.deleteLog(id);
      if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle);
      reload();
    },
    [repo, db, fileHandle, currentPin, reload]
  );

  return {
    vehicles,
    logs,
    alerts,
    addVehicle,
    updateVehicle,
    removeVehicle,
    addLog,
    removeLog,
    reload,
    totalVehicles: vehicles.length,
    criticalAlerts: alerts.filter(a => a.isCritical).length
  };
};
