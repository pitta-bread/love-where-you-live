import { describe, expect, it } from 'vitest';
import { render } from 'svelte/server';
import Page from './+page.svelte';

describe('/welcome/+page.svelte', () => {
	it('renders the welcome call to action and google sign in link', () => {
		const { body } = render(Page);

		expect(body).toContain('Find your rhythm.');
		expect(body).toContain('Sign in with Google');
		expect(body).toContain('href="/login/google"');
	});
});
