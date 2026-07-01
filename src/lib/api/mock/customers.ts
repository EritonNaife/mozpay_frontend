import type { ApiResult } from '../client';
import type { CustomerDashboard, CustomerDetail, CustomerSummary } from '../types';
import {
    customers,
    getCustomerDashboard as buildCustomerDashboard,
    getCustomerDetail as buildCustomerDetail,
} from './data';

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

export async function getCustomerDashboard(): Promise<ApiResult<CustomerDashboard>> {
    return { ok: true, data: buildCustomerDashboard() };
}
