import type { ProjectCreateInput, ProjectRead } from '$lib/types/domain';

type ApiFetch = typeof fetch;

function apiUrl(apiBaseUrl: string, path: string): string {
	return `${apiBaseUrl.replace(/\/$/, '')}${path}`;
}

interface RequestHeaderOptions {
	userEmail?: string;
	sharedSecret?: string;
	vercelProtectionBypassSecret?: string;
}

function requestHeaders(options: RequestHeaderOptions = {}): HeadersInit {
	const headers: Record<string, string> = {};

	if (options.sharedSecret) {
		headers['x-backend-secret'] = options.sharedSecret;
	}

	if (options.userEmail) {
		headers['x-user-email'] = options.userEmail;
	}

	if (options.vercelProtectionBypassSecret) {
		headers['x-vercel-protection-bypass'] = options.vercelProtectionBypassSecret;
	}

	return headers;
}

export class ProjectApiError extends Error {
	status: number;
	responseBody: string;

	constructor(message: string, status: number, responseBody: string) {
		super(message);
		this.name = 'ProjectApiError';
		this.status = status;
		this.responseBody = responseBody;
	}
}

async function responseBody(response: Response): Promise<string> {
	try {
		return await response.text();
	} catch {
		return '';
	}
}

export async function listProjects(
	fetchFn: ApiFetch,
	apiBaseUrl: string,
	userEmail: string,
	sharedSecret?: string,
	vercelProtectionBypassSecret?: string
): Promise<ProjectRead[]> {
	const response = await fetchFn(apiUrl(apiBaseUrl, '/api/v1/projects'), {
		headers: requestHeaders({ userEmail, sharedSecret, vercelProtectionBypassSecret })
	});

	if (!response.ok) {
		throw new ProjectApiError('Failed to list projects', response.status, await responseBody(response));
	}

	return (await response.json()) as ProjectRead[];
}

export async function getProject(
	fetchFn: ApiFetch,
	apiBaseUrl: string,
	projectId: number,
	userEmail: string,
	sharedSecret?: string,
	vercelProtectionBypassSecret?: string
): Promise<ProjectRead> {
	const response = await fetchFn(apiUrl(apiBaseUrl, `/api/v1/projects/${projectId}`), {
		headers: requestHeaders({ userEmail, sharedSecret, vercelProtectionBypassSecret })
	});

	if (!response.ok) {
		throw new ProjectApiError('Failed to load project', response.status, await responseBody(response));
	}

	return (await response.json()) as ProjectRead;
}

export async function createProject(
	fetchFn: ApiFetch,
	apiBaseUrl: string,
	payload: ProjectCreateInput,
	userEmail: string,
	sharedSecret?: string,
	vercelProtectionBypassSecret?: string
): Promise<ProjectRead> {
	const response = await fetchFn(apiUrl(apiBaseUrl, '/api/v1/projects'), {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			...requestHeaders({ userEmail, sharedSecret, vercelProtectionBypassSecret })
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		throw new ProjectApiError('Failed to create project', response.status, await responseBody(response));
	}

	return (await response.json()) as ProjectRead;
}

export async function deleteProject(
	fetchFn: ApiFetch,
	apiBaseUrl: string,
	projectId: number,
	userEmail: string,
	sharedSecret?: string,
	vercelProtectionBypassSecret?: string
): Promise<void> {
	const response = await fetchFn(apiUrl(apiBaseUrl, `/api/v1/projects/${projectId}`), {
		method: 'DELETE',
		headers: requestHeaders({ userEmail, sharedSecret, vercelProtectionBypassSecret })
	});

	if (!response.ok) {
		throw new ProjectApiError('Failed to delete project', response.status, await responseBody(response));
	}
}
