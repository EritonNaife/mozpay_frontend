import { getCustomerDashboard } from '$lib/api';
import type { CustomerDashboard } from '$lib/api/types';

class CustomerDashboardStore {
    data: CustomerDashboard | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await getCustomerDashboard();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            this.data = null;
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }
}

export const customerDashboardStore = new CustomerDashboardStore();
