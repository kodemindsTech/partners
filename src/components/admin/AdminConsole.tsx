"use client";

import { useState } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Target, 
  GitMerge, 
  CreditCard, 
  Award, 
  Wallet, 
  Gift, 
  Settings, 
  ShieldCheck, 
  FileText, 
  TrendingUp, 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Truck, 
  ArrowUpRight, 
  ChevronRight,
  Plus,
  RefreshCw,
  LogOut,
  Sliders,
  DollarSign,
  UserCheck,
  UserX,
  Clock
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { LeadStatus, Partner, Lead, PayoutRequest, RewardClaim } from "@/lib/types";
import { formatINR, formatINRWithDecimals, formatDate, formatTimeAgo } from "@/lib/utils";

interface AdminConsoleProps {
  onLogout?: () => void;
}

export function AdminConsole({ onLogout }: AdminConsoleProps) {
  const {
    partners,
    leads,
    offers,
    earnings,
    payouts,
    claims,
    commissionPlans,
    tiers,
    settings,
    auditLogs,
    updateLeadStatus,
    resolveConflict,
    markPayoutPaid,
    updateClaimStatus,
    approvePartner,
    rejectPartner,
    suspendPartner
  } = usePortalStore();

  const [activeTab, setActiveTab] = useState<
    "dashboard" | "partners" | "leads" | "conflicts" | "payouts" | "offers" | "plans" | "audit"
  >("dashboard");

  const [partnerFilter, setPartnerFilter] = useState<string>("all");

  // Status Change Modal State
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [newStatus, setNewStatus] = useState<LeadStatus>("demo_booked");
  const [statusNote, setStatusNote] = useState("");
  const [visibleToPartner, setVisibleToPartner] = useState(true);
  const [lostReason, setLostReason] = useState("");

  // Payout Payment Modal State
  const [settlingPayout, setSettlingPayout] = useState<PayoutRequest | null>(null);
  const [utrInput, setUtrInput] = useState("");

  // Claim Dispatch Modal State
  const [dispatchingClaim, setDispatchingClaim] = useState<RewardClaim | null>(null);
  const [courierName, setCourierName] = useState("BlueDart Express");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [voucherCode, setVoucherCode] = useState("");

  // Conflict Review Modal
  const [reviewingConflict, setReviewingConflict] = useState<Lead | null>(null);
  const [conflictWinnerId, setConflictWinnerId] = useState<string>("");
  const [conflictReason, setConflictReason] = useState("");

  // KPI Calculations
  const totalPartners = partners.length;
  const pendingApprovalPartners = partners.filter((p) => p.status === "pending_approval");
  const approvedPartners = partners.filter((p) => p.status === "active").length;
  const totalLeads = leads.length;
  const paidLeads = leads.filter((l) => l.status === "paid" || l.status === "onboarded").length;
  const conversionRate = totalLeads > 0 ? ((paidLeads / totalLeads) * 100).toFixed(1) : "0";
  const pendingPayouts = payouts.filter((p) => p.status === "requested" || p.status === "under_review");
  const openConflicts = leads.filter((l) => l.conflictStatus === "pending_review");

  // Filtered partners list
  const filteredPartners = partners.filter((p) => {
    if (partnerFilter === "all") return true;
    return p.status === partnerFilter;
  });

  // Handle Lead Status Form Submit
  const handleLeadStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
    updateLeadStatus(
      editingLead.id,
      newStatus,
      statusNote || `Updated status to ${newStatus.toUpperCase()}`,
      visibleToPartner,
      newStatus === "lost" ? lostReason : undefined
    );
    setEditingLead(null);
    setStatusNote("");
    setLostReason("");
  };

  // Handle Payout Settle Submit
  const handlePayoutSettle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!settlingPayout || !utrInput) return;
    markPayoutPaid(settlingPayout.id, utrInput);
    setSettlingPayout(null);
    setUtrInput("");
  };

  // Handle Claim Dispatch Submit
  const handleClaimDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispatchingClaim) return;
    if (dispatchingClaim.rewardType === "voucher") {
      updateClaimStatus(dispatchingClaim.id, "delivered", { voucherCode: voucherCode || "AMZN-RETR-2026-AUTO" });
    } else {
      updateClaimStatus(dispatchingClaim.id, "dispatched", { courierName, trackingNumber });
    }
    setDispatchingClaim(null);
    setTrackingNumber("");
    setVoucherCode("");
  };

  // Handle Conflict Resolution
  const handleResolveConflictSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingConflict || !conflictWinnerId) return;
    resolveConflict(reviewingConflict.id, conflictWinnerId, conflictReason || "Awarded based on earliest verified interaction timestamp");
    setReviewingConflict(null);
    setConflictReason("");
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-[#1D1D1F] dark:text-[#F5F5F7] flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-zinc-900 text-white px-6 py-3.5 flex items-center justify-between border-b border-zinc-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#9CE06F] text-[#1F251D] flex items-center justify-center font-black text-base shadow">
            R
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Retner Admin Command Center</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-rose-400 hover:text-rose-300 hover:bg-zinc-700 text-xs font-semibold transition"
              title="Admin Logout"
            >
              <LogOut className="w-4 h-4" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-56 flex-shrink-0 space-y-1.5 hidden md:block">
          {[
            { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
            { id: "partners", label: "Partners & KYC", icon: Users, badge: pendingApprovalPartners.length, highlight: pendingApprovalPartners.length > 0 },
            { id: "leads", label: "Leads Pipeline", icon: Target, badge: leads.length },
            { id: "conflicts", label: "Conflict Queue", icon: GitMerge, badge: openConflicts.length, highlight: openConflicts.length > 0 },
            { id: "payouts", label: "Payout Requests", icon: Wallet, badge: pendingPayouts.length, highlight: pendingPayouts.length > 0 },
            { id: "offers", label: "Offers & Claims", icon: Gift, badge: claims.filter((c) => c.status === "claimed").length },
            { id: "plans", label: "Commission Plans", icon: Award },
            { id: "audit", label: "System Audit Logs", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] shadow-sm"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/60 dark:hover:bg-zinc-800"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      item.highlight
                        ? "bg-rose-500 text-white font-bold"
                        : isActive
                        ? "bg-white/20 text-white"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Program Overview & Performance
                </h2>
                <p className="text-xs text-zinc-500">Real-time referral metrics and partner pipeline</p>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="apple-card p-4">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Active Partners</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                    {approvedPartners} <span className="text-xs font-normal text-zinc-400">/ {totalPartners} total</span>
                  </div>
                  {pendingApprovalPartners.length > 0 ? (
                    <div className="text-[11px] text-amber-600 font-bold mt-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {pendingApprovalPartners.length} awaiting approval
                    </div>
                  ) : (
                    <div className="text-[11px] text-emerald-600 font-medium mt-1">All partners active</div>
                  )}
                </div>

                <div className="apple-card p-4">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Total Leads Referred</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                    {totalLeads}
                  </div>
                  <div className="text-[11px] text-indigo-600 font-medium mt-1">{paidLeads} converted to paid</div>
                </div>

                <div className="apple-card p-4">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Conversion Rate</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                    {conversionRate}%
                  </div>
                  <div className="text-[11px] text-zinc-400 font-medium mt-1">Target: 15%</div>
                </div>

                <div className="apple-card p-4 bg-gradient-to-br from-white to-[#F3FDDA] dark:from-zinc-900 dark:to-[#1F251D]/60 border-[#9CE06F]/50">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Open Payout Liability</div>
                  <div className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mt-2">
                    {formatINR(pendingPayouts.reduce((acc, p) => acc + p.netPayablePaise, 0))}
                  </div>
                  <div className="text-[11px] text-amber-600 font-bold mt-1">{pendingPayouts.length} pending requests</div>
                </div>
              </div>

              {/* Lead Funnel Pipeline Breakdown */}
              <div className="apple-card p-5 space-y-4">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Referral Funnel Stages
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {[
                    { label: "New", count: leads.filter((l) => l.status === "new").length, color: "bg-zinc-100 text-zinc-800" },
                    { label: "Demo Booked", count: leads.filter((l) => l.status === "demo_booked").length, color: "bg-blue-50 text-blue-700" },
                    { label: "Trial", count: leads.filter((l) => l.status === "trial").length, color: "bg-indigo-50 text-indigo-700" },
                    { label: "Paid", count: leads.filter((l) => l.status === "paid").length, color: "bg-emerald-50 text-emerald-700" },
                    { label: "Onboarded", count: leads.filter((l) => l.status === "onboarded").length, color: "bg-teal-50 text-teal-700" },
                  ].map((stage, idx) => (
                    <div key={idx} className={`p-3.5 rounded-xl border border-black/5 ${stage.color} text-center`}>
                      <span className="text-[11px] font-bold block uppercase tracking-wider">{stage.label}</span>
                      <span className="text-2xl font-black mt-1 block">{stage.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PARTNERS & APPROVALS */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Partner Directory & Approvals</h2>
                  <p className="text-xs text-zinc-500">Review newly registered partners, approve accounts, verify KYC, and override commission tiers</p>
                </div>

                {/* Filter Chips */}
                <div className="flex gap-1.5 text-xs">
                  {[
                    { label: "All Partners", value: "all", count: partners.length },
                    { label: "Pending Approval", value: "pending_approval", count: pendingApprovalPartners.length },
                    { label: "Active", value: "active", count: approvedPartners },
                    { label: "Suspended", value: "suspended", count: partners.filter((p) => p.status === "suspended").length },
                  ].map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setPartnerFilter(f.value)}
                      className={`px-3 py-1.5 rounded-xl font-semibold transition flex items-center gap-1.5 ${
                        partnerFilter === f.value
                          ? "bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D]"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200"
                      }`}
                    >
                      <span>{f.label}</span>
                      <span className="text-[10px] opacity-75 font-mono">({f.count})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="apple-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Partner Profile</th>
                        <th className="p-3.5">Type & Tier</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5">KYC / PAN</th>
                        <th className="p-3.5">Leads / Paid</th>
                        <th className="p-3.5 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {filteredPartners.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{p.name}</div>
                            <div className="text-[11px] text-zinc-500">{p.email} · {p.phone}</div>
                            <div className="text-[10px] text-zinc-400 mt-0.5">
                              {p.companyName ? `${p.companyName} (${p.city})` : p.city} · Code: <strong className="font-mono">{p.referralCode}</strong>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="capitalize font-semibold">{p.type.replace("_", " ")}</div>
                            <span className="inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                              {p.tierId.replace("tier-", "").toUpperCase()}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                p.status === "active"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : p.status === "pending_approval"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                            >
                              {p.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {p.kyc.status.toUpperCase()}
                            </span>
                            {p.kyc.pan && <div className="text-[10px] font-mono text-zinc-400 mt-0.5">PAN: {p.kyc.pan}</div>}
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold">{p.stats.leadsCount} leads</span>
                            <span className="text-emerald-600 block text-[10px] font-bold">{formatINR(p.stats.totalEarnedPaise)} earned</span>
                          </td>
                          <td className="p-3.5 text-right space-x-1.5">
                            {p.status === "pending_approval" ? (
                              <>
                                <button
                                  onClick={() => approvePartner(p.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-700 transition"
                                >
                                  Approve Partner
                                </button>
                                <button
                                  onClick={() => rejectPartner(p.id)}
                                  className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-bold transition"
                                >
                                  Reject
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => suspendPartner(p.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px] font-semibold"
                              >
                                {p.status === "suspended" ? "Reactivate" : "Suspend"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEADS PIPELINE */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Leads Pipeline & Status Manager</h2>
                  <p className="text-xs text-zinc-500">Update statuses, attach partner-visible notes, and record conversion payouts</p>
                </div>
              </div>

              <div className="apple-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Brand & Website</th>
                        <th className="p-3.5">Referred By</th>
                        <th className="p-3.5">Source</th>
                        <th className="p-3.5">Current Status</th>
                        <th className="p-3.5">Protection Expiry</th>
                        <th className="p-3.5 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {leads.map((l) => (
                        <tr key={l.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{l.brandName}</div>
                            <div className="text-[11px] text-zinc-500">{l.website} · {l.monthlyRevenueRange}</div>
                          </td>
                          <td className="p-3.5 font-semibold text-zinc-700 dark:text-zinc-300">
                            {l.partnerName || l.partnerId}
                          </td>
                          <td className="p-3.5">
                            <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800">
                              {l.source}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-bold uppercase text-[10px] px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border">
                              {l.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="p-3.5 text-zinc-500">
                            {formatDate(l.protectionExpiresAt)}
                          </td>
                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => {
                                setEditingLead(l);
                                setNewStatus(l.status);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs font-bold shadow-sm"
                            >
                              Manage Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CONFLICT QUEUE */}
          {activeTab === "conflicts" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Referral Conflict Arbitration Queue</h2>
                <p className="text-xs text-zinc-500">Resolve competing claims from partners based on timestamp and interaction proof</p>
              </div>

              {openConflicts.length === 0 ? (
                <div className="apple-card p-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Zero Pending Conflicts</h3>
                  <p className="text-xs text-zinc-400 mt-1">All lead attributions are uniquely mapped to designated partners.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {openConflicts.map((c) => (
                    <div key={c.id} className="apple-card p-5 border-amber-300 dark:border-amber-700/60 bg-amber-50/20 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] uppercase">
                            Dispute Detected
                          </span>
                          <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">
                            {c.brandName} ({c.website})
                          </h3>
                          <p className="text-xs text-zinc-500">
                            Claimed on {formatDate(c.attributedAt)} by <strong>{c.partnerName}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setReviewingConflict(c);
                            setConflictWinnerId(c.partnerId);
                          }}
                          className="px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs font-bold"
                        >
                          Arbitrate & Resolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: PAYOUTS QUEUE */}
          {activeTab === "payouts" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Payout Requests & UTR Settlement</h2>
                <p className="text-xs text-zinc-500">Review withdrawals, verify bank/UPI details, and log UTR confirmation numbers</p>
              </div>

              <div className="apple-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Partner</th>
                        <th className="p-3.5">Gross / TDS / Net</th>
                        <th className="p-3.5">Destination Method</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Settlement</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {payouts.map((p) => (
                        <tr key={p.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{p.partnerName}</div>
                            <div className="text-[11px] text-zinc-400">Requested {formatDate(p.requestedAt)}</div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-sm text-emerald-600">{formatINR(p.netPayablePaise)} net</div>
                            <div className="text-[10px] text-zinc-400">
                              Gross {formatINR(p.amountPaise)} · TDS {formatINR(p.tdsPaise)}
                            </div>
                          </td>
                          <td className="p-3.5">
                            <div className="font-mono text-xs">{p.method.type === "upi" ? p.method.upiId : p.method.accountNumberMasked}</div>
                            <div className="text-[10px] text-zinc-400">{p.method.holderName}</div>
                          </td>
                          <td className="p-3.5">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                p.status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {p.status}
                            </span>
                            {p.utr && <div className="text-[10px] font-mono text-zinc-400 mt-1">UTR: {p.utr}</div>}
                          </td>
                          <td className="p-3.5 text-right">
                            {p.status !== "paid" ? (
                              <button
                                onClick={() => setSettlingPayout(p)}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs shadow-sm hover:bg-emerald-700"
                              >
                                Record UTR & Pay
                              </button>
                            ) : (
                              <span className="text-emerald-600 font-bold text-xs flex items-center justify-end gap-1">
                                <CheckCircle2 className="w-4 h-4" /> Settled
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: OFFERS & REWARD CLAIMS */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Reward Claims & Physical Gift Logistics</h2>
                <p className="text-xs text-zinc-500">Dispatch physical gadgets (AirPods Pro), assign courier AWB tracking, or send voucher codes</p>
              </div>

              <div className="apple-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 font-bold uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Partner</th>
                        <th className="p-3.5">Prize / Reward</th>
                        <th className="p-3.5">Delivery Details</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Fulfillment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                      {claims.map((c) => (
                        <tr key={c.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                          <td className="p-3.5">
                            <div className="font-bold text-zinc-900 dark:text-zinc-100">{c.partnerName}</div>
                            <div className="text-[11px] text-zinc-400">Claimed {formatDate(c.claimedAt)}</div>
                          </td>
                          <td className="p-3.5 font-bold text-zinc-800 dark:text-zinc-200">
                            {c.rewardName}
                          </td>
                          <td className="p-3.5 text-zinc-600 dark:text-zinc-400">
                            {c.deliveryDetails.shippingAddress || c.deliveryDetails.email || "Digital"}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              {c.status}
                            </span>
                            {c.trackingNumber && <div className="text-[10px] font-mono text-zinc-400 mt-1">AWB: {c.trackingNumber}</div>}
                          </td>
                          <td className="p-3.5 text-right">
                            {c.status === "claimed" ? (
                              <button
                                onClick={() => setDispatchingClaim(c)}
                                className="px-3 py-1.5 rounded-lg bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold text-xs"
                              >
                                Dispatch & Track
                              </button>
                            ) : (
                              <span className="text-zinc-400 text-xs">Fulfilled</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PLANS */}
          {activeTab === "plans" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Commission Plans & Tier Thresholds</h2>
                <p className="text-xs text-zinc-500">Configure multi-tier percentage or bounty rules without deploying code</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {commissionPlans.map((plan) => (
                  <div key={plan.id} className="apple-card p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-bold">
                          {plan.type.replace(/_/g, " ")}
                        </span>
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                          {plan.name}
                        </h3>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">Active v{plan.version}</span>
                    </div>

                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {plan.description}
                    </p>

                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 text-xs text-zinc-700 dark:text-zinc-300 font-medium">
                      💡 <strong>Worked Example:</strong> {plan.workedExample}
                    </div>

                    <div className="text-[11px] text-zinc-400 pt-1">
                      Hold Period: <strong>{plan.holdPeriodDays} days</strong> · Qualifying Trigger: <strong>{plan.qualifyingStatus}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === "audit" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Immutable Financial Audit Trail</h2>
                <p className="text-xs text-zinc-500">Every write, status change, and money movement logged with before/after state</p>
              </div>

              <div className="apple-card divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                        <span>{log.action.replace(/_/g, " ").toUpperCase()}</span>
                        <span className="text-[10px] font-mono px-1.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300">
                          {log.entity}#{log.entityId}
                        </span>
                      </div>
                      <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right text-zinc-400 text-[11px]">
                      <div>{log.actor}</div>
                      <div>{formatTimeAgo(log.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODALS */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Update Pipeline Status for {editingLead.brandName}
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Partner: {editingLead.partnerName}</p>

            <form onSubmit={handleLeadStatusSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold"
                >
                  <option value="new">New</option>
                  <option value="demo_booked">Demo Booked</option>
                  <option value="trial">Trial Started</option>
                  <option value="paid">Paid (Triggers Commission)</option>
                  <option value="onboarded">Onboarded (Live)</option>
                  <option value="lost">Lost</option>
                </select>
              </div>

              {newStatus === "lost" && (
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                    Lost Reason
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chose competitor, budget mismatch"
                    value={lostReason}
                    onChange={(e) => setLostReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs"
                  />
                </div>
              )}

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                  Activity Timeline Note
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Brand converted to Growth Annual plan; WhatsApp catalog live."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={visibleToPartner}
                  onChange={(e) => setVisibleToPartner(e.target.checked)}
                  className="rounded text-[#1F251D]"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Visible to partner on lead timeline & WhatsApp alert
                </span>
              </label>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold"
                >
                  Save & Notify Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {settlingPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Confirm Bank Settlement for {settlingPayout.partnerName}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">
              Net Amount: <strong className="text-emerald-600">{formatINR(settlingPayout.netPayablePaise)}</strong>
            </p>

            <form onSubmit={handlePayoutSettle} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                  Bank Reference Number / UTR
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. HDFCN26239104821"
                  value={utrInput}
                  onChange={(e) => setUtrInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-mono font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSettlingPayout(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Mark Paid & Send Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {dispatchingClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Fulfill Reward: {dispatchingClaim.rewardName}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Partner: {dispatchingClaim.partnerName}</p>

            <form onSubmit={handleClaimDispatch} className="mt-4 space-y-4 text-xs">
              {dispatchingClaim.rewardType === "milestone_gift" ? (
                <>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Courier Partner
                    </label>
                    <input
                      type="text"
                      required
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                      Tracking / AWB Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BD948102948IN"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono font-bold"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                    Voucher Code
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMZN-RETR-8849-2026"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs font-mono font-bold"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDispatchingClaim(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reviewingConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Arbitrate Lead: {reviewingConflict.brandName}
            </h3>
            <p className="text-xs text-zinc-500 mt-1">Domain: {reviewingConflict.website}</p>

            <form onSubmit={handleResolveConflictSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                  Assign Lead To Partner
                </label>
                <select
                  value={conflictWinnerId}
                  onChange={(e) => setConflictWinnerId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-sm font-semibold"
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.companyName || p.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-zinc-700 dark:text-zinc-300 uppercase block mb-1">
                  Arbitration Rationale
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Awarded to partner with earlier WhatsApp introduction proof."
                  value={conflictReason}
                  onChange={(e) => setConflictReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewingConflict(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] font-bold"
                >
                  Resolve & Award Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
