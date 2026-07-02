export type Centavos = number;
export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;

export type Role = 'MERCHANT' | 'CUSTOMER' | 'ADMIN';

export type PlanStatus =
    | 'PENDING_CONFIRMATION'
    | 'ACTIVE'
    | 'REJECTED'
    | 'CANCELLED'
    | 'COMPLETED'
    | 'EXPIRED';

export type InstallmentStatus =
    | 'PENDING'
    | 'PARTIALLY_PAID'
    | 'PAID'
    | 'OVERDUE';

export type PaymentStatus = 'RECORDED' | 'REVERSED';

export type DisputeStatus =
    | 'OPEN'
    | 'RESOLVED_NO_CHANGE'
    | 'RESOLVED_UPDATED'
    // Merchant reference display states (open | review | resolved)
    | 'open'
    | 'review'
    | 'resolved';

export type PaymentMethod = 'M_PESA' | 'CASH' | 'BANK_TRANSFER';

export type NotificationStatus =
    | 'PENDING'
    | 'SENT'
    | 'DELIVERED'
    | 'FAILED';

export type NotificationChannel = 'IN_APP' | 'SMS';

export type IssueType =
    | 'wrong_product'
    | 'wrong_amount'
    | 'already_paid'
    | 'wrong_due_date'
    | 'wrong_merchant'
    | 'other';

export type ResolutionType = 'no_change' | 'updated';

export type CorrectionAction = 'correct_amount' | 'correct_method' | 'reverse';

export type ScoreLabel = 'Excellent' | 'Building' | 'Needs Attention';

export type MerchantStatus = 'ACTIVE' | 'SUSPENDED';

export type RejectReason = 'terms' | 'not_mine';

export interface MerchantProfile {
    id: UUID;
    businessName: string;
    businessCategory: string;
    status: MerchantStatus;
}

/**
 * Notification preferences toggled on the merchant profile screen.
 * Reference defaults: payments/overdue/disputes ON, weekly/marketing OFF.
 */
export interface NotificationPrefs {
    payments: boolean;
    overdue: boolean;
    disputes: boolean;
    weekly: boolean;
    marketing: boolean;
}

export interface MerchantProfileResponse {
    id: string;
    business_name: string;
    business_category: string;
    status: string;
    // Optional display fields (mock/reference only; real backend may omit)
    name?: string;
    store?: string;
    phone?: string;
    location?: string;
    joinDate?: string;
    notificationPrefs?: NotificationPrefs;
}

export interface OtpVerifyResponse {
    jwt: string;
    roles: Role[];
    is_new: boolean;
    has_pin: boolean;
}

export interface LoginWithPinResponse {
    jwt: string;
    roles: Role[];
    is_new: boolean;
    has_pin: boolean;
}

export interface CreateMerchantProfileRequest {
    business_name: string;
    business_category: string;
}

export interface Installment {
    id: UUID;
    sequence: number;
    dueDate: ISODate;
    amountDueCentavos: Centavos;
    amountPaidCentavos: Centavos;
    status: InstallmentStatus;
    disputed: boolean;
}

export interface PreviewInstallment {
    sequence: number;
    dueDate: ISODate;
    amountDueCentavos: Centavos;
}

/**
 * A single row in a customer-facing plan schedule (customer plan-detail screen).
 * Money is integer meticais; date is a display string (e.g. '28 Jun 2026').
 */
export interface PlanScheduleItem {
    n: number;
    amount: number; // meticais
    date: string; // e.g. '28 Jun 2026'
    status: 'paid' | 'due';
}

export interface PlanSummary {
    id: UUID;
    status: PlanStatus;
    remainingBalanceCentavos: Centavos;
    totalPaidCentavos: Centavos;
    disputed: boolean;
    installments: Installment[];
    // Optional merchant-reference display fields (money values are integer meticais)
    productName?: string;
    customerName?: string;
    merchantName?: string;
    customerId?: UUID;
    currentInstallment?: number;
    installmentsTotal?: number;
    total?: number;
    paid?: number;
    remaining?: number;
    nextAmount?: number; // next payment amount in meticais
    nextDate?: string;
    state?: 'active' | 'due_today' | 'overdue' | 'pending';
    // Optional customer-reference plan-detail schedule (integer meticais)
    schedule?: PlanScheduleItem[];
}

export interface PlanDetail extends PlanSummary {
    merchantName?: string;
    customerName?: string;
    productName?: string;
    disputeStatus?: DisputeStatus | null;
}

export interface ConfirmationContext {
    planId: UUID;
    status: 'PENDING_CONFIRMATION';
    merchantName: string;
    productName: string;
    productValueCentavos: Centavos;
    downPaymentCentavos: Centavos;
    remainingBalanceCentavos: Centavos;
    installments: Installment[];
    requiresOtp: true;
}

export interface PlanPreviewRequest {
    productValueCentavos: Centavos;
    downPaymentCentavos: Centavos;
    installmentCount: number;
    firstDueDate: ISODate;
}

export interface CreatePlanRequest extends PlanPreviewRequest {
    customerName: string;
    customerPhoneNumber: string;
    productName: string;
}

export interface PlanPreviewResponse {
    remainingBalanceCentavos: Centavos;
    installments: PreviewInstallment[];
}

export interface CustomerPlanDecisionRequest {
    confirmationToken: string;
}

export interface RejectPlanRequest extends CustomerPlanDecisionRequest {
    reason: RejectReason;
    note?: string;
}

export interface PaymentRegistrationSession {
    id: UUID;
    planId: UUID;
    openedAt: ISODateTime;
}

export interface RecordPaymentRequest {
    planId: UUID;
    registrationSessionId: UUID;
    amountCentavos: Centavos;
    method: PaymentMethod;
}

export interface PaymentAllocation {
    installmentId: UUID;
    sequence: number;
    allocatedCentavos: Centavos;
}

export interface PaymentRecord {
    id: UUID;
    planId: UUID;
    registrationSessionId: UUID;
    amountCentavos: Centavos;
    method: PaymentMethod;
    status: PaymentStatus;
    disputed: boolean;
    recordedAt: ISODateTime;
}

export interface PaymentRecordDetail extends PaymentRecord {
    allocations: PaymentAllocation[];
}

/**
 * A row in the merchant payment-history screen. Money is integer meticais.
 * Distinct from PaymentRecord (which backs the plan payment-registration flow).
 */
export interface PaymentHistoryItem {
    id: UUID;
    customer: string;
    plan: string; // product name
    amount: number; // meticais
    method: 'mpesa' | 'cash' | 'bank';
    status: 'confirmed' | 'pending';
    date: string; // e.g. '28 Jun'
    time: string; // e.g. '14:32'
    ref: string; // e.g. 'MP-78291'
}

export interface PaymentHistoryStats {
    totalConfirmed: number; // sum of confirmed amounts (meticais)
    pendingCount: number;
    mostUsedMethod: 'mpesa' | 'cash' | 'bank';
}

export interface CreateDisputeRequest {
    planId: UUID;
    paymentId?: UUID;
    issueType: IssueType;
    note?: string;
}

export interface PlanFactCorrection {
    targetType: 'plan';
    reason: IssueType;
    note: string;
    correctedFields: {
        productName?: string;
        productValueCentavos?: Centavos;
        downPaymentCentavos?: Centavos;
        firstDueDate?: ISODate;
        customerName?: string;
    };
}

export interface PaymentRecordCorrection {
    targetType: 'payment_record';
    paymentId: UUID;
    reason: IssueType;
    action: CorrectionAction;
    note: string;
    correctedFields?: {
        amountCentavos?: Centavos;
        method?: PaymentMethod;
    };
}

export interface ResolveDisputeRequest {
    resolution: ResolutionType;
    correction?: PlanFactCorrection | PaymentRecordCorrection;
    resolutionNote?: string;
}

/** One event in a dispute timeline (merchant reference). */
export interface DisputeTimelineEvent {
    type: 'opened' | 'note' | 'action' | 'resolved';
    date: string; // e.g. '23 Jun'
    time: string; // e.g. '15:45'
    text: string;
}

export interface DisputeItem {
    id: UUID;
    planId: UUID;
    paymentId?: UUID;
    status: DisputeStatus;
    issueType: IssueType;
    outcome?: string;
    note?: string;
    openedAt?: ISODateTime;
    customerName?: string;
    planProduct?: string;
    // Optional merchant-reference display fields (amount is integer meticais)
    customerId?: UUID;
    plan?: string; // product name
    amount?: number;
    reason?: string;
    opened?: string; // e.g. '23 Jun'
    resolved?: string; // e.g. '8 Jun'
    timeline?: DisputeTimelineEvent[];
}

export interface NotificationItem {
    id: UUID;
    channel: NotificationChannel;
    status: NotificationStatus;
    message: string;
    createdAt: ISODateTime;
    read?: boolean;
    // Optional merchant-reference display fields
    type?: 'payment' | 'overdue' | 'dispute' | 'pending';
    time?: string; // relative label, e.g. 'Há 2h'
    icon?: string; // e.g. 'check' | 'alert' | 'flag' | 'clock'
}

export interface CorrectionSummary {
    currentRecordStatus: 'corrected' | 'unchanged';
    summary: string;
}

export interface CustomerObligation {
    planId: UUID;
    merchantName: string;
    productName: string;
    status: PlanStatus;
    remainingBalanceCentavos: Centavos;
    nextPaymentCentavos: Centavos;
    nextDueDate: ISODate | null;
    remainingInstallments: number;
    disputed: boolean;
    disputeStatus: DisputeStatus | null;
    disputeOutcome: string | null;
    correctionSummary: CorrectionSummary | null;
    notifications: NotificationItem[];
}

/**
 * A row in the customer dashboard "recent activity" (paid) feed.
 * Money is integer meticais; date is a display string (e.g. '28 Mai').
 */
export interface CustomerActivityItem {
    merchant: string;
    amount: number; // meticais
    method: string; // e.g. 'M-Pesa'
    date: string; // e.g. '28 Mai'
}

export interface CustomerDashboard {
    totalOwedCentavos: Centavos;
    nextPaymentCentavos: Centavos;
    nextDueDate: ISODate | null;
    remainingInstallments: number;
    score: number;
    scoreLabel: ScoreLabel;
    obligations: CustomerObligation[];
    recentNotifications: NotificationItem[];
    // Optional customer-reference display fields (money values are integer meticais)
    userName?: string; // e.g. 'Anísio'
    userPhone?: string; // e.g. '84 123 4567'
    nextAmount?: number; // next payment amount in meticais (e.g. 2500)
    nextDate?: string; // e.g. '28 Jun'
    currentInstallment?: number; // active plan installment progress, e.g. 2
    installmentsTotal?: number; // active plan installment count, e.g. 3
    activePlanMerchant?: string; // e.g. 'Loja Aurora'
    recentActivity?: CustomerActivityItem[]; // paid feed
}

export interface MerchantDashboard {
    activeInstallmentValueCentavos: Centavos;
    activeCustomers: number;
    pendingPayments: number;
    overduePayments: number;
    averageCustomerScore: number | null;
    dueToday: PlanSummary[];
    overdueItems: PlanSummary[];
    recentlyPaid: PaymentRecord[];
    businessName?: string;
    businessCategory?: string;
}

export interface MonthlyCollection {
    month: string; // Jan..Dez
    amount: number; // meticais
}

export interface CollectionRate {
    month: string; // Jan..Dez
    rate: number; // percent
}

/**
 * Aggregated stats for the merchant dashboard + Estatísticas screen.
 * All money values are integer meticais; counts are integers.
 */
export interface MerchantStats {
    totalReceivable: number;
    dueToday: number;
    dueTodayCount: number;
    overdue: number;
    overdueCount: number;
    overdueDays: number;
    pending: number;
    pendingCount: number;
    activeCustomers: number;
    activePlans: number;
    completedPlans: number;
    collected: number;
    collectedPrev: number;
    monthlyCollections: MonthlyCollection[];
    collectionRates: CollectionRate[];
}

export interface CustomerSummary {
    id: UUID;
    name: string;
    phone: string;
    score: number;
    activePlans: number;
    tone: 'blue' | 'green' | 'amber' | 'red' | 'slate';
    // Optional merchant-reference display fields (totalOwing is integer meticais)
    totalOwing?: number;
    lastPayment?: string; // e.g. '28 Mai'
    risk?: 'low' | 'medium' | 'high';
}

/** Single-customer detail bundle: their plans + payments + disputes. */
export interface CustomerDetail {
    customer: CustomerSummary;
    plans: PlanSummary[];
    payments: PaymentHistoryItem[];
    disputes: DisputeItem[];
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}
