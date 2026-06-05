import type { PageServerLoad } from './$types';
import { listInspections } from '$lib/server/queries/inspections';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const status = url.searchParams.get('status') || undefined;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const result = await listInspections({ rangeId, status, limit, offset: (page - 1) * limit });

	return {
		inspections: result.inspections,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page,
		status: status || ''
	};
};
