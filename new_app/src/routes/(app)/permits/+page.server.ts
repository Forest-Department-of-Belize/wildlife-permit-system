import type { PageServerLoad } from './$types';
import { listPermits } from '$lib/server/queries/permits';
import { listRanges } from '$lib/server/queries/common';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const search = url.searchParams.get('search') || undefined;
	const status = url.searchParams.get('status') || undefined;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const [result, ranges] = await Promise.all([
		listPermits({ rangeId, search, status, limit, offset: (page - 1) * limit }),
		listRanges()
	]);

	return {
		permits: result.permits,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page,
		search: search || '',
		status: status || '',
		ranges
	};
};
