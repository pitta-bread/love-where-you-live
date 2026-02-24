import type { VercelRelatedProject } from '@vercel/related-projects';
import { describe, expect, it } from 'vitest';
import { BACKEND_PROJECT_ID, resolveApiBaseUrl } from './resolve-api-base-url';

function backendProject(project: Partial<VercelRelatedProject> = {}): VercelRelatedProject {
	return {
		project: {
			id: BACKEND_PROJECT_ID,
			name: 'love-where-you-live-be'
		},
		production: {},
		preview: {},
		...project
	};
}

describe('resolveApiBaseUrl', () => {
	it('falls back when related projects are unavailable', () => {
		const resolved = resolveApiBaseUrl({
			projects: [],
			fallbackPublicApiBaseUrl: ' http://localhost:9000/ '
		});

		expect(resolved).toBe('http://localhost:9000');
	});

	it('uses preview branch host when in preview environment', () => {
		const resolved = resolveApiBaseUrl({
			projects: [backendProject({ preview: { branch: 'api-git-feature.vercel.app' } })],
			vercelEnv: 'preview',
			fallbackPublicApiBaseUrl: 'http://localhost:8000'
		});

		expect(resolved).toBe('https://api-git-feature.vercel.app');
	});

	it('prefers preview custom environment host over branch host', () => {
		const resolved = resolveApiBaseUrl({
			projects: [
				backendProject({
					preview: {
						customEnvironment: 'api-git-staging.vercel.app',
						branch: 'api-git-feature.vercel.app'
					}
				})
			],
			vercelEnv: 'preview',
			fallbackPublicApiBaseUrl: 'http://localhost:8000'
		});

		expect(resolved).toBe('https://api-git-staging.vercel.app');
	});

	it('uses production alias host when in production environment', () => {
		const resolved = resolveApiBaseUrl({
			projects: [backendProject({ production: { alias: 'api.lovewhereyoulive.app' } })],
			vercelEnv: 'production',
			fallbackPublicApiBaseUrl: 'http://localhost:8000'
		});

		expect(resolved).toBe('https://api.lovewhereyoulive.app');
	});

	it('falls back to production deployment url when alias is unavailable', () => {
		const resolved = resolveApiBaseUrl({
			projects: [backendProject({ production: { url: 'api-deploy.vercel.app' } })],
			vercelEnv: 'production',
			fallbackPublicApiBaseUrl: 'http://localhost:8000'
		});

		expect(resolved).toBe('https://api-deploy.vercel.app');
	});
});
