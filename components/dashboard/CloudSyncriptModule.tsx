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

import React, { useEffect, useState } from 'react';
import ModuleShell from './ModuleShell';
import { useAppStore } from '@/lib/store';
import { initTokenClient, requestAccessToken, listVaultBackups, fetchUserEmail } from '@/lib/gdrive';
import { performCloudSync, isSyncDue } from '@/lib/sync';
import { 
  Cloud, CloudOff, RefreshCcw, ShieldCheck, 
  ExternalLink, Key, AlertCircle, History,
  Database, Wifi, WifiOff, XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation, Language } from '@/lib/i18n';

export default function CloudSyncriptModule() {
  const { 
    db, currentPin, lang, 
    lastSyncDate, isSyncing, gdriveToken, pendingSync,
    setGDriveToken, setSyncStatus, unlinkCloud
  } = useAppStore();
  const t_hook = useTranslation(lang as Language);

  const [backups, setBackups] = useState<any[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [authStatus, setAuthStatus] = useState<'idle' | 'auth_checking' | 'authorized' | 'unauthorized' | 'error'>('idle');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    initTokenClient(async (res: any) => {
      if (res.access_token) {
        const email = await fetchUserEmail(res.access_token);
        setUserEmail(email);

        // Check against vault's authorized list
        const authListRaw = db.exec("SELECT value FROM settings WHERE key = 'gdrive_auth_emails'");
        const authorizedEmails: string[] = authListRaw.length > 0 ? JSON.parse(authListRaw[0].values[0][0]) : [];

        if (authorizedEmails.length > 0 && (!email || !authorizedEmails.includes(email.toLowerCase()))) {
          setAuthStatus('unauthorized');
          setGDriveToken(null);
        } else {
          setGDriveToken(res.access_token);
          setAuthStatus('authorized');
          fetchBackups(res.access_token);
        }
      } else {
        setAuthStatus('error');
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const fetchBackups = async (token: string) => {
    try {
      const list = await listVaultBackups(token);
      setBackups(list);
    } catch {}
  };

  const handleManualSync = async () => {
    if (!gdriveToken) {
      requestAccessToken();
      return;
    }
    
    if (!db || !currentPin) return;

    setSyncStatus({ isSyncing: true });
    const success = await performCloudSync(gdriveToken, db, currentPin, (status) => {
      if (status === 'success') {
        setSyncStatus({ 
          lastSync: new Date().toISOString(), 
          isSyncing: false,
          pendingSync: false 
        });
        fetchBackups(gdriveToken);
      } else if (status === 'error') {
        setSyncStatus({ isSyncing: false });
      }
    });
  };

  const t = {
    title: t_hook('CLOUD_SYNC'),
    subtitle: t_hook('CLOUD_SYNC_SUBTITLE'),
    status: t_hook('NETWORK_STATUS'),
    syncNow: t_hook('SYNC_NOW'),
    authorized: t_hook('ACCOUNT_LINKED'),
    notAuthorized: t_hook('LINK_ACCOUNT'),
    lastSync: t_hook('LAST_SYNC'),
    history: t_hook('BACKUP_HISTORY'),
  };

  return (
    <ModuleShell title={t.title} subtitle={t.subtitle}>
      <div className="space-y-6">
        
        {/* Connection Status Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-5 bg-bg-secondary/40 border-border-light/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isOnline ? 'bg-text-success/10 text-text-success' : 'bg-text-danger/10 text-text-danger'}`}>
                {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{t_hook('CONNECTIVITY')}</div>
                <div className="text-sm font-bold text-text-primary">{isOnline ? t_hook('ACTIVE_LINK') : t_hook('OFFLINE_MODE')}</div>
              </div>
            </div>
            {pendingSync && (
              <span className="text-[9px] font-black uppercase tracking-widest bg-gold/10 text-gold px-2 py-1 rounded border border-gold/20 animate-pulse">
                Pending Queue
              </span>
            )}
          </div>

          <div className="card p-5 bg-bg-secondary/40 border-border-light/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                authStatus === 'authorized' ? 'bg-gold/10 text-gold' : 
                authStatus === 'unauthorized' ? 'bg-text-danger/10 text-text-danger' : 
                'bg-bg-tertiary text-text-tertiary'
              }`}>
                {authStatus === 'unauthorized' ? <XCircle size={20} /> : <ShieldCheck size={20} />}
              </div>
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-tertiary">{t_hook('VAULT_IDENTITY')}</div>
                <div className="text-sm font-bold text-text-primary">
                  {authStatus === 'authorized' ? t_hook('AUTH_AUTHENTICATED') : authStatus === 'unauthorized' ? t_hook('AUTH_UNAUTHORIZED') : t_hook('AUTH_LOCK')}
                </div>
                {authStatus === 'unauthorized' && (
                  <div className="text-[9px] text-text-danger font-bold truncate max-w-[120px]">
                    {userEmail}
                  </div>
                )}
              </div>
            </div>
            {(!gdriveToken || authStatus === 'unauthorized') && (
               <button onClick={() => requestAccessToken()} className="text-[10px] font-bold text-gold hover:underline">
                 {authStatus === 'unauthorized' ? 'Change Account' : 'Link Account'}
               </button>
            )}
          </div>
        </div>

        {/* Main Sync Controller */}
        <div className="card p-8 bg-gradient-to-br from-bg-primary to-bg-secondary border-border-light shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center text-center">
             <div className="w-20 h-20 bg-bg-tertiary rounded-3xl flex items-center justify-center mb-6 border border-border-light shadow-inner group-hover:scale-110 transition-transform duration-500">
                <AnimatePresence mode="wait">
                  {isSyncing ? (
                    <motion.div
                      key="syncing"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCcw size={40} className="text-gold" />
                    </motion.div>
                  ) : (
                    <motion.div key="idle" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                      <Cloud size={40} className={gdriveToken ? 'text-gold' : 'text-text-tertiary'} />
                    </motion.div>
                  )}
                </AnimatePresence>
             </div>

             <h3 className="text-xl font-bold text-text-primary mb-2">{t_hook('CLOUD_ENGINE')}</h3>
             <p className="text-sm text-text-secondary max-w-sm mb-8">
               {t_hook('CLOUD_DESC')}
             </p>

             <button 
               onClick={handleManualSync}
               disabled={isSyncing || !isOnline}
               className={`btn btn-primary h-14 px-10 rounded-2xl flex items-center gap-3 text-base shadow-lg shadow-gold/20 relative overflow-hidden ${isSyncing ? 'opacity-70' : ''}`}
             >
                <RefreshCcw size={20} className={isSyncing ? 'animate-spin' : ''} />
                {isSyncing ? 'Processing...' : t.syncNow}
                {isSyncing && (
                   <motion.div 
                     className="absolute inset-0 bg-white/10"
                     animate={{ x: ['-100%', '100%'] }}
                     transition={{ duration: 1.5, repeat: Infinity }}
                   />
                )}
             </button>

             <div className="mt-8 flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary">
                <div className="flex items-center gap-2">
                   <div className="w-1 h-1 rounded-full bg-text-success" />
                   {lastSyncDate ? `Last Sync: ${new Date(lastSyncDate).toLocaleTimeString()}` : 'Never Synced'}
                </div>
                <span>·</span>
                <div className="flex items-center gap-2">
                   <Database size={12} />
                   AES-256 Encrypted
                </div>
             </div>
          </div>
        </div>

        {/* Sync History / List */}
        <section>
          <div className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 px-1 flex items-center justify-between">
            <span className="flex items-center gap-2"><History size={14} /> {t.history}</span>
            <button onClick={() => gdriveToken && fetchBackups(gdriveToken)} className="hover:text-gold transition-colors">
              <RefreshCcw size={12} />
            </button>
          </div>

          <div className="card divide-y divide-border-light/30">
            {backups.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-text-tertiary gap-3">
                <CloudOff size={32} className="opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">{gdriveToken ? 'No backups found' : 'Authorize to see history'}</p>
              </div>
            ) : (
              backups.slice(0, 5).map((b) => (
                <div key={b.id} className="p-4 flex items-center justify-between hover:bg-bg-secondary transition-colors cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-tertiary flex items-center justify-center border border-border-light text-gold text-xs font-black">
                      K
                    </div>
                    <div>
                      <div className="text-sm font-bold text-text-primary">{b.name}</div>
                      <div className="text-[9px] text-text-tertiary uppercase font-black tracking-widest mt-0.5">
                        {new Date(b.createdTime).toLocaleString()} · {(b.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <button className="p-2 text-text-tertiary hover:text-gold transition-colors">
                    <ExternalLink size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </ModuleShell>
  );
}
