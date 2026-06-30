import type { ApiResult } from '../client';
import type {
    ConfirmationContext,
    CreatePlanRequest,
    CustomerPlanDecisionRequest,
    DisputeItem,
    PlanDetail,
    PlanPreviewRequest,
    PlanPreviewResponse,
    PlanSummary,
    RejectPlanRequest,
} from '../types';
import { addPlan, getPlanDetail, plans, updatePlanStatus, uuid } from './data';

function mapPlanSummary(plan: PlanSummary) {
    return { ...plan };
}

export async function listPlans(params?: { status?: string; search?: string }): Promise<ApiResult<PlanSummary[]>> {
    let items = plans.map(mapPlanSummary);
    if (params?.status && params.status !== 'all') {
        items = items.filter((p) => p.status.toLowerCase() === params.status!.toLowerCase());
    }
    if (params?.search) {
        const q = params.search.toLowerCase();
        items = items.filter((p) => getPlanDetail(p.id)?.productName?.toLowerCase().includes(q));
    }
    return { ok: true, data: items };
}

export async function getPlan(id: string): Promise<ApiResult<PlanDetail>> {
    const detail = getPlanDetail(id);
    if (!detail) return { ok: false, error: 'NOT_FOUND', message: 'Plano não encontrado' };
    return { ok: true, data: detail };
}

export async function previewPlan(body: PlanPreviewRequest): Promise<ApiResult<PlanPreviewResponse>> {
    const balance = Math.max(0, body.productValueCentavos - body.downPaymentCentavos);
    const count = Math.max(1, body.installmentCount);
    const base = Math.floor(balance / count);
    const installments = Array.from({ length: count }, (_, i) => {
        const isLast = i === count - 1;
        const amount = isLast ? balance - base * (count - 1) : base;
        return {
            sequence: i + 1,
            dueDate: body.firstDueDate,
            amountDueCentavos: amount,
        };
    });
    return { ok: true, data: { remainingBalanceCentavos: balance, installments } };
}

export async function createPlan(body: CreatePlanRequest): Promise<ApiResult<PlanSummary>> {
    const balance = body.productValueCentavos - body.downPaymentCentavos;
    const count = Math.max(1, body.installmentCount);
    const base = Math.floor(balance / count);
    const plan: PlanSummary = {
        id: uuid(),
        status: 'PENDING_CONFIRMATION',
        remainingBalanceCentavos: balance,
        totalPaidCentavos: 0,
        disputed: false,
        installments: Array.from({ length: count }, (_, i) => {
            const isLast = i === count - 1;
            const amount = isLast ? balance - base * (count - 1) : base;
            return {
                id: uuid(),
                sequence: i + 1,
                dueDate: body.firstDueDate,
                amountDueCentavos: amount,
                amountPaidCentavos: 0,
                status: 'PENDING',
                disputed: false,
            };
        }),
    };
    addPlan(plan);
    return { ok: true, data: plan };
}

export async function getConfirmationContext(_token: string): Promise<ApiResult<ConfirmationContext>> {
    const plan = plans[0];
    return {
        ok: true,
        data: {
            planId: plan.id,
            status: 'PENDING_CONFIRMATION',
            merchantName: 'Loja Bom Preço',
            productName: 'Telemóvel Samsung A14',
            productValueCentavos: 1_500_00,
            downPaymentCentavos: 500_00,
            remainingBalanceCentavos: 1_000_00,
            installments: plan.installments,
            requiresOtp: true,
        },
    };
}

export async function confirmPlan(id: string, _body: CustomerPlanDecisionRequest): Promise<ApiResult<PlanSummary>> {
    updatePlanStatus(id, 'ACTIVE');
    const plan = getPlanDetail(id);
    if (!plan) return { ok: false, error: 'NOT_FOUND', message: 'Plano não encontrado' };
    return { ok: true, data: plan };
}

export async function rejectPlan(id: string, _body: RejectPlanRequest): Promise<ApiResult<PlanSummary>> {
    updatePlanStatus(id, 'REJECTED');
    const plan = getPlanDetail(id);
    if (!plan) return { ok: false, error: 'NOT_FOUND', message: 'Plano não encontrado' };
    return { ok: true, data: plan };
}

export async function cancelPlan(id: string): Promise<ApiResult<PlanSummary>> {
    updatePlanStatus(id, 'CANCELLED');
    const plan = getPlanDetail(id);
    if (!plan) return { ok: false, error: 'NOT_FOUND', message: 'Plano não encontrado' };
    return { ok: true, data: plan };
}

export async function disputePlan(_id: string, _reason: string): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED', message: 'Use a API de disputas para criar uma reclamação' };
}
