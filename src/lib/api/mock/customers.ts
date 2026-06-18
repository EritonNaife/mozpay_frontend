import type { ApiResult } from '../client';
import type { CustomerDashboard, CustomerSummary } from '../types';
import { customers, getCustomerDashboard as buildCustomerDashboard } from './data';

export async function listCustomers(): Promise<ApiResult<CustomerSummary[]>> {
    return { ok: true, data: customers };
}

export async function getCustomer(id: string): Promise<ApiResult<CustomerSummary>> {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return { ok: false, error: 'NOT_FOUND', message: 'Cliente não encontrado' };
    return { ok: true, data: customer };
}

export async function getCustomerDashboard(): Promise<ApiResult<CustomerDashboard>> {
    return { ok: true, data: buildCustomerDashboard() };
}
