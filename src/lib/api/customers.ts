import { api } from './client';
import type { ApiResult } from './client';
import { toCamelCase } from '$lib/utils/case';
import type { CustomerDashboard, CustomerDetail, CustomerSummary } from './types';

export async function listCustomers(): Promise<ApiResult<CustomerSummary[]>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function getCustomer(id: string): Promise<ApiResult<CustomerSummary>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function getCustomerDetail(id: string): Promise<ApiResult<CustomerDetail>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function getCustomerDashboard(): Promise<ApiResult<CustomerDashboard>> {
    const res = await api<Record<string, unknown>>('/customer/dashboard', { method: 'GET' });
    if (!res.ok) return res;
    return { ok: true, data: toCamelCase<CustomerDashboard>(res.data) };
}
