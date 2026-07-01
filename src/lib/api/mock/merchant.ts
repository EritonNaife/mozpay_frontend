import type { ApiResult } from '../client';
import type { CreateMerchantProfileRequest, MerchantDashboard, MerchantProfileResponse, MerchantStats } from '../types';
import { getMerchantDashboard as buildMerchantDashboard, merchantDetails, merchantProfile, merchantStats } from './data';

export async function getMerchantDashboard(): Promise<ApiResult<MerchantDashboard>> {
    return { ok: true, data: buildMerchantDashboard() };
}

export async function getMerchantStats(): Promise<ApiResult<MerchantStats>> {
    return { ok: true, data: merchantStats };
}

export function getProfile(): Promise<ApiResult<MerchantProfileResponse>> {
    return Promise.resolve({
        ok: true,
        data: {
            id: merchantProfile.id,
            business_name: merchantProfile.businessName,
            business_category: merchantProfile.businessCategory,
            status: merchantProfile.status,
            name: merchantDetails.name,
            store: merchantDetails.store,
            phone: merchantDetails.phone,
            location: merchantDetails.location,
            joinDate: merchantDetails.joinDate,
            notificationPrefs: merchantDetails.notificationPrefs,
        },
    });
}

export function createProfile(body: CreateMerchantProfileRequest): Promise<ApiResult<MerchantProfileResponse>> {
    merchantProfile.businessName = body.business_name;
    merchantProfile.businessCategory = body.business_category;
    merchantDetails.store = body.business_name;
    return getProfile();
}
