// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: {
				sub: string;
				email: string;
			} | null;
		}
		interface PageData {
			user: {
				sub: string;
				email: string;
			} | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
