import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getInspectionByUuid } from '$lib/server/queries/inspections';

export const load: PageServerLoad = async ({ params }) => {
	const inspection = await getInspectionByUuid(params.uuid);
	if (!inspection) error(404, 'Inspection not found');
	return { inspection };
};
