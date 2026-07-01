import { listDisputes, addDisputeNote, resolveMerchantDispute } from '$lib/api';
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

    /** Select an already-loaded dispute by id. */
    byId(id: string): DisputeItem | null {
        return this.data?.find((d) => d.id === id) ?? null;
    }

    /** Append a note (timeline event) to a dispute and refresh local state. */
    async note(id: string, text: string): Promise<DisputeItem | null> {
        const res = await addDisputeNote(id, text);
        if (res.ok) {
            this.replace(res.data);
            return res.data;
        }
        if (res.error !== 'NOT_IMPLEMENTED') this.error = res.message || res.error;
        return null;
    }

    /** Resolve a dispute (status=resolved + resolved event) and refresh local state. */
    async resolve(id: string, note?: string): Promise<DisputeItem | null> {
        const res = await resolveMerchantDispute(id, note);
        if (res.ok) {
            this.replace(res.data);
            return res.data;
        }
        if (res.error !== 'NOT_IMPLEMENTED') this.error = res.message || res.error;
        return null;
    }

    private replace(updated: DisputeItem) {
        if (!this.data) {
            this.data = [updated];
            return;
        }
        this.data = this.data.map((d) => (d.id === updated.id ? updated : d));
    }
}

export const disputesStore = new DisputesStore();
