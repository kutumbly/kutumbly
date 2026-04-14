import React, { useState, useEffect } from 'react';
import { FileCode2, ArrowLeft, Loader2, AlertCircle, Key, FileUp, Cloud, History, Download } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { openVault, openVaultFromBytes } from '@/lib/vault';
import { initTokenClient, requestAccessToken, listVaultBackups, downloadVaultFile } from '@/lib/gdrive';
import { VaultMeta } from '@/types/vault';
import { motion, AnimatePresence } from 'framer-motion';

interface ImportPanelProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function ImportPanel({ onBack, onSuccess }: ImportPanelProps) {
  const { addRecentVault, setActiveVault, lang, gdriveToken, setGDriveToken } = useAppStore();
  
  const [step, setStep] = useState<'pick' | 'cloud' | 'pin'>('pick');
  const [fileHandle, setFileHandle] = useState<FileSystemFileHandle | null>(null);
  const [cloudBuffer, setCloudBuffer] = useState<Uint8Array | null>(null);
  const [cloudFileName, setCloudFileName] = useState('');
  
  const [pin, setPin] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [cloudFiles, setCloudFiles] = useState<any[]>([]);
  const [isCloudLoading, setIsCloudLoading] = useState(false);

  useEffect(() => {
    initTokenClient((res: any) => {
      if (res.access_token) {
        setGDriveToken(res.access_token);
        fetchCloudFiles(res.access_token);
      }
    });
  }, []);

  const fetchCloudFiles = async (token: string) => {
    setIsCloudLoading(true);
    try {
      const files = await listVaultBackups(token);
      setCloudFiles(files);
    } catch (e) {
      setError("Failed to fetch cloud backups");
    } finally {
      setIsCloudLoading(false);
    }
  };

  const handlePickFile = async () => {
    try {
      if ('showOpenFilePicker' in window) {
        const [picked] = await (window as any).showOpenFilePicker({
          types: [{ description: 'Kutumbly Vault', accept: { 'application/kutumb': ['.kutumb'] } }]
        });
        setFileHandle(picked);
        setStep('pin');
        setCloudBuffer(null);
        setError(null);
      } else {
        setError(lang === 'hi' ? 'Aapka browser file picking support nahi karta' : 'Your browser does not support file picking');
      }
    } catch (err) {}
  };

  const handleCloudRestoreInit = () => {
    if (gdriveToken) {
      setStep('cloud');
      fetchCloudFiles(gdriveToken);
    } else {
      requestAccessToken();
    }
  };

  const handleSelectCloudFile = async (file: any) => {
    if (!gdriveToken) return;
    setIsCloudLoading(true);
    try {
      const bytes = await downloadVaultFile(gdriveToken, file.id);
      setCloudBuffer(bytes);
      setCloudFileName(file.name);
      setFileHandle(null);
      setStep('pin');
    } catch (e) {
      setError("Download failed");
    } finally {
      setIsCloudLoading(false);
    }
  };

  const handleOtherMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.kutumb';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const bytes = new Uint8Array(ev.target?.result as ArrayBuffer);
          setCloudBuffer(bytes);
          setCloudFileName(file.name);
          setFileHandle(null);
          setStep('pin');
        };
        reader.readAsArrayBuffer(file);
      }
    };
    input.click();
  };

  const handleUnlock = async () => {
    if ((!fileHandle && !cloudBuffer) || pin.length < 4) return;

    setIsDecrypting(true);
    setError(null);

    try {
      let db: any;
      let finalHandle = fileHandle;
      let vaultName = fileHandle ? fileHandle.name.replace('.kutumb', '') : cloudFileName.replace('.kutumb', '');
      let vaultId = crypto.randomUUID();

      if (fileHandle) {
        const res = await openVault(pin, fileHandle);
        db = res.db;
        finalHandle = (res.handle as FileSystemFileHandle) || null;
      } else if (cloudBuffer) {
        db = await openVaultFromBytes(cloudBuffer, pin);
      }
      
      // IDENTITY VERIFICATION ON RESTORE
      try {
        const { fetchUserEmail } = await import("@/lib/gdrive");
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : false;
        
        if (isOnline && gdriveToken) {
           const currentUser = await fetchUserEmail(gdriveToken);
           const authRaw = db.exec("SELECT value FROM settings WHERE key = 'gdrive_auth_emails'");
           if (authRaw.length > 0) {
              const authorized: string[] = JSON.parse(authRaw[0].values[0][0]);
              if (authorized.length > 0 && currentUser && !authorized.includes(currentUser.toLowerCase())) {
                 db.close();
                 throw new Error("UNAUTHORIZED_IDENTITY");
              }
           }
        }
      } catch (authErr: any) {
        if (authErr.message === "UNAUTHORIZED_IDENTITY") throw authErr;
        // Else ignore auth errors (maybe offline or dev)
      }

      try {
        const nameRes = db.exec("SELECT value FROM settings WHERE key = 'vault_name'");
        if (nameRes.length > 0) vaultName = nameRes[0].values[0][0] as string;
        
        const idRes = db.exec("SELECT value FROM settings WHERE key = 'vault_id'");
        if (idRes.length > 0) {
          vaultId = idRes[0].values[0][0] as string;
        } else {
          db.run("INSERT INTO settings (key, value) VALUES ('vault_id', ?)", [vaultId]);
        }
      } catch (e) {}

      const importedVault: VaultMeta = {
        id: vaultId,
        name: vaultName,
        icon: '🔐',
        lastOpened: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        memberCount: 0,
        fileHandle: finalHandle || undefined,
      };

      addRecentVault(importedVault);
      setActiveVault(importedVault);
      setUnlocked(db, finalHandle || undefined);
      onSuccess();
    } catch (err: any) {
      console.error("Unlock failed:", err);
      if (err.message === 'WRONG_PIN') {
        setError(lang === 'hi' ? 'Galat PIN — dobara try karo' : 'Invalid PIN — please try again');
      } else if (err.message === 'UNAUTHORIZED_IDENTITY') {
        setError(lang === 'hi' ? 'Yah email authorized nahi hai' : 'Authenticated email is not authorized for this vault');
      } else if (err.message === 'UNENCRYPTED_DB_DETECTED') {
        setError(lang === 'hi' ? 'Yah unencrypted raw database hai. (.kutumb file chahiye)' : 'This is an unencrypted raw database. Please select a .kutumb vault file.');
      } else {
        setError(lang === 'hi' ? 'Vault khul nahi paya (Invalid File Signature)' : 'Failed to open vault (Invalid File Signature)');
        
        // Diagnostic Log for Developer
        if (fileHandle || cloudBuffer) {
           console.warn("[EOS-DIAGNOSTIC] Decryption failed. Signature Mismatch.");
        }
      }
      setPin('');
    } finally {
      setIsDecrypting(false);
    }
  };

  const { setUnlocked } = useAppStore();

  return (
    <div className="flex flex-col h-full bg-primary relative p-8">
      {/* Back Button */}
      <button 
        onClick={step === 'pin' || step === 'cloud' ? () => setStep('pick') : onBack}
        className="absolute top-8 left-8 p-2 rounded-full bg-secondary hover:bg-gold-light/50 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 text-text-secondary" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center max-w-[400px] mx-auto w-full">
        <AnimatePresence mode="wait">
          {step === 'pick' && (
            <motion.div 
              key="pick"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full flex flex-col items-center gap-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4 border-[0.5px] border-gold/20">
                  <FileCode2 className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {lang === 'hi' ? 'Gateway Kholo' : 'Vault Gateway'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Choose your source for the Sovereign OS.
                </p>
              </div>

              <div className="w-full flex flex-col gap-3">
                <button
                  onClick={handlePickFile}
                  className="w-full h-16 bg-secondary border border-border-medium rounded-xl flex items-center px-6 gap-4 hover:border-gold hover:bg-gold-light/20 transition-all group"
                >
                  <FileUp className="w-6 h-6 text-text-tertiary group-hover:text-gold transition-colors" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-text-primary">{lang === 'hi' ? 'File Choose Karein' : 'Local .kutumb File'}</div>
                    <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">From your device</div>
                  </div>
                </button>

                <button
                  onClick={handleCloudRestoreInit}
                  className="w-full h-16 bg-secondary border border-border-medium rounded-xl flex items-center px-6 gap-4 hover:border-gold hover:bg-gold-light/20 transition-all group"
                >
                  <Cloud className="w-6 h-6 text-text-tertiary group-hover:text-gold transition-colors" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-text-primary">{lang === 'hi' ? 'Cloud Se Restore' : 'Cloud-Syncript Restore'}</div>
                    <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">From your Google Drive</div>
                  </div>
                </button>

                <button
                  onClick={handleOtherMedia}
                  className="w-full h-16 bg-secondary border border-border-medium rounded-xl flex items-center px-6 gap-4 hover:border-gold hover:bg-gold-light/20 transition-all group"
                >
                  <Download className="w-6 h-6 text-text-tertiary group-hover:text-gold transition-colors" />
                  <div className="text-left">
                    <div className="text-sm font-bold text-text-primary">{lang === 'hi' ? 'Other Media' : 'Other Media (OTG/USB)'}</div>
                    <div className="text-[10px] text-text-tertiary font-bold uppercase tracking-widest">SD Card, USB or Legacy browsers</div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'cloud' && (
            <motion.div key="cloud" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
               <div className="text-center mb-6">
                  <History className="w-10 h-10 text-gold mx-auto mb-2" />
                  <h3 className="text-lg font-bold text-text-primary">Discovery Portal</h3>
                  <p className="text-xs text-text-secondary">Select an encrypted block to restore.</p>
               </div>
               
               <div className="card w-full max-h-[300px] overflow-y-auto divide-y divide-border-light/30">
                  {isCloudLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-gold" /></div>
                  ) : cloudFiles.length === 0 ? (
                    <div className="p-8 text-center text-xs text-text-tertiary">No backups found in Drive</div>
                  ) : (
                    cloudFiles.map(f => (
                      <button 
                        key={f.id} 
                        onClick={() => handleSelectCloudFile(f)}
                        className="w-full p-4 flex items-center justify-between hover:bg-gold-light/10 transition-colors text-left group"
                      >
                        <div>
                          <div className="text-sm font-bold text-text-primary group-hover:text-gold">{f.name}</div>
                          <div className="text-[9px] text-text-tertiary uppercase font-black">{new Date(f.createdTime).toLocaleString()}</div>
                        </div>
                        <Download size={14} className="text-text-tertiary" />
                      </button>
                    ))
                  )}
               </div>
            </motion.div>
          )}

          {step === 'pin' && (
            <motion.div 
              key="pin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full flex flex-col gap-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gold-light rounded-2xl flex items-center justify-center mx-auto mb-4 border-[0.5px] border-gold/20">
                  <Key className="w-8 h-8 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-text-primary">
                  {lang === 'hi' ? 'PIN Enter Karein' : 'Enter PIN'}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  Decryption key for {fileHandle?.name || cloudFileName}
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  autoFocus
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full h-12 px-4 rounded-lg bg-secondary border-[0.5px] border-border-medium text-center text-2xl tracking-[1em] outline-none focus:border-gold transition-all"
                />
              </div>

              {error && <div className="text-danger text-[11px] font-bold text-center">{error}</div>}

              <button
                onClick={handleUnlock}
                disabled={isDecrypting || pin.length < 4}
                className="w-full h-12 bg-gold text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-4 shadow-md bg-gradient-to-tr from-gold to-[#d4af37] disabled:opacity-50"
              >
                {isDecrypting ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>{lang === 'hi' ? 'Unlock Karein' : 'Unlock Vault'}</span>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

