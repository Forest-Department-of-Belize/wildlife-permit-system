import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createSpecies } from '$lib/server/commands/users';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) redirect(302, '/login');
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();
		const commonName = fd.get('common_name') as string;

		if (!commonName?.trim()) return fail(400, { error: 'Common name is required' });

		const species = await createSpecies(
			commonName.trim(),
			(fd.get('scientific_name') as string) || undefined,
			(fd.get('image_url') as string) || undefined
		);

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Species created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/species/${species.uuid}`);
	}
};
