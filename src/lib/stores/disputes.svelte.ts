import { listDisputes } from '$lib/api/disputes';
import type { DisputeItem } from '$lib/api/types';

class DisputesStore {
    data: DisputeItem[] | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await listDisputes();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            this.data = [];
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }
}

export const disputesStore = new DisputesStore();
