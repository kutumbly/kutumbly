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

import { useAppStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Home, Book, CheckSquare, IndianRupee,
  Settings, LogOut, Shield, Heart, Users,
  Utensils, TrendingUp, Calendar, Briefcase, Network, GraduationCap
} from "lucide-react";
import { motion } from "framer-motion";
import HomeModule from "@/components/dashboard/HomeModule";
import DiaryModule from "@/components/dashboard/DiaryModule";
import TasksModule from "@/components/dashboard/TasksModule";
import MoneyModule from "@/components/dashboard/MoneyModule";
import NevataModule from "@/components/dashboard/NevataModule";
import HomeStaffModule from "@/components/dashboard/HomeStaffModule";
import HealthModule from "@/components/dashboard/HealthModule";
import InvestModule from "@/components/dashboard/InvestModule";
import GroceryModule from "@/components/dashboard/GroceryModule";
import SetupModule from "@/components/dashboard/SetupModule";
import NetworkModule from "@/components/dashboard/NetworkModule";
import VidyaModule from "@/components/dashboard/VidyaModule";
import BottomNav from "@/components/dashboard/BottomNav";
import ModuleShell from "@/components/dashboard/ModuleShell";

const ALL_TABS = [
  { id: "home",    labelEn: "Home",      labelHi: "Aangan",    icon: Home },
  { id: "diary",   labelEn: "Diary",     labelHi: "Diary",     icon: Book },
  { id: "tasks",   labelEn: "Tasks",     labelHi: "Kaam",      icon: CheckSquare },
  { id: "money",   labelEn: "Money",     labelHi: "Paisa",     icon: IndianRupee },
  { id: "nevata",  labelEn: "Nevata",    labelHi: "Nevata",    icon: Calendar },
  { id: "health",  labelEn: "Health",    labelHi: "Sehat",     icon: Heart },
  { id: "invest",  labelEn: "Invest",    labelHi: "Nivesh",    icon: TrendingUp },
  { id: "grocery", labelEn: "Grocery",   labelHi: "Kirana",    icon: Utensils },
  { id: "staff",   labelEn: "HomeStaff", labelHi: "Staff",     icon: Briefcase },
  { id: "vidya",   labelEn: "Vidya",     labelHi: "विद्या",    icon: GraduationCap },
  { id: "network", labelEn: "Sync",      labelHi: "Jodna",     icon: Network },
  { id: "setup",   labelEn: "Setup",     labelHi: "Vyavastha", icon: Settings },
];

export default function DashboardPage() {
  const router = useRouter();
  const {
    isUnlocked, activeVault, lockVault,
    lang, setLang,
    hiddenModules, activeModule, setActiveModule,
    theme,
  } = useAppStore();

  useEffect(() => {
    if (!isUnlocked) router.replace("/");
  }, [isUnlocked, router]);

  if (!isUnlocked) return null;

  // Filter hidden modules, always show setup
  const visibleTabs = ALL_TABS.filter(
    (t) => t.id === "setup" || !hiddenModules.includes(t.id)
  );

  const handleLogout = () => {
    lockVault();
    router.replace("/");
  };

  const renderModule = () => {
    switch (activeModule) {
      case "home":    return <HomeModule />;
      case "diary":   return <DiaryModule />;
      case "tasks":   return <TasksModule />;
      case "money":   return <MoneyModule />;
      case "nevata":  return <NevataModule />;
      case "health":  return <HealthModule />;
      case "invest":  return <InvestModule />;
      case "grocery": return <GroceryModule />;
      case "staff":   return <HomeStaffModule />;
      case "vidya":   return <VidyaModule />;
      case "network": return <NetworkModule />;
      case "setup":   return <SetupModule />;
      default:
        return (
          <ModuleShell
            title={ALL_TABS.find(t => t.id === activeModule)?.labelEn || "Module"}
            subtitle="Feature coming in the next update"
          >
            <div className="card aspect-video flex flex-col items-center justify-center border-dashed border-2 border-border-medium bg-bg-secondary/30">
              <Shield className="w-12 h-12 text-border-medium mb-4 opacity-50" />
              <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest">
                Loading...
              </p>
            </div>
          </ModuleShell>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-tertiary">

      {/* ── App Header ─────────────────────────────────────────── */}
      <header className="bg-bg-primary border-b border-border-light px-6 py-3 flex items-center justify-between sticky top-0 z-50 shadow-sm shadow-black/[0.02]">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 md:w-7 md:h-7 bg-bg-primary border border-border-light rounded-xl flex items-center justify-center p-1 shadow-sm">
             <Image src="/favicon.svg" alt="Logo" width={20} height={20} className="brightness-110" />
          </div>
          <div className="flex flex-col md:flex-row md:items-baseline md:gap-2">
            <span className="text-base md:text-lg font-black tracking-tight text-text-primary">Kutumbly</span>
            <div className="flex items-center gap-2">
              <span className="hidden md:block w-px h-3 bg-border-light" />
              <span className="text-[10px] md:text-[11px] font-black text-gold uppercase tracking-[0.2em]">
                {activeVault?.name || "Vault"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Offline badge */}
          <div className="hidden md:flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-text-tertiary">
            <div className="flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-text-success shadow-[0_0_8px_rgba(5,150,105,0.4)]" />
               offline
            </div>
            <span>·</span>
            <div className="flex items-center gap-1.5">
               <Shield size={10} className="opacity-50" />
               AES-256
            </div>
          </div>
          {/* Language display (change in Vyavastha) */}
          <div className="text-[10px] uppercase font-black tracking-[0.2em] text-text-tertiary">
            {lang}
          </div>
          
          <span className="w-px h-4 bg-border-light mx-1" />

          {/* Lock button */}
          <button
            onClick={handleLogout}
            className="text-text-tertiary hover:text-text-danger transition-all active:scale-90"
            title="Lock Vault"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* ── Tab Navigation (Desktop Only) ─────────────────────────── */}
      <nav className="hidden md:flex bg-bg-primary border-b border-border-light sticky top-[57px] z-40 overflow-x-auto scroller-hide items-center px-4">
        {visibleTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeModule === tab.id;
          const label = lang === "en" ? tab.labelEn : tab.labelHi;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveModule(tab.id)}
              className={`flex-shrink-0 px-5 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group ${
                isActive ? "text-gold-text" : "text-text-tertiary hover:text-text-primary"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon size={14} strokeWidth={isActive ? 3 : 2} className="transition-transform group-active:scale-90" />
                <span>{label}</span>
              </div>
              {isActive && (
                <motion.div 
                  layoutId="active-tab-bar"
                  className="absolute bottom-0 left-5 right-5 h-[3px] bg-gold rounded-t-full shadow-[0_-4px_10px_rgba(201,151,28,0.2)]" 
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Main Content ───────────────────────────────────────── */}
      <main className="flex-1 p-4 md:p-6 pb-24 md:pb-8 max-w-5xl mx-auto w-full">
        {activeModule === "home" && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-primary">
              {lang === "en" ? "नमस्ते," : "Namaste,"}{" "}
              {activeVault?.name?.split(" ")[0] || ""}
            </h2>
            <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-widest mt-1">
              {new Date().toLocaleDateString(
                lang === "en" ? "en-IN" : "hi-IN",
                { weekday: "long", day: "numeric", month: "long", year: "numeric" }
              )}
            </p>
          </div>
        )}
        {renderModule()}
      </main>

      {/* ── Mobile Navigation ──────────────────────────────────── */}
      <BottomNav 
        tabs={visibleTabs as any} 
        activeTab={activeModule} 
        onTabChange={setActiveModule} 
        lang={lang} 
      />

      {/* ── Footer (Hide on mobile to prevent clutter) ─────────── */}
      <footer className="hidden md:block py-6 text-center bg-bg-tertiary border-t border-border-light/50">
        <div className="text-[9px] font-black uppercase tracking-[0.4em] text-text-tertiary opacity-40">
          Kutumbly Sovereign OS · Zero Cloud · Bharat
        </div>
      </footer>
    </div>
  );
}
