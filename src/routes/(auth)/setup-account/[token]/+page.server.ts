import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validateInviteToken, setupAccount } from '$lib/server/commands/auth';

export const load: PageServerLoad = async ({ params }) => {
	const user = await validateInviteToken(params.token);
	if (!user) redirect(302, '/login');
	return { invitedUser: user };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const confirm = data.get('confirm_password') as string;

		if (password !== confirm) return fail(400, { error: 'Passwords do not match' });
		if (password.length < 8) return fail(400, { error: 'Password must be at least 8 characters' });

		const success = await setupAccount(params.token, password);
		if (!success) return fail(400, { error: 'Invalid or expired invite link' });

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Account set up successfully. Please login.' }), { path: '/', maxAge: 30 });
		redirect(302, '/login');
	}
};
