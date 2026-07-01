import { listNotifications, markRead } from '$lib/api';
import type { NotificationItem } from '$lib/api/types';

class NotificationsStore {
    data: NotificationItem[] | null = $state(null);
    loading = $state(false);
    error: string | null = $state(null);

    async load() {
        this.loading = true;
        this.error = null;
        const res = await listNotifications();
        if (res.ok) {
            this.data = res.data;
        } else if (res.error === 'NOT_IMPLEMENTED') {
            // Backend not yet available — show empty state
            this.data = null;
        } else {
            this.error = res.message || res.error;
        }
        this.loading = false;
    }

    async markAllRead() {
        const res = await markRead();
        if (res.ok && this.data) {
            for (const n of this.data) n.read = true;
        }
    }
}

export const notificationsStore = new NotificationsStore();
