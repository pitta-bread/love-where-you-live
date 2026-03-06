import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/projects/[projectId]/+page.svelte', () => {
	it('renders a project placeholder detail page', () => {
		const { body } = render(Page, {
			props: {
				data: {
					user: {
						sub: 'google-user-123',
						email: 'alex.morgan@example.com'
					},
					project: {
						id: 1,
						name: 'Bristol Move',
						area: 'Somerset',
						default_transport_mode: 'drive',
						search_started_at: '2026-02-28T12:00:00Z',
						created_at: '2026-02-28T12:00:00Z',
						updated_at: '2026-02-28T12:00:00Z'
					}
				}
			}
		});

		expect(body).toContain('Bristol Move');
		expect(body).toContain('Back to Moves');
		expect(body).toContain('Next step coming soon');
	});
});
