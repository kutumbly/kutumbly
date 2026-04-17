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
import { HealthReading, Medication, Vaccination, MedicalProfile, HealthAdvancedProfile, MedicalPrescription } from '@/types/db';
import { runQuery } from '@/lib/db';
import { useMemo, useCallback, useState } from 'react';

export function useHealth() {
  const { db, currentPin, fileHandle } = useAppStore();
  const [tick, setTick] = useState(0);

  // 1. Data Queries
  const readings = useMemo<HealthReading[]>(() => {
    return runQuery<HealthReading>(db, "SELECT * FROM health_readings ORDER BY date DESC, created_at DESC LIMIT 100");
  }, [db, tick]);

  const medications = useMemo<Medication[]>(() => {
    return runQuery<Medication>(db, "SELECT * FROM medications ORDER BY start_date DESC");
  }, [db, tick]);

  const vaccinations = useMemo<Vaccination[]>(() => {
    return runQuery<Vaccination>(db, "SELECT * FROM vaccinations ORDER BY date DESC");
  }, [db, tick]);

  const medicalProfiles = useMemo<MedicalProfile[]>(() => {
    return runQuery<MedicalProfile>(db, "SELECT * FROM medical_profiles");
  }, [db, tick]);

  const advancedProfiles = useMemo<HealthAdvancedProfile[]>(() => {
    return runQuery<HealthAdvancedProfile>(db, "SELECT * FROM health_advanced_profiles");
  }, [db, tick]);

  const prescriptions = useMemo<MedicalPrescription[]>(() => {
    return runQuery<MedicalPrescription>(db, "SELECT * FROM medical_prescriptions ORDER BY start_date DESC");
  }, [db, tick]);

  // 2. Health Readings Mutations
  const addReading = useCallback((member_id: string, bp_sys: number, bp_dia: number, sugar: number, pulse: number, weight: number, notes: string, date?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const activeDate = date || new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    
    db.run(
      "INSERT INTO health_readings (id, member_id, date, bp_systolic, bp_diastolic, blood_sugar, pulse, weight, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [id, member_id, activeDate, bp_sys, bp_dia, sugar, pulse, weight, notes, created_at]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const editReading = useCallback((id: string, bp_sys: number, bp_dia: number, sugar: number, pulse: number, weight: number, notes: string, date: string) => {
    if (!db) return;
    db.run(
      "UPDATE health_readings SET bp_systolic = ?, bp_diastolic = ?, blood_sugar = ?, pulse = ?, weight = ?, notes = ?, date = ? WHERE id = ?",
      [bp_sys, bp_dia, sugar, pulse, weight, notes, date, id]
    );
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteReading = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM health_readings WHERE id = ?", [id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // 3. Medication Mutations
  const addMedication = useCallback((member_id: string, name: string, dosage: string, frequency: string, startDate?: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const activeDate = startDate || new Date().toISOString().split('T')[0];
    
    db.run(
      "INSERT INTO medications (id, member_id, name, dosage, frequency, start_date) VALUES (?, ?, ?, ?, ?, ?)",
      [id, member_id, name, dosage, frequency, activeDate]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const editMedication = useCallback((id: string, name: string, dosage: string, frequency: string, startDate: string, endDate: string | null) => {
    if (!db) return;
    db.run(
      "UPDATE medications SET name = ?, dosage = ?, frequency = ?, start_date = ?, end_date = ? WHERE id = ?",
      [name, dosage, frequency, startDate, endDate, id]
    );
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const stopMedication = useCallback((id: string) => {
    if (!db) return;
    const end_date = new Date().toISOString().split('T')[0];
    db.run("UPDATE medications SET end_date = ? WHERE id = ?", [end_date, id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteMedication = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM medications WHERE id = ?", [id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // 3.5 Premium Prescription (Rx) Mutations
  const addPrescription = useCallback((
    member_id: string, doctor_name: string, generic_name: string, brand_name: string,
    medicine_type: string, dosage: string, schedule_code: string, meal_instruction: string, purpose: string
  ) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const start_date = new Date().toISOString().split('T')[0];
    const created_at = new Date().toISOString();
    
    db.run(
      `INSERT INTO medical_prescriptions (
        id, member_id, doctor_name, generic_name, brand_name, medicine_type, 
        dosage, schedule_code, meal_instruction, purpose, start_date, stock_remaining, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, member_id, doctor_name, generic_name, brand_name, medicine_type, dosage, schedule_code, meal_instruction, purpose, start_date, 0, created_at]
    );

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const stopPrescription = useCallback((id: string) => {
    if (!db) return;
    const end_date = new Date().toISOString().split('T')[0];
    db.run("UPDATE medical_prescriptions SET end_date = ? WHERE id = ?", [end_date, id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deletePrescription = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM medical_prescriptions WHERE id = ?", [id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);


  // 4. Vaccination Mutations
  const addVaccination = useCallback((member_id: string, name: string, date: string, provider: string, nextDue: string | null, notes: string) => {
    if (!db) return;
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    db.run(
      "INSERT INTO vaccinations (id, member_id, name, date, provider, next_due_date, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [id, member_id, name, date, provider, nextDue, notes, created_at]
    );
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  const deleteVaccination = useCallback((id: string) => {
    if (!db) return;
    db.run("DELETE FROM vaccinations WHERE id = ?", [id]);
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // 5. Medical Profile (SOS) Mutations
  const updateMedicalProfile = useCallback((
    member_id: string, 
    bloodGroup: string, 
    allergies: string, 
    chronic: string, 
    doctor: string, 
    emergencyContact: string, 
    insurance: string
  ) => {
    if (!db) return;
    const updated_at = new Date().toISOString();

    // Check if profile exists
    const existing = runQuery<MedicalProfile>(db, "SELECT * FROM medical_profiles WHERE member_id = ?", [member_id]);
    
    if (existing.length > 0) {
      db.run(
        `UPDATE medical_profiles SET 
          blood_group = ?, allergies = ?, chronic_conditions = ?, 
          primary_doctor = ?, emergency_contact = ?, insurance_details = ?, 
          updated_at = ? 
        WHERE member_id = ?`,
        [bloodGroup, allergies, chronic, doctor, emergencyContact, insurance, updated_at, member_id]
      );
    } else {
      const id = crypto.randomUUID();
      db.run(
        `INSERT INTO medical_profiles (
          id, member_id, blood_group, allergies, chronic_conditions, 
          primary_doctor, emergency_contact, insurance_details, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [id, member_id, bloodGroup, allergies, chronic, doctor, emergencyContact, insurance, updated_at]
      );
    }

    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  // 6. Advanced Profiles (Ayurvedic & Allopathic Refinements)
  const updateAdvancedProfile = useCallback((
    member_id: string,
    prakriti: string,
    agni: string,
    diet: string,
    surgical_history: string,
    family_history: string,
    current_treatment: string
  ) => {
    if (!db) return;
    const updated_at = new Date().toISOString();
    const existing = runQuery<HealthAdvancedProfile>(db, "SELECT * FROM health_advanced_profiles WHERE member_id = ?", [member_id]);
    
    if (existing.length > 0) {
      db.run(
        `UPDATE health_advanced_profiles SET 
          prakriti = ?, agni = ?, diet = ?, surgical_history = ?, family_history = ?, current_treatment = ?, updated_at = ?
         WHERE member_id = ?`,
        [prakriti, agni, diet, surgical_history, family_history, current_treatment, updated_at, member_id]
      );
    } else {
      db.run(
        `INSERT INTO health_advanced_profiles (
          member_id, prakriti, agni, diet, surgical_history, family_history, current_treatment, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [member_id, prakriti, agni, diet, surgical_history, family_history, current_treatment, updated_at]
      );
    }
    if (fileHandle && currentPin) saveVault(db, currentPin, fileHandle).catch(console.error);
    setTick(t => t + 1);
  }, [db, currentPin, fileHandle]);

  return { 
    readings, 
    medications, 
    vaccinations,
    medicalProfiles,
    advancedProfiles,
    prescriptions,
    addReading, 
    editReading,
    deleteReading,
    addMedication, 
    editMedication,
    stopMedication,
    deleteMedication,
    addPrescription,
    stopPrescription,
    deletePrescription,
    addVaccination,
    deleteVaccination,
    updateMedicalProfile,
    updateAdvancedProfile
  };
}
