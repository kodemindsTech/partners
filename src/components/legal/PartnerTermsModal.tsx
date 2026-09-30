"use client";

import { X, ShieldCheck, Scale, FileText, CheckCircle2, ChevronRight, AlertTriangle } from "lucide-react";

interface PartnerTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  isAccepted?: boolean;
}

export function PartnerTermsModal({ isOpen, onClose, onAccept, isAccepted = false }: PartnerTermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-[#151814] rounded-3xl shadow-2xl border border-zinc-200 dark:border-white/10 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-[#1A1E18]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 dark:bg-[#9CE06F]/20 text-[#9CE06F] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <span>Retner Partner Circle – Diwali Edition</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#9CE06F]/20 text-[#1F251D] dark:text-[#9CE06F] font-bold">
                  v2026.09.30
                </span>
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Coregrow Technologies Private Limited · Ahmedabad, Gujarat
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans">
          {/* Top Banner Notice */}
          <div className="p-3.5 rounded-2xl bg-[#9CE06F]/10 border border-[#9CE06F]/20 text-zinc-800 dark:text-zinc-200 space-y-1">
            <div className="flex items-center gap-2 font-bold text-xs text-[#1F251D] dark:text-[#9CE06F]">
              <ShieldCheck className="w-4 h-4" />
              <span>Legally Binding Partner Agreement</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              These terms govern your participation in the Retner Partner Circle (Diwali Edition), operated by <strong>Coregrow Technologies Private Limited</strong>. Jurisdiction: <strong>Ahmedabad, Gujarat, India</strong>.
            </p>
          </div>

          {/* Program Overview Table */}
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#9CE06F]" /> Program Overview & Compensation Structure
            </h3>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-white/10">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-zinc-100 dark:bg-[#1A1E18] text-zinc-800 dark:text-zinc-200 font-bold border-b border-zinc-200 dark:border-white/10">
                  <tr>
                    <th className="p-2.5">Component</th>
                    <th className="p-2.5">What Partner Receives</th>
                    <th className="p-2.5">Trigger</th>
                    <th className="p-2.5">Payout Timeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-white/5">
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-900 dark:text-zinc-100">Revenue Share</td>
                    <td className="p-2.5 font-mono text-[#9CE06F] font-bold">15%, 20% or 25%</td>
                    <td className="p-2.5">Net subscription revenue for 12 months per client</td>
                    <td className="p-2.5">Within 7 working days of payment clearing</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-900 dark:text-zinc-100">Fast-Start Cash</td>
                    <td className="p-2.5 font-mono text-[#9CE06F] font-bold">₹2,000 (1st) + ₹1,000 (2nd) + ₹1,000 (3rd)</td>
                    <td className="p-2.5">First payment cleared within 30-day fast-start window</td>
                    <td className="p-2.5">Within 7 working days (Max ₹4,000 per partner)</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-zinc-900 dark:text-zinc-100">Milestone Gifts</td>
                    <td className="p-2.5 font-mono text-[#9CE06F] font-bold">Diya (₹3k) · Lantern (₹15k) · Firework (₹15k)</td>
                    <td className="p-2.5">Clients with 2nd quarterly payment cleared</td>
                    <td className="p-2.5">Within 15 days of qualifying payment</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 1: Definitions */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">1. Definitions</h4>
            <p><strong>• Retner, we, us:</strong> Coregrow Technologies Private Limited, operating Retner (retner.ai).</p>
            <p><strong>• Partner:</strong> An agency, developer, consultant, creator, or community enrolled in the Partner Circle and approved by Retner.</p>
            <p><strong>• Referred client:</strong> A new brand registered by the partner that subscribes to a paid Retner plan.</p>
            <p><strong>• Net subscription revenue:</strong> Plan fee actually collected by Retner, excluding GST, refunds, chargebacks, wallet credits/top-ups, pass-through usage (voice, RCS, SMS), setup fees, and discounts.</p>
          </div>

          {/* Section 2: Partner Eligibility */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">2. Partner Eligibility</h4>
            <p>1. Partner must be enrolled, verified, and in good standing with complete KYC (PAN, legal name, bank account, and GST if registered).</p>
            <p>2. Employees, contractors, and direct relatives of Retner are strictly ineligible for gifts or fast-start cash bonuses.</p>
          </div>

          {/* Section 3: Referral Registration & Attribution */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">3. Referral Registration & 90-Day Attribution Lock</h4>
            <p>1. A referral counts only if registered through the partner's unique referral link, code, or portal before the client's first demo or trial.</p>
            <p>2. Attribution is locked to the partner for <strong>90 days</strong> from initial registration.</p>
            <p>3. If two partners register the same brand, the earliest verified registration wins as determined by Retner's system logs.</p>
            <p>4. Brands already in Retner's active sales pipeline or active/churned within the last 12 months cannot be registered as new referrals.</p>
          </div>

          {/* Section 4 & 5: Tiered Revenue Share */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">4 & 5. Tiered Revenue Share Structure</h4>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-[#1A1E18] space-y-1">
              <p>• <strong>Clients 1 to 4:</strong> 15% revenue share (₹6,300/yr per brand on ₹3,500/mo plan)</p>
              <p>• <strong>Clients 5 to 9:</strong> 20% revenue share (₹8,400/yr per brand on ₹3,500/mo plan)</p>
              <p>• <strong>Client 10 and above:</strong> 25% revenue share (₹10,500/yr per brand on ₹3,500/mo plan)</p>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              * Rates lock for each client when their first payment clears. Runs for 12 months while the client remains active and paying.
            </p>
          </div>

          {/* Section 6: Fast-Start Cash */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">6. Fast-Start Cash Bonus</h4>
            <p>Partners earn up to ₹4,000 cash for their first 3 paid referrals inside the 30-day fast-start window (₹2,000 for 1st, ₹1,000 for 2nd, ₹1,000 for 3rd). Paid via direct bank transfer within 7 working days of first cleared payment.</p>
          </div>

          {/* Section 7: Diwali Milestone Gifts */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">7. Diwali Milestone Gifts & Pool Limit</h4>
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-[#1A1E18] space-y-1">
              <p>• <strong>Diya (5 clients):</strong> ₹3,000 Amazon Voucher + Partner Circle Badge (Limited to 20 slots)</p>
              <p>• <strong>Lantern (10 clients):</strong> AirPods-class gift (~₹15,000) or ₹15,000 Voucher + Co-branded case study (Limited to 4 slots)</p>
              <p>• <strong>Firework (15 clients):</strong> ₹15,000 Amazon Voucher + Priority support & early feature access (Limited to 2 slots)</p>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              * Gifts do not stack (awarded for the highest unlocked tier). Total Diwali gift pool capped at ₹1.5 Lakhs. Requires 2nd quarterly payment cleared.
            </p>
          </div>

          {/* Section 8: Payout Cap Guardrail */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">8. Financial Guardrail & 30% Payout Cap</h4>
            <p>Total partner payout (including revenue share, fast-start cash, and milestone gifts) is capped at <strong>30% of first-year collected revenue</strong> from that partner's clients. Any excess is held until qualifying revenue clears.</p>
          </div>

          {/* Section 9: Taxes, GST & TDS */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">9. Taxes, TDS & GST Compliance</h4>
            <p>Payouts are settled directly via NEFT/IMPS/UPI. TDS is deducted as mandated under the Indian Income Tax Act. GST is disbursed only against a valid tax invoice with matching GSTIN.</p>
          </div>

          {/* Section 10 & 11: Prohibited Conduct & Clawback */}
          <div className="space-y-1.5">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">10 & 11. Prohibited Conduct & Clawback</h4>
            <p>Self-referrals, affiliated dummy accounts, PPC bidding on Retner brand keywords, or spam messaging under TRAI / DPDP Act 2023 lead to immediate disqualification, account termination, and clawback of paid commissions.</p>
          </div>

          {/* Section 14: Governing Law & Jurisdiction */}
          <div className="p-3.5 rounded-2xl bg-zinc-100 dark:bg-[#1A1E18] border border-zinc-200 dark:border-white/10 space-y-1">
            <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
              14. Governing Law & Exclusive Jurisdiction
            </h4>
            <p className="text-zinc-700 dark:text-zinc-300">
              These terms are governed by the laws of India. The courts at <strong>Ahmedabad, Gujarat</strong> have sole and exclusive jurisdiction over any disputes arising out of or in connection with the Retner Partner Circle.
            </p>
          </div>
        </div>

        {/* Action Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-[#1A1E18] flex items-center justify-between">
          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
            {isAccepted ? (
              <span className="text-emerald-600 dark:text-[#9CE06F] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Accepted & on file
              </span>
            ) : (
              <span>Scroll and accept to complete your partner enrollment</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              Close
            </button>
            {onAccept && !isAccepted && (
              <button
                type="button"
                onClick={() => {
                  onAccept();
                  onClose();
                }}
                className="px-5 py-2 rounded-xl bg-zinc-900 dark:bg-[#9CE06F] text-white dark:text-[#1F251D] text-xs font-bold hover:opacity-90 transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>I Agree to All Terms</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
