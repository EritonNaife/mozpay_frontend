import * as jose from 'jose';

/**
 * Dev/mock auth helper for the /auth/* BFF endpoints.
 *
 * When VITE_USE_MOCK_API is enabled, the auth endpoints short-circuit the
 * Django backend proxy and mint a locally-signed JWT so the OTP/PIN login
 * screens work end-to-end with any input. The token is signed with the same
 * key that hooks.server.ts verifies against (default: the unsafe dev key),
 * so the server-side route guard accepts it.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

const JWT_SIGNING_KEY =
	process.env.JWT_SIGNING_KEY || 'unsafe-local-jwt-signing-key-for-development-only';

/** Response body the login pages expect (minus the jwt, which goes in the cookie). */
export const MOCK_AUTH_RESPONSE = {
	roles: ['MERCHANT', 'CUSTOMER'] as string[],
	is_new: false,
	has_pin: true,
};

/** Mint a valid HS256 token accepted by hooks.server.ts. */
export async function mintMockToken(
	sub = 'mock-user',
	roles: string[] = MOCK_AUTH_RESPONSE.roles,
): Promise<string> {
	const key = new TextEncoder().encode(JWT_SIGNING_KEY);
	return await new jose.SignJWT({ roles })
		.setProtectedHeader({ alg: 'HS256' })
		.setSubject(sub)
		.setIssuedAt()
		.setExpirationTime('30d')
		.sign(key);
}
