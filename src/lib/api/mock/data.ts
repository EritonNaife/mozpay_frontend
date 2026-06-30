import type {
    Centavos,
    CustomerDashboard,
    CustomerObligation,
    CustomerSummary,
    DisputeItem,
    Installment,
    MerchantDashboard,
    MerchantProfile,
    NotificationItem,
    PaymentMethod,
    PaymentRecord,
    PaymentRecordDetail,
    PaymentRegistrationSession,
    PlanDetail,
    PlanStatus,
    PlanSummary,
    ScoreLabel,
    UUID,
} from '../types';

export function uuid(n = 8): UUID {
    return `${n}x`.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
}

export function todayIso(): string {
    return new Date().toISOString().slice(0, 10);
}

export function futureIso(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
}

export function isoNow(): string {
    return new Date().toISOString();
}

function installment(id: UUID, sequence: number, dueDate: string, amount: Centavos, paid: Centavos): Installment {
    const status = paid >= amount ? 'PAID' : paid > 0 ? 'PARTIALLY_PAID' : new Date(dueDate) < new Date() ? 'OVERDUE' : 'PENDING';
    return { id, sequence, dueDate, amountDueCentavos: amount, amountPaidCentavos: paid, status, disputed: false };
}

export const merchantProfile: MerchantProfile = {
    id: uuid(),
    businessName: 'Loja Bom Preço',
    businessCategory: 'Electrónica e telemóveis',
    status: 'ACTIVE',
};

export const customers: CustomerSummary[] = [
    { id: uuid(), name: 'Ana Maria', phone: '+258840000001', score: 78, activePlans: 2, tone: 'green' },
    { id: uuid(), name: 'Carlos M.', phone: '+258840000002', score: 45, activePlans: 1, tone: 'amber' },
    { id: uuid(), name: 'Fernanda P.', phone: '+258840000003', score: 92, activePlans: 1, tone: 'blue' },
];

const plan1Installments: Installment[] = [
    installment(uuid(), 1, futureIso(-5), 500_00, 500_00),
    installment(uuid(), 2, futureIso(25), 500_00, 0),
    installment(uuid(), 3, futureIso(55), 500_00, 0),
];

const plan2Installments: Installment[] = [
    installment(uuid(), 1, futureIso(10), 350_00, 0),
    installment(uuid(), 2, futureIso(40), 350_00, 0),
];

const plan3Installments: Installment[] = [
    installment(uuid(), 1, futureIso(-20), 400_00, 400_00),
    installment(uuid(), 2, futureIso(-10), 400_00, 400_00),
    installment(uuid(), 3, futureIso(5), 400_00, 0),
];

export const plans: PlanSummary[] = [
    {
        id: uuid(),
        status: 'ACTIVE',
        remainingBalanceCentavos: 1_000_00,
        totalPaidCentavos: 500_00,
        disputed: false,
        installments: plan1Installments,
    },
    {
        id: uuid(),
        status: 'PENDING_CONFIRMATION',
        remainingBalanceCentavos: 700_00,
        totalPaidCentavos: 0,
        disputed: false,
        installments: plan2Installments,
    },
    {
        id: uuid(),
        status: 'ACTIVE',
        remainingBalanceCentavos: 400_00,
        totalPaidCentavos: 800_00,
        disputed: true,
        installments: plan3Installments,
    },
];

export function getPlanDetail(id: UUID): PlanDetail | undefined {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return undefined;
    return {
        ...plan,
        merchantName: merchantProfile.businessName,
        customerName: customers.find((c) => c.id === customers[0].id)?.name,
        productName: id === plans[0].id ? 'Telemóvel Samsung A14' : id === plans[1].id ? 'Frigorífico Consul' : 'Colchão Ortopédico',
        disputeStatus: plan.disputed ? 'OPEN' : null,
    };
}

export const payments: PaymentRecord[] = [
    {
        id: uuid(),
        planId: plans[0].id,
        registrationSessionId: uuid(),
        amountCentavos: 500_00,
        method: 'M_PESA',
        status: 'RECORDED',
        disputed: false,
        recordedAt: isoNow(),
    },
    {
        id: uuid(),
        planId: plans[2].id,
        registrationSessionId: uuid(),
        amountCentavos: 400_00,
        method: 'CASH',
        status: 'RECORDED',
        disputed: false,
        recordedAt: isoNow(),
    },
];

export const paymentSessions: PaymentRegistrationSession[] = [];

export function getPaymentDetail(id: UUID): PaymentRecordDetail | undefined {
    const p = payments.find((x) => x.id === id);
    if (!p) return undefined;
    return { ...p, allocations: [{ installmentId: uuid(), sequence: 1, allocatedCentavos: p.amountCentavos }] };
}

export const notifications: NotificationItem[] = [
    { id: uuid(), channel: 'SMS', status: 'DELIVERED', message: 'Lembrete: pagamento de 5.000 MZN vence amanhã.', createdAt: isoNow(), read: false },
    { id: uuid(), channel: 'IN_APP', status: 'SENT', message: 'O seu plano na Loja Bom Preço foi confirmado.', createdAt: isoNow(), read: true },
];

export const disputes: DisputeItem[] = [
    {
        id: uuid(),
        planId: plans[2].id,
        status: 'OPEN',
        issueType: 'already_paid',
        note: 'Já paguei a prestação de Abril mas ainda aparece como pendente.',
        openedAt: isoNow(),
        customerName: customers[2].name,
        planProduct: 'Colchão Ortopédico',
    },
];

export function getCustomerDashboard(): CustomerDashboard {
    const obligation: CustomerObligation = {
        planId: plans[0].id,
        merchantName: merchantProfile.businessName,
        productName: 'Telemóvel Samsung A14',
        status: 'ACTIVE',
        remainingBalanceCentavos: 1_000_00,
        nextPaymentCentavos: 500_00,
        nextDueDate: futureIso(25),
        remainingInstallments: 2,
        disputed: false,
        disputeStatus: null,
        disputeOutcome: null,
        correctionSummary: null,
        notifications: [notifications[0]],
    };
    return {
        totalOwedCentavos: 1_000_00,
        nextPaymentCentavos: 500_00,
        nextDueDate: futureIso(25),
        remainingInstallments: 2,
        score: 78,
        scoreLabel: 'Building' as ScoreLabel,
        obligations: [obligation],
        recentNotifications: notifications,
    };
}

export function getMerchantDashboard(): MerchantDashboard {
    return {
        activeInstallmentValueCentavos: 2_050_00,
        activeCustomers: 3,
        pendingPayments: 1,
        overduePayments: 0,
        averageCustomerScore: 72,
        dueToday: [plans[0]],
        overdueItems: [],
        recentlyPaid: [payments[0]],
        businessName: merchantProfile.businessName,
        businessCategory: merchantProfile.businessCategory,
    };
}

export function addPlan(plan: PlanSummary) {
    plans.unshift(plan);
}

export function addPayment(payment: PaymentRecord) {
    payments.unshift(payment);
}

export function updatePlanStatus(id: UUID, status: PlanStatus) {
    const plan = plans.find((p) => p.id === id);
    if (plan) plan.status = status;
}

export function recordPaymentSession(session: PaymentRegistrationSession) {
    paymentSessions.unshift(session);
}

export function addDispute(dispute: DisputeItem) {
    disputes.unshift(dispute);
    const plan = plans.find((p) => p.id === dispute.planId);
    if (plan) plan.disputed = true;
}

export function resolveDisputeById(id: UUID, outcome: string) {
    const d = disputes.find((x) => x.id === id);
    if (!d) return;
    d.status = 'RESOLVED_NO_CHANGE';
    d.outcome = outcome;
    const plan = plans.find((p) => p.id === d.planId);
    if (plan) plan.disputed = false;
}

export function formatMoneyFromCentavos(centavos: Centavos): string {
    return `${(centavos / 100).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MZN`;
}

export const methods: PaymentMethod[] = ['M_PESA', 'CASH', 'BANK_TRANSFER'];
