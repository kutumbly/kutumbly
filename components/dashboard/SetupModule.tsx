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

import React from 'react';
import { useAppStore } from '@/lib/store';
import ModuleShell from './ModuleShell';
import {
  Shield, Globe, Sun, Moon, Eye, EyeOff,
  Trash2, Download, Lock, HardDrive, FileTerminal, Network, Fingerprint
} from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';
import { triggerManualBackup } from '@/lib/vault';
import { downloadTallyXML, pushToTallyBridge } from '@/lib/tally';
import { registerBiometric, hasBiometricRegistered } from '@/lib/biometric';

const MODULE_LIST = [
  { id: 'diary',   label: 'Diary',     desc: 'Family journals & memories' },
  { id: 'tasks',   label: 'Tasks',     desc: 'Household chores & to-dos' },
  { id: 'money',   label: 'Money',     desc: 'Income & expense ledger' },
  { id: 'nevata',  label: 'Nevata',    desc: 'Gifting & occasion log' },
  { id: 'health',  label: 'Health',    desc: 'Medical records & vitals' },
  { id: 'invest',  label: 'Invest',    desc: 'Investment & SIP tracker' },
  { id: 'grocery', label: 'Grocery',   desc: 'Smart shopping list' },
  { id: 'staff',   label: 'HomeStaff', desc: 'Domestic helper management' },
  { id: 'network', label: 'Network',   desc: 'P2P secure webRTC sync' },
];

export default function SetupModule() {
  const {
    activeVault, lang, setLang,
    hiddenModules, toggleModule,
    theme, setTheme,
    db, currentPin,
    unlinkCloud, factoryReset
  } = useAppStore();
  const t = useTranslation(lang as Language);

  const [backupStatus, setBackupStatus] = React.useState<'idle' | 'saving' | 'done'>('idle');
  const [authorizedEmails, setAuthorizedEmails] = React.useState<string[]>([]);
  const [newEmail, setNewEmail] = React.useState('');
  const [showBurnConfirm, setShowBurnConfirm] = React.useState(false);
  const [burnConfirmText, setBurnConfirmText] = React.useState('');

  // Load authorized emails from DB settings
  React.useEffect(() => {
    if (!db) return;
    try {
      const res = db.exec("SELECT value FROM settings WHERE key = 'gdrive_auth_emails'");
      if (res.length > 0) {
        setAuthorizedEmails(JSON.parse(res[0].values[0][0]));
      }
    } catch {}
  }, [db]);

  const saveAuthorizedEmails = (emails: string[]) => {
    if (!db) return;
    try {
      db.run("INSERT OR REPLACE INTO settings (key, value) VALUES ('gdrive_auth_emails', ?)", [JSON.stringify(emails)]);
      setAuthorizedEmails(emails);
    } catch (err) {
      console.error("Failed to save auth emails:", err);
    }
  };

  const handleAddEmail = () => {
    if (!newEmail.trim() || !newEmail.includes('@')) return;
    const emailSet = new Set([...authorizedEmails, newEmail.trim().toLowerCase()]);
    const updatedList = Array.from(emailSet);
    saveAuthorizedEmails(updatedList);
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    const updated = authorizedEmails.filter(e => e !== email);
    saveAuthorizedEmails(updated);
  };

  const handleManualBackup = async () => {
    if (!db || !currentPin || !activeVault?.id) return;
    setBackupStatus('saving');
    try {
      await triggerManualBackup(db, currentPin, activeVault.id);
      setBackupStatus('done');
      setTimeout(() => setBackupStatus('idle'), 3000);
    } catch {
      setBackupStatus('idle');
    }
  };

  const [bridgeStatus, setBridgeStatus] = React.useState<'idle' | 'syncing' | 'error' | 'success'>('idle');

  const handlePushToBridge = async () => {
    if (!db) return;
    setBridgeStatus('syncing');
    const success = await pushToTallyBridge(db, 'http://localhost:3005/import');
    setBridgeStatus(success ? 'success' : 'error');
    setTimeout(() => setBridgeStatus('idle'), 3000);
  };

  const [bioState, setBioState] = React.useState<'idle' | 'registering' | 'success' | 'failed'>('idle');
  const isBioRegistered = activeVault ? hasBiometricRegistered(activeVault.id) : false;

  const handleRegisterBiometric = async () => {
    if (!activeVault || !currentPin) return;
    setBioState('registering');
    const success = await registerBiometric(activeVault.id, currentPin);
    setBioState(success ? 'success' : 'failed');
    setTimeout(() => setBioState('idle'), 3000);
  };

  return (
    <ModuleShell
      title={t('VYAVASTHA')}
      subtitle={lang === 'en' ? "Personalize your Sovereign OS" : "Apne system ko customize karein"}
    >
      <div className="space-y-8">

        {/* ── Module Visibility Toggles ───────────────────────── */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
            Module Configuration
          </div>
          <div className="card divide-y divide-border-light/30">
            {MODULE_LIST.map((m) => {
              const isHidden = hiddenModules.includes(m.id);
              return (
                <div
                  key={m.id}
                  className="py-4 px-4 flex items-center justify-between group hover:bg-bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center border text-[10px] font-black transition-all ${
                        isHidden
                          ? 'bg-bg-tertiary border-border-light text-text-tertiary'
                          : 'bg-bg-info border-text-info/20 text-text-info'
                      }`}
                    >
                      {m.label.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className={`text-sm font-bold transition-colors ${isHidden ? 'text-text-tertiary' : 'text-text-primary'}`}>
                        {m.label}
                      </div>
                      <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-wider">
                        {m.desc}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleModule(m.id)}
                    className={`transition-colors ${isHidden ? 'text-border-medium hover:text-gold' : 'text-text-success hover:text-text-danger'}`}
                    title={isHidden ? 'Show module' : 'Hide module'}
                  >
                    {isHidden ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Preferences ────────────────────────────────────── */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
            Preferences
          </div>
          <div className="space-y-3">

            {/* Language */}
            <div className="card p-4 flex items-center justify-between overflow-visible">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-text-tertiary" />
                <div>
                  <div className="text-sm font-bold text-text-primary">{t('SYSTEM_LANG')}</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                    Current: {lang.toUpperCase()}
                  </div>
                </div>
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-bg-secondary border border-border-medium rounded-lg text-[10px] font-bold uppercase px-3 py-2 text-text-primary focus:outline-none focus:border-gold"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="bho">भोजपुरी (Bhojpuri)</option>
              </select>
            </div>

            {/* Theme */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === 'dark' ? <Moon size={18} className="text-text-tertiary" /> : <Sun size={18} className="text-text-tertiary" />}
                <div>
                  <div className="text-sm font-bold text-text-primary">Appearance</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                    {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="btn text-[10px] font-bold uppercase px-4 py-2"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>

            {/* Vault Security */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={18} className="text-text-tertiary" />
                <div>
                  <div className="text-sm font-bold text-text-primary">Vault Security</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                    AES-256-GCM · {activeVault?.name || 'Locked'}
                  </div>
                </div>
              </div>
              <button className="btn text-[10px] font-bold uppercase px-4 py-2">
                Change PIN
              </button>
            </div>

            {/* Biometric Link */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint size={18} className="text-text-tertiary" />
                <div>
                  <div className="text-sm font-bold text-text-primary">Biometric Link</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mt-1">
                    WebAuthn PRF Harding
                  </div>
                </div>
              </div>
              <button 
                onClick={handleRegisterBiometric}
                disabled={bioState === 'registering' || isBioRegistered}
                className={`btn text-[10px] font-bold uppercase px-4 py-2 border transition-all ${isBioRegistered ? 'border-text-success text-text-success border-transparent' : 'border-border-medium hover:border-text-primary'}`}
              >
                {isBioRegistered ? 'Biometric Active' : bioState === 'registering' ? 'Scanning...' : bioState === 'failed' ? 'Device Not Supported' : bioState === 'success' ? 'Linked!' : 'Link Device'}
              </button>
            </div>

            {/* Export Vault */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Download size={18} className="text-text-tertiary" />
                <div>
                  <div className="text-sm font-bold text-text-primary">Export Vault</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                    Download encrypted .kutumb file
                  </div>
                </div>
              </div>
              <button className="btn text-[10px] font-bold uppercase px-4 py-2">
                Export
              </button>
            </div>

            {/* Manual Backup */}
            <div className="card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <HardDrive size={18} className="text-text-tertiary" />
                <div>
                  <div className="text-sm font-bold text-text-primary">Manual Backup</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                    Create an instant labeled snapshot
                  </div>
                </div>
              </div>
              <button 
                onClick={handleManualBackup} 
                disabled={backupStatus !== 'idle'}
                className="btn text-[10px] font-bold uppercase px-4 py-2 border border-border-medium hover:border-gold hover:text-gold disabled:opacity-50 transition-all"
              >
                {backupStatus === 'saving' ? 'Saving...' : backupStatus === 'done' ? 'Backup Complete' : 'Backup Now'}
              </button>
            </div>

            {/* GDrive Authorized Emails */}
            <div className="card p-4 bg-gold-light/20 border-gold/10">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <Globe size={18} className="text-gold" />
                    <div className="overflow-hidden">
                      <div className="text-sm font-bold text-text-primary">Cloud Authorization</div>
                      <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                        Allowed sync email addresses
                      </div>
                    </div>
                  </div>
                  <button onClick={unlinkCloud} className="text-[9px] font-black text-text-tertiary bg-bg-primary px-2 py-1 rounded hover:text-text-danger transition-colors">
                    LOGOUT CLOUD
                  </button>
                </div>

                <div className="space-y-2">
                  {authorizedEmails.map(email => (
                    <div key={email} className="flex items-center justify-between bg-bg-primary/50 py-2 px-3 rounded-lg border border-border-light/50">
                      <span className="text-xs font-bold text-text-primary">{email}</span>
                      <button onClick={() => handleRemoveEmail(email)} className="text-text-danger hover:opacity-70 transition-opacity">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input 
                      type="email" 
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Add Gmail Address"
                      className="flex-1 bg-bg-primary border border-border-light rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-gold"
                    />
                    <button 
                      onClick={handleAddEmail}
                      className="bg-gold text-white px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      ADD
                    </button>
                  </div>
                  <p className="text-[9px] text-text-tertiary font-bold uppercase tracking-widest ml-1">
                    Backups will be blocked if linked account is not in this list.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TallyPrime Gateway ────────────────────────────────────── */}
        {/* ... (Tally UI remains unchanged) ... */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1">
            Enterprise Sync Gateway
          </div>
          <div className="space-y-3">
            <div className="card p-4 flex flex-col gap-4">
               <div>
                  <div className="text-sm font-black text-text-primary">TallyPrime Protocol</div>
                  <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest mt-1">
                    Export Kutumbly Ledgers to Standard XML Vouchers
                  </div>
               </div>
               
               <div className="flex bg-bg-secondary p-3 rounded-xl border border-border-light gap-4">
                  <div className="flex-1">
                    <div className="text-xs font-bold text-text-primary mb-1">Option A: Native Setup</div>
                    <div className="text-[10px] text-text-tertiary mb-3">Silent XML compilation. Install manually via Tally Data config.</div>
                    <button onClick={() => downloadTallyXML(db)} className="btn text-[10px] font-bold uppercase px-4 py-2 border border-border-medium hover:border-text-primary transition-all flex items-center gap-2">
                       <FileTerminal size={14} /> Download XML
                    </button>
                  </div>
                  <div className="w-px bg-border-light/50"></div>
                  <div className="flex-1">
                    <div className="text-xs font-bold text-text-primary mb-1">Option B: HTTP Bridge</div>
                    <div className="text-[10px] text-text-tertiary mb-3">Sync zero-trust pipeline to localhost:3005 TallyNode.</div>
                    <button onClick={handlePushToBridge} className={`btn text-[10px] font-bold uppercase px-4 py-2 border transition-all flex items-center gap-2 ${bridgeStatus === 'error' ? 'border-text-danger text-text-danger' : 'border-border-medium hover:border-text-primary'}`}>
                       <Network size={14} /> {bridgeStatus === 'syncing' ? 'Syncing...' : bridgeStatus === 'success' ? 'Pushed' : bridgeStatus === 'error' ? 'Bridge Refused' : 'Push via Node'}
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* ── Danger Zone ────────────────────────────────────── */}
        <section>
          <div className="text-[11px] font-black text-text-danger uppercase tracking-[0.2em] mb-4 px-1">
            Danger Zone
          </div>
          <div className="card border-text-danger/20 bg-bg-danger p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-text-danger" />
              <div>
                <div className="text-sm font-bold text-text-primary">Sovereign Reset (The Burn Protocol)</div>
                <div className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">
                  Wipe device cache, memory & identity handles
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowBurnConfirm(true)}
              className="btn bg-text-danger text-white text-[10px] font-bold uppercase px-4 py-2 border-none hover:opacity-90"
            >
              System Burn
            </button>
          </div>
        </section>

        {/* Burn Protocol Modal */}
        {showBurnConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
            <div className="w-full max-w-sm bg-bg-primary rounded-[2.5rem] p-8 border border-text-danger/20 shadow-2xl">
              <div className="w-16 h-16 bg-text-danger/10 text-text-danger rounded-3xl flex items-center justify-center mb-6 mx-auto">
                <Trash2 size={32} />
              </div>
              <h3 className="text-2xl font-black text-center text-text-primary mb-2 uppercase tracking-wide">
                Burn Protocol
              </h3>
              <p className="text-xs font-bold text-center text-text-tertiary mb-6 leading-relaxed">
                This will wipe ALL device memory and handles. This is irreversible but does not affect cloud files.
                Type <span className="text-text-danger">BURN</span> below to confirm.
              </p>
              
              <input 
                type="text" 
                value={burnConfirmText}
                onChange={(e) => setBurnConfirmText(e.target.value)}
                placeholder="BURN"
                className="w-full h-14 bg-bg-secondary border border-border-light rounded-2xl px-6 text-center font-black text-lg tracking-[0.5em] focus:outline-none focus:border-text-danger transition-all mb-6"
              />

              <div className="flex flex-col gap-3">
                <button 
                  disabled={burnConfirmText !== 'BURN'}
                  onClick={factoryReset}
                  className="w-full h-14 bg-text-danger text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-lg shadow-text-danger/20 active:scale-95 transition-all disabled:opacity-50"
                >
                  Confirm Destroy
                </button>
                <button 
                  onClick={() => { setShowBurnConfirm(false); setBurnConfirmText(''); }}
                  className="w-full h-14 bg-bg-tertiary text-text-tertiary rounded-2xl font-black uppercase tracking-[0.2em] active:scale-95 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModuleShell>
  );
}
