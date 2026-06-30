// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: { sub: string; roles: string[] };
			token?: string;
		}
		interface PageData {
			isAuthenticated: boolean;
			roles: string[];
			userSub: string | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
