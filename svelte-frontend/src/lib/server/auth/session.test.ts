import { afterEach, describe, expect, it } from 'vitest';
import { createSessionToken, readSessionUser, SESSION_TTL_SECONDS } from './session';

const originalSessionSecret = process.env.AUTH_SESSION_SECRET;

afterEach(() => {
	process.env.AUTH_SESSION_SECRET = originalSessionSecret;
});

describe('session token helpers', () => {
	it('creates and validates a session token', () => {
		process.env.AUTH_SESSION_SECRET = 'test-session-secret';

		const token = createSessionToken({
			sub: 'google-user-123',
			email: 'test.user@example.com'
		});

		const user = readSessionUser(token);

		expect(user).toEqual({
			sub: 'google-user-123',
			email: 'test.user@example.com'
		});
	});

	it('rejects a tampered token signature', () => {
		process.env.AUTH_SESSION_SECRET = 'test-session-secret';

		const token = createSessionToken({
			sub: 'google-user-123',
			email: 'test.user@example.com'
		});
		const [payload, signature] = token.split('.');
		const tamperedToken = `${payload}.${signature.slice(0, -1)}x`;

		expect(readSessionUser(tamperedToken)).toBeNull();
	});

	it('rejects expired tokens', () => {
		process.env.AUTH_SESSION_SECRET = 'test-session-secret';

		const issuedAtMs = 1_000;
		const token = createSessionToken(
			{
				sub: 'google-user-123',
				email: 'test.user@example.com'
			},
			issuedAtMs
		);
		const afterExpiryMs = (1 + SESSION_TTL_SECONDS + 1) * 1000;

		expect(readSessionUser(token, afterExpiryMs)).toBeNull();
	});
});
