import { env as privateEnv } from '$env/dynamic/private';
import { getProject, ProjectApiError } from '$lib/server/projects-api';
import { resolveApiBaseUrl } from '$lib/server/resolve-api-base-url';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

function requireAuthenticatedUser(locals: App.Locals): NonNullable<App.Locals['user']> {
	if (!locals.user) {
		throw redirect(303, '/welcome');
	}

	return locals.user;
}

export const load: PageServerLoad = async ({ fetch, locals, params }) => {
	const user = requireAuthenticatedUser(locals);
	const projectId = Number(params.projectId);

	if (!Number.isInteger(projectId) || projectId <= 0) {
		throw error(404, 'Move not found');
	}

	const apiBaseUrl = resolveApiBaseUrl();

	try {
		const project = await getProject(
			fetch,
			apiBaseUrl,
			projectId,
			user.email,
			privateEnv.BACKEND_API_SHARED_SECRET,
			privateEnv.BACKEND_VERCEL_PROTECTION_BYPASS_SECRET
		);
		return { project };
	} catch (cause) {
		if (cause instanceof ProjectApiError && cause.status === 404) {
			throw error(404, 'Move not found');
		}

		console.error('Failed to load move from backend API', {
			apiBaseUrl,
			projectId,
			cause
		});
		throw error(502, 'Unable to load move from API');
	}
};
