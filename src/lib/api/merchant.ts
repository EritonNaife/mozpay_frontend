import { api } from '../api';
import type { ApiResult } from '../api';
import { toCamelCase } from '$lib/utils/case';
import type { CreateMerchantProfileRequest, MerchantDashboard, MerchantProfileResponse } from './types';

export async function getMerchantDashboard(): Promise<ApiResult<MerchantDashboard>> {
    const res = await api<Record<string, unknown>>('/merchant/dashboard', { method: 'GET' });
    if (!res.ok) return res;
    return { ok: true, data: toCamelCase<MerchantDashboard>(res.data) };
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
