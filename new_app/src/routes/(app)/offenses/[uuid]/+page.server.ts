import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getOffenseByUuid } from '$lib/server/queries/offenses';

export const load: PageServerLoad = async ({ params }) => {
	const offense = await getOffenseByUuid(params.uuid);
	if (!offense) error(404, 'Offense not found');
	return { offense };
};
