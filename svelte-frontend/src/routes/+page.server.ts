import { env as privateEnv } from '$env/dynamic/private';
import { createAnchor, listAnchors } from '$lib/server/anchors-api';
import { hasFieldErrors, parseAnchorForm } from '$lib/server/anchor-form';
import { resolveApiBaseUrl } from '$lib/server/resolve-api-base-url';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const apiBaseUrl = resolveApiBaseUrl();

	try {
		const anchors = await listAnchors(fetch, apiBaseUrl, privateEnv.BACKEND_API_SHARED_SECRET);
		return { anchors };
	} catch {
		throw error(502, 'Unable to load anchors from API');
	}
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const parsed = parseAnchorForm(formData);

		if (!parsed.data || hasFieldErrors(parsed.fieldErrors)) {
			return fail(400, {
				values: parsed.values,
				fieldErrors: parsed.fieldErrors,
				formError: null
			});
		}

		const apiBaseUrl = resolveApiBaseUrl();

		try {
			await createAnchor(
				fetch,
				apiBaseUrl,
				parsed.data,
				privateEnv.BACKEND_API_SHARED_SECRET
			);
		} catch {
			return fail(502, {
				values: parsed.values,
				fieldErrors: {},
				formError: 'Unable to save anchor right now. Please try again.'
			});
		}

		throw redirect(303, '/');
	}
};
