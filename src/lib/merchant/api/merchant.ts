import { api } from '$lib/shared/api/client';
import type { ApiResult } from '$lib/shared/api/client';
import { toCamelCase } from '$lib/shared/utils/case';
import type { CreateMerchantProfileRequest, MerchantDashboard, MerchantProfileResponse, MerchantStats } from '$lib/shared/api/types';

export async function getMerchantDashboard(): Promise<ApiResult<MerchantDashboard>> {
    const res = await api<Record<string, unknown>>('/merchant/dashboard', { method: 'GET' });
    if (!res.ok) return res;
    return { ok: true, data: toCamelCase<MerchantDashboard>(res.data) };
}

export async function getMerchantStats(): Promise<ApiResult<MerchantStats>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export function getProfile() {
    return api<MerchantProfileResponse>('/merchant/profile', { method: 'GET' });
}

export function createProfile(body: CreateMerchantProfileRequest) {
    return api<MerchantProfileResponse>('/merchant/profile', {
        method: 'POST',
        body,
    });
}
