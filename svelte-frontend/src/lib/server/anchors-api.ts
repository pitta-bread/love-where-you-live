import type { AnchorCreateInput, AnchorRead } from '$lib/types/domain';

type ApiFetch = typeof fetch;

function apiUrl(apiBaseUrl: string, path: string): string {
	return `${apiBaseUrl.replace(/\/$/, '')}${path}`;
}

export class AnchorApiError extends Error {
	status: number;
	responseBody: string;

	constructor(message: string, status: number, responseBody: string) {
		super(message);
		this.name = 'AnchorApiError';
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

export async function listAnchors(fetchFn: ApiFetch, apiBaseUrl: string): Promise<AnchorRead[]> {
	const response = await fetchFn(apiUrl(apiBaseUrl, '/api/v1/anchors'));

	if (!response.ok) {
		throw new AnchorApiError('Failed to list anchors', response.status, await responseBody(response));
	}

	return (await response.json()) as AnchorRead[];
}

export async function createAnchor(
	fetchFn: ApiFetch,
	apiBaseUrl: string,
	payload: AnchorCreateInput
): Promise<AnchorRead> {
	const response = await fetchFn(apiUrl(apiBaseUrl, '/api/v1/anchors'), {
		method: 'POST',
		headers: { 'content-type': 'application/json' },
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		throw new AnchorApiError(
			'Failed to create anchor',
			response.status,
			await responseBody(response)
		);
	}

	return (await response.json()) as AnchorRead;
}
