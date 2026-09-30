"use client";

import { useState, useEffect } from "react";
import { 
  Partner, 
  Lead, 
  Offer, 
  Earning, 
  PayoutRequest, 
  CommissionPlan, 
  Tier, 
  ProgramSettings, 
  AuditLog, 
  RewardClaim,
  LeadStatus,
  ConflictStatus,
  PartnerType,
  PartnerStatus
} from "./types";
import { 
  initialPartner, 
  initialAllPartners, 
  initialLeads, 
  initialOffers, 
  initialEarnings, 
  initialPayouts, 
  initialRewardClaims, 
  initialCommissionPlans, 
  initialTiers, 
  initialSettings, 
  initialAuditLogs 
} from "./mockData";
import { normalizeDomain } from "./utils";

const STORAGE_KEY = "retner_partner_portal_state_v2";

export interface AuthSession {
  userType: "partner" | "admin" | null;
  partnerId?: string;
  adminEmail?: string;
  adminRole?: string;
}

interface AppState {
  authSession: AuthSession;
  currentPartner: Partner;
  partners: Partner[];
  leads: Lead[];
  offers: Offer[];
  earnings: Earning[];
  payouts: PayoutRequest[];
  claims: RewardClaim[];
  commissionPlans: CommissionPlan[];
  tiers: Tier[];
  settings: ProgramSettings;
  auditLogs: AuditLog[];
}

function getInitialState(): AppState {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
  }
  return {
    authSession: {
      userType: "partner",
      partnerId: initialPartner.id,
    },
    currentPartner: initialPartner,
    partners: initialAllPartners,
    leads: initialLeads,
    offers: initialOffers,
    earnings: initialEarnings,
    payouts: initialPayouts,
    claims: initialRewardClaims,
    commissionPlans: initialCommissionPlans,
    tiers: initialTiers,
    settings: initialSettings,
    auditLogs: initialAuditLogs,
  };
}

let globalState: AppState = getInitialState();
const listeners = new Set<() => void>();

function notify() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch {
      // Ignore
    }
  }
  listeners.forEach((listener) => listener());
}

export function usePortalStore() {
  const [state, setState] = useState<AppState>(globalState);

  useEffect(() => {
    const handleChange = () => setState({ ...globalState });
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  // Auth Action: Partner Login via Phone/Email
  const partnerLogin = (identifier: string) => {
    const cleanId = identifier.trim().toLowerCase();
    const partner = globalState.partners.find(
      (p) =>
        p.email.toLowerCase() === cleanId ||
        p.phone.replace(/[^0-9]/g, "").includes(cleanId.replace(/[^0-9]/g, "")) ||
        p.referralCode.toLowerCase() === cleanId
    );

    if (!partner) {
      throw new Error("No partner account found with this mobile or email. Please sign up first.");
    }

    globalState = {
      ...globalState,
      authSession: {
        userType: "partner",
        partnerId: partner.id,
      },
      currentPartner: partner,
    };
    notify();
    return partner;
  };

  // Auth Action: Partner Signup
  const partnerSignup = (data: {
    name: string;
    phone: string;
    email: string;
    type: PartnerType;
    companyName?: string;
    city: string;
    website?: string;
    d2cBrandsCount?: number;
  }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    const cleanPhone = data.phone.trim();

    // Check duplicate email or phone
    const existing = globalState.partners.find(
      (p) => p.email.toLowerCase() === cleanEmail || p.phone === cleanPhone
    );
    if (existing) {
      throw new Error("A partner with this email or mobile number already exists.");
    }

    const newId = `part-${Date.now()}`;
    const codeBase = data.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "") || "RETN";
    const referralCode = `${codeBase}${Math.floor(10 + Math.random() * 90)}`;
    const now = new Date().toISOString();

    const isAutoApprove = globalState.settings.autoApprovePartners;
    const initialStatus: PartnerStatus = isAutoApprove ? "active" : "pending_approval";

    const newPartner: Partner = {
      id: newId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      type: data.type,
      companyName: data.companyName,
      city: data.city,
      website: data.website,
      d2cBrandsCount: Number(data.d2cBrandsCount) || 1,
      status: initialStatus,
      tierId: "tier-silver",
      referralCode,
      kyc: {
        pan: "",
        legalName: data.name,
        status: "not_submitted",
        documents: [],
      },
      payoutMethods: [],
      notificationPrefs: { whatsapp: true, email: true },
      stats: {
        clicks: 0,
        uniqueVisitors: 0,
        leadsCount: 0,
        paidCount: 0,
        conversionRate: 0,
        totalEarnedPaise: 0,
        availablePaise: 0,
        pendingPaise: 0,
        paidOutPaise: 0,
      },
      createdAt: now,
    };

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: `New Partner (${data.name})`,
      action: "partner_signup",
      entity: "partner",
      entityId: newId,
      details: `New ${data.type.replace("_", " ")} registered from ${data.city}. Status: ${initialStatus}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      partners: [newPartner, ...globalState.partners],
      currentPartner: newPartner,
      authSession: {
        userType: "partner",
        partnerId: newId,
      },
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
    return newPartner;
  };

  // Auth Action: Admin Login
  const adminLogin = (email: string, password?: string, totp?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "admin@retner.ai" || cleanEmail.includes("admin")) {
      globalState = {
        ...globalState,
        authSession: {
          userType: "admin",
          adminEmail: "admin@retner.ai",
          adminRole: "Super Admin",
        },
      };
      notify();
      return true;
    }
    throw new Error("Invalid admin credentials. Use admin@retner.ai / Admin@123");
  };

  // Logout
  const logout = () => {
    globalState = {
      ...globalState,
      authSession: { userType: null },
    };
    notify();
  };

  // Admin Action: Approve Partner
  const approvePartner = (partnerId: string) => {
    const now = new Date().toISOString();
    const updatedPartners = globalState.partners.map((p) => {
      if (p.id === partnerId) {
        return { ...p, status: "active" as PartnerStatus };
      }
      return p;
    });

    const partner = globalState.partners.find((p) => p.id === partnerId);

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Admin (SuperAdmin)",
      action: "partner_approved",
      entity: "partner",
      entityId: partnerId,
      details: `Approved partner ${partner?.name} (${partner?.referralCode})`,
      timestamp: now,
    };

    let updatedCurrent = globalState.currentPartner;
    if (globalState.currentPartner.id === partnerId) {
      updatedCurrent = { ...globalState.currentPartner, status: "active" };
    }

    globalState = {
      ...globalState,
      partners: updatedPartners,
      currentPartner: updatedCurrent,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Admin Action: Reject Partner
  const rejectPartner = (partnerId: string, reason?: string) => {
    const now = new Date().toISOString();
    const updatedPartners = globalState.partners.map((p) => {
      if (p.id === partnerId) {
        return { ...p, status: "rejected" as PartnerStatus };
      }
      return p;
    });

    const partner = globalState.partners.find((p) => p.id === partnerId);

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Admin (SuperAdmin)",
      action: "partner_rejected",
      entity: "partner",
      entityId: partnerId,
      details: `Rejected partner ${partner?.name}. Reason: ${reason || "Profile criteria mismatch"}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      partners: updatedPartners,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Admin Action: Suspend Partner
  const suspendPartner = (partnerId: string) => {
    const now = new Date().toISOString();
    const updatedPartners = globalState.partners.map((p) => {
      if (p.id === partnerId) {
        const nextStatus: PartnerStatus = p.status === "suspended" ? "active" : "suspended";
        return { ...p, status: nextStatus };
      }
      return p;
    });

    const partner = globalState.partners.find((p) => p.id === partnerId);

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Admin",
      action: "partner_status_toggle",
      entity: "partner",
      entityId: partnerId,
      details: `Toggled status for ${partner?.name}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      partners: updatedPartners,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Action: Add new lead from Partner form
  const addLead = (newLeadData: {
    brandName: string;
    website: string;
    shopDomain?: string;
    contact: { name: string; phone: string; email: string };
    monthlyRevenueRange: string;
    notes?: string;
  }) => {
    const normalizedNewDomain = normalizeDomain(newLeadData.website);
    
    // Check duplicate or conflict
    const existingMatch = globalState.leads.find(
      (l) => normalizeDomain(l.website) === normalizedNewDomain
    );

    const isConflict = Boolean(existingMatch);
    const newId = `lead-${Date.now()}`;
    const now = new Date().toISOString();
    const expiry = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString();

    const createdLead: Lead = {
      id: newId,
      partnerId: globalState.currentPartner.id,
      partnerName: globalState.currentPartner.name,
      brandName: newLeadData.brandName,
      website: newLeadData.website,
      shopDomain: newLeadData.shopDomain,
      source: "manual",
      contact: newLeadData.contact,
      monthlyRevenueRange: newLeadData.monthlyRevenueRange,
      notes: newLeadData.notes,
      status: "new",
      conflictStatus: isConflict ? "pending_review" : "none",
      attributedAt: now,
      protectionExpiresAt: expiry,
      commissionEarnedPaise: 0,
      events: [
        {
          id: `ev-${Date.now()}`,
          leadId: newId,
          fromStatus: null,
          toStatus: "new",
          note: isConflict 
            ? "Domain matches existing entry; assigned to conflict queue for admin review."
            : "Manually registered and protected for 90 days.",
          visibleToPartner: true,
          actor: { type: "partner", name: globalState.currentPartner.name },
          timestamp: now,
        }
      ],
    };

    const updatedLeads = [createdLead, ...globalState.leads];
    
    // Update partner counter
    const updatedPartner = {
      ...globalState.currentPartner,
      stats: {
        ...globalState.currentPartner.stats,
        leadsCount: globalState.currentPartner.stats.leadsCount + 1,
      }
    };

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: `Partner (${globalState.currentPartner.name})`,
      action: isConflict ? "lead_submitted_conflict" : "lead_submitted",
      entity: "lead",
      entityId: newId,
      details: `Submitted brand ${newLeadData.brandName} (${newLeadData.website})`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      currentPartner: updatedPartner,
      leads: updatedLeads,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();

    return { lead: createdLead, isConflict };
  };

  // Action: Admin updates lead status
  const updateLeadStatus = (
    leadId: string, 
    newStatus: LeadStatus, 
    note: string, 
    visibleToPartner = true,
    lostReason?: string
  ) => {
    const now = new Date().toISOString();
    const lead = globalState.leads.find((l) => l.id === leadId);
    if (!lead) return;

    const fromStatus = lead.status;
    const newEvent = {
      id: `ev-${Date.now()}`,
      leadId,
      fromStatus,
      toStatus: newStatus,
      note,
      visibleToPartner,
      actor: { type: "admin" as const, name: "Admin Console" },
      timestamp: now,
    };

    let commissionPaiseToAdd = 0;
    let newEarnings = [...globalState.earnings];

    // If moved to Paid, generate pending earning based on partner tier
    if (newStatus === "paid" && fromStatus !== "paid") {
      commissionPaiseToAdd = 1800000; // ₹18,000 commission simulation
      const earnId = `earn-${Date.now()}`;
      const earningItem: Earning = {
        id: earnId,
        partnerId: lead.partnerId,
        leadId: lead.id,
        leadBrandName: lead.brandName,
        type: "commission",
        amountPaise: commissionPaiseToAdd,
        tdsAmountPaise: Math.round(commissionPaiseToAdd * 0.05),
        netAmountPaise: Math.round(commissionPaiseToAdd * 0.95),
        status: "pending",
        availableAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: now,
        reason: `Commission on plan conversion for ${lead.brandName} (30d hold)`,
        planSnapshot: {
          planId: "plan-3",
          planName: "Gold Partner Tier Plan",
          rateOrFixed: "15%",
        }
      };
      newEarnings = [earningItem, ...newEarnings];
    }

    const updatedLeads = globalState.leads.map((l) => {
      if (l.id === leadId) {
        return {
          ...l,
          status: newStatus,
          lostReason: newStatus === "lost" ? lostReason : l.lostReason,
          commissionEarnedPaise: l.commissionEarnedPaise + commissionPaiseToAdd,
          events: [newEvent, ...l.events],
        };
      }
      return l;
    });

    // Update partner stats if it's the current partner
    let updatedCurrentPartner = globalState.currentPartner;
    if (lead.partnerId === globalState.currentPartner.id) {
      updatedCurrentPartner = {
        ...globalState.currentPartner,
        stats: {
          ...globalState.currentPartner.stats,
          paidCount: newStatus === "paid" ? globalState.currentPartner.stats.paidCount + 1 : globalState.currentPartner.stats.paidCount,
          pendingPaise: globalState.currentPartner.stats.pendingPaise + commissionPaiseToAdd,
          totalEarnedPaise: globalState.currentPartner.stats.totalEarnedPaise + commissionPaiseToAdd,
        }
      };
    }

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Admin",
      action: "lead_status_changed",
      entity: "lead",
      entityId: leadId,
      details: `Moved ${lead.brandName} from ${fromStatus} to ${newStatus}. Note: ${note}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      currentPartner: updatedCurrentPartner,
      leads: updatedLeads,
      earnings: newEarnings,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Action: Admin resolves conflict
  const resolveConflict = (leadId: string, winningPartnerId: string, reason: string) => {
    const now = new Date().toISOString();
    const updatedLeads = globalState.leads.map((l) => {
      if (l.id === leadId) {
        const winningPartner = globalState.partners.find((p) => p.id === winningPartnerId);
        return {
          ...l,
          partnerId: winningPartnerId,
          partnerName: winningPartner?.name || l.partnerName,
          conflictStatus: "resolved" as ConflictStatus,
          events: [
            {
              id: `ev-${Date.now()}`,
              leadId: l.id,
              fromStatus: l.status,
              toStatus: l.status,
              note: `Conflict resolved in favor of ${winningPartner?.name}. Reason: ${reason}`,
              visibleToPartner: true,
              actor: { type: "admin" as const, name: "SuperAdmin" },
              timestamp: now,
            },
            ...l.events,
          ]
        };
      }
      return l;
    });

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "SuperAdmin",
      action: "conflict_resolved",
      entity: "lead",
      entityId: leadId,
      details: `Lead awarded to partner ${winningPartnerId}. Reason: ${reason}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      leads: updatedLeads,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Action: Partner requests payout
  const requestPayout = (amountPaise: number, payoutMethodId: string, note?: string) => {
    if (amountPaise > globalState.currentPartner.stats.availablePaise) {
      throw new Error("Requested amount exceeds available balance");
    }

    const method = globalState.currentPartner.payoutMethods.find((m) => m.id === payoutMethodId);
    if (!method) throw new Error("Invalid payout method");

    const now = new Date().toISOString();
    const tdsPaise = Math.round(amountPaise * (globalState.settings.tdsRatePercent / 100));
    const netPayablePaise = amountPaise - tdsPaise;
    const payoutId = `pay-${Date.now()}`;

    // Mark eligible available earnings as requested
    const updatedEarnings = globalState.earnings.map((e) => {
      if (e.status === "available" && e.partnerId === globalState.currentPartner.id) {
        return { ...e, status: "requested" as const, payoutId };
      }
      return e;
    });

    const newPayout: PayoutRequest = {
      id: payoutId,
      partnerId: globalState.currentPartner.id,
      partnerName: globalState.currentPartner.name,
      amountPaise,
      tdsPaise,
      netPayablePaise,
      method,
      status: "requested",
      earningIds: updatedEarnings.filter((e) => e.payoutId === payoutId).map((e) => e.id),
      requestNote: note,
      requestedAt: now,
    };

    const updatedPartner = {
      ...globalState.currentPartner,
      stats: {
        ...globalState.currentPartner.stats,
        availablePaise: globalState.currentPartner.stats.availablePaise - amountPaise,
      }
    };

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: `Partner (${globalState.currentPartner.name})`,
      action: "payout_requested",
      entity: "payout",
      entityId: payoutId,
      details: `Requested ₹${amountPaise / 100} (Net ₹${netPayablePaise / 100}) to ${method.type === "upi" ? method.upiId : method.accountNumberMasked}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      currentPartner: updatedPartner,
      payouts: [newPayout, ...globalState.payouts],
      earnings: updatedEarnings,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();

    return newPayout;
  };

  // Action: Admin marks payout as Paid with UTR
  const markPayoutPaid = (payoutId: string, utr: string, proofUrl?: string) => {
    const now = new Date().toISOString();
    const payout = globalState.payouts.find((p) => p.id === payoutId);
    if (!payout) return;

    const updatedPayouts = globalState.payouts.map((p) => {
      if (p.id === payoutId) {
        return {
          ...p,
          status: "paid" as const,
          utr,
          proofUrl: proofUrl || "/proofs/sample_utr.png",
          paidAt: now,
          reviewedBy: "Finance Admin",
        };
      }
      return p;
    });

    // Mark linked earnings as paid
    const updatedEarnings = globalState.earnings.map((e) => {
      if (e.payoutId === payoutId) {
        return { ...e, status: "paid" as const };
      }
      return e;
    });

    // Update partner paidOutPaise
    const updatedPartner = {
      ...globalState.currentPartner,
      stats: {
        ...globalState.currentPartner.stats,
        paidOutPaise: globalState.currentPartner.stats.paidOutPaise + payout.amountPaise,
      }
    };

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Finance Admin",
      action: "payout_paid",
      entity: "payout",
      entityId: payoutId,
      details: `Marked ₹${payout.netPayablePaise / 100} paid. UTR: ${utr}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      currentPartner: updatedPartner,
      payouts: updatedPayouts,
      earnings: updatedEarnings,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Action: Partner claims offer
  const claimOffer = (offerId: string, deliveryDetails: { shippingAddress?: string; phone?: string; email?: string }) => {
    const offer = globalState.offers.find((o) => o.id === offerId);
    if (!offer) throw new Error("Offer not found");

    const now = new Date().toISOString();
    const claimId = `claim-${Date.now()}`;

    const newClaim: RewardClaim = {
      id: claimId,
      offerId,
      offerTitle: offer.title,
      partnerId: globalState.currentPartner.id,
      partnerName: globalState.currentPartner.name,
      rewardName: offer.rewardName,
      rewardType: offer.rewardType,
      deliveryDetails,
      status: "claimed",
      claimedAt: now,
    };

    // If it's a cash bonus, directly credit to earnings
    let newEarnings = [...globalState.earnings];
    if (offer.rewardType === "cash_bonus") {
      newEarnings = [
        {
          id: `earn-${Date.now()}`,
          partnerId: globalState.currentPartner.id,
          type: "offer_cash",
          amountPaise: offer.rewardValuePaise,
          tdsAmountPaise: 0,
          netAmountPaise: offer.rewardValuePaise,
          status: "available",
          availableAt: now,
          createdAt: now,
          reason: `Unlocked ${offer.title} reward bonus`,
          planSnapshot: {
            planId: "bonus",
            planName: "Reward Milestone",
            rateOrFixed: `₹${offer.rewardValuePaise / 100}`,
          }
        },
        ...newEarnings
      ];
    }

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: `Partner (${globalState.currentPartner.name})`,
      action: "offer_claimed",
      entity: "offer",
      entityId: offerId,
      details: `Claimed ${offer.title}. Reward: ${offer.rewardName}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      claims: [newClaim, ...globalState.claims],
      earnings: newEarnings,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();

    return newClaim;
  };

  // Action: Admin dispatches reward claim
  const updateClaimStatus = (
    claimId: string, 
    status: "approved" | "dispatched" | "delivered" | "rejected", 
    meta?: { courierName?: string; trackingNumber?: string; voucherCode?: string; rejectReason?: string }
  ) => {
    const now = new Date().toISOString();
    const updatedClaims = globalState.claims.map((c) => {
      if (c.id === claimId) {
        return {
          ...c,
          status,
          courierName: meta?.courierName || c.courierName,
          trackingNumber: meta?.trackingNumber || c.trackingNumber,
          voucherCode: meta?.voucherCode || c.voucherCode,
          rejectReason: meta?.rejectReason || c.rejectReason,
          handledAt: now,
        };
      }
      return c;
    });

    const auditEntry: AuditLog = {
      id: `log-${Date.now()}`,
      actor: "Admin",
      action: `claim_${status}`,
      entity: "reward_claim",
      entityId: claimId,
      details: `Updated reward claim status to ${status}`,
      timestamp: now,
    };

    globalState = {
      ...globalState,
      claims: updatedClaims,
      auditLogs: [auditEntry, ...globalState.auditLogs],
    };
    notify();
  };

  // Action: Switch Partner (Impersonation / multi-partner test)
  const switchPartner = (partnerId: string) => {
    const found = globalState.partners.find((p) => p.id === partnerId);
    if (found) {
      globalState = { 
        ...globalState, 
        currentPartner: found,
        authSession: {
          userType: "partner",
          partnerId: found.id,
        }
      };
      notify();
    }
  };

  // Action: Reset demo state
  const resetDemoState = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    globalState = {
      authSession: {
        userType: "partner",
        partnerId: initialPartner.id,
      },
      currentPartner: initialPartner,
      partners: initialAllPartners,
      leads: initialLeads,
      offers: initialOffers,
      earnings: initialEarnings,
      payouts: initialPayouts,
      claims: initialRewardClaims,
      commissionPlans: initialCommissionPlans,
      tiers: initialTiers,
      settings: initialSettings,
      auditLogs: initialAuditLogs,
    };
    notify();
  };

  return {
    ...state,
    partnerLogin,
    partnerSignup,
    adminLogin,
    logout,
    approvePartner,
    rejectPartner,
    suspendPartner,
    addLead,
    updateLeadStatus,
    resolveConflict,
    requestPayout,
    markPayoutPaid,
    claimOffer,
    updateClaimStatus,
    switchPartner,
    resetDemoState,
  };
}
