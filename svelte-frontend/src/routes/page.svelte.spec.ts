import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/+page.svelte', () => {
	it('renders the static dashboard shell', () => {
		const { body } = render(Page);

		expect(body).toContain('Love Where You Live');
		expect(body).toContain('124 Maple Close');
	});
});
