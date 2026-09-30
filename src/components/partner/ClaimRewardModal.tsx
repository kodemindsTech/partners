"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { X, Gift, Sparkles, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { Offer } from "@/lib/types";
import { usePortalStore } from "@/lib/store";

interface ClaimRewardModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
}

export function ClaimRewardModal({ isOpen, onClose, offer }: ClaimRewardModalProps) {
  const { currentPartner, claimOffer } = usePortalStore();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(currentPartner?.phone || "");
  const [email, setEmail] = useState(currentPartner?.email || "");
  const [isClaiming, setIsClaiming] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !offer || !currentPartner) return null;

  const handleClaim = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClaiming(true);

    try {
      claimOffer(offer.id, {
        shippingAddress: offer.rewardType === "milestone_gift" ? address : undefined,
        phone: phone,
        email: email,
      });

      // Fire celebratory confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#9CE06F", "#D3F37F", "#1F251D", "#FFD700"],
      });

      setSuccess(true);
      setTimeout(() => {
        setIsClaiming(false);
        setSuccess(false);
        onClose();
      }, 2200);
    } catch (err: unknown) {
      setIsClaiming(false);
      const message = err instanceof Error ? err.message : "Error claiming offer";
      alert(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>Claim Reward</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {offer.rewardName}
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
            <CheckCircle2 className="w-16 h-16 text-[#9CE06F] mx-auto mb-3" />
            <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Reward Claimed!
            </h4>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-2">
              {offer.rewardType === "milestone_gift"
                ? "Our team is dispatching your package. Courier tracking details will appear in your 'My Rewards' tab within 2 business days."
                : offer.rewardType === "voucher"
                ? "Your digital gift voucher has been generated and sent to your email & WhatsApp."
                : "Your cash bonus has been credited directly to your withdrawable ledger balance!"}
            </p>
          </div>
        ) : (
          <form onSubmit={handleClaim} className="mt-5 space-y-4">
            {/* Offer preview card */}
            <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex items-center gap-3">
              <img
                src={offer.heroImage}
                alt={offer.title}
                className="w-16 h-16 object-cover rounded-xl border border-zinc-200 dark:border-zinc-700"
              />
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold mb-1">
                  TARGET ACHIEVED
                </span>
                <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {offer.rewardName}
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {offer.title}
                </p>
              </div>
            </div>

            {offer.rewardType === "milestone_gift" && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                  Delivery Shipping Address
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <textarea
                    required
                    rows={3}
                    placeholder="Full street address, landmark, city, state, pin code"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>

                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="Recipient Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
              </div>
            )}

            {offer.rewardType === "voucher" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                  Recipient Email for Voucher Code
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="Voucher delivery email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
              </div>
            )}

            {offer.rewardType === "cash_bonus" && (
              <p className="text-xs text-zinc-500 p-3 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl">
                This ₹{offer.rewardValuePaise / 100} cash reward will be added instantly to your withdrawable ledger balance.
              </p>
            )}

            <button
              type="submit"
              disabled={isClaiming}
              className="w-full py-3.5 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition disabled:opacity-50 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
            >
              {isClaiming ? "Unlocking Reward..." : `Confirm Claim (${offer.rewardName})`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
