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

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, RotateCcw, Edit3, Check, X,
  Tag, AlertTriangle, ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { DICTIONARY, Language } from '@/lib/i18n';
import ModuleShell from './ModuleShell';

/* ── Derive categories from key prefixes ─────────────────────── */
const CATEGORY_MAP: Record<string, string> = {
  'NAV_':        '🧭 Navigation',
  'nav.':        '🧭 Navigation',
  'landing.':    '🏠 Landing Page',
  'common.':     '⚙️ Common',
  'CASH':        '💰 Cash Hub',
  'HEALTH':      '❤️ Health Hub',
  'SUVIDHA':     '🏠 Suvidha Hub',
  'SAMAN':       '📦 Saman Hub',
  'INVEST':      '📈 Invest Hub',
  'UTSAV':       '🎊 Utsav Hub',
  'SEWAK':       '👷 Sewak Hub',
  'VIDYA':       '📚 Vidya Hub',
  'DIARY':       '📓 Diary Hub',
  'TASK':        '✅ Tasks Hub',
  'FAMILY':      '👨‍👩‍👧 Family',
  'SANSKRITI':   '🎭 Sanskriti',
  'SOVEREIGN':   '🛡️ Sovereign',
  'GATEWAY':     '🔐 Gateway',
  'SETUP':       '⚙️ Setup',
  'legal.':      '⚖️ Legal',
};

function getCategory(key: string): string {
  for (const [prefix, label] of Object.entries(CATEGORY_MAP)) {
    if (key.startsWith(prefix)) return label;
  }
  return '🔤 Other';
}

export default function LabelsModule() {
  const { lang, customLabels, setCustomLabel, resetCustomLabel, resetAllLabels } = useAppStore();
  const activeLang = lang as Language;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showOnlyOverrides, setShowOnlyOverrides] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['all']));

  /* ── Derived data ──────────────────────────────────────────── */
  const allKeys = useMemo(() => Object.keys(DICTIONARY), []);

  const categories = useMemo(() => {
    const cats = new Set<string>();
    allKeys.forEach(k => cats.add(getCategory(k)));
    return ['all', ...Array.from(cats).sort()];
  }, [allKeys]);

  const overrideCount = useMemo(
    () => Object.keys(customLabels).filter(k => k.startsWith(`${activeLang}:`)).length,
    [customLabels, activeLang]
  );

  const filteredKeys = useMemo(() => {
    let keys = allKeys;

    if (showOnlyOverrides) {
      keys = keys.filter(k => customLabels[`${activeLang}:${k}`] !== undefined);
    }

    if (selectedCategory !== 'all') {
      keys = keys.filter(k => getCategory(k) === selectedCategory);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      keys = keys.filter(k => {
        const entry = DICTIONARY[k];
        return (
          k.toLowerCase().includes(q) ||
          entry?.en?.toLowerCase().includes(q) ||
          entry?.[activeLang]?.toLowerCase().includes(q)
        );
      });
    }

    return keys.slice(0, 300); // safety cap
  }, [allKeys, search, selectedCategory, showOnlyOverrides, customLabels, activeLang]);

  /* ── Helpers ───────────────────────────────────────────────── */
  const getEffectiveValue = (key: string) =>
    customLabels[`${activeLang}:${key}`] ?? DICTIONARY[key]?.[activeLang] ?? DICTIONARY[key]?.en ?? key;

  const getDictValue = (key: string) =>
    DICTIONARY[key]?.[activeLang] ?? DICTIONARY[key]?.en ?? key;

  const isOverridden = (key: string) =>
    customLabels[`${activeLang}:${key}`] !== undefined;

  const startEdit = (key: string) => {
    setEditingKey(key);
    setEditValue(getEffectiveValue(key));
  };

  const saveEdit = () => {
    if (!editingKey) return;
    if (editValue.trim() === '' || editValue === getDictValue(editingKey)) {
      resetCustomLabel(activeLang, editingKey);
    } else {
      setCustomLabel(activeLang, editingKey, editValue.trim());
    }
    setEditingKey(null);
  };

  const cancelEdit = () => {
    setEditingKey(null);
    setEditValue('');
  };

  /* ── Grouped render ────────────────────────────────────────── */
  const groupedKeys = useMemo(() => {
    const groups: Record<string, string[]> = {};
    filteredKeys.forEach(k => {
      const cat = getCategory(k);
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(k);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredKeys]);

  return (
    <ModuleShell
      title="Label Manager"
      subtitle={`${allKeys.length} labels · ${overrideCount} custom override${overrideCount !== 1 ? 's' : ''}`}
    >
      {/* ── Top Controls ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary opacity-50" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by key or text…"
            className="w-full pl-10 pr-4 py-3 bg-bg-primary border border-border-light rounded-2xl text-sm font-medium text-text-primary placeholder-text-tertiary/50 outline-none focus:border-gold transition-all"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 bg-bg-primary border border-border-light rounded-2xl text-sm font-black text-text-primary outline-none focus:border-gold transition-all cursor-pointer"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'all' ? '📋 All Categories' : c}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none" />
        </div>

        {/* Overrides toggle */}
        <button
          onClick={() => setShowOnlyOverrides(v => !v)}
          className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
            showOnlyOverrides
              ? 'bg-gold text-white border-gold shadow-lg shadow-gold/30'
              : 'bg-bg-primary text-text-tertiary border-border-light hover:border-gold/40'
          }`}
        >
          {showOnlyOverrides ? `✓ ${overrideCount} Overrides` : 'Show Overrides'}
        </button>

        {/* Reset all */}
        {overrideCount > 0 && (
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setShowResetConfirm(true)}
            className="px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-500/30 text-red-500 bg-red-500/5 hover:bg-red-500 hover:text-white transition-all whitespace-nowrap"
          >
            Reset All
          </motion.button>
        )}
      </div>

      {/* ── Stats bar ──────────────────────────────────────────── */}
      <div className="flex items-center gap-4 px-2 text-[10px] font-black uppercase tracking-widest text-text-tertiary">
        <span>{filteredKeys.length} of {allKeys.length} labels</span>
        {overrideCount > 0 && (
          <span className="text-gold">{overrideCount} customized</span>
        )}
        <span className="ml-auto opacity-50">Language: {activeLang.toUpperCase()}</span>
      </div>

      {/* ── Reset confirm dialog ───────────────────────────────── */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-red-500/10 border border-red-500/30 rounded-[2rem] p-6 flex items-center gap-6"
          >
            <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-black text-text-primary">Reset all {overrideCount} custom labels?</p>
              <p className="text-xs text-text-tertiary mt-1">All overrides for <strong>{activeLang.toUpperCase()}</strong> will revert to default values.</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 rounded-xl border border-border-light text-[10px] font-black uppercase tracking-widest text-text-tertiary hover:border-gold/40 transition-all">Cancel</button>
              <button
                onClick={() => { resetAllLabels(); setShowResetConfirm(false); }}
                className="px-4 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all"
              >
                Reset All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Label groups ───────────────────────────────────────── */}
      <div className="space-y-4">
        {groupedKeys.length === 0 ? (
          <div className="text-center py-20 text-[10px] font-black uppercase tracking-widest text-text-tertiary opacity-40">
            No labels match your search
          </div>
        ) : (
          groupedKeys.map(([category, keys]) => {
            const isExpanded = expandedCategories.has(category) || search.trim() !== '';
            return (
              <div key={category} className="bg-bg-primary border border-border-light rounded-[2rem] overflow-hidden">
                {/* Category header */}
                <button
                  onClick={() => {
                    setExpandedCategories(prev => {
                      const next = new Set(prev);
                      if (next.has(category)) next.delete(category);
                      else next.add(category);
                      return next;
                    });
                  }}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-bg-tertiary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-text-primary uppercase tracking-widest">{category}</span>
                    <span className="text-[9px] font-black text-text-tertiary bg-bg-tertiary px-2 py-0.5 rounded-full border border-border-light">
                      {keys.length} {keys.filter(k => isOverridden(k)).length > 0 && `· ${keys.filter(k => isOverridden(k)).length} custom`}
                    </span>
                  </div>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown size={16} className="text-text-tertiary" />
                  </motion.div>
                </button>

                {/* Rows */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border-light/40"
                    >
                      {keys.map((key, idx) => (
                        <LabelRow
                          key={key}
                          dictKey={key}
                          isLast={idx === keys.length - 1}
                          isOverridden={isOverridden(key)}
                          effectiveValue={getEffectiveValue(key)}
                          dictValue={getDictValue(key)}
                          isEditing={editingKey === key}
                          editValue={editValue}
                          onEditChange={setEditValue}
                          onStartEdit={() => startEdit(key)}
                          onSave={saveEdit}
                          onCancel={cancelEdit}
                          onReset={() => resetCustomLabel(activeLang, key)}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </ModuleShell>
  );
}

/* ── Label Row ─────────────────────────────────────────────────── */
interface LabelRowProps {
  dictKey: string;
  isLast: boolean;
  isOverridden: boolean;
  effectiveValue: string;
  dictValue: string;
  isEditing: boolean;
  editValue: string;
  onEditChange: (v: string) => void;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onReset: () => void;
}

function LabelRow({
  dictKey, isLast, isOverridden, effectiveValue, dictValue,
  isEditing, editValue, onEditChange, onStartEdit, onSave, onCancel, onReset,
}: LabelRowProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isEditing) inputRef.current?.focus();
  }, [isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSave();
    if (e.key === 'Escape') onCancel();
  };

  return (
    <motion.div
      layout
      className={`flex items-center gap-4 px-6 py-4 group hover:bg-bg-tertiary/50 transition-colors ${!isLast ? 'border-b border-border-light/30' : ''}`}
    >
      {/* Override indicator */}
      <div className="flex-shrink-0 w-1.5">
        {isOverridden && (
          <div className="w-1.5 h-1.5 rounded-full bg-gold" title="Customized" />
        )}
      </div>

      {/* Key */}
      <div className="flex-shrink-0 w-48 md:w-64">
        <div className="flex items-center gap-1.5">
          <Tag size={10} className="text-text-tertiary opacity-40 flex-shrink-0" />
          <code className="text-[10px] font-mono text-text-tertiary truncate">{dictKey}</code>
        </div>
      </div>

      {/* Value — edit or display */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => onEditChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={dictValue}
            className="w-full bg-bg-tertiary border border-gold rounded-xl px-4 py-2 text-sm font-medium text-text-primary outline-none transition-all"
          />
        ) : (
          <div className="space-y-0.5">
            <p className={`text-sm font-medium truncate ${isOverridden ? 'text-gold-text' : 'text-text-primary'}`}>
              {effectiveValue}
            </p>
            {isOverridden && (
              <p className="text-[10px] text-text-tertiary opacity-50 truncate">
                Default: {dictValue}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex items-center gap-1">
        {isEditing ? (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onSave}
              className="w-8 h-8 rounded-lg bg-gold text-white flex items-center justify-center hover:bg-gold/90 transition-colors shadow-md shadow-gold/30"
            >
              <Check size={14} strokeWidth={3} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCancel}
              className="w-8 h-8 rounded-lg border border-border-light text-text-tertiary flex items-center justify-center hover:text-text-primary transition-colors"
            >
              <X size={14} />
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onStartEdit}
              className="w-8 h-8 rounded-lg border border-border-light text-text-tertiary flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-gold hover:border-gold/40 transition-all"
            >
              <Edit3 size={13} />
            </motion.button>
            {isOverridden && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onReset}
                className="w-8 h-8 rounded-lg border border-border-light text-text-tertiary flex items-center justify-center opacity-0 group-hover:opacity-100 hover:text-red-500 hover:border-red-400/40 transition-all"
                title="Reset to default"
              >
                <RotateCcw size={12} />
              </motion.button>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
