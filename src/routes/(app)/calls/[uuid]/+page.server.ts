import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getCallByUuid } from '$lib/server/queries/calls';

export const load: PageServerLoad = async ({ params }) => {
	const call = await getCallByUuid(params.uuid);
	if (!call) error(404, 'Call not found');
	return { call };
};
