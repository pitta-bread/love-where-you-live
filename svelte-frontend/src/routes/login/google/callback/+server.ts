import {
	exchangeGoogleAuthorizationCode,
	fetchGoogleIdentity
} from '$lib/server/auth/google';
import {
	AUTH_SESSION_COOKIE_NAME,
	GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME,
	authSessionCookieOptions,
	createSessionToken
} from '$lib/server/auth/session';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function clearTransientOauthCookies(cookies: Parameters<RequestHandler>[0]['cookies']): void {
	cookies.delete(GOOGLE_OAUTH_STATE_COOKIE_NAME, { path: '/' });
	cookies.delete(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME, { path: '/' });
}

export const GET: RequestHandler = async ({ cookies, url }) => {
	const code = url.searchParams.get('code');
	const returnedState = url.searchParams.get('state');
	const storedState = cookies.get(GOOGLE_OAUTH_STATE_COOKIE_NAME);
	const codeVerifier = cookies.get(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME);

	clearTransientOauthCookies(cookies);

	if (!code || !returnedState || !storedState || returnedState !== storedState || !codeVerifier) {
		throw error(400, 'Google sign-in callback validation failed');
	}

	let accessToken: string;
	try {
		const tokens = await exchangeGoogleAuthorizationCode(url, code, codeVerifier);
		accessToken = tokens.access_token;
	} catch (cause) {
		console.error('Google OAuth token exchange failed', { cause });
		throw error(502, 'Unable to complete Google sign-in');
	}

	let identity: { sub: string; email: string };
	try {
		identity = await fetchGoogleIdentity(accessToken);
	} catch (cause) {
		console.error('Google OAuth profile fetch failed', { cause });
		throw error(502, 'Unable to load Google account profile');
	}

	const sessionToken = createSessionToken(identity);
	cookies.set(AUTH_SESSION_COOKIE_NAME, sessionToken, authSessionCookieOptions(url));

	throw redirect(303, '/projects');
};
