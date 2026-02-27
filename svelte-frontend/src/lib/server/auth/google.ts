import { createHash, randomBytes } from 'node:crypto';
import { env as privateEnv } from '$env/dynamic/private';

const GOOGLE_AUTHORIZATION_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_USERINFO_URL = 'https://openidconnect.googleapis.com/v1/userinfo';

const GOOGLE_SCOPES = ['openid', 'email', 'profile'] as const;

interface GoogleTokenResponse {
	access_token: string;
}

interface GoogleUserInfoResponse {
	sub: string;
	email: string;
	email_verified: boolean;
}

export interface GoogleIdentity {
	sub: string;
	email: string;
}

function googleClientId(): string {
	const clientId = privateEnv.GOOGLE_CLIENT_ID?.trim();
	if (!clientId) {
		throw new Error('GOOGLE_CLIENT_ID is not configured');
	}
	return clientId;
}

function googleClientSecret(): string {
	const clientSecret = privateEnv.GOOGLE_CLIENT_SECRET?.trim();
	if (!clientSecret) {
		throw new Error('GOOGLE_CLIENT_SECRET is not configured');
	}
	return clientSecret;
}

export function generateGoogleOauthState(): string {
	return randomBytes(24).toString('base64url');
}

export function generateGoogleCodeVerifier(): string {
	return randomBytes(32).toString('base64url');
}

function generatePkceChallenge(codeVerifier: string): string {
	return createHash('sha256').update(codeVerifier).digest('base64url');
}

export function googleCallbackUrl(url: URL): string {
	return new URL('/login/google/callback', url.origin).toString();
}

export function createGoogleAuthorizationUrl(
	url: URL,
	state: string,
	codeVerifier: string
): string {
	const params = new URLSearchParams({
		client_id: googleClientId(),
		redirect_uri: googleCallbackUrl(url),
		response_type: 'code',
		scope: GOOGLE_SCOPES.join(' '),
		state,
		code_challenge: generatePkceChallenge(codeVerifier),
		code_challenge_method: 'S256',
		access_type: 'offline',
		include_granted_scopes: 'true'
	});

	return `${GOOGLE_AUTHORIZATION_URL}?${params.toString()}`;
}

export async function exchangeGoogleAuthorizationCode(
	url: URL,
	code: string,
	codeVerifier: string
): Promise<GoogleTokenResponse> {
	const response = await fetch(GOOGLE_TOKEN_URL, {
		method: 'POST',
		headers: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			code,
			client_id: googleClientId(),
			client_secret: googleClientSecret(),
			redirect_uri: googleCallbackUrl(url),
			grant_type: 'authorization_code',
			code_verifier: codeVerifier
		})
	});

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(`Google token exchange failed: ${response.status} ${body}`);
	}

	const payload = (await response.json()) as Partial<GoogleTokenResponse>;
	if (typeof payload.access_token !== 'string' || !payload.access_token) {
		throw new Error('Google token exchange missing access_token');
	}

	return {
		access_token: payload.access_token
	};
}

export async function fetchGoogleIdentity(accessToken: string): Promise<GoogleIdentity> {
	const response = await fetch(GOOGLE_USERINFO_URL, {
		headers: {
			authorization: `Bearer ${accessToken}`
		}
	});

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new Error(`Google userinfo failed: ${response.status} ${body}`);
	}

	const payload = (await response.json()) as Partial<GoogleUserInfoResponse>;
	if (
		typeof payload.sub !== 'string' ||
		typeof payload.email !== 'string' ||
		typeof payload.email_verified !== 'boolean'
	) {
		throw new Error('Google userinfo response missing required fields');
	}

	if (!payload.email_verified) {
		throw new Error('Google account email is not verified');
	}

	return {
		sub: payload.sub,
		email: payload.email
	};
}
