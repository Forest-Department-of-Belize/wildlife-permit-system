import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getApplicationByUuid } from '$lib/server/queries/applications';
import { deleteApplication } from '$lib/server/commands/applications';

export const load: PageServerLoad = async ({ params }) => {
	const application = await getApplicationByUuid(params.uuid);
	if (!application) error(404, 'Application not found');
	return { application };
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		try {
			await deleteApplication(params.uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Application deleted' }), { path: '/', maxAge: 30 });
			redirect(302, '/applications');
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete: application has related records' }), { path: '/', maxAge: 30 });
				redirect(302, `/applications/${params.uuid}`);
			}
			throw e;
		}
	}
};
