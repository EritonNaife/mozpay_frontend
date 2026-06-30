import type { ApiResult } from '../client';
import type { CreateMerchantProfileRequest, MerchantDashboard, MerchantProfileResponse } from '../types';
import { getMerchantDashboard as buildMerchantDashboard, merchantProfile } from './data';

export async function getMerchantDashboard(): Promise<ApiResult<MerchantDashboard>> {
    return { ok: true, data: buildMerchantDashboard() };
}

export function getProfile(): Promise<ApiResult<MerchantProfileResponse>> {
    return Promise.resolve({
        ok: true,
        data: {
            id: merchantProfile.id,
            business_name: merchantProfile.businessName,
            business_category: merchantProfile.businessCategory,
            status: merchantProfile.status,
        },
    });
}

export function createProfile(body: CreateMerchantProfileRequest): Promise<ApiResult<MerchantProfileResponse>> {
    merchantProfile.businessName = body.business_name;
    merchantProfile.businessCategory = body.business_category;
    return getProfile();
}
