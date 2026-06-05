import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { updateProfile } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		if (!locals.user) redirect(302, '/login');

		const fd = await request.formData();
		const firstName = fd.get('first_name') as string;
		const lastName = fd.get('last_name') as string;
		const email = fd.get('email') as string;
		const newPassword = fd.get('new_password') as string;
		const confirmPassword = fd.get('confirm_password') as string;

		if (!firstName?.trim()) return fail(400, { error: 'First name is required' });
		if (!lastName?.trim()) return fail(400, { error: 'Last name is required' });
		if (!email?.trim()) return fail(400, { error: 'Email is required' });

		if (newPassword && newPassword !== confirmPassword) {
			return fail(400, { error: 'Passwords do not match' });
		}

		if (newPassword && newPassword.length < 8) {
			return fail(400, { error: 'Password must be at least 8 characters' });
		}

		try {
			await updateProfile(
				locals.user.uuid,
				firstName.trim(),
				lastName.trim(),
				email.trim().toLowerCase(),
				newPassword || undefined
			);

			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Profile updated successfully' }), { path: '/', maxAge: 30 });
			redirect(302, '/users/profile');
		} catch (e: any) {
			if (e.code === '23505') {
				return fail(400, { error: 'A user with this email already exists' });
			}
			throw e;
		}
	}
};
