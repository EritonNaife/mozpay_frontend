import type { ApiResult } from '$lib/shared/api/client';
import type { CustomerDashboard } from '$lib/shared/api/types';
import { getCustomerDashboard as buildCustomerDashboard } from '$lib/shared/api/data';

export async function getCustomerDashboard(): Promise<ApiResult<CustomerDashboard>> {
    return { ok: true, data: buildCustomerDashboard() };
}
