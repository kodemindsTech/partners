"use client";

import { useState } from "react";
import { 
  User, 
  ShieldCheck, 
  Award, 
  FileText, 
  Download, 
  HelpCircle, 
  Bell, 
  Check, 
  ExternalLink, 
  Building2, 
  CreditCard,
  LogOut,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { usePortalStore } from "@/lib/store";

export function ProfileTab() {
  const { currentPartner, tiers, commissionPlans } = usePortalStore();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  if (!currentPartner) return null;

  const currentTier = tiers.find((t) => t.id === currentPartner.tierId) || tiers[0];
  const linkedPlan = commissionPlans.find((p) => p.id === currentTier.linkedPlanId) || commissionPlans[0];

  const [whatsappNotifs, setWhatsappNotifs] = useState(currentPartner.notificationPrefs?.whatsapp ?? true);
  const [emailNotifs, setEmailNotifs] = useState(currentPartner.notificationPrefs?.email ?? true);

  const faqs = [
    {
      q: "When are commissions moved from Pending to Available?",
      a: "Commissions are held for 30 days from the brand's payment date. Once the 30-day refund window elapses and the brand is active, the balance moves automatically to Available for instant withdrawal.",
    },
    {
      q: "How does the 90-day lead protection work?",
      a: "When you submit a brand lead manually or via your link, that domain is locked to your partner account for 90 days. Any inquiries from that brand will be attributed solely to you.",
    },
    {
      q: "What TDS is deducted from payouts?",
      a: "As per Indian Income Tax regulations (Section 194H), TDS is deducted at 5% for PAN verified partners. You can claim this credit in your annual ITR using the Form 16A statements.",
    },
    {
      q: "Can I refer brands outside India?",
      a: "Retner supports global brands on Shopify; payouts in Phase 1 are disbursed in INR to Indian bank accounts / UPI.",
    },
  ];

  const resources = [
    { title: "Retner D2C Pitch Deck (2026)", format: "PDF", size: "14.2 MB", desc: "Complete platform walkthrough and value proposition" },
    { title: "Agency Partner One-Pager & Battlecard", format: "PDF", size: "2.4 MB", desc: "Key competitive differentiation & WhatsApp ROI metrics" },
    { title: "WhatsApp ROI & Cart Recovery Case Studies", format: "PDF", size: "8.1 MB", desc: "Real brand case studies with 30%+ recovery rates" },
    { title: "Social Creatives & Brand Media Kit", format: "ZIP", size: "38.5 MB", desc: "High-res banners, logos, and customizable WhatsApp graphics" },
  ];

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Header Card */}
      <div className="apple-card p-6 sm:p-8 bg-gradient-to-r from-white via-zinc-50 to-[#F3FDDA]/40 dark:from-[#161A15] dark:via-[#151814] dark:to-[#1A2317] border border-zinc-200 dark:border-white/10 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#1F251D] to-[#2E3B2A] text-white flex items-center justify-center font-black text-3xl shadow-xl border-2 border-white/30">
              {currentPartner.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {currentPartner.name}
                </h2>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> KYC Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                {currentPartner.companyName} · {currentPartner.email} · {currentPartner.phone}
              </p>
              <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-1.5">
                PAN: <strong className="text-zinc-700 dark:text-zinc-300">{currentPartner.kyc.pan}</strong> · Partner Referral Code: <strong className="text-zinc-900 dark:text-zinc-100">{currentPartner.referralCode}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-4 rounded-2xl bg-white dark:bg-[#1A1E18] border border-zinc-200 dark:border-white/10 text-right">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block">CURRENT TIER</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 flex items-center justify-end gap-1 mt-0.5">
                <Award className="w-4 h-4" /> {currentTier.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Columns: Commission Plan & Tiers Matrix & Resources) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Commission Plan Breakdown */}
          <div className="apple-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Active Commission Structure
                </h3>
              </div>
              <span className="text-xs font-black text-[#1F251D] dark:text-[#9CE06F] bg-[#9CE06F]/20 px-3 py-1 rounded-full uppercase">
                {linkedPlan.type === "recurring_lifetime" ? "15% Lifetime Recurring" : "20% Growth Plan"}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 text-xs sm:text-sm space-y-2">
              <div className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                {linkedPlan.name}
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {linkedPlan.description}
              </p>
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-white/10 text-xs text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-[#9CE06F] flex-shrink-0" />
                <span><strong>Worked Example:</strong> {linkedPlan.workedExample}</span>
              </div>
            </div>
          </div>

          {/* Tiers & Benefits Matrix (3 Columns Across Desktop) */}
          <div className="apple-card p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Partner Tiers & Progression Benefits
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {tiers.map((t) => {
                const isCurrent = t.id === currentTier.id;
                return (
                  <div
                    key={t.id}
                    className={`p-5 rounded-2xl border text-xs flex flex-col justify-between transition ${
                      isCurrent
                        ? "border-[#1F251D] dark:border-[#9CE06F] bg-zinc-50 dark:bg-[#1A2016] shadow-md ring-2 ring-[#9CE06F]/30"
                        : "border-zinc-200 dark:border-white/10 opacity-75"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                          {t.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D]">
                            Current Tier
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold mb-3">
                        {t.thresholdValue === 0 ? "Entry Tier" : `${t.thresholdValue}+ Paid Referrals`}
                      </div>
                      <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
                        {t.perks.map((p, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                            <span>{p}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marketing Resources Kit (2x2 Grid) */}
          <div className="apple-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Download className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                <span>Approved Partner Collateral & Pitch Assets</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {resources.map((res, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 flex items-center justify-between hover:bg-zinc-100 dark:hover:bg-[#1A1E18] transition cursor-pointer"
                  onClick={() => alert(`Downloading "${res.title}"...`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center">
                      {res.format}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {res.title}
                      </div>
                      <div className="text-[11px] text-zinc-400 dark:text-zinc-500">{res.desc} · {res.size}</div>
                    </div>
                  </div>
                  <Download className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 Columns: Notifications & FAQs) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notification Preferences */}
          <div className="apple-card p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <span>Notification Preferences</span>
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-white/5 text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200">
                    WhatsApp Instant Alerts
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Lead status changes, offer unlocks, and payout UTRs
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={whatsappNotifs}
                  onChange={(e) => setWhatsappNotifs(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#9CE06F] text-[#1F251D] focus:ring-[#9CE06F]"
                />
              </div>

              <div className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-zinc-800 dark:text-zinc-200">
                    Email Digests & Statements
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Monthly earnings summaries and platform announcements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="h-4 w-4 rounded accent-[#9CE06F] text-[#1F251D] focus:ring-[#9CE06F]"
                />
              </div>
            </div>
          </div>

          {/* Frequently Asked Questions Accordion */}
          <div className="apple-card p-6 space-y-4">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
              <span>Partner FAQs</span>
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-white/5">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-3">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full text-left flex items-center justify-between text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-white"
                  >
                    <span>{faq.q}</span>
                    <ChevronRight
                      className={`w-4 h-4 text-zinc-400 transition-transform ${
                        activeFaq === idx ? "rotate-90 text-[#9CE06F]" : ""
                      }`}
                    />
                  </button>
                  {activeFaq === idx && (
                    <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
