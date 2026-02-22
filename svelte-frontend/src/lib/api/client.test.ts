import { describe, expect, it } from 'vitest';
import { createApiClient } from './client';

describe('createApiClient', () => {
	it('normalizes the base URL and returns a placeholder health payload', async () => {
		const client = createApiClient('https://api.example.com/');
		const health = await client.getHealth();

		expect(client.baseUrl).toBe('https://api.example.com');
		expect(health).toEqual({ status: 'ok' });
	});
});
