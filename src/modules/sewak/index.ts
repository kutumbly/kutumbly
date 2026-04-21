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
import { sewakRepo } from './sewak.repo';
import { SewakMember } from '@/types/db';

/**
 * SEWAK HUB (Staff & Domestic Management)
 * Sealed module for managing helpers, drivers, and household staff.
 */
export function useSewak() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  const staff = useMemo(() => sewakRepo.getMembers(db, true), [db, tick]);
  const allStaff = useMemo(() => sewakRepo.getMembers(db, false), [db, tick]);
  const payments = useMemo(() => sewakRepo.getPayments(db), [db, tick]);
  const attendance = useMemo(() => sewakRepo.getAttendance(db), [db, tick]);
  const advances = useMemo(() => sewakRepo.getAdvances(db), [db, tick]);
  const welfare = useMemo(() => sewakRepo.getWelfare(db), [db, tick]);
  const documents = useMemo(() => sewakRepo.getDocuments(db), [db, tick]);

  const commit = useCallback(() => {
    if (db && fileHandle && currentPin) {
      saveVault(db, currentPin, fileHandle).catch(console.error);
    }
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const addStaff = useCallback((name: string, role: string, monthly_salary: number, phone: string, emergency_contact?: string, shift_timing?: string) => {
    const id = sewakRepo.createMember(db, { name, role, monthly_salary, phone, emergency_contact, shift_timing });
    commit();
  }, [db, commit]);

  const removeStaff = useCallback((id: string) => {
    sewakRepo.archiveMember(db, id);
    commit();
  }, [db, commit]);
  
  const purgeStaff = useCallback((id: string) => {
    if (window.confirm("CRITICAL: This will permanently delete ALL history, payments, and attendance for this member. Proceed?")) {
      sewakRepo.deleteMember(db, id);
      commit();
    }
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
    
    // Core human-centric math logic
    const perDayWage = (member.monthly_salary) / 30;
    const leaveDeductions = Math.floor(absentDays * perDayWage);
    const netBeforeRecovery = member.monthly_salary - leaveDeductions;

    // Hardcore Debug: Prevent 100% recovery. Limit to 50% of month's net or actual balance.
    const RECOVERY_CEILING = netBeforeRecovery * 0.5;
    const advanceToRecover = Math.min(member.advance_balance || 0, RECOVERY_CEILING);

    let net = netBeforeRecovery - advanceToRecover;
    if (net < 0) net = 0;

    return { 
      gross: member.monthly_salary, 
      deductions: Math.floor(leaveDeductions), 
      advanceRecovered: Math.floor(advanceToRecover), 
      net: Math.floor(net)
    };
  }, [allStaff, attendance]);

  const issueWelfare = useCallback((sewak_id: string, type: string, amount: number, notes: string = '') => {
    const event_date = new Date().toISOString().split('T')[0];
    sewakRepo.createWelfare(db, { sewak_id, welfare_type: type, amount, event_date, notes });
    commit();
  }, [db, commit]);

  const addDocument = useCallback((sewak_id: string, doc_type: string, vault_ref: string | null = null, expiry_date: string | null = null) => {
    sewakRepo.createDocument(db, { sewak_id, doc_type, vault_ref, expiry_date, verification_status: 'PENDING' });
    
    // Hardening: Auto-verify if critical identity docs are provided
    if (doc_type === 'Police_Verification' || doc_type === 'Aadhaar') {
       sewakRepo.updateKYCStatus(db, sewak_id, 'VERIFIED');
    }
    
    commit();
  }, [db, commit]);

  return {
    staff,
    allStaff,
    payments,
    attendance,
    advances,
    welfare,
    documents,
    addStaff,
    removeStaff,
    grantAdvance,
    markAttendance,
    paySalary,
    issueWelfare,
    addDocument,
    calculatePayout,
    purgeStaff
  };
}
