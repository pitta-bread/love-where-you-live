import { env as publicEnv } from '$env/dynamic/public';

const DEFAULT_PUBLIC_API_BASE_URL = 'http://localhost:8000';

export function resolvePublicApiBaseUrl(envValue?: string): string {
	const trimmed = envValue?.trim();
	if (!trimmed) {
		return DEFAULT_PUBLIC_API_BASE_URL;
	}

	return trimmed.replace(/\/$/, '');
}

export const PUBLIC_API_BASE_URL: string = resolvePublicApiBaseUrl(publicEnv.PUBLIC_API_BASE_URL);
