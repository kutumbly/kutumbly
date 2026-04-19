/* ============================================================
 * कुटुंबली — KUTUMBLY SOVEREIGN OS
 * Zero Cloud · Local First · Encrypted · Offline Forever
 * ============================================================
 * System Architect   :  Jawahar R. M.
 * Organisation:  AITDL Network — Sovereign Division
 * Project     :  Kutumbly — India's Family OS
 *
 * "Memory, Not Code."
 * ============================================================ */

"use client";

import { useMemo, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { saveVault } from '@/lib/vault';
import { sewakRepo } from './sewak.repo';
import { SewakMember } from '@/types/db';

/**
 * SEWAK HUB (Staff & Domestic Management)
 * Sealed module for managing helpers, drivers, and household staff.
 */
export function useSewak() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const staff = useMemo(() => sewakRepo.getMembers(db), [db, tick]);
  const payments = useMemo(() => sewakRepo.getPayments(db), [db, tick]);
  const attendance = useMemo(() => sewakRepo.getAttendance(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addStaff = useCallback((name: string, role: string, monthly_salary: number, phone: string) => {
    const id = sewakRepo.createMember(db, { name, role, monthly_salary, phone });
    commit();
  }, [db, commit]);

  const removeStaff = useCallback((id: string) => {
    sewakRepo.deleteMember(db, id);
    commit();
  }, [db, commit]);

  const grantAdvance = useCallback((sewak_id: string, amount: number) => {
    sewakRepo.updateAdvance(db, sewak_id, amount);
    commit();
  }, [db, commit]);

  const markAttendance = useCallback((sewak_id: string, date: string, status: string) => {
    sewakRepo.recordAttendance(db, sewak_id, date, status);
    commit();
  }, [db, commit]);

  const paySalary = useCallback((sewak_id: string, month: string, gross: number, net: number, advance: number) => {
    sewakRepo.recordPayment(db, {
        sewak_id,
        month,
        gross,
        deductions: gross - net,
        net,
        advance
    });
    commit();
  }, [db, commit]);

  const calculatePayout = useCallback((sewak_id: string, month: string) => {
    const member = staff.find(s => s.id === sewak_id);
    if (!member) return { gross: 0, deductions: 0, net: 0, advanceRecovered: 0 };
    
    const absentDays = attendance.filter(a => a.sewak_id === sewak_id && a.date.startsWith(month) && a.status === 'absent_unpaid').length;
    
    // Core math logic
    const perDayWage = (member.monthly_salary) / 30;
    const leaveDeductions = absentDays * perDayWage;
    const advanceToRecover = member.advance_balance || 0;
    
    let net = member.monthly_salary - leaveDeductions - advanceToRecover;
    if (net < 0) net = 0;

    return { 
      gross: member.monthly_salary, 
      deductions: leaveDeductions, 
      advanceRecovered: advanceToRecover, 
      net 
    };
  }, [staff, attendance]);

  return {
    staff,
    payments,
    attendance,
    addStaff,
    removeStaff,
    grantAdvance,
    markAttendance,
    paySalary,
    calculatePayout
  };
}
