import { redirect, type Handle } from '@sveltejs/kit';
import * as jose from 'jose';

const PROTECTED_MERCHANT = /^\/merchant(\/(?!onboarding).*)?$/;
const PROTECTED_CUSTOMER = /^\/customer(\/(?!login|consent).*)?$/;
const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
	.split(',')
	.map(s => s.trim())
	.filter(Boolean);
if (ALLOWED_ORIGINS.length === 0) {
	ALLOWED_ORIGINS.push('http://localhost:5173', 'http://localhost:8000');
}

const JWT_SIGNING_KEY = process.env.JWT_SIGNING_KEY || 'unsafe-local-jwt-signing-key-for-development-only';
const IS_PROD = process.env.NODE_ENV === 'production';

async function verifyToken(token: string): Promise<{ sub: string; roles: string[] } | null> {
	try {
		const key = new TextEncoder().encode(JWT_SIGNING_KEY);
		const { payload } = await jose.jwtVerify(token, key, { algorithms: ['HS256'] });
		return {
			sub: payload.sub as string,
			roles: ((payload.roles as string[]) ?? []).map((r) => r.toLowerCase()),
		};
	} catch {
		return null;
	}
}

export const handle: Handle = async ({ event, resolve }) => {
	// CSRF: Origin/Referer check on unsafe methods
	if (UNSAFE_METHODS.has(event.request.method)) {
		const origin = event.request.headers.get('Origin');
		if (origin && !ALLOWED_ORIGINS.includes(origin)) {
			return new Response('CSRF check failed', { status: 403 });
		}
	}

	const token = event.cookies.get('mozpay_token');
	const pathname = event.url.pathname;

	if (token) {
		const claims = await verifyToken(token);
		if (claims) {
			event.locals.user = { sub: claims.sub, roles: claims.roles };
			event.locals.token = token;
		}
	}

	// Server-side route guarding — redirect before render
	const inMerchant = pathname === '/merchant' || pathname.startsWith('/merchant/');
	const inCustomer = pathname === '/customer' || pathname.startsWith('/customer/');

	if (!event.locals.user) {
		if (PROTECTED_MERCHANT.test(pathname)) {
			throw redirect(307, '/merchant/onboarding');
		}
		if (PROTECTED_CUSTOMER.test(pathname)) {
			throw redirect(307, '/customer/login');
		}
	} else {
		// Strict one-side sessions: an authenticated user may only enter their own area.
		const roles = event.locals.user.roles;
		if (inMerchant && !roles.includes('merchant')) {
			throw redirect(307, '/customer');
		}
		if (inCustomer && !roles.includes('customer')) {
			throw redirect(307, '/merchant');
		}
	}

	return resolve(event);
};
