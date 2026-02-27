import {
	createGoogleAuthorizationUrl,
	generateGoogleCodeVerifier,
	generateGoogleOauthState
} from '$lib/server/auth/google';
import {
	GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME,
	GOOGLE_OAUTH_STATE_COOKIE_NAME,
	oauthTransientCookieOptions
} from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ cookies, locals, url }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}

	const state = generateGoogleOauthState();
	const codeVerifier = generateGoogleCodeVerifier();
	const cookieOptions = oauthTransientCookieOptions(url);

	cookies.set(GOOGLE_OAUTH_STATE_COOKIE_NAME, state, cookieOptions);
	cookies.set(GOOGLE_OAUTH_CODE_VERIFIER_COOKIE_NAME, codeVerifier, cookieOptions);

	throw redirect(302, createGoogleAuthorizationUrl(url, state, codeVerifier));
};
