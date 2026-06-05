import type { PageServerLoad } from './$types';
import { listSpecies } from '$lib/server/queries/common';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { species: [] };
	const species = await listSpecies();
	return { species };
};
