"use client";

import { useState } from "react";
import { 
  Wallet, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Download, 
  Filter, 
  Receipt, 
  Building2,
  AlertCircle,
  ShieldCheck
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { formatINR, formatINRWithDecimals, formatDate } from "@/lib/utils";
import { RequestPayoutModal } from "./RequestPayoutModal";
import { EarningType } from "@/lib/types";

export function EarningsTab() {
  const { currentPartner, earnings, payouts, settings } = usePortalStore();

  const [activeLedgerFilter, setActiveLedgerFilter] = useState<string>("all");
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);

  if (!currentPartner) return null;

  const availablePaise = currentPartner.stats.availablePaise;
  const pendingPaise = currentPartner.stats.pendingPaise;
  const paidOutPaise = currentPartner.stats.paidOutPaise;
  const minPayout = settings.minPayoutPaise;

  // Filter earnings for active partner
  const partnerEarnings = earnings.filter((e) => e.partnerId === currentPartner.id);

  const filteredEarnings = partnerEarnings.filter((e) => {
    if (activeLedgerFilter === "all") return true;
    return e.status === activeLedgerFilter || e.type === activeLedgerFilter;
  });

  const partnerPayouts = payouts.filter((p) => p.partnerId === currentPartner.id);

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Title & CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Earnings Ledger & Bank Payouts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            Full audited transaction trail · Section 194H 5% TDS compliant · 30-day hold security
          </p>
        </div>

        <button
          onClick={() => setPayoutModalOpen(true)}
          disabled={availablePaise < minPayout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs sm:text-sm font-bold hover:opacity-95 transition active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          <Wallet className="w-4 h-4" />
          <span>Request Payout ({formatINR(availablePaise)})</span>
        </button>
      </div>

      {/* Balance Cards Summary (Full Desktop Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available */}
        <div className="apple-card p-5 bg-gradient-to-br from-white to-[#F3FDDA] dark:from-zinc-900 dark:to-[#1F251D]/50 border-[#9CE06F]/50 flex flex-col justify-between shadow-sm">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Available to Withdraw
          </span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {formatINR(availablePaise)}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2">
            Instant withdrawal enabled
          </span>
        </div>

        {/* Pending */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Pending Hold Period
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
            {formatINR(pendingPaise)}
          </div>
          <span className="text-xs text-zinc-400 mt-2">
            30-day refund protection
          </span>
        </div>

        {/* Paid Out */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Paid Out
          </span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-800 dark:text-zinc-200 mt-2 font-mono">
            {formatINR(paidOutPaise)}
          </div>
          <span className="text-xs text-zinc-400 mt-2">
            Settled to verified bank account
          </span>
        </div>

        {/* Lifetime Earned */}
        <div className="apple-card p-5 flex flex-col justify-between">
          <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Lifetime Commission
          </span>
          <div className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-100 mt-2 font-mono">
            {formatINR(currentPartner.stats.totalEarnedPaise)}
          </div>
          <span className="text-xs text-zinc-400 mt-2">
            Gross partner earnings
          </span>
        </div>
      </div>

      {/* Main 2-Column Desktop Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Columns: Full Interactive Ledger Table) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-zinc-500" />
              <span>Earnings Ledger</span>
            </h3>

            {/* Filter Chips */}
            <div className="flex gap-1.5 text-xs">
              {["all", "available", "pending", "paid"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveLedgerFilter(f)}
                  className={`px-3 py-1.5 rounded-xl capitalize font-bold transition ${
                    activeLedgerFilter === f
                      ? "bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D]"
                      : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 apple-card overflow-hidden">
            {filteredEarnings.map((earn) => {
              const isReversal = earn.status === "reversed" || earn.type === "reversal";
              return (
                <div key={earn.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-zinc-50/60 dark:hover:bg-zinc-800/40 transition">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {earn.reason}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          earn.status === "available"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400"
                            : earn.status === "pending"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        }`}
                      >
                        {earn.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                      <span>{formatDate(earn.createdAt)}</span>
                      {earn.leadBrandName && (
                        <>
                          <span>•</span>
                          <span className="font-semibold">{earn.leadBrandName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>5% TDS: {formatINR(earn.tdsAmountPaise)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-base font-black font-mono ${
                        isReversal
                          ? "text-rose-600"
                          : "text-zinc-900 dark:text-zinc-100"
                      }`}
                    >
                      {isReversal ? "-" : "+"}{formatINR(earn.netAmountPaise)}
                    </div>
                    <span className="text-[10px] text-zinc-400 block">
                      Net credited
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (5 Columns: Payout Requests History & Bank info) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-zinc-500" />
              <span>Withdrawal Settlements</span>
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              {partnerPayouts.length} total
            </span>
          </div>

          {partnerPayouts.length === 0 ? (
            <div className="apple-card p-8 text-center text-xs text-zinc-400">
              No payout requests submitted yet.
            </div>
          ) : (
            <div className="space-y-3">
              {partnerPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="apple-card p-5 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-zinc-900 dark:text-zinc-100 font-mono">
                          {formatINR(payout.netPayablePaise)}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400">
                          {payout.status}
                        </span>
                      </div>
                      <div className="text-xs text-zinc-500 mt-1">
                        Requested on {formatDate(payout.requestedAt)} • TDS {formatINR(payout.tdsPaise)}
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Downloading Payout Statement PDF for ${payout.id}... (Generated per Section 8)`)}
                      className="px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs flex items-center gap-1.5 font-bold transition"
                      title="Download PDF Statement"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </div>

                  {payout.utr && (
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-zinc-400 text-[10px] block">BANK UTR REFERENCE</span>
                        <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
                          {payout.utr}
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick Verified Payout Destination Card */}
          <div className="apple-card p-5 space-y-3 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Verified Payout Method
            </span>
            {currentPartner.payoutMethods[0] && (
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    {currentPartner.payoutMethods[0].type === "upi" ? "UPI VPA" : "Bank Account"}
                  </div>
                  <div className="text-xs font-mono text-zinc-500 mt-0.5">
                    {currentPartner.payoutMethods[0].upiId || currentPartner.payoutMethods[0].accountNumberMasked}
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-bold">
                  <ShieldCheck className="w-4 h-4" /> Verified
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payout Request Modal */}
      <RequestPayoutModal
        isOpen={payoutModalOpen}
        onClose={() => setPayoutModalOpen(false)}
      />
    </div>
  );
}
