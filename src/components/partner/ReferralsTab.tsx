"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  Building2, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  X,
  AlertCircle
} from "lucide-react";
import { usePortalStore } from "@/lib/store";
import { Lead, LeadStatus } from "@/lib/types";
import { formatINR, formatDate, formatTimeAgo } from "@/lib/utils";

interface ReferralsTabProps {
  onOpenReferModal: () => void;
}

export function ReferralsTab({ onOpenReferModal }: ReferralsTabProps) {
  const { leads, currentPartner } = usePortalStore();

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Filter leads for the active partner
  const partnerLeads = leads.filter((l) => l.partnerId === currentPartner.id);

  const filteredLeads = partnerLeads.filter((lead) => {
    const matchesSearch = 
      lead.brandName.toLowerCase().includes(search.toLowerCase()) ||
      lead.website.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = 
      selectedStatus === "all" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const statusChips: { label: string; value: string; count: number }[] = [
    { label: "All Leads", value: "all", count: partnerLeads.length },
    { label: "New", value: "new", count: partnerLeads.filter((l) => l.status === "new").length },
    { label: "Demo Booked", value: "demo_booked", count: partnerLeads.filter((l) => l.status === "demo_booked").length },
    { label: "Trial", value: "trial", count: partnerLeads.filter((l) => l.status === "trial").length },
    { label: "Paid", value: "paid", count: partnerLeads.filter((l) => l.status === "paid").length },
    { label: "Onboarded", value: "onboarded", count: partnerLeads.filter((l) => l.status === "onboarded").length },
    { label: "Lost", value: "lost", count: partnerLeads.filter((l) => l.status === "lost").length },
  ];

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case "new": return "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";
      case "demo_booked": return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200";
      case "trial": return "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200";
      case "paid": return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200";
      case "onboarded": return "bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200";
      case "lost": return "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200";
      default: return "bg-zinc-100 text-zinc-700";
    }
  };

  return (
    <div className="space-y-6 pb-20 w-full">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
            Referred Brands Directory
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500">
            {partnerLeads.length} total brand inquiries tracked under 90-day domain protection
          </p>
        </div>
        <button
          onClick={onOpenReferModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs sm:text-sm font-bold hover:opacity-90 transition active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Refer New Brand</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by brand name, website domain, or founder contact..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-[#9CE06F] shadow-sm"
          />
        </div>

        {/* Status Chips Filter */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar w-full md:w-auto">
          {statusChips.map((chip) => (
            <button
              key={chip.value}
              onClick={() => setSelectedStatus(chip.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 ${
                selectedStatus === chip.value
                  ? "bg-[#1F251D] text-white dark:bg-white dark:text-zinc-900 shadow-sm"
                  : "bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50"
              }`}
            >
              <span>{chip.label}</span>
              <span className="text-[10px] opacity-75 font-mono">({chip.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Full Desktop Leads Data Table */}
      <div className="apple-card overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-12 h-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-3" />
            <p className="text-base font-bold text-zinc-700 dark:text-zinc-300">
              No matching brands found
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Submit a brand or share your referral link to begin tracking conversions.
            </p>
            <button
              onClick={onOpenReferModal}
              className="mt-4 px-4 py-2.5 rounded-xl bg-[#1F251D] text-white dark:bg-[#9CE06F] dark:text-[#1F251D] text-xs font-bold inline-flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Register Brand</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-700 text-zinc-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Brand & Store</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Protection Window</th>
                  <th className="p-4">Commission Earned</th>
                  <th className="p-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/60 cursor-pointer transition"
                  >
                    <td className="p-4">
                      <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {lead.brandName}
                      </div>
                      <div className="text-xs text-zinc-500 flex items-center gap-2 mt-0.5">
                        <span>{lead.website}</span>
                        <span>•</span>
                        <span>{lead.monthlyRevenueRange}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {lead.source}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Until {formatDate(lead.protectionExpiresAt)}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400">
                        Submitted {formatTimeAgo(lead.attributedAt)}
                      </span>
                    </td>

                    <td className="p-4">
                      {lead.commissionEarnedPaise > 0 ? (
                        <div className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm">
                          {formatINR(lead.commissionEarnedPaise)}
                        </div>
                      ) : (
                        <span className="text-zinc-400 text-xs">
                          Pending Conversion
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLead(lead);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 inline-flex items-center gap-1 transition"
                      >
                        <span>View Timeline</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lead Detail Modal / Slide-over Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-white dark:bg-[#1C1C1E] rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] overflow-y-auto hide-scrollbar">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                    {selectedLead.brandName}
                  </h3>
                  <span className={`px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedLead.status)}`}>
                    {selectedLead.status.replace("_", " ")}
                  </span>
                </div>
                <a
                  href={`https://${selectedLead.website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-[#1F251D] dark:text-[#9CE06F] hover:underline flex items-center gap-1 mt-1 font-semibold"
                >
                  <span>{selectedLead.website}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Attribution & Protection Card */}
            <div className="mt-5 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Attribution Source:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 uppercase font-mono">
                  {selectedLead.source} ({selectedLead.source === "link" ? "Unique Partner Link" : "Direct Manual Submission"})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Submitted Timestamp:</span>
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {formatDate(selectedLead.attributedAt)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Protection Active Until:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  {formatDate(selectedLead.protectionExpiresAt)}
                </span>
              </div>
              {selectedLead.commissionEarnedPaise > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-700">
                  <span className="text-zinc-500">Total Commission Credited:</span>
                  <span className="font-black text-base text-emerald-600 dark:text-emerald-400 font-mono">
                    {formatINR(selectedLead.commissionEarnedPaise)}
                  </span>
                </div>
              )}
            </div>

            {/* Contact Person Details */}
            <div className="mt-5 space-y-2">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Founder / Decision Maker Details
              </h4>
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block">NAME</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedLead.contact.name}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block">MOBILE</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedLead.contact.phone}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-zinc-400 text-[10px] block">EMAIL</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300 truncate block">{selectedLead.contact.email}</span>
                </div>
              </div>
            </div>

            {/* Status Progression Timeline */}
            <div className="mt-6 space-y-3">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Attribution & Conversion Timeline
              </h4>

              <div className="space-y-4 relative pl-5 border-l-2 border-zinc-200 dark:border-zinc-700 ml-2">
                {selectedLead.events.filter((e) => e.visibleToPartner).length === 0 ? (
                  <p className="text-xs text-zinc-400">Attributed & awaiting sales touchpoint</p>
                ) : (
                  selectedLead.events
                    .filter((e) => e.visibleToPartner)
                    .map((ev) => (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-[#9CE06F] ring-4 ring-white dark:ring-[#1C1C1E]" />
                        <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                          <span className="uppercase">{ev.toStatus.replace("_", " ")}</span>
                          <span className="text-[11px] text-zinc-400 font-normal">
                            {formatTimeAgo(ev.timestamp)}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                          {ev.note}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
