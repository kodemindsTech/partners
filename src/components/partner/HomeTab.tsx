"use client";

import { useState } from "react";
import { 
  Sparkles, 
  ArrowUpRight, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  TrendingUp, 
  Clock, 
  ChevronRight, 
  Gift, 
  MessageSquareShare,
  Award,
  Download,
  ShieldCheck
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { formatINR, formatTimeAgo } from "@/lib/utils";
import { ShareQRModal } from "./ShareQRModal";

interface HomeTabProps {
  onOpenReferModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export function HomeTab({ onOpenReferModal, onNavigateToTab }: HomeTabProps) {
  const { currentPartner, tiers, offers, leads, earnings } = usePortalStore();
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  if (!currentPartner) return null;

  const currentTier = tiers.find((t) => t.id === currentPartner.tierId) || tiers[0];
  const nextTier = tiers.find((t) => t.order === currentTier.order + 1);

  const fullReferralUrl = `https://partners.retner.ai/r/${currentPartner.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullReferralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hey! Check out Retner.ai — the AI WhatsApp growth platform for D2C brands. Use my partner link to get priority onboarding and trial credits: ${fullReferralUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  // Recent 5 activities combining lead status changes and earnings
  const recentActivities = [
    ...leads.slice(0, 3).map((l) => ({
      id: l.id,
      title: `${l.brandName} is now ${l.status.replace("_", " ").toUpperCase()}`,
      time: l.attributedAt,
      type: "lead" as const,
      amount: l.commissionEarnedPaise > 0 ? formatINR(l.commissionEarnedPaise) : null,
    })),
    ...earnings.slice(0, 3).map((e) => ({
      id: e.id,
      title: e.reason,
      time: e.createdAt,
      type: "earning" as const,
      amount: `+${formatINR(e.netAmountPaise)}`,
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Announcements Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1F251D] via-[#2A3327] to-[#1F251D] text-white p-4 px-5 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#9CE06F] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#9CE06F]"></span>
          </span>
          <span className="text-xs sm:text-sm font-medium text-zinc-200">
            Diwali Sprint: Close 2 paid brands before Oct 31 to unlock an extra <strong>₹5,000 cash bonus</strong> directly in your ledger!
          </span>
        </div>
        <button
          onClick={() => onNavigateToTab("offers")}
          className="text-xs font-bold text-[#9CE06F] hover:underline flex items-center gap-1 flex-shrink-0 ml-3 bg-white/10 px-3 py-1.5 rounded-xl transition"
        >
          <span>View Offer</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Greeting & Quick Stats Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
              Welcome back, {currentPartner.name.split(" ")[0]} 👋
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {currentPartner.companyName || "Retner Growth Partner"} · Tracking active campaigns and referred brand conversions
          </p>
        </div>

        {/* Tier Badge */}
        <div 
          onClick={() => onNavigateToTab("profile")}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-bold cursor-pointer hover:bg-amber-500/15 transition shadow-sm"
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>{currentTier.name}</span>
          <span className="text-[11px] opacity-80 font-mono">({currentTier.linkedPlanId === "plan-3" ? "15% Lifetime" : "10% Standard"})</span>
        </div>
      </div>

      {/* Four Earnings Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Earned */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Earned
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {formatINR(currentPartner.stats.totalEarnedPaise)}
          </div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lifetime Commissions</span>
          </div>
        </div>

        {/* Available to Withdraw */}
        <div className="apple-card p-5 bg-gradient-to-br from-white to-[#F3FDDA] dark:from-zinc-900 dark:to-[#1F251D]/60 border-[#9CE06F]/50 flex flex-col justify-between shadow-sm">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Available to Withdraw
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {formatINR(currentPartner.stats.availablePaise)}
          </div>
          <button
            onClick={() => onNavigateToTab("earnings")}
            className="text-xs text-[#1F251D] dark:text-[#9CE06F] font-bold flex items-center gap-1 mt-2 hover:underline"
          >
            <span>Request Payout</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Pending (Hold Period) */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Pending Hold
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
            {formatINR(currentPartner.stats.pendingPaise)}
          </div>
          <div className="text-xs text-zinc-400 flex items-center gap-1 mt-2">
            <Clock className="w-3.5 h-3.5" />
            <span>30-day refund protection lock</span>
          </div>
        </div>

        {/* Paid Out */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <div className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Settled to Bank
          </div>
          <div className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-200 mt-2 font-mono">
            {formatINR(currentPartner.stats.paidOutPaise)}
          </div>
          <div className="text-xs text-zinc-400 mt-2">
            Direct NEFT / UPI settlement
          </div>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 Columns: Referral Card & Live Milestone Offers) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Share Your Link Card */}
          <div className="apple-card p-6 bg-gradient-to-b from-white to-zinc-50 dark:from-[#1C1C1E] dark:to-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9CE06F]/20 text-[#1F251D] dark:text-[#9CE06F] flex items-center justify-center font-bold text-base shadow-sm">
                  🔗
                </div>
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    Your Unique Referral Link
                  </h3>
                  <p className="text-xs text-zinc-500">60-day cookie attribution window · Instant demo booking attribution</p>
                </div>
              </div>
              <button
                onClick={() => setQrOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition text-xs font-semibold"
                title="Show QR Code"
              >
                <QrCode className="w-4 h-4" />
                <span>Show QR</span>
              </button>
            </div>

            {/* Link Bar */}
            <div className="flex items-center justify-between p-3 bg-white dark:bg-zinc-800/90 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-inner">
              <span className="font-mono text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 truncate pr-3 font-semibold">
                {fullReferralUrl}
              </span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] hover:opacity-90 transition active:scale-95 flex-shrink-0 shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied" : "Copy Link"}</span>
              </button>
            </div>

            {/* Actions Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleWhatsAppShare}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20bd5a] transition active:scale-[0.98] shadow-sm"
              >
                <MessageSquareShare className="w-4 h-4" />
                <span>Share Referral on WhatsApp</span>
              </button>

              <button
                onClick={onOpenReferModal}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-bold text-xs sm:text-sm hover:opacity-90 transition active:scale-[0.98]"
              >
                <span>+ Register Brand Manually (90d Lock)</span>
              </button>
            </div>
          </div>

          {/* Live Milestone Offers Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Live Milestone Offers & Gifting
                </h3>
              </div>
              <button
                onClick={() => onNavigateToTab("offers")}
                className="text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 flex items-center gap-1"
              >
                <span>All Offers</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Grid of Offers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {offers.map((offer) => {
                const isUnlocked = offer.unlocked || (offer.userProgress || 0) >= offer.targetCount;
                return (
                  <div
                    key={offer.id}
                    onClick={() => onNavigateToTab("offers")}
                    className="apple-card overflow-hidden cursor-pointer group hover:scale-[1.01] transition-transform flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-36 w-full overflow-hidden bg-zinc-100">
                        <img
                          src={offer.heroImage}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[#D3F37F] text-[10px] font-bold tracking-wider">
                          {offer.badgeText}
                        </div>
                        {isUnlocked && (
                          <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold shadow-md">
                            UNLOCKED
                          </div>
                        )}
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                          {offer.title}
                        </h4>
                        <p className="text-xs text-zinc-500 line-clamp-2">
                          {offer.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] text-zinc-500 font-semibold">
                          <span>Target Progress</span>
                          <span className="font-mono">
                            {offer.userProgress || 0} of {offer.targetCount}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#1F251D] dark:bg-[#9CE06F] h-full rounded-full"
                            style={{
                              width: `${Math.min(100, ((offer.userProgress || 0) / offer.targetCount) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {nextTier && (
            <div className="apple-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-800 dark:text-zinc-200">
                  Tier Upgrade Milestone
                </span>
                <span className="text-zinc-500 font-mono font-semibold">
                  {currentPartner.stats.paidCount} / {nextTier.thresholdValue} referrals
                </span>
              </div>

              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#9CE06F] to-[#D3F37F] h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (currentPartner.stats.paidCount / nextTier.thresholdValue) * 100)}%`,
                  }}
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-700 dark:text-zinc-300">
                <div className="flex items-center gap-1.5 font-bold text-zinc-900 dark:text-zinc-100 mb-1">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Next: {nextTier.name} (20% Lifetime)</span>
                </div>
                <p className="text-[11px] text-zinc-500">
                  {Math.max(0, nextTier.thresholdValue - currentPartner.stats.paidCount)} more paid referral unlocks VIP support and exclusive hardware gifting.
                </p>
              </div>
            </div>
          )}

          {/* Recent Activity Feed */}
          <div className="apple-card p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Recent Activity
            </h3>

            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {recentActivities.length === 0 ? (
                <p className="text-xs text-zinc-400 py-3 text-center">No recent activity yet.</p>
              ) : (
                recentActivities.map((act) => (
                  <div key={act.id} className="py-2.5 flex items-center justify-between first:pt-0 last:pb-0">
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <div className="w-2 h-2 rounded-full bg-[#9CE06F] flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {act.title}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {formatTimeAgo(act.time)}
                        </div>
                      </div>
                    </div>
                    {act.amount && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0 font-mono">
                        {act.amount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Marketing Kit Card */}
          <div className="apple-card p-5 space-y-3 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                Partner Collateral
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">2026 Pitch Kit</span>
            </div>
            <p className="text-xs text-zinc-500">
              Download approved D2C decks, WhatsApp ROI case studies, and brand creatives.
            </p>
            <button
              onClick={() => onNavigateToTab("profile")}
              className="w-full py-2.5 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center justify-center gap-1.5 transition"
            >
              <Download className="w-4 h-4" />
              <span>Browse All Resources</span>
            </button>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <ShareQRModal
        isOpen={qrOpen}
        onClose={() => setQrOpen(false)}
        referralCode={currentPartner.referralCode}
        partnerName={currentPartner.name}
      />
    </div>
  );
}
