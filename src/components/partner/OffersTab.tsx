"use client";

import { useState } from "react";
import { Gift, Sparkles, Clock, CheckCircle2, ChevronRight, Package, Truck, ExternalLink, AlertCircle } from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { Offer } from "@/lib/types";
import { formatINR, formatDate } from "@/lib/utils";
import { ClaimRewardModal } from "./ClaimRewardModal";

export function OffersTab() {
  const { offers, claims, currentPartner } = usePortalStore();

  const [activeSubTab, setActiveSubTab] = useState<"live" | "my_rewards">("live");
  const [selectedOfferForDetail, setSelectedOfferForDetail] = useState<Offer | null>(null);
  const [claimingOffer, setClaimingOffer] = useState<Offer | null>(null);

  if (!currentPartner) return null;

  // Filter claims for current partner
  const partnerClaims = claims.filter((c) => c.partnerId === currentPartner.id);

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Header & Sub Tabs Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Milestone Offers & Exclusive Rewards
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Earn physical Apple gadgets, shopping vouchers, and direct cash bonuses on conversion milestones
          </p>
        </div>

        {/* Tab Pill */}
        <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700">
          <button
            onClick={() => setActiveSubTab("live")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeSubTab === "live"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            Live Offers ({offers.length})
          </button>
          <button
            onClick={() => setActiveSubTab("my_rewards")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeSubTab === "my_rewards"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            <span>Claimed Rewards</span>
            {partnerClaims.length > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-[10px] flex items-center justify-center font-mono">
                {partnerClaims.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {activeSubTab === "live" ? (
        /* Responsive 3-column Desktop Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const isUnlocked = offer.unlocked || (offer.userProgress || 0) >= offer.targetCount;
            const progress = offer.userProgress || 0;
            const target = offer.targetCount;
            const pct = Math.min(100, (progress / target) * 100);

            return (
              <div
                key={offer.id}
                className="apple-card overflow-hidden hover:border-zinc-300 dark:hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  {/* Hero Banner with Badge */}
                  <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                    <img
                      src={offer.heroImage}
                      alt={offer.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1F251D]/90 backdrop-blur-md text-[#D3F37F] text-xs font-bold tracking-wider">
                        {offer.badgeText}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base sm:text-lg font-bold leading-tight">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-zinc-200 mt-0.5">
                        {offer.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Offer Details & Progress */}
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed min-h-[48px]">
                      {offer.description}
                    </p>

                    {/* Progress Box */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-zinc-600 dark:text-zinc-400">
                          Milestone Progress:
                        </span>
                        <span className="text-zinc-900 dark:text-zinc-100 font-mono">
                          {progress} / {target} {offer.targetStatus} referrals
                        </span>
                      </div>

                      <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="bg-gradient-to-r from-[#9CE06F] to-[#D3F37F] h-full rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Ends {formatDate(offer.endAt)}</span>
                        </span>
                        {isUnlocked ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Target Achieved!
                          </span>
                        ) : (
                          <span>{target - progress} more needed</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  {isUnlocked ? (
                    <button
                      onClick={() => setClaimingOffer(offer)}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold text-xs hover:opacity-95 transition active:scale-[0.99] flex items-center justify-center gap-1.5 shadow-md"
                    >
                      <Gift className="w-4 h-4" />
                      <span>Claim {offer.rewardName}</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500 font-bold text-xs cursor-not-allowed flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{target - progress} More Paid Referrals</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedOfferForDetail(offer)}
                    className="py-3 px-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition"
                  >
                    T&Cs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* My Rewards History (Desktop Grid) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerClaims.length === 0 ? (
            <div className="col-span-full apple-card p-12 text-center">
              <Gift className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
              <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">
                No rewards claimed yet
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Complete referral targets above to unlock AirPods, Amazon vouchers, and bonuses.
              </p>
            </div>
          ) : (
            partnerClaims.map((claim) => (
              <div key={claim.id} className="apple-card p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {claim.rewardName}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {claim.offerTitle} · Claimed {formatDate(claim.claimedAt)}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        claim.status === "delivered"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                          : claim.status === "dispatched"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}
                    >
                      {claim.status}
                    </span>
                  </div>

                  {/* Delivery details tracking info */}
                  {claim.trackingNumber && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-zinc-500" />
                        <div>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {claim.courierName || "BlueDart Express"}:
                          </span>{" "}
                          <span className="font-mono text-zinc-600 dark:text-zinc-400">
                            {claim.trackingNumber}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">In Transit</span>
                    </div>
                  )}

                  {claim.voucherCode && (
                    <div className="mt-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px]">VOUCHER CODE</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                          {claim.voucherCode}
                        </span>
                      </div>
                      <button
                        onClick={() => navigator.clipboard.writeText(claim.voucherCode!)}
                        className="px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-xs font-semibold"
                      >
                        Copy
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Claim Reward Modal */}
      <ClaimRewardModal
        isOpen={Boolean(claimingOffer)}
        onClose={() => setClaimingOffer(null)}
        offer={claimingOffer}
      />

      {/* Offer Terms Modal */}
      {selectedOfferForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              {selectedOfferForDetail.title} — Terms & Conditions
            </h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {selectedOfferForDetail.terms}
            </p>
            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
              Valid until: <strong>{formatDate(selectedOfferForDetail.endAt)}</strong>
            </div>
            <button
              onClick={() => setSelectedOfferForDetail(null)}
              className="mt-5 w-full py-3 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 text-xs font-bold"
            >
              Close Terms
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
