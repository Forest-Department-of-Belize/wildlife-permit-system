import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { listDistricts } from '$lib/server/queries/common';
import { deleteDistrict } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { districts: [] };
	const districts = await listDistricts();
	return { districts };
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		const fd = await request.formData();
		const uuid = fd.get('uuid') as string;

		try {
			await deleteDistrict(uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'District deleted' }), { path: '/', maxAge: 30 });
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete: district has related records' }), { path: '/', maxAge: 30 });
			} else {
				throw e;
			}
		}
		redirect(302, '/districts');
	}
};
