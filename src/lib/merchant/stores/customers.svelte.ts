import { listCustomers, getCustomer, getCustomerDetail } from '$lib/merchant/api';
import type { CustomerDetail, CustomerSummary } from '$lib/shared/api/types';

class CustomersStore {
    data: CustomerSummary[] | null = $state(null);
    detail: CustomerDetail | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await listCustomers();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            this.data = [];
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }

    async loadOne(id: string): Promise<CustomerSummary | null> {
        this.loading = true;
        this.error = null;
        const res = await getCustomer(id);
        if (res.ok) {
            this.loading = false;
            return res.data;
        } else {
            this.error = res.message || res.error;
            this.loading = false;
            return null;
        }
    }

    /** Load a single customer's plans + payments + disputes bundle. */
    async loadDetail(id: string): Promise<CustomerDetail | null> {
        this.loading = true;
        this.error = null;
        const res = await getCustomerDetail(id);
        if (res.ok) {
            this.detail = res.data;
            this.loading = false;
            return res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            this.detail = null;
            this.loading = false;
            return null;
        } else {
            this.error = res.message || res.error;
            this.loading = false;
            return null;
        }
    }
}

export const customersStore = new CustomersStore();
