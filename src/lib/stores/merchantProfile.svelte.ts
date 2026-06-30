import { getProfile } from '$lib/api/merchant';
import type { MerchantProfileResponse } from '$lib/api/types';

class MerchantProfileStore {
    data: MerchantProfileResponse | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        if (this.data) return; // already loaded
        this.loading = true;
        this.error = null;
        const res = await getProfile();
        if (res.ok) {
            this.data = res.data;
        } else {
            this.error = res.error === 'PROFILE_NOT_FOUND' ? null : (res.message || res.error);
        }
        this.loading = false;
    }

    set(profile: MerchantProfileResponse) {
        this.data = profile;
        this.error = null;
    }

    clear() {
        this.data = null;
        this.error = null;
    }
}

export const merchantProfileStore = new MerchantProfileStore();
