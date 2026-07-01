import { listPlans, getPlan } from '$lib/api';
import type { PlanSummary, PlanDetail } from '$lib/api/types';

class PlansStore {
    data: PlanSummary[] | null = $state(null);
    current: PlanDetail | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await listPlans();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            // Backend not yet available — treat as empty rather than error
            this.data = [];
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }

    async loadPlan(id: string) {
        this.loading = true;
        this.error = null;
        const res = await getPlan(id);
        if (res.ok) {
            this.current = res.data;
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }
}

export const plansStore = new PlansStore();
