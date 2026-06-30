import { api } from './client';
import type { ApiResult } from './client';
import type {
    PlanDetail,
    PlanSummary,
    CreatePlanRequest,
    PlanPreviewRequest,
    PlanPreviewResponse,
    CustomerPlanDecisionRequest,
    RejectPlanRequest,
    DisputeItem,
} from './types';

interface PreviewInstallmentRaw {
    sequence: number;
    due_date: string;
    amount_due_centavos: number;
}

interface PlanPreviewResponseRaw {
    remaining_balance_centavos: number;
    installments: PreviewInstallmentRaw[];
}

interface InstallmentRaw {
    id: string;
    sequence: number;
    due_date: string;
    amount_due_centavos: number;
    amount_paid_centavos: number;
    status: string;
    disputed: boolean;
}

interface PlanSummaryRaw {
    id: string;
    status: string;
    remaining_balance_centavos: number;
    total_paid_centavos: number;
    disputed: boolean;
    installments: InstallmentRaw[];
}

interface PlanDetailRaw extends PlanSummaryRaw {
    merchant_name?: string;
    customer_name?: string;
    product_name?: string;
    dispute_status?: string;
}

function mapInstallment(raw: InstallmentRaw) {
    return {
        id: raw.id,
        sequence: raw.sequence,
        dueDate: raw.due_date,
        amountDueCentavos: raw.amount_due_centavos,
        amountPaidCentavos: raw.amount_paid_centavos,
        status: raw.status as import('./types').InstallmentStatus,
        disputed: raw.disputed,
    };
}

function mapPlanSummary(raw: PlanSummaryRaw): PlanSummary {
    return {
        id: raw.id,
        status: raw.status as PlanSummary['status'],
        remainingBalanceCentavos: raw.remaining_balance_centavos,
        totalPaidCentavos: raw.total_paid_centavos,
        disputed: raw.disputed,
        installments: raw.installments.map(mapInstallment),
    };
}

export async function listPlans(params?: { status?: string; search?: string }): Promise<ApiResult<PlanSummary[]>> {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    const res = await api<PlanSummaryRaw[]>(`/plans${query}`, { method: 'GET' });
    if (!res.ok) return res;
    return { ok: true, data: res.data.map(mapPlanSummary) };
}

export async function getPlan(id: string): Promise<ApiResult<PlanDetail>> {
    const res = await api<PlanDetailRaw>(`/plans/${id}`, { method: 'GET' });
    if (!res.ok) return res;
    const detail: PlanDetail = {
        ...mapPlanSummary(res.data),
        merchantName: res.data.merchant_name,
        customerName: res.data.customer_name,
        productName: res.data.product_name,
        disputeStatus: (res.data.dispute_status as PlanDetail['disputeStatus']) ?? null,
    };
    return { ok: true, data: detail };
}

export async function previewPlan(body: PlanPreviewRequest): Promise<ApiResult<PlanPreviewResponse>> {
    const res = await api<PlanPreviewResponseRaw>('/plans/preview', {
        method: 'POST',
        body: {
            product_value_centavos: body.productValueCentavos,
            down_payment_centavos: body.downPaymentCentavos,
            installment_count: body.installmentCount,
            first_due_date: body.firstDueDate,
        },
    });
    if (!res.ok) return res;
    return {
        ok: true,
        data: {
            remainingBalanceCentavos: res.data.remaining_balance_centavos,
            installments: res.data.installments.map((i) => ({
                sequence: i.sequence,
                dueDate: i.due_date,
                amountDueCentavos: i.amount_due_centavos,
            })),
        },
    };
}

export async function createPlan(body: CreatePlanRequest): Promise<ApiResult<PlanSummary>> {
    const res = await api<PlanSummaryRaw>('/plans', {
        method: 'POST',
        body: {
            product_value_centavos: body.productValueCentavos,
            down_payment_centavos: body.downPaymentCentavos,
            installment_count: body.installmentCount,
            first_due_date: body.firstDueDate,
            customer_name: body.customerName,
            customer_phone_number: body.customerPhoneNumber,
            product_name: body.productName,
        },
    });
    if (!res.ok) return res;
    return { ok: true, data: mapPlanSummary(res.data) };
}

interface ConfirmationContextRaw {
    plan_id: string;
    status: string;
    merchant_name: string;
    product_name: string;
    product_value_centavos: number;
    down_payment_centavos: number;
    remaining_balance_centavos: number;
    installments: InstallmentRaw[];
    requires_otp: boolean;
}

export async function getConfirmationContext(token: string): Promise<ApiResult<import('./types').ConfirmationContext>> {
    const res = await api<ConfirmationContextRaw>(`/plans/confirm-context?token=${encodeURIComponent(token)}`, {
        method: 'GET',
    });
    if (!res.ok) return res;
    return {
        ok: true,
        data: {
            planId: res.data.plan_id,
            status: res.data.status as import('./types').ConfirmationContext['status'],
            merchantName: res.data.merchant_name,
            productName: res.data.product_name,
            productValueCentavos: res.data.product_value_centavos,
            downPaymentCentavos: res.data.down_payment_centavos,
            remainingBalanceCentavos: res.data.remaining_balance_centavos,
            installments: res.data.installments.map(mapInstallment),
            requiresOtp: res.data.requires_otp as true,
        },
    };
}

export async function confirmPlan(id: string, body: CustomerPlanDecisionRequest): Promise<ApiResult<PlanSummary>> {
    const res = await api<PlanSummaryRaw>(`/plans/${id}/confirm`, {
        method: 'POST',
        body: { confirmation_token: body.confirmationToken },
    });
    if (!res.ok) return res;
    return { ok: true, data: mapPlanSummary(res.data) };
}

export async function rejectPlan(id: string, body: RejectPlanRequest): Promise<ApiResult<PlanSummary>> {
    const res = await api<PlanSummaryRaw>(`/plans/${id}/reject`, {
        method: 'POST',
        body: {
            confirmation_token: body.confirmationToken,
            reason: body.reason,
            note: body.note,
        },
    });
    if (!res.ok) return res;
    return { ok: true, data: mapPlanSummary(res.data) };
}

export async function cancelPlan(id: string): Promise<ApiResult<PlanSummary>> {
    const res = await api<PlanSummaryRaw>(`/plans/${id}/cancel`, { method: 'POST' });
    if (!res.ok) return res;
    return { ok: true, data: mapPlanSummary(res.data) };
}

export async function disputePlan(id: string, reason: string): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}
