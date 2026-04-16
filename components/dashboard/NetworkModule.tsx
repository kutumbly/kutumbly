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

import React, { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import ModuleShell from './ModuleShell';
import { Network, QrCode, Cpu, ShieldCheck, Download, Zap } from 'lucide-react';
import { P2PNode } from '@/lib/p2p';
import { useTranslation, Language } from '@/lib/i18n';
import { triggerManualBackup } from '@/lib/vault';

export default function NetworkModule() {
  const { lang, db, activeVault, currentPin } = useAppStore();
  const t = useTranslation(lang as Language);
  
  const [mode, setMode] = useState<'idle' | 'host' | 'guest'>('idle');
  const [node, setNode] = useState<P2PNode | null>(null);
  const [status, setStatus] = useState<string>(t('OFF_GRID'));
  
  // HOST states
  const [hostOffer, setHostOffer] = useState('');
  const [guestAnswerInput, setGuestAnswerInput] = useState('');

  // GUEST states
  const [hostOfferInput, setHostOfferInput] = useState('');
  const [guestAnswer, setGuestAnswer] = useState('');

  const cleanup = () => {
    if (node) node.pc.close();
    setNode(null);
    setMode('idle');
    setStatus(t('OFF_GRID'));
    setHostOffer('');
    setGuestAnswerInput('');
    setHostOfferInput('');
    setGuestAnswer('');
  };

  useEffect(() => {
    return () => cleanup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initHost = async () => {
    setMode('host');
    setStatus('Generating Quantum Offer...');
    const p2p = new P2PNode();
    setNode(p2p);
    
    p2p.onConnected = () => {
       setStatus('Secure Channel Established!');
       // Automatically send the vault binary over P2P!
       if (db && currentPin && activeVault?.id) {
           const dbBytes = db.export();
           p2p.sendData(dbBytes.buffer);
           setStatus('Vault Transmitted Successfully.');
       }
    };
    
    try {
        const offer = await p2p.createHostOffer();
        setHostOffer(offer);
        setStatus('Waiting for Guest Answer...');
    } catch (e) {
        setStatus('Failed to generate Local Offer');
    }
  };

  const hostAcceptAnswer = async () => {
    if (!node || !guestAnswerInput) return;
    setStatus('Finalizing Handshake...');
    await node.acceptGuestAnswer(guestAnswerInput);
  };

  const initGuest = async () => {
    setMode('guest');
    setStatus('Awaiting Host Offer Paste...');
    const p2p = new P2PNode();
    setNode(p2p);

    p2p.onData = async (buffer) => {
       setStatus(t('NETWORK_RECEIVING'));
       // In a real P2P, we would decrypt/verify this byte array
       // For this prototype, we'll prompt a download to prove it crossed the airgap!
       const blob = new Blob([buffer], { type: 'application/octet-stream' });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `SYNCED_VAULT_${new Date().getTime()}.sqlite`;
       a.click();
       setStatus(t('NETWORK_DOWNLOADED'));
    };

    p2p.onConnected = () => {
       setStatus('Secure Channel Established! Waiting for transmission...');
    };
  };

  const guestAcceptOffer = async () => {
    if (!node || !hostOfferInput) return;
    setStatus('Generating Answer Payload...');
    const answer = await node.acceptHostOfferAndCreateAnswer(hostOfferInput);
    setGuestAnswer(answer);
    setStatus('Answer Generated. Pass this back to the Host.');
  };

  return (
    <ModuleShell 
      title={t('P2P_SYNC')}
      subtitle={lang === 'en' ? "Air-gapped serverless replication" : "Bina server के सीधा फोन-से-फोन सिंक"}
    >
      <div className="space-y-6">
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="card p-6 bg-gold/5 border-gold/20 flex flex-col items-center justify-center text-center gap-4 group hover:bg-gold/10 transition-colors cursor-pointer" onClick={initHost}>
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                   <QrCode size={32} />
                </div>
                <div>
                   <h3 className="font-black text-text-primary text-lg">Send Vault (Host)</h3>
                   <p className="text-[10px] uppercase font-bold text-text-tertiary tracking-widest mt-1">Generate Air-Gap Offer</p>
                </div>
             </div>

             <div className="card p-6 bg-bg-info/10 border-bg-info/20 flex flex-col items-center justify-center text-center gap-4 group hover:bg-bg-info/20 transition-colors cursor-pointer" onClick={initGuest}>
                <div className="w-16 h-16 rounded-full bg-bg-info/20 flex items-center justify-center text-text-info group-hover:scale-110 transition-transform">
                   <Zap size={32} />
                </div>
                <div>
                   <h3 className="font-black text-text-primary text-lg">Receive Vault (Guest)</h3>
                   <p className="text-[10px] uppercase font-bold text-text-tertiary tracking-widest mt-1">Scan Air-Gap Offer</p>
                </div>
             </div>
         </div>

         <div className="card p-4 flex items-center justify-between border-l-[4px] border-l-gold">
            <div className="flex items-center gap-3">
               <Cpu size={20} className="text-gold" />
               <div className="font-black text-xs uppercase tracking-widest text-text-secondary">{t('NETWORK_STATUS')}</div>
            </div>
            <div className="text-xs font-bold font-mono bg-bg-secondary px-3 py-1.5 rounded-lg border border-border-light text-text-primary">
               {status}
            </div>
         </div>

         {mode === 'host' && (
             <div className="card p-6 border-gold/30">
                 <h4 className="text-sm font-black mb-4 flex items-center gap-2"><ShieldCheck size={18} className="text-gold" /> Host Protocol Terminal</h4>
                 
                 <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-text-tertiary tracking-widest block mb-2">1. Copy this Offer & sent to Guest</label>
                        <textarea 
                           readOnly 
                           value={hostOffer} 
                           className="w-full h-24 bg-bg-secondary border border-border-light rounded-xl p-3 text-[8px] font-mono text-text-secondary opacity-70 outline-none" 
                           placeholder="Generating SDP Offer..."
                        />
                        <button 
                           onClick={() => navigator.clipboard.writeText(hostOffer)}
                           className="mt-2 text-[10px] font-bold text-gold uppercase tracking-widest hover:underline"
                        >
                           Copy Offer Payload
                        </button>
                    </div>

                    <div className="pt-4 border-t border-border-light/50">
                        <label className="text-[10px] font-bold uppercase text-text-tertiary tracking-widest block mb-2">2. Paste Guest's Answer Here</label>
                        <textarea 
                           value={guestAnswerInput} 
                           onChange={e => setGuestAnswerInput(e.target.value)}
                           className="w-full h-24 bg-bg-tertiary border border-border-light rounded-xl p-3 text-[10px] font-mono text-text-primary outline-none focus:border-gold" 
                           placeholder="Paste answering JSON base64 string here..."
                        />
                        <button 
                           onClick={hostAcceptAnswer} disabled={!guestAnswerInput}
                           className="w-full mt-3 bg-gold hover:opacity-90 disabled:opacity-30 text-white font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                           Finalize Direct Connection
                        </button>
                    </div>
                 </div>
             </div>
         )}

         {mode === 'guest' && (
             <div className="card p-6 border-bg-info/30">
                 <h4 className="text-sm font-black mb-4 flex items-center gap-2"><Download size={18} className="text-text-info" /> Guest Protocol Terminal</h4>
                 
                 <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-text-tertiary tracking-widest block mb-2">1. Paste Host's Offer Here</label>
                        <textarea 
                           value={hostOfferInput} 
                           onChange={e => setHostOfferInput(e.target.value)}
                           className="w-full h-24 bg-bg-tertiary border border-border-light rounded-xl p-3 text-[10px] font-mono text-text-primary outline-none focus:border-text-info" 
                           placeholder="Paste offer JSON base64 string here..."
                        />
                        <button 
                           onClick={guestAcceptOffer} disabled={!hostOfferInput}
                           className="w-full mt-3 bg-text-info hover:opacity-90 disabled:opacity-30 text-white font-bold h-12 rounded-xl text-xs uppercase tracking-widest transition-all"
                        >
                           Generate Answer
                        </button>
                    </div>

                    {guestAnswer && (
                        <div className="pt-4 border-t border-border-light/50">
                            <label className="text-[10px] font-bold uppercase text-text-tertiary tracking-widest block mb-2">2. Copy Answer & return to Host</label>
                            <textarea 
                               readOnly 
                               value={guestAnswer} 
                               className="w-full h-24 bg-bg-secondary border border-border-light rounded-xl p-3 text-[8px] font-mono text-text-secondary opacity-70 outline-none" 
                            />
                            <button 
                               onClick={() => navigator.clipboard.writeText(guestAnswer)}
                               className="mt-2 text-[10px] font-bold text-text-info uppercase tracking-widest hover:underline"
                            >
                               Copy Answer Payload
                            </button>
                        </div>
                    )}
                 </div>
             </div>
         )}

      </div>
    </ModuleShell>
  );
}
