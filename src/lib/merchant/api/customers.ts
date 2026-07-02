import type { ApiResult } from '$lib/shared/api/client';
import type { CustomerDetail, CustomerSummary } from '$lib/shared/api/types';

export async function listCustomers(): Promise<ApiResult<CustomerSummary[]>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function getCustomer(id: string): Promise<ApiResult<CustomerSummary>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function getCustomerDetail(id: string): Promise<ApiResult<CustomerDetail>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}
