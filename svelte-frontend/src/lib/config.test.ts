import { describe, expect, it } from 'vitest';
import { resolvePublicApiBaseUrl } from './config';

describe('resolvePublicApiBaseUrl', () => {
	it('returns localhost fallback when env is missing', () => {
		expect(resolvePublicApiBaseUrl(undefined)).toBe('http://localhost:8000');
	});

	it('trims and normalizes trailing slash when env is set', () => {
		expect(resolvePublicApiBaseUrl(' https://api.example.com/ ')).toBe('https://api.example.com');
	});
});
