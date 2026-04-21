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

export type RitualType = 'DAILY' | 'SPECIAL' | 'TITHI' | 'SANKALPA';

export interface DharmaProfile {
  id: string;
  gotra: string | null;
  pravar: string | null;
  kuldevta: string | null;
  kuldevi: string | null;
  kulguru: string | null;
  shaakha: string | null;
  veda: string | null;
  upadevyas: string[]; // JSON array in DB
  is_locked: number;
  updated_at: string;
}

export interface VillageRoot {
  id: string;
  village_name: string;
  district: string | null;
  state: string | null;
  gramdevi_name: string | null;
  gramdevi_rituals: string | null;
  sthan_address: string | null;
  notes: string | null;
  updated_at: string;
}

export interface RitualLog {
  id: string;
  date: string;
  type: RitualType;
  name: string;
  performer_id: string | null;
  sankalpa_text: string | null;
  notes: string | null;
  created_at: string;
}

export interface SanskritiContract {
  profile: DharmaProfile | null;
  roots: VillageRoot[];
  logs: RitualLog[];
  loading: boolean;
  actions: {
    updateProfile: (profile: Partial<DharmaProfile>) => Promise<void>;
    addVillageRoot: (root: Omit<VillageRoot, 'id' | 'updated_at'>) => Promise<void>;
    updateVillageRoot: (id: string, root: Partial<VillageRoot>) => Promise<void>;
    deleteVillageRoot: (id: string) => Promise<void>;
    logRitual: (log: Omit<RitualLog, 'id' | 'created_at'>) => Promise<void>;
    deleteRitualLog: (id: string) => Promise<void>;
  };
}
