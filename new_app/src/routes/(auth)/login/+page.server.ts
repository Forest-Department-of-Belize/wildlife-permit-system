import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { authenticateUser } from '$lib/server/commands/auth';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) redirect(302, '/dashboard');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const email = data.get('email') as string;
		const password = data.get('password') as string;

		if (!email || !password) {
			return fail(400, { error: 'Email and password are required' });
		}

		const user = await authenticateUser(email, password);
		if (!user) {
			return fail(400, { error: 'Invalid email or password' });
		}

		const { firstLogin, ...sessionData } = user;
		cookies.set('session', JSON.stringify(sessionData), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24
		});

		if (firstLogin) redirect(302, '/users/profile');
		redirect(302, '/dashboard');
	}
};
