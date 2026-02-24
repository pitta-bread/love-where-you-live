import {
	relatedProjects,
	type VercelRelatedProject
} from '@vercel/related-projects';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';
import { resolvePublicApiBaseUrl } from '$lib/config';

export const BACKEND_PROJECT_ID = 'prj_KU03kWVaUsT19LQawaGQV1XhheyY';

export interface ResolveApiBaseUrlOptions {
	projects?: VercelRelatedProject[];
	vercelEnv?: string;
	fallbackPublicApiBaseUrl?: string;
}

function relatedProjectHost(
	project: VercelRelatedProject,
	vercelEnv: string | undefined
): string | undefined {
	if (vercelEnv === 'preview') {
		return project.preview.customEnvironment ?? project.preview.branch;
	}

	if (vercelEnv === 'production') {
		return project.production.alias ?? project.production.url;
	}

	return undefined;
}

function normalizeHost(host: string): string {
	return host.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

export function resolveApiBaseUrl(options: ResolveApiBaseUrlOptions = {}): string {
	const fallback = resolvePublicApiBaseUrl(
		options.fallbackPublicApiBaseUrl ?? publicEnv.PUBLIC_API_BASE_URL
	);
	const projects = options.projects ?? relatedProjects({ noThrow: true });
	const backendProject = projects.find((project) => project.project.id === BACKEND_PROJECT_ID);

	if (!backendProject) {
		return fallback;
	}

	const host = relatedProjectHost(backendProject, options.vercelEnv ?? privateEnv.VERCEL_ENV);
	if (!host) {
		return fallback;
	}

	return `https://${normalizeHost(host)}`;
}
