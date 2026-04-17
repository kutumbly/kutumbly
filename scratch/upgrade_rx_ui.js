const fs = require('fs');
let code = fs.readFileSync('components/dashboard/HealthModule.tsx', 'utf8');

// Replace Summary Metric Card
code = code.replace(
  /<MetricCard label=\{t\('HEALTH_MEDS'\)\} value=\{activeMedsCount\} status="default" \/>/g,
  '<MetricCard label="Active Rx" value={activeRxCount} status="default" />'
);

// Drill down medications count
code = code.replace(
  /const memberMeds = medications.filter\(\(med: Medication\) => med.member_id === m.id && !med.end_date\);/g,
  'const memberMeds = prescriptions.filter((med) => med.member_id === m.id && !med.end_date);'
);

// Global Medication List replacement (Overview)
const globalMedsRegex = /\{\/\* Global Medication List \*\/\}.*?\{\/\* Level 2: Member Medical Report Drill Down \*\/\}/s;

const newGlobalRx = `{/* Global Rx List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em]">
               Active Prescriptions
            </div>
          </div>
          
          <div className="space-y-4">
             {prescriptions.filter((m) => !m.end_date).length > 0 ? prescriptions.filter((m) => !m.end_date).map((rx, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={rx.id} 
                  className="bg-bg-primary border border-border-light p-6 rounded-[2rem] flex items-center justify-between group hover:border-gold/30 hover:shadow-xl shadow-black/[0.02] transition-all"
                >
                  <div className="flex gap-5 items-center">
                     <div className="w-14 h-14 rounded-2xl bg-gold/5 text-gold-text flex items-center justify-center border border-gold/10 group-hover:bg-gold-text group-hover:text-white transition-all shadow-sm">
                        <Pill size={28} />
                     </div>
                     <div>
                        <div className="text-base font-black text-text-primary tracking-tight leading-tight">{rx.generic_name} <span className="opacity-40 text-sm">{rx.brand_name && \`(\${rx.brand_name})\`}</span></div>
                        <div className="flex items-center gap-3 mt-2">
                           <span className="text-[10px] text-text-tertiary font-black uppercase tracking-widest bg-bg-tertiary px-2 py-0.5 rounded">
                            {members.find((x) => x.id === rx.member_id)?.name}
                           </span>
                           <span className="text-[10px] text-text-primary font-black uppercase tracking-[0.15em] border border-border-light px-2 rounded bg-white">
                            {rx.schedule_code}
                           </span>
                           <span className="text-[10px] text-gold-text font-black uppercase tracking-[0.15em] opacity-80">
                            {rx.meal_instruction === 'AC' ? 'Khali Pet' : rx.meal_instruction === 'PC' ? 'Khane Ke Baad' : 'Anytime'}
                           </span>
                        </div>
                     </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-2">
                     <button onClick={() => stopPrescription(rx.id)} className="text-[9px] text-danger font-black uppercase bg-danger/5 px-4 py-2 rounded-xl border border-danger/10 hover:bg-danger hover:text-white transition-all">Stop Rx</button>
                  </div>
                </motion.div>
             )) : (
                <div className="bg-bg-primary border border-border-light border-dashed rounded-[3rem] py-24 flex flex-col items-center justify-center opacity-40">
                   <div className="w-20 h-20 bg-bg-tertiary rounded-full flex items-center justify-center mb-6">
                      <Pill size={32} className="text-text-tertiary" strokeWidth={1} />
                   </div>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">{lang === 'hi' ? 'Dawa Khaali Hai' : 'No active Rx'}</p>
                </div>
             )}
           </div>
          </section>
        </motion.div>
        )}

        {/* Level 2: Member Medical Report Drill Down */}`;

code = code.replace(globalMedsRegex, newGlobalRx);


// Member Drill Down M-Management Replacement (Around line 640)
const drillDownMedsRegex = /\{\/\* Medication Management \*\/\}.*?\{\/\* SOS Edit View \*\/\}/s;

const advancedRxDrill = `{/* Rx Prescription Management */}
               <div className="bg-bg-primary border border-border-light rounded-[2.5rem] p-8 shadow-xl shadow-black/[0.02]">
                  <div className="flex items-center justify-between mb-6">
                     <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.3em] flex items-center gap-2">
                        <PillIcon size={16} className="text-gold" /> Active Prescriptions (Rx)
                     </h3>
                     <button 
                        onClick={() => setShowRxForm(true)}
                        className="text-[9px] font-black text-gold-text uppercase tracking-widest hover:underline"
                     >
                        + Add Rx
                     </button>
                  </div>
                  <div className="space-y-3">
                     {prescriptions.filter(m => m.member_id === activeMember.id && !m.end_date).map((rx, i) => (
                        <div key={rx.id} className="flex items-center justify-between p-4 bg-bg-tertiary border border-border-light rounded-2xl group">
                           <div className="flex gap-4 items-center">
                              <div className="w-10 h-10 rounded-xl bg-white border border-border-light flex items-center justify-center text-gold-text shadow-sm">
                                 <Pill size={20} />
                              </div>
                              <div>
                                 <div className="text-sm font-black text-text-primary flex items-center gap-2">
                                    {rx.generic_name} {rx.dosage && <span className="opacity-40 text-xs">{rx.dosage}</span>}
                                 </div>
                                 <div className="flex items-center gap-2 mt-1">
                                    <div className="text-[9px] font-black bg-white border border-border-light px-1.5 rounded">{rx.schedule_code}</div>
                                    <div className="text-[8px] font-black text-text-tertiary uppercase tracking-[0.1em]">{rx.meal_instruction === 'AC' ? 'Khali Pet' : rx.meal_instruction === 'PC' ? 'Khane Ke Baad' : rx.meal_instruction}</div>
                                    <div className="text-[8px] font-bold text-text-tertiary opacity-50 ml-2">by Dr. {rx.doctor_name || 'General'}</div>
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <button onClick={() => stopPrescription(rx.id)} className="text-[9px] text-danger font-black uppercase bg-white border border-border-light px-3 py-1.5 rounded-lg hover:bg-danger hover:text-white transition-all">Stop</button>
                              <button onClick={() => deletePrescription(rx.id)} className="opacity-0 group-hover:opacity-100 p-2 text-text-tertiary"><Trash2 size={14}/></button>
                           </div>
                        </div>
                     ))}
                     {prescriptions.filter(m => m.member_id === activeMember.id && !m.end_date).length === 0 && (
                        <div className="text-center py-8 text-[10px] font-black text-text-tertiary uppercase tracking-widest opacity-50">
                           No active Rx
                        </div>
                     )}
                  </div>
               </div>
             </div>
          </div>
        </motion.div>
        )}

        {/* SOS Edit View */}`;

code = code.replace(drillDownMedsRegex, advancedRxDrill);

// Inject Sliding Modal for Add Rx right before closing </AnimatePresence>
const rxModalBlock = `
        {/* Sliding Rx Form Modal */}
        {showRxForm && activeMember && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          >
             <div className="bg-bg-primary w-full max-w-xl rounded-[2.5rem] p-8 shadow-2xl border border-border-light relative overflow-hidden">
                <div className="flex justify-between items-center mb-8">
                   <div>
                     <h2 className="text-xl font-black text-text-primary tracking-tight">New Prescription</h2>
                     <p className="text-[10px] font-black text-gold-text uppercase tracking-widest mt-1">NMC Standard Format</p>
                   </div>
                   <button onClick={() => setShowRxForm(false)} className="w-10 h-10 rounded-full bg-bg-tertiary flex items-center justify-center text-text-tertiary hover:text-danger"><X size={18}/></button>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Doctor / Hospital</label>
                        <input value={rxDoc} onChange={e=>setRxDoc(e.target.value)} type="text" placeholder="Dr. Sharma / Apollo" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Medicine Type</label>
                        <select value={rxType} onChange={e=>setRxType(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold appearance-none">
                           <option value="Tablet">Tablet / Capsule</option>
                           <option value="Syrup">Syrup / Liquid</option>
                           <option value="Injection">Injection</option>
                           <option value="Ointment">Ointment / Drops</option>
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-danger uppercase tracking-widest pl-1">Generic Name (Required)</label>
                        <input value={rxGen} onChange={e=>setRxGen(e.target.value)} type="text" placeholder="e.g. Paracetamol" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold uppercase outline-none focus:border-gold" />
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Brand Name (Optional)</label>
                        <input value={rxBrand} onChange={e=>setRxBrand(e.target.value)} type="text" placeholder="e.g. Dolo 650" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold uppercase outline-none focus:border-gold" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Schedule</label>
                        <select value={rxSch} onChange={e=>setRxSch(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-black outline-none focus:border-gold appearance-none">
                           <option value="1-0-1">1-0-1</option>
                           <option value="1-1-1">1-1-1</option>
                           <option value="1-0-0">1-0-0</option>
                           <option value="0-0-1">0-0-1</option>
                           <option value="SOS">SOS (As needed)</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Meal Timing</label>
                        <select value={rxMeal} onChange={e=>setRxMeal(e.target.value)} className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-black outline-none focus:border-gold appearance-none">
                           <option value="PC">PC - Khane Ke Baad</option>
                           <option value="AC">AC - Khali Pet</option>
                           <option value="ANY">Anytime</option>
                        </select>
                     </div>
                     <div className="flex flex-col gap-2">
                        <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Dosage</label>
                        <input value={rxDose} onChange={e=>setRxDose(e.target.value)} type="text" placeholder="500mg" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                     </div>
                  </div>

                  <div className="flex flex-col gap-2">
                     <label className="text-[9px] font-black text-text-tertiary uppercase tracking-widest pl-1">Purpose / Notes</label>
                     <input value={rxPurp} onChange={e=>setRxPurp(e.target.value)} type="text" placeholder="Fever / Body Ache" className="w-full bg-bg-tertiary p-4 rounded-xl border border-border-light text-sm font-bold outline-none focus:border-gold" />
                  </div>

                  <button 
                     disabled={!rxGen}
                     onClick={() => {
                        addPrescription(activeMember.id, rxDoc, rxGen, rxBrand, rxType, rxDose, rxSch, rxMeal, rxPurp);
                        setShowRxForm(false);
                        setRxGen(''); setRxBrand(''); setRxPurp('');
                     }}
                     className="w-full mt-4 bg-gold-text disabled:opacity-50 hover:bg-gold text-white font-black uppercase tracking-[0.2em] h-14 rounded-xl shadow-lg flex items-center justify-center gap-2"
                  >
                     <ShieldCheck size={18} /> Confirm Prescription
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>`;

code = code.replace(/<\/AnimatePresence>/, rxModalBlock);

fs.writeFileSync('components/dashboard/HealthModule.tsx', code);
console.log('Rx UI upgraded!');
