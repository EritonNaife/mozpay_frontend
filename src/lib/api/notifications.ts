import type { ApiResult } from './client';
import type { NotificationItem } from './types';

export async function listNotifications(): Promise<ApiResult<NotificationItem[]>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}

export async function markRead(id?: string): Promise<ApiResult<void>> {
    return { ok: false, error: 'NOT_IMPLEMENTED' };
}
