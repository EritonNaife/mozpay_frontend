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
    | 'RESOLVED_UPDATED';

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

export interface MerchantProfileResponse {
    id: string;
    business_name: string;
    business_category: string;
    status: string;
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

export interface PlanSummary {
    id: UUID;
    status: PlanStatus;
    remainingBalanceCentavos: Centavos;
    totalPaidCentavos: Centavos;
    disputed: boolean;
    installments: Installment[];
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
}

export interface NotificationItem {
    id: UUID;
    channel: NotificationChannel;
    status: NotificationStatus;
    message: string;
    createdAt: ISODateTime;
    read?: boolean;
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

export interface CustomerDashboard {
    totalOwedCentavos: Centavos;
    nextPaymentCentavos: Centavos;
    nextDueDate: ISODate | null;
    remainingInstallments: number;
    score: number;
    scoreLabel: ScoreLabel;
    obligations: CustomerObligation[];
    recentNotifications: NotificationItem[];
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

export interface CustomerSummary {
    id: UUID;
    name: string;
    phone: string;
    score: number;
    activePlans: number;
    tone: 'blue' | 'green' | 'amber' | 'red' | 'slate';
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
}
