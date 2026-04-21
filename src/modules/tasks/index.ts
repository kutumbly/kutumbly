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

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { tasksRepo } from './tasks.repo';
import { FamilyTask } from '@/types/db';

/**
 * TASKS HUB (Productivity & Delegation)
 * Sealed module for managing family tasks and assignments.
 */
export function useTasks() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const tasks = useMemo(() => tasksRepo.getTasks(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addTask = useCallback((task: Omit<FamilyTask, 'id' | 'created_at' | 'status'>) => {
    const id = tasksRepo.createTask(db, task);
    commit();
  }, [db, commit]);

  const toggleTask = useCallback((id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    tasksRepo.updateStatus(db, id, newStatus);
    commit();
  }, [db, commit]);

  const deleteTask = useCallback((id: string) => {
    tasksRepo.deleteTask(db, id);
    commit();
  }, [db, commit]);

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask
  };
}
