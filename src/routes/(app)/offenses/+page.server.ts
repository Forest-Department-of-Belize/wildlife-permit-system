import type { PageServerLoad } from './$types';
import { listOffenses } from '$lib/server/queries/offenses';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const result = await listOffenses({ rangeId, limit, offset: (page - 1) * limit });

	return {
		offenses: result.offenses,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page
	};
};
