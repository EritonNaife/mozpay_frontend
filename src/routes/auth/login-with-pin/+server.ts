import { json, type RequestHandler } from '@sveltejs/kit';

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8000';
const IS_PROD = process.env.NODE_ENV === 'production';

async function proxy(pathname: string, request: Request, existingToken?: string) {
	const headers: Record<string, string> = { 'Content-Type': 'application/json' };
	if (existingToken) headers['Authorization'] = `Bearer ${existingToken}`;

	const res = await fetch(`${BACKEND}/api/v1${pathname}`, {
		method: request.method,
		headers,
		body: request.body ? await request.text() : undefined,
	});

	const data = await res.json();
	return { status: res.status, data };
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { status, data } = await proxy('/auth/login-with-pin', request);

	if (status === 200 && data.jwt) {
		cookies.set('mozpay_token', data.jwt, {
			path: '/',
			httpOnly: true,
			secure: IS_PROD,
			sameSite: 'lax',
		});
		const { jwt, ...body } = data;
		return json(body, { status });
	}

	return json(data, { status });
};
