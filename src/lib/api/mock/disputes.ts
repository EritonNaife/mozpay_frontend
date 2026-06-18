import type { ApiResult } from '../client';
import type { CreateDisputeRequest, DisputeItem, ResolveDisputeRequest } from '../types';
import { addDispute, disputes, resolveDisputeById, uuid } from './data';

export async function listDisputes(): Promise<ApiResult<DisputeItem[]>> {
    return { ok: true, data: [...disputes] };
}

export async function createDispute(body: CreateDisputeRequest): Promise<ApiResult<DisputeItem>> {
    const dispute: DisputeItem = {
        id: uuid(),
        planId: body.planId,
        paymentId: body.paymentId,
        status: 'OPEN',
        issueType: body.issueType,
        note: body.note,
        openedAt: new Date().toISOString(),
    };
    addDispute(dispute);
    return { ok: true, data: dispute };
}

export async function resolveDispute(id: string, body: ResolveDisputeRequest): Promise<ApiResult<DisputeItem>> {
    resolveDisputeById(id, body.resolution);
    const dispute = disputes.find((d) => d.id === id);
    if (!dispute) return { ok: false, error: 'NOT_FOUND', message: 'Disputa não encontrada' };
    return { ok: true, data: dispute };
}
