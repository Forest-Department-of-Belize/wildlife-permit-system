import type { Handle } from '@sveltejs/kit';
import type { SessionUser } from '$lib/utils/permissions';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionCookie = event.cookies.get('session');
	if (sessionCookie) {
		try {
			event.locals.user = JSON.parse(sessionCookie) as SessionUser;
		} catch {
			event.locals.user = null;
		}
	} else {
		event.locals.user = null;
	}

	const path = event.url.pathname;
	const publicPaths = ['/login', '/logout', '/forgot-password', '/reset-password', '/setup-account'];
	const isPublic = publicPaths.some((p) => path.startsWith(p));

	if (!isPublic && !event.locals.user && path !== '/') {
		return new Response(null, { status: 302, headers: { location: '/login' } });
	}

	if (path === '/' && !event.locals.user) {
		return new Response(null, { status: 302, headers: { location: '/login' } });
	}

	if (path === '/') {
		return new Response(null, { status: 302, headers: { location: '/dashboard' } });
	}

	return resolve(event);
};
