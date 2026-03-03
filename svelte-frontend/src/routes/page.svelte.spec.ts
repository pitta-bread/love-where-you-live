import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders redirect marker content', () => {
		const { body } = render(Page);

		expect(body).toContain('Redirecting');
	});
});
