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

/**
 * SOVEREIGN EVENT BUS
 * ─────────────────────────────────────────────────────────────
 * Lightweight pub/sub via `mitt` (300 bytes).
 * The ONLY way modules may communicate with each other.
 * Modules NEVER import from each other directly.
 *
 * Pattern:
 *   Emitter  → eventBus.emit('module.action', payload)
 *   Listener → eventBus.on('module.action', handler)
 * ─────────────────────────────────────────────────────────────
 */
import mitt from 'mitt';

export type SovereignEvents = {
  // ── Money module ─────────────────────────────────────────
  'money.advance.paid':      { staffId: string; amount: number };
  'money.expense.added':     { category: string; amount: number };

  // ── Staff module ──────────────────────────────────────────
  'staff.attendance.marked': { staffId: string; date: string; status: string };
  'staff.salary.paid':       { staffId: string; amount: number; month: string };

  // ── Health module ─────────────────────────────────────────
  'health.reading.added':    { memberId: string; type: string; value: number };
  'health.rx.added':         { memberId: string; genericName: string };

  // ── Utsav module ──────────────────────────────────────────
  'utsav.event.created':     { eventId: string; title: string; direction: string };
  'utsav.shagun.recorded':   { eventId: string; amount: number; familyName: string };

  // ── Suvidha module ────────────────────────────────────────
  'suvidha.log.created':     { vendorId: string; date: string };
  'suvidha.payment.made':    { vendorId: string; amount: number };

  // ── Vault / Auth ──────────────────────────────────────────
  'vault.unlocked':          Record<string, never>;
  'vault.locked':            Record<string, never>;
};

export const eventBus = mitt<SovereignEvents>();
