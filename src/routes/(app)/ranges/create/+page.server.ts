import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listDistricts } from '$lib/server/queries/common';
import { createRange } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	const districts = await listDistricts();
	return { districts };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();
		const name = fd.get('name') as string;
		const districtId = fd.get('district_id') as string;

		if (!name?.trim()) return fail(400, { error: 'Name is required' });
		if (!districtId) return fail(400, { error: 'District is required' });

		await createRange(name.trim(), Number(districtId));

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Forest station created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, '/ranges');
	}
};
