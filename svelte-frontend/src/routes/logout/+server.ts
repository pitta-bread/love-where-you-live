import { AUTH_SESSION_COOKIE_NAME } from '$lib/server/auth/session';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const logoutHandler: RequestHandler = ({ cookies }) => {
	cookies.delete(AUTH_SESSION_COOKIE_NAME, { path: '/' });
	throw redirect(303, '/welcome');
};

export const POST: RequestHandler = logoutHandler;
export const GET: RequestHandler = logoutHandler;
