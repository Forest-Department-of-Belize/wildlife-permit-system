import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getRangeByUuid, listDistricts } from '$lib/server/queries/common';
import { updateRange } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const [range, districts] = await Promise.all([
		getRangeByUuid(params.uuid),
		listDistricts()
	]);

	if (!range) error(404, 'Forest station not found');

	return { range, districts };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		const name = fd.get('name') as string;
		const districtId = fd.get('district_id') as string;

		if (!name?.trim()) return fail(400, { error: 'Name is required' });
		if (!districtId) return fail(400, { error: 'District is required' });

		await updateRange(params.uuid, name.trim(), Number(districtId));

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Forest station updated successfully' }), { path: '/', maxAge: 30 });
		redirect(302, '/ranges');
	}
};
