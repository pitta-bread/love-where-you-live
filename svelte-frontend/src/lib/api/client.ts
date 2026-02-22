import { PUBLIC_API_BASE_URL } from '$lib/config';

export interface ApiClient {
	baseUrl: string;
	getHealth(): Promise<{ status: 'ok' }>;
}

export function createApiClient(baseUrl = PUBLIC_API_BASE_URL): ApiClient {
	const normalizedBaseUrl = baseUrl.replace(/\/$/, '');

	return {
		baseUrl: normalizedBaseUrl,
		async getHealth() {
			// Phase 0 placeholder until backend wiring is introduced.
			return { status: 'ok' };
		}
	};
}

export const apiClient = createApiClient();
