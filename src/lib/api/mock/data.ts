import type {
    Centavos,
    CollectionRate,
    CustomerActivityItem,
    CustomerDashboard,
    CustomerDetail,
    CustomerObligation,
    CustomerSummary,
    DisputeItem,
    Installment,
    MerchantDashboard,
    MerchantProfile,
    MerchantStats,
    MonthlyCollection,
    NotificationItem,
    NotificationPrefs,
    PaymentHistoryItem,
    PaymentHistoryStats,
    PaymentMethod,
    PaymentRecord,
    PaymentRecordDetail,
    PaymentRegistrationSession,
    PlanDetail,
    PlanScheduleItem,
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

const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

/** '28 Jun' style display date. */
export function displayDate(d = new Date()): string {
    return `${d.getDate()} ${MONTHS_PT[d.getMonth()]}`;
}

/** '28 Jun 2026' style display date (with year), used by plan schedules. */
export function displayDateFull(d = new Date()): string {
    return `${d.getDate()} ${MONTHS_PT[d.getMonth()]} ${d.getFullYear()}`;
}

/** Build a customer-facing schedule from a plan's installments (money → meticais). */
export function deriveSchedule(installments: Installment[]): PlanScheduleItem[] {
    return installments.map((inst) => ({
        n: inst.sequence,
        amount: Math.round(inst.amountDueCentavos / 100),
        date: displayDateFull(new Date(inst.dueDate)),
        status: inst.status === 'PAID' ? 'paid' : 'due',
    }));
}

/** Next payment amount (meticais): first unpaid installment, else 0. */
export function deriveNextAmount(installments: Installment[]): number {
    const next = installments.find((i) => i.status !== 'PAID');
    return next ? Math.round(next.amountDueCentavos / 100) : 0;
}

/** '14:32' style display time. */
export function displayTime(d = new Date()): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function installment(id: UUID, sequence: number, dueDate: string, amount: Centavos, paid: Centavos): Installment {
    const status = paid >= amount ? 'PAID' : paid > 0 ? 'PARTIALLY_PAID' : new Date(dueDate) < new Date() ? 'OVERDUE' : 'PENDING';
    return { id, sequence, dueDate, amountDueCentavos: amount, amountPaidCentavos: paid, status, disputed: false };
}

// ── Merchant profile ──────────────────────────────────────────────────────
export const merchantProfile: MerchantProfile = {
    id: uuid(),
    businessName: 'Loja Aurora',
    businessCategory: 'Comércio a retalho',
    status: 'ACTIVE',
};

/** Reference display details + notification preferences for the profile screen. */
export const merchantDetails: {
    name: string;
    store: string;
    phone: string;
    location: string;
    joinDate: string;
    notificationPrefs: NotificationPrefs;
} = {
    name: 'Carlos Mondlane',
    store: 'Loja Aurora',
    phone: '84 555 1234',
    location: 'Maputo Centro',
    joinDate: 'Março 2026',
    notificationPrefs: { payments: true, overdue: true, disputes: true, weekly: false, marketing: false },
};

// ── Stats + series (Estatísticas screen) ────────────────────────────────────
const monthlyCollections: MonthlyCollection[] = [
    { month: 'Jan', amount: 32000 },
    { month: 'Fev', amount: 41000 },
    { month: 'Mar', amount: 38500 },
    { month: 'Abr', amount: 52000 },
    { month: 'Mai', amount: 54200 },
    { month: 'Jun', amount: 67500 },
];

const collectionRates: CollectionRate[] = [
    { month: 'Jan', rate: 78 },
    { month: 'Fev', rate: 82 },
    { month: 'Mar', rate: 80 },
    { month: 'Abr', rate: 85 },
    { month: 'Mai', rate: 83 },
    { month: 'Jun', rate: 88 },
];

export const merchantStats: MerchantStats = {
    totalReceivable: 125750,
    dueToday: 12500,
    dueTodayCount: 2,
    overdue: 8500,
    overdueCount: 1,
    overdueDays: 15,
    pending: 15000,
    pendingCount: 1,
    activeCustomers: 24,
    activePlans: 18,
    completedPlans: 42,
    collected: 67500,
    collectedPrev: 54200,
    monthlyCollections,
    collectionRates,
};

// ── Customers ───────────────────────────────────────────────────────────────
function toneForRisk(risk: 'low' | 'medium' | 'high'): CustomerSummary['tone'] {
    return risk === 'low' ? 'green' : risk === 'medium' ? 'amber' : 'red';
}

const refCustomers: Array<{
    id: string;
    name: string;
    phone: string;
    score: number;
    risk: 'low' | 'medium' | 'high';
    activePlans: number;
    totalOwing: number;
    lastPayment: string;
}> = [
    { id: '1', name: 'Anísio Cumbe', phone: '84 123 4567', score: 72, risk: 'low', activePlans: 2, totalOwing: 7500, lastPayment: '28 Mai' },
    { id: '2', name: 'Fátima Nhaca', phone: '84 234 5678', score: 85, risk: 'low', activePlans: 1, totalOwing: 3500, lastPayment: '25 Mai' },
    { id: '3', name: 'Jorge Sitoe', phone: '84 345 6789', score: 45, risk: 'high', activePlans: 1, totalOwing: 12000, lastPayment: '10 Abr' },
    { id: '4', name: 'Maria Tembe', phone: '84 456 7890', score: 60, risk: 'medium', activePlans: 3, totalOwing: 18500, lastPayment: '22 Mai' },
    { id: '5', name: 'Pedro Macamo', phone: '84 567 8901', score: 78, risk: 'low', activePlans: 1, totalOwing: 5000, lastPayment: '1 Jun' },
    { id: '6', name: 'Rosa Chissano', phone: '84 678 9012', score: 55, risk: 'medium', activePlans: 2, totalOwing: 9250, lastPayment: '15 Mai' },
    { id: '7', name: 'Samuel Dube', phone: '84 789 0123', score: 90, risk: 'low', activePlans: 1, totalOwing: 2500, lastPayment: '28 Jun' },
    { id: '8', name: 'Teresa Zitha', phone: '84 890 1234', score: 35, risk: 'high', activePlans: 2, totalOwing: 15000, lastPayment: '2 Abr' },
];

export const customers: CustomerSummary[] = refCustomers.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    score: c.score,
    activePlans: c.activePlans,
    tone: toneForRisk(c.risk),
    totalOwing: c.totalOwing,
    lastPayment: c.lastPayment,
    risk: c.risk,
}));

// ── Plans ─────────────────────────────────────────────────────────────────
/** Build a schedule from flat reference values (meticais → centavos). */
function buildInstallments(totalMt: number, count: number, current: number): Installment[] {
    if (count <= 0) return [];
    const each = Math.round(totalMt / count);
    return Array.from({ length: count }, (_, i) => {
        const seq = i + 1;
        const isLast = seq === count;
        const amountMt = isLast ? totalMt - each * (count - 1) : each;
        const paidMt = seq < current ? amountMt : 0;
        return installment(uuid(), seq, futureIso((seq - current) * 30), amountMt * 100, paidMt * 100);
    });
}

const refPlans: Array<{
    id: string;
    customerId: string;
    customer: string;
    product: string;
    total: number;
    paid: number;
    remaining: number;
    state: 'active' | 'due_today' | 'overdue' | 'pending';
    nextDate: string;
    installments: number;
    current: number;
    /** Optional customer-reference schedule (source of truth for the customer's own plan). */
    schedule?: PlanScheduleItem[];
}> = [
    {
        id: '1', customerId: '1', customer: 'Anísio Cumbe', product: 'Samsung Galaxy A14', total: 7500, paid: 5000, remaining: 2500, state: 'active', nextDate: '28 Jun', installments: 3, current: 3,
        schedule: [
            { n: 1, amount: 2500, date: '28 Abr 2026', status: 'paid' },
            { n: 2, amount: 2500, date: '28 Mai 2026', status: 'paid' },
            { n: 3, amount: 2500, date: '28 Jun 2026', status: 'due' },
        ],
    },
    { id: '2', customerId: '2', customer: 'Fátima Nhaca', product: 'Televisão 32"', total: 12000, paid: 8500, remaining: 3500, state: 'active', nextDate: '30 Jun', installments: 4, current: 3 },
    { id: '3', customerId: '3', customer: 'Jorge Sitoe', product: 'Frigorífico LG', total: 25000, paid: 13000, remaining: 12000, state: 'overdue', nextDate: '15 Jun', installments: 5, current: 3 },
    { id: '4', customerId: '4', customer: 'Maria Tembe', product: 'Sofá 3 lugares', total: 18500, paid: 0, remaining: 18500, state: 'pending', nextDate: '1 Jul', installments: 6, current: 1 },
    { id: '5', customerId: '5', customer: 'Pedro Macamo', product: 'Máquina de lavar', total: 15000, paid: 10000, remaining: 5000, state: 'active', nextDate: '5 Jul', installments: 3, current: 3 },
    { id: '6', customerId: '6', customer: 'Rosa Chissano', product: 'iPhone 13', total: 35000, paid: 25750, remaining: 9250, state: 'due_today', nextDate: '30 Jun', installments: 4, current: 4 },
];

export const plans: PlanSummary[] = refPlans.map((p) => {
    const installments = buildInstallments(p.total, p.installments, p.current);
    return {
        id: p.id,
        status: (p.state === 'pending' ? 'PENDING_CONFIRMATION' : 'ACTIVE') as PlanStatus,
        remainingBalanceCentavos: p.remaining * 100,
        totalPaidCentavos: p.paid * 100,
        disputed: p.id === '3', // Jorge Sitoe's plan is under dispute (review)
        installments,
        productName: p.product,
        customerName: p.customer,
        customerId: p.customerId,
        currentInstallment: p.current,
        installmentsTotal: p.installments,
        total: p.total,
        paid: p.paid,
        remaining: p.remaining,
        nextAmount: deriveNextAmount(installments),
        nextDate: p.nextDate,
        state: p.state,
        schedule: p.schedule ?? deriveSchedule(installments),
    };
});

export function getPlanDetail(id: UUID): PlanDetail | undefined {
    const plan = plans.find((p) => p.id === id);
    if (!plan) return undefined;
    return {
        ...plan,
        merchantName: merchantProfile.businessName,
        customerName: plan.customerName,
        productName: plan.productName,
        disputeStatus: plan.disputed ? 'OPEN' : null,
    };
}

// ── Payment registration records (plan payment flow) ────────────────────────
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

// ── Payment history (merchant history screen) ───────────────────────────────
export const paymentHistory: PaymentHistoryItem[] = [
    { id: '1', customer: 'Samuel Dube', plan: 'Rádio Portátil', amount: 2500, method: 'mpesa', status: 'confirmed', date: '28 Jun', time: '14:32', ref: 'MP-78291' },
    { id: '2', customer: 'Pedro Macamo', plan: 'Máquina de lavar', amount: 5000, method: 'cash', status: 'confirmed', date: '27 Jun', time: '09:15', ref: 'CX-00142' },
    { id: '3', customer: 'Fátima Nhaca', plan: 'Televisão 32"', amount: 3000, method: 'mpesa', status: 'confirmed', date: '25 Jun', time: '11:20', ref: 'MP-78156' },
    { id: '4', customer: 'Anísio Cumbe', plan: 'Samsung Galaxy A14', amount: 2500, method: 'mpesa', status: 'pending', date: '24 Jun', time: '16:45', ref: 'MP-78089' },
    { id: '5', customer: 'Rosa Chissano', plan: 'iPhone 13', amount: 8750, method: 'bank', status: 'confirmed', date: '22 Jun', time: '10:30', ref: 'TB-04521' },
    { id: '6', customer: 'Maria Tembe', plan: 'Sofá 3 lugares', amount: 3083, method: 'mpesa', status: 'pending', date: '20 Jun', time: '13:10', ref: 'MP-77945' },
    { id: '7', customer: 'Pedro Macamo', plan: 'Máquina de lavar', amount: 5000, method: 'cash', status: 'confirmed', date: '15 Jun', time: '08:45', ref: 'CX-00138' },
    { id: '8', customer: 'Fátima Nhaca', plan: 'Televisão 32"', amount: 3000, method: 'bank', status: 'confirmed', date: '10 Jun', time: '14:00', ref: 'TB-04498' },
    { id: '9', customer: 'Anísio Cumbe', plan: 'Samsung Galaxy A14', amount: 2500, method: 'mpesa', status: 'confirmed', date: '5 Jun', time: '09:30', ref: 'MP-77801' },
    { id: '10', customer: 'Rosa Chissano', plan: 'iPhone 13', amount: 8750, method: 'mpesa', status: 'confirmed', date: '1 Jun', time: '15:20', ref: 'MP-77690' },
];

export function getPaymentStats(): PaymentHistoryStats {
    const totalConfirmed = paymentHistory
        .filter((p) => p.status === 'confirmed')
        .reduce((sum, p) => sum + p.amount, 0);
    const pendingCount = paymentHistory.filter((p) => p.status === 'pending').length;
    const counts = paymentHistory.reduce<Record<string, number>>((m, p) => {
        m[p.method] = (m[p.method] ?? 0) + 1;
        return m;
    }, {});
    const mostUsedMethod = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'mpesa') as PaymentHistoryItem['method'];
    return { totalConfirmed, pendingCount, mostUsedMethod };
}

// ── Notifications ───────────────────────────────────────────────────────────
export const notifications: NotificationItem[] = [
    { id: '1', channel: 'IN_APP', status: 'DELIVERED', type: 'payment', icon: 'check', message: 'Samuel Dube pagou 2.500 MT via M-Pesa', time: 'Há 2h', createdAt: isoNow(), read: false },
    { id: '2', channel: 'IN_APP', status: 'DELIVERED', type: 'overdue', icon: 'alert', message: 'Jorge Sitoe — pagamento em atraso há 15 dias', time: 'Há 5h', createdAt: isoNow(), read: false },
    { id: '3', channel: 'IN_APP', status: 'SENT', type: 'dispute', icon: 'flag', message: 'Teresa Zitha abriu uma disputa', time: 'Ontem', createdAt: isoNow(), read: true },
    { id: '4', channel: 'IN_APP', status: 'SENT', type: 'pending', icon: 'clock', message: 'Plano de Maria Tembe aguarda confirmação', time: 'Ontem', createdAt: isoNow(), read: true },
];

// ── Disputes ────────────────────────────────────────────────────────────────
export const disputes: DisputeItem[] = [
    {
        id: '1',
        planId: '',
        status: 'open',
        issueType: 'wrong_product',
        openedAt: isoNow(),
        customerName: 'Teresa Zitha',
        customerId: '8',
        plan: 'Computador Portátil',
        planProduct: 'Computador Portátil',
        amount: 7500,
        reason: 'Produto com defeito — ecrã danificado na entrega',
        opened: '23 Jun',
        timeline: [
            { type: 'opened', date: '23 Jun', time: '15:45', text: 'Disputa aberta pelo cliente' },
            { type: 'note', date: '24 Jun', time: '09:00', text: 'Cliente enviou fotos do ecrã danificado' },
            { type: 'action', date: '25 Jun', time: '10:30', text: 'Comerciante propôs substituição do produto' },
        ],
    },
    {
        id: '2',
        planId: '3',
        status: 'review',
        issueType: 'wrong_amount',
        openedAt: isoNow(),
        customerName: 'Jorge Sitoe',
        customerId: '3',
        plan: 'Frigorífico LG',
        planProduct: 'Frigorífico LG',
        amount: 12000,
        reason: 'Contesta valor da prestação — alega acordo diferente',
        opened: '18 Jun',
        timeline: [
            { type: 'opened', date: '18 Jun', time: '11:20', text: 'Disputa aberta pelo cliente' },
            { type: 'note', date: '19 Jun', time: '14:00', text: 'Equipa de suporte contactou ambas as partes' },
            { type: 'action', date: '20 Jun', time: '09:15', text: 'Em análise pela equipa MoyaPay' },
        ],
    },
    {
        id: '3',
        planId: '6',
        status: 'resolved',
        issueType: 'already_paid',
        openedAt: isoNow(),
        customerName: 'Rosa Chissano',
        customerId: '6',
        plan: 'iPhone 13',
        planProduct: 'iPhone 13',
        amount: 35000,
        reason: 'Pagamento M-Pesa não foi creditado na conta',
        opened: '5 Jun',
        resolved: '8 Jun',
        timeline: [
            { type: 'opened', date: '5 Jun', time: '16:30', text: 'Disputa aberta pelo cliente' },
            { type: 'note', date: '6 Jun', time: '10:00', text: 'Confirmação de transacção M-Pesa verificada' },
            { type: 'action', date: '7 Jun', time: '11:45', text: 'Pagamento confirmado manualmente' },
            { type: 'resolved', date: '8 Jun', time: '09:00', text: 'Disputa encerrada — pagamento creditado' },
        ],
    },
];

// ── Single-customer detail bundle ───────────────────────────────────────────
export function getCustomerDetail(id: UUID): CustomerDetail | undefined {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return undefined;
    return {
        customer,
        plans: plans.filter((p) => p.customerId === id),
        payments: paymentHistory.filter((p) => p.customer === customer.name),
        disputes: disputes.filter((d) => d.customerId === id),
    };
}

export function getCustomerDashboard(): CustomerDashboard {
    const activePlan = plans[0]; // Anísio's active 'Loja Aurora' plan
    const obligation: CustomerObligation = {
        planId: activePlan.id,
        merchantName: merchantProfile.businessName,
        productName: activePlan.productName ?? 'Samsung Galaxy A14',
        status: 'ACTIVE',
        remainingBalanceCentavos: activePlan.remainingBalanceCentavos,
        nextPaymentCentavos: 2_500_00,
        nextDueDate: futureIso(25),
        remainingInstallments: 1,
        disputed: false,
        disputeStatus: null,
        disputeOutcome: null,
        correctionSummary: null,
        notifications: [notifications[0]],
    };
    const recentActivity: CustomerActivityItem[] = [
        { merchant: 'Loja Aurora', amount: 2500, method: 'M-Pesa', date: '28 Mai' },
    ];
    return {
        totalOwedCentavos: activePlan.remainingBalanceCentavos,
        nextPaymentCentavos: 2_500_00,
        nextDueDate: futureIso(25),
        remainingInstallments: 1,
        score: 72,
        scoreLabel: 'Building' as ScoreLabel,
        obligations: [obligation],
        recentNotifications: notifications,
        // Customer-reference display fields (source of truth: ui_kits/customer/data.js)
        userName: 'Anísio',
        userPhone: '84 123 4567',
        nextAmount: 2500,
        nextDate: '28 Jun',
        currentInstallment: 2,
        installmentsTotal: 3,
        activePlanMerchant: 'Loja Aurora',
        recentActivity,
    };
}

export function getMerchantDashboard(): MerchantDashboard {
    const avgScore = Math.round(customers.reduce((s, c) => s + c.score, 0) / customers.length);
    return {
        activeInstallmentValueCentavos: merchantStats.totalReceivable * 100,
        activeCustomers: merchantStats.activeCustomers,
        pendingPayments: merchantStats.pendingCount,
        overduePayments: merchantStats.overdueCount,
        averageCustomerScore: avgScore,
        dueToday: plans.filter((p) => p.state === 'due_today'),
        overdueItems: plans.filter((p) => p.state === 'overdue'),
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

/** Append a note event to a dispute's timeline (merchant reference flow). */
export function addDisputeNoteById(id: UUID, text: string): DisputeItem | undefined {
    const d = disputes.find((x) => x.id === id);
    if (!d) return undefined;
    d.timeline = [...(d.timeline ?? []), { type: 'note', date: displayDate(), time: displayTime(), text }];
    return d;
}

/** Resolve a dispute: set status=resolved and append a resolved event. */
export function resolveMerchantDisputeById(id: UUID, text?: string): DisputeItem | undefined {
    const d = disputes.find((x) => x.id === id);
    if (!d) return undefined;
    d.status = 'resolved';
    d.resolved = displayDate();
    d.timeline = [
        ...(d.timeline ?? []),
        { type: 'resolved', date: displayDate(), time: displayTime(), text: text ?? 'Disputa encerrada' },
    ];
    const plan = plans.find((p) => p.id === d.planId);
    if (plan) plan.disputed = false;
    return d;
}

export function formatMoneyFromCentavos(centavos: Centavos): string {
    return `${(centavos / 100).toLocaleString('pt-MZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MZN`;
}

export const methods: PaymentMethod[] = ['M_PESA', 'CASH', 'BANK_TRANSFER'];
