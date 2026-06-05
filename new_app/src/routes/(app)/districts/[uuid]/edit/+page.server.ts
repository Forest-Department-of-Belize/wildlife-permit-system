import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getDistrictByUuid } from '$lib/server/queries/common';
import { updateDistrict } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const district = await getDistrictByUuid(params.uuid);
	if (!district) error(404, 'District not found');

	return { district };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		const name = fd.get('name') as string;

		if (!name?.trim()) return fail(400, { error: 'Name is required' });

		await updateDistrict(params.uuid, name.trim());

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'District updated successfully' }), { path: '/', maxAge: 30 });
		redirect(302, '/districts');
	}
};
