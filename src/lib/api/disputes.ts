import type { ApiResult } from '../api';
import type { DisputeItem, CreateDisputeRequest, ResolveDisputeRequest } from './types';

export async function listDisputes(): Promise<ApiResult<DisputeItem[]>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function createDispute(body: CreateDisputeRequest): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function resolveDispute(id: string, body: ResolveDisputeRequest): Promise<ApiResult<DisputeItem>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}
