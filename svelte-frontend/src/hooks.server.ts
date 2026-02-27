import { AUTH_SESSION_COOKIE_NAME, readSessionUser } from '$lib/server/auth/session';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(AUTH_SESSION_COOKIE_NAME);
	event.locals.user = readSessionUser(token);

	return resolve(event);
};
