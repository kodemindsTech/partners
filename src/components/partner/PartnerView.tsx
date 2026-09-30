"use client";

import { useState, useEffect } from "react";
import { 
  Home, 
  Users, 
  Gift, 
  Wallet, 
  User, 
  Plus, 
  Bell, 
  Sparkles, 
  LogOut, 
  Award,
  Sun,
  Moon
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { HomeTab } from "./HomeTab";
import { ReferralsTab } from "./ReferralsTab";
import { OffersTab } from "./OffersTab";
import { EarningsTab } from "./EarningsTab";
import { ProfileTab } from "./ProfileTab";
import { ReferLeadModal } from "./ReferLeadModal";
import { Lead } from "@/lib/types";
import { formatINR } from "@/lib/utils";

interface PartnerViewProps {
  onLogout: () => void;
}

export function PartnerView({ onLogout }: PartnerViewProps) {
  const { currentPartner, tiers } = usePortalStore();

  const [activeTab, setActiveTab] = useState<"home" | "referrals" | "offers" | "earnings" | "profile">("home");
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Default to dark mode or user stored preference
    const saved = localStorage.getItem("retner_theme");
    const prefersDark = saved ? saved === "dark" : true;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("retner_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("retner_theme", "light");
    }
  };

  if (!currentPartner) {
    return null;
  }

  const currentTier = tiers.find((t) => t.id === currentPartner.tierId) || tiers[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLeadAdded = (lead: Lead, isConflict: boolean) => {
    if (isConflict) {
      showToast(`Lead for ${lead.brandName} submitted & routed to conflict queue.`);
    } else {
      showToast(`Lead ${lead.brandName} successfully protected for 90 days!`);
    }
  };

  const navItems = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "referrals", label: "Referred Brands", icon: Users, badge: currentPartner.stats.leadsCount },
    { id: "offers", label: "Milestone Offers", icon: Gift },
    { id: "earnings", label: "Earnings & Payouts", icon: Wallet },
    { id: "profile", label: "Program & Assets", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-[#0B0D0A] text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col">
      {/* Toast Notification Alert */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-zinc-900/90 dark:bg-zinc-800/90 backdrop-blur-md text-white text-xs font-semibold shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 border border-white/10">
          <Sparkles className="w-3.5 h-3.5 text-[#9CE06F]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#121512]/90 backdrop-blur-md px-6 lg:px-10 py-3.5 flex items-center justify-between border-b border-black/5 dark:border-white/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-[#9CE06F] dark:text-[#1F251D] flex items-center justify-center font-black text-base tracking-wider shadow-sm">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-zinc-900 dark:text-zinc-100">
                retner
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9CE06F]/25 text-[#1F251D] dark:text-[#9CE06F] uppercase tracking-wider">
                Partner Portal
              </span>
            </div>
          </div>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Available balance highlight */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-[#1A1E18] border border-zinc-200 dark:border-white/10 text-xs">
            <span className="text-zinc-500 dark:text-zinc-400 font-medium">Available:</span>
            <span className="font-bold text-emerald-600 dark:text-[#9CE06F] font-mono">
              {formatINR(currentPartner.stats.availablePaise)}
            </span>
          </div>

          <button
            onClick={() => setReferModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs font-bold hover:opacity-90 transition active:scale-95 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Refer Brand</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1E18] border border-transparent dark:border-white/10 transition"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* In-app notification bell */}
          <button
            onClick={() => showToast("All system alerts are synced with your WhatsApp & Email")}
            className="relative p-2.5 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#1A1E18] transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#9CE06F]" />
          </button>

          {/* Log Out */}
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 gap-8">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-64 flex-shrink-0 hidden md:flex flex-col justify-between">
          <div className="space-y-6">
            {/* Partner Profile Snapshot Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#151814] border border-zinc-200 dark:border-white/10 space-y-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F251D] to-[#2D3A29] text-[#9CE06F] flex items-center justify-center font-black text-base shadow">
                  {currentPartner.name[0] || "P"}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {currentPartner.name}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {currentPartner.companyName || currentPartner.type.replace("_", " ")}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-zinc-100 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-zinc-500 dark:text-zinc-400 font-medium">Partner Tier:</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {currentTier.name}
                </span>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as typeof activeTab)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition ${
                      isActive
                        ? "bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] shadow-sm"
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-[#1A1E18]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${isActive ? "bg-white/25 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Referral Link Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161A15] to-[#111410] border border-zinc-200 dark:border-white/10 text-white space-y-2.5 shadow-md">
            <span className="text-[10px] uppercase font-mono text-[#9CE06F] font-bold block tracking-wider">
              Referral Slug
            </span>
            <div className="font-mono font-black text-sm tracking-wider bg-black/40 text-zinc-100 px-3 py-1.5 rounded-lg border border-white/5">
              partners.retner.ai/r/{currentPartner.referralCode}
            </div>
            <p className="text-[11px] text-zinc-400 leading-snug">
              Share directly on WhatsApp to attribute new brand signups.
            </p>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 min-w-0">
          {activeTab === "home" && (
            <HomeTab
              onOpenReferModal={() => setReferModalOpen(true)}
              onNavigateToTab={(tab) => setActiveTab(tab as typeof activeTab)}
            />
          )}

          {activeTab === "referrals" && (
            <ReferralsTab onOpenReferModal={() => setReferModalOpen(true)} />
          )}

          {activeTab === "offers" && <OffersTab />}

          {activeTab === "earnings" && <EarningsTab />}

          {activeTab === "profile" && <ProfileTab />}
        </main>
      </div>

      {/* Floating Action Button (Mobile Only) */}
      <div className="md:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setReferModalOpen(true)}
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-xs shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Refer Brand</span>
        </button>
      </div>

      {/* Apple HIG Bottom Tab Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-tabbar">
        <div className="grid grid-cols-5 py-2 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`flex flex-col items-center justify-center py-1 transition-colors ${
                  isActive
                    ? "text-[#1F251D] dark:text-[#9CE06F] font-bold"
                    : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 font-medium"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px]">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Refer Lead Modal */}
      <ReferLeadModal
        isOpen={referModalOpen}
        onClose={() => setReferModalOpen(false)}
        onSuccess={handleLeadAdded}
      />
    </div>
  );
}
