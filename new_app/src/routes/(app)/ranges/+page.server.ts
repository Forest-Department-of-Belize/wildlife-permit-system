import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { listRanges } from '$lib/server/queries/common';
import { deleteRange } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { ranges: [] };
	const ranges = await listRanges();
	return { ranges };
};

export const actions: Actions = {
	delete: async ({ request, cookies }) => {
		const fd = await request.formData();
		const uuid = fd.get('uuid') as string;

		try {
			await deleteRange(uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Forest station deleted' }), { path: '/', maxAge: 30 });
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete: station has related records' }), { path: '/', maxAge: 30 });
			} else {
				throw e;
			}
		}
		redirect(302, '/ranges');
	}
};
