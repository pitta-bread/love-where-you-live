import { env as privateEnv } from '$env/dynamic/private';
import {
	createProject,
	deleteProject,
	listProjects,
	ProjectApiError
} from '$lib/server/projects-api';
import { hasProjectFieldErrors, parseProjectForm } from '$lib/server/project-form';
import { resolveApiBaseUrl } from '$lib/server/resolve-api-base-url';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

function requireAuthenticatedUser(locals: App.Locals): NonNullable<App.Locals['user']> {
	if (!locals.user) {
		throw redirect(303, '/welcome');
	}

	return locals.user;
}

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const user = requireAuthenticatedUser(locals);
	const apiBaseUrl = resolveApiBaseUrl();

	try {
		const projects = await listProjects(
			fetch,
			apiBaseUrl,
			user.email,
			privateEnv.BACKEND_API_SHARED_SECRET,
			privateEnv.BACKEND_VERCEL_PROTECTION_BYPASS_SECRET
		);
		return { projects };
	} catch (cause) {
		console.error('Failed to load projects from backend API', {
			apiBaseUrl,
			cause
		});
		throw error(502, 'Unable to load moves from API');
	}
};

export const actions: Actions = {
	create: async ({ request, fetch, locals }) => {
		const user = requireAuthenticatedUser(locals);
		const formData = await request.formData();
		const parsed = parseProjectForm(formData);

		if (!parsed.data || hasProjectFieldErrors(parsed.fieldErrors)) {
			return fail(400, {
				createForm: {
					values: parsed.values,
					fieldErrors: parsed.fieldErrors,
					formError: null
				}
			});
		}

		const apiBaseUrl = resolveApiBaseUrl();
		let createdProjectId: number | null = null;

		try {
			const created = await createProject(
				fetch,
				apiBaseUrl,
				parsed.data,
				user.email,
				privateEnv.BACKEND_API_SHARED_SECRET,
				privateEnv.BACKEND_VERCEL_PROTECTION_BYPASS_SECRET
			);
			createdProjectId = created.id;
		} catch (cause) {
			if (cause instanceof ProjectApiError && cause.status === 409) {
				return fail(409, {
					createForm: {
						values: parsed.values,
						fieldErrors: {},
						formError: 'A move with this name already exists.'
					}
				});
			}

			return fail(502, {
				createForm: {
					values: parsed.values,
					fieldErrors: {},
					formError: 'Unable to create move right now. Please try again.'
				}
			});
		}

		if (createdProjectId === null) {
			return fail(502, {
				createForm: {
					values: parsed.values,
					fieldErrors: {},
					formError: 'Unable to create move right now. Please try again.'
				}
			});
		}

		throw redirect(303, `/projects/${createdProjectId}`);
	},
	delete: async ({ request, fetch, locals }) => {
		const user = requireAuthenticatedUser(locals);
		const projectIdValue = (await request.formData()).get('project_id');

		if (typeof projectIdValue !== 'string' || !/^\d+$/.test(projectIdValue)) {
			return fail(400, { deleteError: 'Invalid move selected.' });
		}

		const projectId = Number(projectIdValue);
		const apiBaseUrl = resolveApiBaseUrl();

		try {
			await deleteProject(
				fetch,
				apiBaseUrl,
				projectId,
				user.email,
				privateEnv.BACKEND_API_SHARED_SECRET,
				privateEnv.BACKEND_VERCEL_PROTECTION_BYPASS_SECRET
			);
		} catch (cause) {
			if (cause instanceof ProjectApiError && cause.status === 404) {
				return fail(404, { deleteError: 'Move not found or no longer available.' });
			}

			return fail(502, { deleteError: 'Unable to delete move right now. Please try again.' });
		}

		throw redirect(303, '/projects');
	}
};
