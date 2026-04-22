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

import { HealthReading } from "@/types/db";

export type WellnessStatus = 'OPTIMAL' | 'VIGILANT' | 'ACTION_REQUIRED' | 'ZERO_DATA';

export interface WellnessResult {
  score: number;
  status: WellnessStatus;
  label: string;
  color: string;
  alerts: string[];
}

/**
 * SOVEREIGN WELLNESS ENGINE (v1)
 * Calculates family-wide wellness pulse based on local-first data.
 */
export const WellnessEngine = {
  
  calculate(readings: HealthReading[]): WellnessResult {
    if (!readings || readings.length === 0) {
       return { score: 0, status: 'ZERO_DATA', label: 'No Data', color: 'text-text-tertiary', alerts: [] };
    }

    let score = 100;
    const alerts: string[] = [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter recent readings
    const recentReadings = readings.filter(r => new Date(r.date) >= thirtyDaysAgo);
    
    if (recentReadings.length === 0) {
      return { score: 50, status: 'VIGILANT', label: 'Outdated', color: 'text-amber-500', alerts: ['No logs in 30 days'] };
    }

    // 1. Vital Signs Stability (Deductive Logic)
    recentReadings.forEach(r => {
      // BP Checks
      if (r.bp_systolic) {
        if (r.bp_systolic > 160) { score -= 15; alerts.push(`Critical BP (${r.bp_systolic})`); }
        else if (r.bp_systolic > 140) { score -= 5; }
        else if (r.bp_systolic < 90) { score -= 10; alerts.push(`Low BP (${r.bp_systolic})`); }
      }
      
      // Sugar Checks
      if (r.blood_sugar) {
        if (r.blood_sugar > 200) { score -= 20; alerts.push(`Hyperglycemia Alert`); }
        else if (r.blood_sugar > 140) { score -= 8; }
        else if (r.blood_sugar < 70) { score -= 15; alerts.push(`Hypoglycemia Alert`); }
      }
    });

    // 2. Consistency Bonus
    const uniqueDays = new Set(recentReadings.map(r => r.date)).size;
    if (uniqueDays >= 4) score += 5; // Good logging habit
    if (uniqueDays >= 10) score += 10; // Excellent logging habit

    // Clamp score
    score = Math.min(100, Math.max(0, score));

    // Determine Status
    let status: WellnessStatus = 'OPTIMAL';
    let label = 'Optimal';
    let color = 'text-emerald-500';

    if (score < 40 || alerts.length > 2) {
      status = 'ACTION_REQUIRED';
      label = 'Action Required';
      color = 'text-red-500';
    } else if (score < 80) {
      status = 'VIGILANT';
      label = 'Vigilant';
      color = 'text-amber-500';
    }

    return { score, status, label, color, alerts: Array.from(new Set(alerts)) };
  },

  /**
   * Generates a 14-day trend array for Sparklines
   */
  getTrend(readings: HealthReading[]): number[] {
    if (!readings || readings.length === 0) return [0, 0, 0, 0, 0];
    
    const trend: number[] = [];
    const now = new Date();
    
    // Group readings by day for last 7 slots
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const dayReadings = readings.filter(r => r.date === d);
      
      if (dayReadings.length === 0) {
        trend.push(trend.length > 0 ? trend[trend.length - 1] : 50); // Carry over or default
      } else {
        const dayScore = this.calculate(dayReadings).score;
        trend.push(dayScore);
      }
    }
    
    return trend;
  }
};
