"use client";

import { useState } from "react";
import { X, Building2, Globe, User, Phone, Mail, FileText, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { Lead } from "@/lib/types";

interface ReferLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (lead: Lead, isConflict: boolean) => void;
}

export function ReferLeadModal({ isOpen, onClose, onSuccess }: ReferLeadModalProps) {
  const { addLead } = usePortalStore();

  const [brandName, setBrandName] = useState("");
  const [website, setWebsite] = useState("");
  const [shopDomain, setShopDomain] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [monthlyRevenueRange, setMonthlyRevenueRange] = useState("₹15L – ₹30L");
  const [notes, setNotes] = useState("");
  const [dpdpConsent, setDpdpConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultMessage, setResultMessage] = useState<{ type: "success" | "conflict"; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dpdpConsent) {
      alert("Please confirm the brand agreed to be contacted (DPDP Act 2023 Compliance)");
      return;
    }

    setIsSubmitting(true);
    try {
      const { lead, isConflict } = addLead({
        brandName,
        website,
        shopDomain: shopDomain || undefined,
        contact: {
          name: contactName,
          phone: contactPhone,
          email: contactEmail,
        },
        monthlyRevenueRange,
        notes: notes || undefined,
      });

      if (isConflict) {
        setResultMessage({
          type: "conflict",
          message: "This brand domain was recently registered. Lead routed to Admin Conflict Queue for 24h arbitration.",
        });
      } else {
        setResultMessage({
          type: "success",
          message: "Lead accepted & protected under your partner code for 90 days!",
        });
      }

      setTimeout(() => {
        setIsSubmitting(false);
        setResultMessage(null);
        onSuccess(lead, isConflict);
        onClose();
        // Reset form
        setBrandName("");
        setWebsite("");
        setShopDomain("");
        setContactName("");
        setContactPhone("");
        setContactEmail("");
        setNotes("");
        setDpdpConsent(false);
      }, 1500);
    } catch (err: unknown) {
      setIsSubmitting(false);
      const message = err instanceof Error ? err.message : "Error submitting lead";
      alert(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#1C1C1E] rounded-t-[28px] sm:rounded-3xl p-6 shadow-2xl border border-black/10 dark:border-white/10 max-h-[90vh] overflow-y-auto hide-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#9CE06F]/20 text-[#1F251D] dark:text-[#9CE06F] flex items-center justify-center font-bold text-lg">
              +
            </div>
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Refer a New Brand
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Direct manual submission with 90-day protection
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

        {resultMessage ? (
          <div className="py-12 text-center animate-in zoom-in-95 duration-200">
            {resultMessage.type === "success" ? (
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
            ) : (
              <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-3" />
            )}
            <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {resultMessage.type === "success" ? "Lead Protected!" : "Conflict Detected"}
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 max-w-xs mx-auto mt-2">
              {resultMessage.message}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Brand Info */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Brand Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Brand Name (e.g. NutriPulse)"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
                <div className="relative">
                  <Globe className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Website (e.g. brand.in)"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Shopify Store Domain (optional, e.g. brand.myshopify.com)"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                />
              </div>
            </div>

            {/* Decision Maker Contact */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Founder / Decision Maker
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  placeholder="Contact Person Full Name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    placeholder="Mobile (+91 98765...)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="Business Email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                  />
                </div>
              </div>
            </div>

            {/* Revenue & Context */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                Monthly GMV / Revenue Range
              </label>
              <select
                value={monthlyRevenueRange}
                onChange={(e) => setMonthlyRevenueRange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
              >
                <option value="Under ₹10L">Under ₹10 Lakhs / month</option>
                <option value="₹10L – ₹25L">₹10L – ₹25 Lakhs / month</option>
                <option value="₹25L – ₹50L">₹25L – ₹50 Lakhs / month</option>
                <option value="₹50L – ₹1Cr">₹50L – ₹1 Crore / month</option>
                <option value="₹1Cr+">₹1 Crore+ / month (Enterprise)</option>
              </select>

              <div className="relative">
                <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <textarea
                  rows={2}
                  placeholder="Context / Current WhatsApp tools (e.g. Klaviyo, Interakt, Wati)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F]"
                />
              </div>
            </div>

            {/* DPDP Act 2023 Consent Checkbox */}
            <div className="pt-2 p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dpdpConsent}
                  onChange={(e) => setDpdpConsent(e.target.checked)}
                  className="mt-0.5 rounded text-[#1F251D] focus:ring-[#9CE06F]"
                />
                <span className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                  <strong className="text-zinc-900 dark:text-zinc-100">DPDP Act 2023 Consent:</strong> I confirm that this brand founder/team has explicitly agreed to be contacted by Retner for demo and onboarding assistance.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || !dpdpConsent}
                className="w-full py-3.5 rounded-xl bg-[#1F251D] dark:bg-[#9CE06F] text-white dark:text-[#1F251D] font-bold text-sm hover:opacity-95 transition disabled:opacity-50 active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
              >
                {isSubmitting ? (
                  <span>Checking Duplicates...</span>
                ) : (
                  <span>Submit & Protect Lead (90 Days)</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
