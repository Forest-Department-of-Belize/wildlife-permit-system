import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getSpeciesByUuid } from '$lib/server/queries/common';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user) error(401, 'Unauthorized');

	const species = await getSpeciesByUuid(params.uuid);
	if (!species) error(404, 'Species not found');

	return { species };
};
