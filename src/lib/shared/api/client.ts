import { auth } from '$lib/shared/stores/auth.svelte.js';

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string; message?: string; data?: unknown };

export async function api<T>(path: string, opts?: Omit<RequestInit, 'body'> & { body?: unknown }): Promise<ApiResult<T>> {
	const headers: Record<string, string> = {
		'Content-Type': 'application/json',
		...(opts?.headers as Record<string, string> || {}),
	};

	let body: BodyInit | undefined;
	if (opts?.body != null) {
		body = typeof opts.body === 'object' && !(opts.body instanceof FormData) && !(opts.body instanceof URLSearchParams) && !(opts.body instanceof Blob) && !(opts.body instanceof ArrayBuffer) && !ArrayBuffer.isView(opts.body)
			? JSON.stringify(opts.body)
			: (opts.body as BodyInit);
	}

	try {
		const res = await fetch(`/api/v1${path}`, { ...opts, headers, body });

		const data = await res.json().catch(() => ({}));
		if (!res.ok) {
			const envelope = data && typeof data === 'object' ? (data as { error?: unknown }).error : null;
			const code =
				(envelope && typeof envelope === 'object'
					? (envelope as { code?: string }).code
					: typeof envelope === 'string'
						? envelope
						: undefined) || 'REQUEST_FAILED';
			const message =
				envelope && typeof envelope === 'object' ? (envelope as { message?: string }).message : undefined;

			if (res.status === 401 && (code === 'TOKEN_EXPIRED' || code === 'INVALID_TOKEN' || code === 'NOT_AUTHENTICATED')) {
				auth.isAuthenticated = false;
				auth.roles = [];
			}

			return { ok: false, error: code, message, data };
		}
		return { ok: true, data };
	} catch {
		return { ok: false, error: 'NETWORK' };
	}
}
