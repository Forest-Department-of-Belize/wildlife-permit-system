import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createDistrict } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();
		const name = fd.get('name') as string;

		if (!name?.trim()) return fail(400, { error: 'Name is required' });

		await createDistrict(name.trim());

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'District created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, '/districts');
	}
};
