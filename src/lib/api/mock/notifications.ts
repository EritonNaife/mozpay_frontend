import type { ApiResult } from '../client';
import type { NotificationItem } from '../types';
import { notifications } from './data';

export async function listNotifications(): Promise<ApiResult<NotificationItem[]>> {
    return { ok: true, data: [...notifications] };
}

export async function markRead(id?: string): Promise<ApiResult<void>> {
    if (id) {
        const n = notifications.find((x) => x.id === id);
        if (n) n.read = true;
    } else {
        notifications.forEach((n) => (n.read = true));
    }
    return { ok: true, data: undefined };
}
