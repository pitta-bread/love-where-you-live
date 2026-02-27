import { describe, expect, it, vi } from 'vitest';
import { createAnchor, listAnchors } from './anchors-api';

describe('anchors-api shared secret header', () => {
	it('includes x-backend-secret and x-vercel-protection-bypass when listing anchors', async () => {
		const fetchFn = vi.fn(async () =>
			new Response(JSON.stringify([]), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			})
		);

		await listAnchors(
			fetchFn as typeof fetch,
			'https://api.example.com',
			'top-secret',
			'bypass-secret'
		);

		expect(fetchFn).toHaveBeenCalledWith('https://api.example.com/api/v1/anchors', {
			headers: {
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			}
		});
	});

	it('includes x-backend-secret and x-vercel-protection-bypass when creating anchors', async () => {
		const fetchFn = vi.fn(async () =>
			new Response(JSON.stringify({ id: 1 }), {
				status: 201,
				headers: { 'content-type': 'application/json' }
			})
		);

		await createAnchor(
			fetchFn as typeof fetch,
			'https://api.example.com',
			{
				name: 'Office',
				address: '123 Street',
				mode: 'transit',
				frequency_per_week: 3,
				importance_weight: 4
			},
			'top-secret',
			'bypass-secret'
		);

		expect(fetchFn).toHaveBeenCalledWith('https://api.example.com/api/v1/anchors', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				'x-backend-secret': 'top-secret',
				'x-vercel-protection-bypass': 'bypass-secret'
			},
			body: JSON.stringify({
				name: 'Office',
				address: '123 Street',
				mode: 'transit',
				frequency_per_week: 3,
				importance_weight: 4
			})
		});
	});
});
