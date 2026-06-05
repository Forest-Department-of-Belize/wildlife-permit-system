import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getPermitByUuid } from '$lib/server/queries/permits';

export const load: PageServerLoad = async ({ params }) => {
	const permit = await getPermitByUuid(params.uuid);
	if (!permit) error(404, 'Permit not found');
	return { permit };
};
