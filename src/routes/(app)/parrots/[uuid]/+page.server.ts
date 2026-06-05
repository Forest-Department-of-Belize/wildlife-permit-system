import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getParrotByUuid } from '$lib/server/queries/parrots';
import { deleteParrot } from '$lib/server/commands/parrots';

export const load: PageServerLoad = async ({ params }) => {
	const parrot = await getParrotByUuid(params.uuid);
	if (!parrot) error(404, 'Parrot not found');
	return { parrot };
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		try {
			await deleteParrot(params.uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Parrot deleted' }), { path: '/', maxAge: 30 });
			redirect(302, '/parrots');
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete: parrot has related records' }), { path: '/', maxAge: 30 });
				redirect(302, `/parrots/${params.uuid}`);
			}
			throw e;
		}
	}
};
