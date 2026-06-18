import { listCustomers, getCustomer } from '$lib/api/customers';
import type { CustomerSummary } from '$lib/api/types';

class CustomersStore {
    data: CustomerSummary[] | null = $state(null);
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
}

export const customersStore = new CustomersStore();
