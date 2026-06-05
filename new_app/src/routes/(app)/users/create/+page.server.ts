import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listRoles, listRanges } from '$lib/server/queries/common';
import { createUser } from '$lib/server/commands/users';
import { sendInviteEmail } from '$lib/server/services/email';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const [roles, ranges] = await Promise.all([listRoles(), listRanges()]);
	return { roles, ranges };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();
		const firstName = fd.get('first_name') as string;
		const lastName = fd.get('last_name') as string;
		const email = fd.get('email') as string;
		const roleId = fd.get('role_id') as string;

		if (!firstName?.trim()) return fail(400, { error: 'First name is required' });
		if (!lastName?.trim()) return fail(400, { error: 'Last name is required' });
		if (!email?.trim()) return fail(400, { error: 'Email is required' });
		if (!roleId) return fail(400, { error: 'Role is required' });

		try {
			const { user, inviteToken } = await createUser({
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
				roleId: Number(roleId),
				rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : null
			});

			await sendInviteEmail(user.email, inviteToken, `${user.firstName} ${user.lastName}`);

			cookies.set('flash', JSON.stringify({ type: 'success', message: 'User created and invite email sent' }), { path: '/', maxAge: 30 });
			redirect(302, `/users/${user.uuid}`);
		} catch (e: any) {
			if (e.code === '23505') {
				return fail(400, { error: 'A user with this email already exists' });
			}
			throw e;
		}
	}
};
