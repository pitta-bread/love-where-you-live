import { createHmac, timingSafeEqual } from 'node:crypto';
import { env as privateEnv } from '$env/dynamic/private';

export const AUTH_SESSION_COOKIE_NAME = 'auth_session';
export const GOOGLE_OAUTH_STATE_COOKIE_NAME = 'google_oauth_state';
export const GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME = 'google_oauth_code_verifier';

export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
export const OAUTH_TRANSIENT_TTL_SECONDS = 60 * 10;

interface SessionClaims {
	sub: string;
	email: string;
	iat: number;
	exp: number;
}

export interface SessionUser {
	sub: string;
	email: string;
}

function getSessionSecret(): string {
	const secret = privateEnv.AUTH_SESSION_SECRET?.trim();
	if (!secret) {
		throw new Error('AUTH_SESSION_SECRET is not configured');
	}
	return secret;
}

function sessionSignature(payloadSegment: string, secret: string): string {
	return createHmac('sha256', secret).update(payloadSegment).digest('base64url');
}

function encodePayload(claims: SessionClaims): string {
	return Buffer.from(JSON.stringify(claims), 'utf8').toString('base64url');
}

function decodePayload(payloadSegment: string): SessionClaims | null {
	try {
		const decoded = Buffer.from(payloadSegment, 'base64url').toString('utf8');
		const parsed = JSON.parse(decoded) as unknown;

		if (!parsed || typeof parsed !== 'object') {
			return null;
		}

		const maybeClaims = parsed as Partial<SessionClaims>;
		if (
			typeof maybeClaims.sub !== 'string' ||
			typeof maybeClaims.email !== 'string' ||
			typeof maybeClaims.iat !== 'number' ||
			typeof maybeClaims.exp !== 'number'
		) {
			return null;
		}

		if (!maybeClaims.sub || !maybeClaims.email.includes('@')) {
			return null;
		}

		if (!Number.isFinite(maybeClaims.iat) || !Number.isFinite(maybeClaims.exp)) {
			return null;
		}

		return maybeClaims as SessionClaims;
	} catch {
		return null;
	}
}

function signaturesMatch(expected: string, provided: string): boolean {
	const expectedBuffer = Buffer.from(expected, 'utf8');
	const providedBuffer = Buffer.from(provided, 'utf8');

	if (expectedBuffer.length !== providedBuffer.length) {
		return false;
	}

	return timingSafeEqual(expectedBuffer, providedBuffer);
}

function nowInSeconds(nowMs: number): number {
	return Math.floor(nowMs / 1000);
}

export function createSessionToken(user: SessionUser, nowMs = Date.now()): string {
	const issuedAt = nowInSeconds(nowMs);
	const claims: SessionClaims = {
		sub: user.sub,
		email: user.email,
		iat: issuedAt,
		exp: issuedAt + SESSION_TTL_SECONDS
	};

	const payloadSegment = encodePayload(claims);
	const signatureSegment = sessionSignature(payloadSegment, getSessionSecret());

	return `${payloadSegment}.${signatureSegment}`;
}

function verifySessionClaims(
	token: string,
	nowMs = Date.now()
): SessionClaims | null {
	const [payloadSegment, signatureSegment, extraSegment] = token.split('.');
	if (!payloadSegment || !signatureSegment || extraSegment) {
		return null;
	}

	const expectedSignature = sessionSignature(payloadSegment, getSessionSecret());
	if (!signaturesMatch(expectedSignature, signatureSegment)) {
		return null;
	}

	const claims = decodePayload(payloadSegment);
	if (!claims) {
		return null;
	}

	const now = nowInSeconds(nowMs);
	if (claims.exp <= now) {
		return null;
	}

	if (claims.iat > claims.exp) {
		return null;
	}

	return claims;
}

export function readSessionUser(token: string | undefined | null, nowMs = Date.now()): SessionUser | null {
	if (!token) {
		return null;
	}

	try {
		const claims = verifySessionClaims(token, nowMs);
		if (!claims) {
			return null;
		}

		return {
			sub: claims.sub,
			email: claims.email
		};
	} catch {
		return null;
	}
}

function isSecureRequest(url: URL): boolean {
	return url.protocol === 'https:';
}

export function authSessionCookieOptions(url: URL) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: isSecureRequest(url),
		maxAge: SESSION_TTL_SECONDS
	};
}

export function oauthTransientCookieOptions(url: URL) {
	return {
		path: '/',
		httpOnly: true,
		sameSite: 'lax' as const,
		secure: isSecureRequest(url),
		maxAge: OAUTH_TRANSIENT_TTL_SECONDS
	};
}
