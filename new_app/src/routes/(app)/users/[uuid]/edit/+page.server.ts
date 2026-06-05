import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getUserByUuid, listRoles, listRanges } from '$lib/server/queries/common';
import { updateUser } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const [targetUser, roles, ranges] = await Promise.all([
		getUserByUuid(params.uuid),
		listRoles(),
		listRanges()
	]);

	if (!targetUser) error(404, 'User not found');

	return { targetUser, roles, ranges };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
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
			await updateUser(params.uuid, {
				firstName: firstName.trim(),
				lastName: lastName.trim(),
				email: email.trim().toLowerCase(),
				roleId: Number(roleId),
				rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : null
			});

			cookies.set('flash', JSON.stringify({ type: 'success', message: 'User updated successfully' }), { path: '/', maxAge: 30 });
			redirect(302, `/users/${params.uuid}`);
		} catch (e: any) {
			if (e.code === '23505') {
				return fail(400, { error: 'A user with this email already exists' });
			}
			throw e;
		}
	}
};
