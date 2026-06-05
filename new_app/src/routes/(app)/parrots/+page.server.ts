import type { PageServerLoad } from './$types';
import { listParrots } from '$lib/server/queries/parrots';
import { listRanges } from '$lib/server/queries/common';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const [result, ranges] = await Promise.all([
		listParrots({ rangeId, limit, offset: (page - 1) * limit }),
		listRanges()
	]);

	return {
		parrots: result.parrots,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page,
		ranges
	};
};
