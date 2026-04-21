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

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw, Download, CheckCircle2, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, ShieldCheck, Zap
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  getSchemaVersion,
  CURRENT_SCHEMA_VERSION,
  getPendingChangelog,
  runMigrations,
} from '@/lib/migrations';
import { exportPreMigrationBackup, saveVault } from '@/lib/vault';

type MigrationStep = 'prompt' | 'backing-up' | 'migrating' | 'done' | 'error';

interface MigrationModalProps {
  /** Called after migration succeeds (or user chooses to skip — not recommended) */
  onComplete: () => void;
}

export default function MigrationModal({ onComplete }: MigrationModalProps) {
  const { db, currentPin, fileHandle, activeVault } = useAppStore();

  const fromVersion = db ? getSchemaVersion(db) : 0;
  const changelog = getPendingChangelog(fromVersion);

  const [step, setStep] = useState<MigrationStep>('prompt');
  const [progress, setProgress] = useState({ current: 0, total: 0, version: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [backupDone, setBackupDone] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);

  /* ── backup ─────────────────────────────────────────────── */
  const handleBackup = async () => {
    if (!db || !currentPin || !activeVault) return;
    setStep('backing-up');
    try {
      await exportPreMigrationBackup(db, currentPin, activeVault.name, fromVersion);
      setBackupDone(true);
      setStep('prompt');
    } catch (err) {
      setErrorMessage(`Backup failed: ${String(err)}`);
      setStep('error');
    }
  };

  /* ── migrate ─────────────────────────────────────────────── */
  const handleMigrate = async () => {
    if (!db || !currentPin || !fileHandle) return;
    setStep('migrating');
    try {
      // Run migrations with progress tracking
      runMigrations(db, (current, total, version) => {
        setProgress({ current, total, version });
      });

      // Persist the updated vault to disk
      await saveVault(db, currentPin, fileHandle);

      setStep('done');
    } catch (err) {
      setErrorMessage(String(err));
      setStep('error');
    }
  };

  /* ── render steps ───────────────────────────────────────── */
  const renderPrompt = () => (
    <motion.div
      key="prompt"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      {/* Badge */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/30 rounded-full mb-6">
          <Zap size={12} className="text-gold" />
          <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">Schema Update Available</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight mb-3">
          Vault Upgrade Required
        </h2>
        <p className="text-[13px] font-bold text-text-secondary leading-relaxed max-w-md mx-auto">
          Your vault was created with an older version of Kutumbly.
          A quick schema upgrade is needed to unlock new features.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4">
          <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest px-3 py-1.5 bg-bg-tertiary border border-border-light rounded-xl">
            Current v{fromVersion}
          </span>
          <span className="text-text-tertiary">→</span>
          <span className="text-[10px] font-black text-gold uppercase tracking-widest px-3 py-1.5 bg-gold/10 border border-gold/30 rounded-xl">
            New v{CURRENT_SCHEMA_VERSION}
          </span>
        </div>
      </div>

      {/* Changelog accordion */}
      <div className="bg-bg-secondary border border-border-light rounded-[2rem] overflow-hidden">
        <button
          onClick={() => setShowChangelog(c => !c)}
          className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-bg-tertiary transition-colors"
        >
          <span className="text-[11px] font-black text-text-secondary uppercase tracking-[0.2em]">
            What&apos;s New ({changelog.reduce((a, c) => a + c.changes.length, 0)} changes)
          </span>
          {showChangelog ? <ChevronUp size={16} className="text-text-tertiary" /> : <ChevronDown size={16} className="text-text-tertiary" />}
        </button>
        <AnimatePresence>
          {showChangelog && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="px-6 pb-6 space-y-5 border-t border-border-light pt-4">
                {changelog.map(({ version, changes }) => (
                  <div key={version}>
                    <div className="text-[9px] font-black text-gold uppercase tracking-[0.3em] mb-3">
                      Version {version}
                    </div>
                    <ul className="space-y-2">
                      {changes.map((c, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 flex-shrink-0" />
                          <span className="text-[12px] font-bold text-text-secondary leading-relaxed">{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backup section */}
      <div className={`rounded-[2rem] border-2 p-6 transition-all ${backupDone ? 'border-text-success/40 bg-text-success/5' : 'border-gold/30 bg-gold/5'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${backupDone ? 'bg-text-success/10' : 'bg-gold/10'}`}>
            {backupDone
              ? <CheckCircle2 size={20} className="text-text-success" />
              : <Download size={20} className="text-gold" />
            }
          </div>
          <div className="flex-1">
            <h4 className={`text-[12px] font-black uppercase tracking-widest mb-1 ${backupDone ? 'text-text-success' : 'text-gold'}`}>
              {backupDone ? '✓ Backup Downloaded' : 'Take Backup First (Recommended)'}
            </h4>
            <p className="text-[11px] font-bold text-text-secondary leading-relaxed">
              {backupDone
                ? `Pre-migration backup saved as v${fromVersion} .kutumb file.`
                : 'Downloads an encrypted copy of your current vault. Restores in case migration ever goes wrong.'}
            </p>
          </div>
          {!backupDone && (
            <button
              onClick={handleBackup}
              className="flex-shrink-0 flex items-center gap-2 h-10 px-5 bg-gold-text text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:opacity-90 transition-all shadow-lg shadow-gold/10"
            >
              <Download size={13} /> Backup
            </button>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleMigrate}
          className="w-full h-14 bg-gold-text text-white font-black text-[12px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-gold/10"
        >
          <RefreshCw size={16} />
          {backupDone ? 'Migrate Now — Backup Ready' : 'Migrate Without Backup'}
        </button>

        {!backupDone && (
          <p className="text-center text-[10px] font-bold text-text-tertiary">
            ⚠️ Migrating without backup is safe — but backup is recommended.
          </p>
        )}
      </div>

      {/* Security note */}
      <div className="flex items-center justify-center gap-6 pt-2 border-t border-border-light">
        <IconNote icon={<ShieldCheck size={14} />} label="Zero cloud contact" />
        <IconNote icon={<RefreshCw size={14} />} label="Runs offline, in memory" />
        <IconNote icon={<CheckCircle2 size={14} />} label="Idempotent — safe to re-run" />
      </div>
    </motion.div>
  );

  const renderBackingUp = () => (
    <motion.div key="backing-up" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-6">
      <Loader2 size={40} className="text-gold animate-spin" />
      <p className="text-base font-black text-text-primary uppercase tracking-widest">Encrypting Backup…</p>
      <p className="text-[11px] font-bold text-text-tertiary">Your data never leaves this device.</p>
    </motion.div>
  );

  const renderMigrating = () => (
    <motion.div key="migrating" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-24 gap-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-border-light" />
        <div className="absolute inset-0 rounded-full border-4 border-t-gold animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCw size={24} className="text-gold" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-base font-black text-text-primary uppercase tracking-widest">Migrating Vault…</p>
        {progress.total > 0 && (
          <p className="text-[11px] font-bold text-text-tertiary">
            Step {progress.current} of {progress.total} — Applying v{progress.version}
          </p>
        )}
      </div>
      {/* Progress bar */}
      {progress.total > 0 && (
        <div className="w-64 h-1.5 bg-bg-tertiary rounded-full overflow-hidden border border-border-light">
          <motion.div
            className="h-full bg-gold rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(progress.current / progress.total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      )}
      <p className="text-[10px] font-bold text-text-tertiary">Please keep this tab open…</p>
    </motion.div>
  );

  const renderDone = () => (
    <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.1 }}
        className="w-24 h-24 rounded-full bg-text-success/10 border-2 border-text-success/30 flex items-center justify-center">
        <CheckCircle2 size={44} className="text-text-success" />
      </motion.div>
      <div>
        <div className="text-[10px] font-black text-text-success uppercase tracking-[0.3em] mb-3">Migration Complete</div>
        <h2 className="text-2xl font-black text-text-primary tracking-tight mb-2">Vault Updated to v{CURRENT_SCHEMA_VERSION}</h2>
        <p className="text-[12px] font-bold text-text-secondary leading-relaxed max-w-sm mx-auto">
          All data is safe. Your vault has been upgraded and saved securely.
        </p>
      </div>
      <button
        onClick={onComplete}
        className="h-14 px-10 bg-gold-text text-white font-black text-[12px] uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-gold/10 mt-4"
      >
        Enter Dashboard →
      </button>
    </motion.div>
  );

  const renderError = () => (
    <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="flex flex-col items-center justify-center py-16 gap-6 text-center">
      <div className="w-20 h-20 rounded-full bg-text-danger/10 border-2 border-text-danger/30 flex items-center justify-center">
        <AlertTriangle size={36} className="text-text-danger" />
      </div>
      <div>
        <div className="text-[10px] font-black text-text-danger uppercase tracking-[0.3em] mb-3">Migration Failed</div>
        <h2 className="text-xl font-black text-text-primary tracking-tight mb-3">Something went wrong</h2>
        <p className="text-[11px] font-bold text-text-secondary leading-relaxed max-w-sm mx-auto font-mono bg-bg-tertiary border border-border-light rounded-xl p-4">
          {errorMessage}
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => setStep('prompt')}
          className="h-12 px-8 bg-bg-secondary border border-border-light text-text-primary font-black text-[11px] uppercase tracking-widest rounded-2xl hover:border-gold transition-all">
          Go Back
        </button>
        <button onClick={handleMigrate}
          className="h-12 px-8 bg-gold-text text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:opacity-90 transition-all">
          Retry Migration
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed inset-0 z-[999] bg-bg-primary/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-xl">
        {/* Header Brand */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.4em]">Kutumbly Sovereign OS</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 'prompt' && renderPrompt()}
          {step === 'backing-up' && renderBackingUp()}
          {step === 'migrating' && renderMigrating()}
          {step === 'done' && renderDone()}
          {step === 'error' && renderError()}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Micro-components ──────────────────────────────────────── */
function IconNote({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-text-tertiary">
      <div className="opacity-60">{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
