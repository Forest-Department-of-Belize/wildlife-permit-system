import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getSpeciesByUuid } from '$lib/server/queries/common';
import { updateSpecies } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) redirect(302, '/login');

	const species = await getSpeciesByUuid(params.uuid);
	if (!species) error(404, 'Species not found');

	return { species };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		const commonName = fd.get('common_name') as string;

		if (!commonName?.trim()) return fail(400, { error: 'Common name is required' });

		await updateSpecies(
			params.uuid,
			commonName.trim(),
			(fd.get('scientific_name') as string) || undefined,
			(fd.get('image_url') as string) || undefined
		);

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Species updated successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/species/${params.uuid}`);
	}
};
