import { json, type RequestHandler } from '@sveltejs/kit';

const IS_PROD = process.env.NODE_ENV === 'production';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.set('mozpay_token', '', {
		path: '/',
		httpOnly: true,
		secure: IS_PROD,
		sameSite: 'lax',
		maxAge: 0,
	});
	return json({ ok: true });
};
