import type { ApiResult } from '$lib/shared/api/client';
import type { DisputeItem, CreateDisputeRequest, ResolveDisputeRequest } from '$lib/shared/api/types';

export async function listDisputes(): Promise<ApiResult<DisputeItem[]>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function createDispute(body: CreateDisputeRequest): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function resolveDispute(id: string, body: ResolveDisputeRequest): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function addDisputeNote(id: string, text: string): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function resolveMerchantDispute(id: string, note?: string): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}
