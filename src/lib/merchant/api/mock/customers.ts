import type { ApiResult } from '$lib/shared/api/client';
import type { CustomerDetail, CustomerSummary } from '$lib/shared/api/types';
import { customers, getCustomerDetail as buildCustomerDetail } from '$lib/shared/api/data';

export async function listCustomers(): Promise<ApiResult<CustomerSummary[]>> {
    return { ok: true, data: customers };
}

export async function getCustomer(id: string): Promise<ApiResult<CustomerSummary>> {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return { ok: false, error: 'NOT_FOUND', message: 'Cliente não encontrado' };
    return { ok: true, data: customer };
}

export async function getCustomerDetail(id: string): Promise<ApiResult<CustomerDetail>> {
    const detail = buildCustomerDetail(id);
    if (!detail) return { ok: false, error: 'NOT_FOUND', message: 'Cliente não encontrado' };
    return { ok: true, data: detail };
}
