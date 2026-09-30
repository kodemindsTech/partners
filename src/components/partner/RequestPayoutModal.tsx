"use client";

import { useState } from "react";
import { X, Wallet, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { formatINR, formatINRWithDecimals } from "@/lib/utils";

interface RequestPayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RequestPayoutModal({ isOpen, onClose }: RequestPayoutModalProps) {
  const { currentPartner, settings, requestPayout } = usePortalStore();

  const availablePaise = currentPartner.stats.availablePaise;
  const minPayoutPaise = settings.minPayoutPaise; // ₹1,000

  const [amountRupees, setAmountRupees] = useState<number>(availablePaise / 100);
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    currentPartner.payoutMethods[0]?.id || ""
  );
  const [requestNote, setRequestNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const amountPaise = Math.round(Number(amountRupees || 0) * 100);
  const tdsPaise = Math.round(amountPaise * (settings.tdsRatePercent / 100));
  const netPayablePaise = Math.max(0, amountPaise - tdsPaise);

  const isValidAmount = amountPaise >= minPayoutPaise && amountPaise <= availablePaise;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidAmount) return;
    if (!selectedMethodId) {
      setErrorMsg("Please select a verified payout method");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");

    try {
      requestPayout(amountPaise, selectedMethodId, requestNote);
      setSuccess(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Error submitting payout request";
      setErrorMsg(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#9CE06F]/20 text-[#1F251D] dark:text-[#9CE06F] flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Request Payout
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Processed within 7 working days to your verified account
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-200">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Payout Request Received!
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-2">
              Finance team has been notified. You will receive an instant WhatsApp confirmation once the UTR is generated.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Available Balance Box */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">Available to Withdraw</span>
                <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {formatINR(availablePaise)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAmountRupees(availablePaise / 100)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] hover:opacity-90 transition active:scale-95"
              >
                Max Amount
              </button>
            </div>

            {/* Amount input */}
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                Withdrawal Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 text-sm font-bold text-zinc-400">₹</span>
                <input
                  type="number"
                  min={minPayoutPaise / 100}
                  max={availablePaise / 100}
                  value={amountRupees}
                  onChange={(e) => setAmountRupees(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-base font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                />
              </div>
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Minimum payout: {formatINR(minPayoutPaise)}
              </span>
            </div>

            {/* Payout Destination */}
            <div>
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block mb-1.5">
                Payout Destination
              </label>
              <div className="space-y-2">
                {currentPartner.payoutMethods.map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                      selectedMethodId === pm.id
                        ? "border-[#1F251D] dark:border-[#9CE06F] bg-zinc-50 dark:bg-zinc-800"
                        : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payoutMethod"
                        value={pm.id}
                        checked={selectedMethodId === pm.id}
                        onChange={() => setSelectedMethodId(pm.id)}
                        className="text-[#1F251D] focus:ring-[#9CE06F]"
                      />
                      <div>
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          {pm.type === "upi" ? "UPI ID" : "Bank Account"}
                        </div>
                        <div className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                          {pm.type === "upi" ? pm.upiId : `${pm.accountNumberMasked} (${pm.ifsc})`}
                        </div>
                      </div>
                    </div>
                    {pm.verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <input
                type="text"
                placeholder="Optional note to Finance team"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
              />
            </div>

            {/* Tax and Summary Card */}
            <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Gross Amount:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {formatINRWithDecimals(amountPaise)}
                </span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>TDS Deduction ({settings.tdsRatePercent}% Section 194H):</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  - {formatINRWithDecimals(tdsPaise)}
                </span>
              </div>
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-1.5 flex justify-between font-bold text-sm text-zinc-900 dark:text-zinc-100">
                <span>Net Payable to Account:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {formatINRWithDecimals(netPayablePaise)}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isValidAmount || availablePaise < minPayoutPaise}
              className="w-full py-3.5 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition disabled:opacity-40 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
            >
              {isSubmitting ? "Submitting Request..." : `Request Payout (${formatINR(netPayablePaise)})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
