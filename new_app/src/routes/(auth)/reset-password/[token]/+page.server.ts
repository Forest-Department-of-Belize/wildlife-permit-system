import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { validateResetToken, resetPassword } from '$lib/server/commands/auth';

export const load: PageServerLoad = async ({ params }) => {
	const valid = await validateResetToken(params.token);
	if (!valid) redirect(302, '/login');
	return {};
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const data = await request.formData();
		const password = data.get('password') as string;
		const confirm = data.get('confirm_password') as string;

		if (password !== confirm) return fail(400, { error: 'Passwords do not match' });
		if (password.length < 8) return fail(400, { error: 'Password must be at least 8 characters' });

		const success = await resetPassword(params.token, password);
		if (!success) return fail(400, { error: 'Invalid or expired reset link' });

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Password reset successfully. Please login.' }), { path: '/', maxAge: 30 });
		redirect(302, '/login');
	}
};
