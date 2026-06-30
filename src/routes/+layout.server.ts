import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		isAuthenticated: !!locals.user,
		roles: locals.user?.roles ?? [],
		userSub: locals.user?.sub ?? null,
	};
};
