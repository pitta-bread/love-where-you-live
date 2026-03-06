import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/projects/+page.svelte', () => {
	it('renders the empty state with create move CTA', () => {
		const { body } = render(Page, {
			props: {
				data: {
					user: {
						sub: 'google-user-123',
						email: 'alex.morgan@example.com'
					},
					projects: []
				},
				form: null
			}
		});

		expect(body).toContain('Your Moves');
		expect(body).toContain('Create New Move');
		expect(body).toContain('Start by creating your first project here');
		expect(body).toContain('alex.morgan@example.com');
	});

	it('renders list state with open and delete actions', () => {
		const { body } = render(Page, {
			props: {
				data: {
					user: {
						sub: 'google-user-123',
						email: 'alex.morgan@example.com'
					},
					projects: [
						{
							id: 1,
							name: 'Bristol Move',
							area: 'Somerset',
							default_transport_mode: 'drive',
							search_started_at: '2026-02-28T12:00:00Z',
							created_at: '2026-02-28T12:00:00Z',
							updated_at: '2026-02-28T12:00:00Z'
						}
					]
				},
				form: null
			}
		});

		expect(body).toContain('Bristol Move');
		expect(body).toContain('Somerset');
		expect(body).toContain('Open');
		expect(body).toContain('Delete');
	});
});
