import { getCustomerScore } from '$lib/customer/api';
import type { CustomerScore } from '$lib/customer/api/scoring';

class ScoringStore {
	data: CustomerScore | null = $state(null);
	loading = $state(false);
	error: string | null = $state(null);

	async load() {
		this.loading = true;
		this.error = null;
		const res = await getCustomerScore();
		if (res.ok) {
			this.data = res.data;
		} else if (res.error === 'NOT_IMPLEMENTED') {
			this.data = { score: 50, label: 'Building' };
		} else {
			this.error = res.message || res.error;
		}
		this.loading = false;
	}
}

export const scoringStore = new ScoringStore();
