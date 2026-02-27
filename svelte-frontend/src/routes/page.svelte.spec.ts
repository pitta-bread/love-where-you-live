import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the dashboard shell and anchor manager', () => {
		const { body } = render(Page, {
			props: {
				data: {
					user: {
						sub: 'google-user-123',
						email: 'test.user@example.com'
					},
					anchors: [
						{
							id: 1,
							name: 'Temple Quay Office',
							address: '1 Glass Wharf, Bristol BS2 0EL',
							mode: 'transit',
							frequency_per_week: 5,
							importance_weight: 4,
							created_at: '2026-02-24T12:00:00Z',
							updated_at: '2026-02-24T12:00:00Z'
						}
					]
				},
				form: null
			}
		});

		expect(body).toContain('Love Where You Live');
		expect(body).toContain('test.user@example.com');
		expect(body).toContain('Sign out');
		expect(body).toContain('124 Maple Close');
		expect(body).toContain('Your anchors');
		expect(body).toContain('Temple Quay Office');
		expect(body).toContain('Save anchor');
	});
});
