import { goto } from '$app/navigation';

export const auth = $state<{
	jwt: string | null;
	user: { sub: string } | null;
	roles: string[];
	isNew: boolean;
	isAuthenticated: boolean;
	phone: string | null;
	hasPin: boolean;
}>({
	jwt: null,
	user: null,
	roles: [],
	isNew: false,
	isAuthenticated: false,
	phone: null,
	hasPin: false,
});

export function login(payload: { roles: string[]; isNew: boolean; has_pin?: boolean }, phone?: string) {
	auth.roles = payload.roles;
	auth.isNew = payload.isNew;
	auth.isAuthenticated = true;
	auth.phone = phone ?? null;
	auth.hasPin = payload.has_pin ?? false;
	if (auth.phone) try { sessionStorage.setItem('mozpay_phone', auth.phone); } catch {}
	if (auth.hasPin) try { sessionStorage.setItem('mozpay_pin', '1'); } catch {}
}

export async function logout() {
	try {
		await fetch('/auth/logout', { method: 'POST' });
	} catch {
		// Best-effort cookie clear
	}
	auth.jwt = null;
	auth.user = null;
	auth.roles = [];
	auth.isNew = false;
	auth.isAuthenticated = false;
	auth.phone = null;
	auth.hasPin = false;
	try { sessionStorage.clear(); } catch {}
	goto('/');
}

export function hydrate(data: { isAuthenticated: boolean; roles: string[]; userSub: string | null }) {
	if (!data.isAuthenticated || !data.userSub) return;
	auth.isAuthenticated = true;
	auth.roles = data.roles;
	auth.user = { sub: data.userSub };
	auth.isNew = false;
	auth.phone = sessionStorage?.getItem('mozpay_phone') || null;
	auth.hasPin = sessionStorage?.getItem('mozpay_pin') === '1';
}

export function setHasPin(value: boolean) {
	auth.hasPin = value;
	try { if (value) sessionStorage.setItem('mozpay_pin', '1'); else sessionStorage.removeItem('mozpay_pin'); } catch {}
}
