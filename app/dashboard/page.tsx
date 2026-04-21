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

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect } from "react";
import {
  Home, Book, CheckSquare, IndianRupee,
  Settings, Shield, Heart,
  Utensils, TrendingUp, Calendar, Briefcase, Network, GraduationCap, Cloud, Milk, Flame, LogOut, Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation, Language } from "@/lib/i18n";
import HomeModule from "@/components/dashboard/HomeModule";
import DiaryModule from "@/components/dashboard/DiaryModule";
import TasksModule from "@/components/dashboard/TasksModule";
import CashModule from "@/components/dashboard/CashModule";
import UtsavModule from "@/components/dashboard/UtsavModule";
import SewakModule from "@/components/dashboard/SewakModule";
import HealthModule from "@/components/dashboard/HealthModule";
import InvestModule from "@/components/dashboard/InvestModule";
import SamanModule from "@/components/dashboard/SamanModule";
import SetupModule from "@/components/dashboard/SetupModule";
import NetworkModule from "@/components/dashboard/NetworkModule";
import CloudSyncriptModule from "@/components/dashboard/CloudSyncriptModule";
import VidyaModule from "@/components/dashboard/VidyaModule";
import SuvidhaModule from "@/components/dashboard/SuvidhaModule";
import SanskritiModule from "@/components/dashboard/SanskritiModule";
import BottomNav from "@/components/dashboard/BottomNav";
import ModuleShell from "@/components/dashboard/ModuleShell";
import LabelsModule from "@/components/dashboard/LabelsModule";

const ALL_TABS = [
  { id: "home",      icon: Home },
  { id: "diary",     icon: Book },
  { id: "tasks",     icon: CheckSquare },
  { id: "cash",      icon: IndianRupee },
  { id: "suvidha",   icon: Milk },
  { id: "utsav",     icon: Calendar },
  { id: "health",    icon: Heart },
  { id: "invest",    icon: TrendingUp },
  { id: "saman",     icon: Utensils },
  { id: "sewak",     icon: Briefcase },
  { id: "vidya",     icon: GraduationCap },
  { id: "sanskriti", icon: Flame },
  { id: "sync",      icon: Cloud },
  { id: "network",   icon: Network },
  { id: "labels",    icon: Tag },
  { id: "setup",     icon: Settings },
];

export default function DashboardPage() {
  const router = useRouter();
  const {
    isUnlocked, activeVault, lockVault,
    lang, mode, setMode,
    hiddenModules, activeModule, setActiveModule,
  } = useAppStore();
  const t = useTranslation(lang as Language);

  useEffect(() => {
    if (!isUnlocked) router.replace("/os");
  }, [isUnlocked, router]);

  if (!isUnlocked) return null;

  const visibleTabs = ALL_TABS.filter(
    (tab) => tab.id === "setup" || !hiddenModules.includes(tab.id)
  );

  const handleLogout = () => {
    lockVault();
    router.replace("/os");
  };

  // Robust label fallback — never show raw key strings
  const getTabLabel = (id: string) => {
    const key = `NAV_${id.toUpperCase()}`;
    const translated = t(key);
    // If translation returns the raw key (no match), use title-cased id
    if (translated === key) {
      return id.charAt(0).toUpperCase() + id.slice(1);
    }
    return translated;
  };

  const renderModule = () => {
    switch (activeModule) {
      case "home":       return <HomeModule />;
      case "diary":      return <DiaryModule />;
      case "tasks":      return <TasksModule />;
      case "cash":       return <CashModule />;
      case "utsav":      return <UtsavModule />;
      case "health":     return <HealthModule />;
      case "invest":     return <InvestModule />;
      case "saman":      return <SamanModule />;
      case "sewak":      return <SewakModule />;
      case "vidya":      return <VidyaModule />;
      case "suvidha":    return <SuvidhaModule />;
      case "sanskriti":  return <SanskritiModule />;
      case "sync":       return <CloudSyncriptModule />;
      case "network":    return <NetworkModule />;
      case "labels":     return <LabelsModule />;
      case "setup":      return <SetupModule />;
      default:
        return (
          <ModuleShell
            title={getTabLabel(activeModule)}
            subtitle={t('COMING_SOON')}
          >
            <div className="card aspect-video flex flex-col items-center justify-center border-dashed border-2 border-border-medium bg-bg-secondary/30">
              <Shield className="w-12 h-12 text-border-medium mb-4 opacity-50" />
              <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest">
                {t('LOADING')}
              </p>
            </div>
          </ModuleShell>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-tertiary">

      {/* ── App Header ──────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 pt-safe">
        <div className="bg-bg-primary/95 backdrop-blur-xl border-b border-border-light/60 px-4 md:px-6 py-3 flex items-center justify-between shadow-[0_1px_12px_rgba(0,0,0,0.05)]">
          {/* Logo + Vault Name */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-bg-primary border border-border-light rounded-[10px] flex items-center justify-center p-1.5 shadow-sm shadow-black/[0.06]">
              <Image src="/favicon.svg" alt="Kutumbly" width={20} height={20} className="brightness-110" style={{ height: 'auto' }} />
            </div>
            <div className="flex flex-col">
              <span className="text-[14px] font-black tracking-tight text-text-primary leading-none">Kutumbly</span>
              {activeVault?.name && (
                <span className="text-[10px] font-black text-gold uppercase tracking-[0.18em] leading-none mt-0.5 truncate max-w-[140px]">
                  {activeVault.name}
                </span>
              )}
            </div>
          </div>

          {/* Right: Status + Lang + Lock */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Offline Badge — always visible */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-bg-secondary border border-border-light">
              <span className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_6px_rgba(5,150,105,0.5)] animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary hidden sm:block">
                {t('OFFLINE')}
              </span>
            </div>

            {/* AES badge — desktop only */}
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary">
              <Shield size={9} className="opacity-40" />
              {t('AES_256')}
            </div>

            <span className="w-px h-4 bg-border-light hidden sm:block" />

            {/* Mode Toggle */}
            <div className="hidden sm:flex items-center bg-bg-secondary border border-border-light rounded-full p-0.5 gap-0.5">
              {(['basic', 'advanced'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] transition-all ${
                    mode === m
                      ? m === 'advanced'
                        ? 'bg-gold-text text-white shadow-sm'
                        : 'bg-text-primary text-bg-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-primary'
                  }`}
                >
                  {m === 'basic' ? t('MODE_BASIC') || 'Basic' : t('MODE_ADVANCED') || 'Advanced'}
                </button>
              ))}
            </div>

            {/* Language chip */}
            <div className="text-[9px] uppercase font-black tracking-[0.2em] text-text-tertiary bg-bg-secondary border border-border-light px-2 py-1 rounded-lg">
              {lang}
            </div>

            {/* Lock button */}
            <button
              onClick={handleLogout}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-text-tertiary hover:text-text-danger hover:bg-bg-danger/30 transition-all active:scale-90"
              title="Lock Vault"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* ── Tab Navigation (Desktop) ──────────────────────────── */}
        <nav className="hidden md:flex bg-bg-primary/90 backdrop-blur-xl border-b border-border-light/60 overflow-x-auto scroller-hide items-center px-3 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeModule === tab.id;
            const label = getTabLabel(tab.id);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveModule(tab.id)}
                className={`flex-shrink-0 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.18em] transition-all relative group flex items-center gap-2 ${
                  isActive ? "text-gold" : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                <Icon
                  size={13}
                  strokeWidth={isActive ? 2.8 : 2}
                  className={`transition-all ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}
                />
                <span>{label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-tab-bar"
                    className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-gradient-to-r from-gold/70 via-gold to-gold/70 rounded-t-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {/* ── Main Content ────────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-6 pb-nav-safe md:pb-10 max-w-5xl mx-auto w-full overscroll-contain">
        {/* Home Greeting Banner */}
        {activeModule === "home" && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 md:mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
              {t('GREETING')}{" "}{activeVault?.name?.split(" ")[0] || ""}
            </h2>
            <p className="text-[11px] font-black text-text-tertiary uppercase tracking-[0.25em] mt-1.5 opacity-70">
              {new Date().toLocaleDateString(
                ({ en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', gu: 'gu-IN', pa: 'pa-IN', ta: 'ta-IN', bho: 'hi-IN', kn: 'kn-IN', te: 'te-IN', ne: 'ne-NP', bn: 'bn-IN', mni: 'en-IN' } as Record<string, string>)[lang] ?? 'en-IN',
                { weekday: "long", day: "numeric", month: "long", year: "numeric" }
              )}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeModule}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {renderModule()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Mobile Navigation ─────────────────────────────────── */}
      <BottomNav
        tabs={visibleTabs as any}
        activeTab={activeModule}
        onTabChange={setActiveModule}
        lang={lang}
      />

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="hidden md:block py-4 text-center bg-bg-tertiary border-t border-border-light/40">
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-text-tertiary opacity-30">
          Kutumbly Sovereign OS · Zero Cloud · Bharat
        </div>
      </footer>
    </div>
  );
}
