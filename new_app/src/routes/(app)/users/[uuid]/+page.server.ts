import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getUserByUuid } from '$lib/server/queries/common';
import { deactivateUser, reactivateUser, resendInvite } from '$lib/server/commands/users';
import { sendInviteEmail } from '$lib/server/services/email';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const targetUser = await getUserByUuid(params.uuid);
	if (!targetUser) error(404, 'User not found');

	return { targetUser };
};

export const actions: Actions = {
	deactivate: async ({ params, cookies }) => {
		await deactivateUser(params.uuid);
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'User deactivated' }), { path: '/', maxAge: 30 });
		redirect(302, `/users/${params.uuid}`);
	},
	reactivate: async ({ params, cookies }) => {
		await reactivateUser(params.uuid);
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'User reactivated' }), { path: '/', maxAge: 30 });
		redirect(302, `/users/${params.uuid}`);
	},
	resendInvite: async ({ params, cookies }) => {
		const { user, inviteToken } = await resendInvite(params.uuid);
		await sendInviteEmail(user.email, inviteToken, `${user.firstName} ${user.lastName}`);
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Invite email resent' }), { path: '/', maxAge: 30 });
		redirect(302, `/users/${params.uuid}`);
	}
};
