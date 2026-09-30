export type PartnerType = 
  | 'marketing_agency' 
  | 'shopify_agency' 
  | 'freelancer' 
  | 'existing_customer' 
  | 'other';

export type PartnerStatus = 
  | 'pending_approval' 
  | 'active' 
  | 'suspended' 
  | 'rejected' 
  | 'deactivated';

export type LeadStatus = 
  | 'new' 
  | 'demo_booked' 
  | 'trial' 
  | 'paid' 
  | 'onboarded' 
  | 'lost' 
  | 'churned';

export type LeadSource = 'link' | 'manual' | 'admin';

export type ConflictStatus = 'none' | 'pending_review' | 'resolved';

export type CommissionPlanType = 
  | 'fixed_per_client' 
  | 'one_time_percentage' 
  | 'recurring_n_months' 
  | 'recurring_lifetime' 
  | 'hybrid' 
  | 'gift_non_cash';

export type EarningType = 
  | 'commission' 
  | 'bonus' 
  | 'adjustment' 
  | 'reversal' 
  | 'offer_cash';

export type EarningStatus = 
  | 'pending' 
  | 'available' 
  | 'requested' 
  | 'paid' 
  | 'reversed';

export type PayoutStatus = 
  | 'requested' 
  | 'under_review' 
  | 'approved' 
  | 'paid' 
  | 'rejected';

export type OfferType = 
  | 'milestone_gift' 
  | 'voucher' 
  | 'cash_bonus' 
  | 'commission_boost' 
  | 'leaderboard_contest' 
  | 'retner_credits';

export type RewardClaimStatus = 
  | 'claimed' 
  | 'approved' 
  | 'dispatched' 
  | 'delivered' 
  | 'rejected';

export interface PayoutMethod {
  id: string;
  type: 'upi' | 'bank_account';
  upiId?: string;
  accountNumberMasked?: string;
  accountNumberFull?: string;
  ifsc?: string;
  holderName: string;
  verified: boolean;
}

export interface PartnerKYC {
  pan: string;
  legalName: string;
  gstin?: string;
  status: 'not_submitted' | 'pending' | 'verified' | 'rejected';
  documents: {
    type: 'cancelled_cheque' | 'pan_card' | 'bank_statement';
    url: string;
    uploadedAt: string;
  }[];
}

export interface PartnerTermsAgreement {
  agreed: boolean;
  version: string;
  agreedAt: string;
  legalEntity: string;
  governingLaw: string;
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  email: string;
  password?: string;
  type: PartnerType;
  companyName?: string;
  city: string;
  website?: string;
  d2cBrandsCount?: number;
  status: PartnerStatus;
  tierId: string;
  planOverrideId?: string;
  referralCode: string;
  customSlug?: string;
  kyc: PartnerKYC;
  termsAgreement?: PartnerTermsAgreement;
  payoutMethods: PayoutMethod[];
  notificationPrefs: {
    whatsapp: boolean;
    email: boolean;
  };
  stats: {
    clicks: number;
    uniqueVisitors: number;
    leadsCount: number;
    paidCount: number;
    conversionRate: number;
    totalEarnedPaise: number;
    availablePaise: number;
    pendingPaise: number;
    paidOutPaise: number;
  };
  createdAt: string;
}

export interface LeadEvent {
  id: string;
  leadId: string;
  fromStatus: LeadStatus | null;
  toStatus: LeadStatus;
  note: string;
  visibleToPartner: boolean;
  actor: {
    type: 'system' | 'admin' | 'partner';
    name: string;
  };
  timestamp: string;
}

export interface Lead {
  id: string;
  partnerId: string;
  partnerName?: string;
  brandName: string;
  website: string;
  shopDomain?: string;
  source: LeadSource;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  monthlyRevenueRange: string;
  currentToolsUsed?: string;
  notes?: string;
  status: LeadStatus;
  lostReason?: string;
  conflictStatus: ConflictStatus;
  clickId?: string;
  attributedAt: string;
  protectionExpiresAt: string;
  commissionEarnedPaise: number;
  retnerAccountId?: string;
  events: LeadEvent[];
}

export interface CommissionPlan {
  id: string;
  name: string;
  description: string;
  type: CommissionPlanType;
  fixedAmountPaise?: number;
  percentageRate?: number;
  basisMonths?: number;
  monthsCount?: number;
  lifetimeCapPaise?: number;
  holdPeriodDays: number;
  qualifyingStatus: LeadStatus;
  active: boolean;
  version: number;
  workedExample: string;
}

export interface Tier {
  id: string;
  name: string;
  order: number;
  badgeColor: string;
  iconName: string;
  thresholdMetric: 'paid_referrals' | 'revenue_paise';
  thresholdValue: number;
  linkedPlanId: string;
  perks: string[];
}

export interface Earning {
  id: string;
  partnerId: string;
  leadId?: string;
  leadBrandName?: string;
  type: EarningType;
  amountPaise: number;
  tdsAmountPaise: number;
  netAmountPaise: number;
  status: EarningStatus;
  availableAt: string;
  createdAt: string;
  reason: string;
  planSnapshot: {
    planId: string;
    planName: string;
    rateOrFixed: string;
  };
  payoutId?: string;
}

export interface PayoutRequest {
  id: string;
  partnerId: string;
  partnerName: string;
  amountPaise: number;
  tdsPaise: number;
  netPayablePaise: number;
  method: PayoutMethod;
  status: PayoutStatus;
  earningIds: string[];
  requestNote?: string;
  reviewedBy?: string;
  utr?: string;
  proofUrl?: string;
  rejectReason?: string;
  requestedAt: string;
  paidAt?: string;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  description: string;
  heroImage: string;
  rewardType: OfferType;
  rewardName: string;
  rewardValuePaise: number;
  targetCount: number;
  targetStatus: LeadStatus;
  windowOnly: boolean;
  startAt: string;
  endAt: string;
  status: 'draft' | 'scheduled' | 'live' | 'paused' | 'ended';
  eligibleTiers: string[];
  terms: string;
  featured: boolean;
  userProgress?: number; // Calculated for the current partner
  unlocked?: boolean;
}

export interface RewardClaim {
  id: string;
  offerId: string;
  offerTitle: string;
  partnerId: string;
  partnerName: string;
  rewardName: string;
  rewardType: OfferType;
  deliveryDetails: {
    shippingAddress?: string;
    phone?: string;
    email?: string;
  };
  courierName?: string;
  trackingNumber?: string;
  voucherCode?: string;
  status: RewardClaimStatus;
  claimedAt: string;
  handledAt?: string;
  rejectReason?: string;
}

export interface ProgramSettings {
  attributionWindowDays: number;
  leadProtectionDays: number;
  autoApprovePartners: boolean;
  defaultHoldDays: number;
  minPayoutPaise: number;
  maxOpenPayouts: number;
  tdsRatePercent: number;
  tdsAnnualThresholdPaise: number;
  notificationAlertEmails: string[];
  campaignStartAt?: string;
  campaignEndAt?: string;
  qualifyingPlans?: string[];
}

export interface AuditLog {
  id: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
}
