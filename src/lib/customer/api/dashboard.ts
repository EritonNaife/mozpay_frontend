import { api } from '$lib/shared/api/client';
import type { ApiResult } from '$lib/shared/api/client';
import type { CustomerDashboard } from '$lib/shared/api/types';
import { toCamelCase } from '$lib/shared/utils/case';

export async function getCustomerDashboard(): Promise<ApiResult<CustomerDashboard>> {
    const res = await api<Record<string, unknown>>('/customer/dashboard', { method: 'GET' });
    if (!res.ok) return res;
    return { ok: true, data: toCamelCase<CustomerDashboard>(res.data) };
}
