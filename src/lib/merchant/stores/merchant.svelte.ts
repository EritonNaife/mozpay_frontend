import { getMerchantDashboard, getMerchantStats } from '$lib/api';
import type { MerchantDashboard, MerchantStats } from '$lib/api/types';

class MerchantStore {
    data: MerchantDashboard | null = $state(null);
    stats: MerchantStats | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await getMerchantDashboard();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            // Backend not yet available — leave data null, no error shown
            this.data = null;
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }

    async loadStats() {
        this.loading = true;
        this.error = null;
        const res = await getMerchantStats();
        if (res.ok) {
            this.stats = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            this.stats = null;
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }
}

export const merchantStore = new MerchantStore();
