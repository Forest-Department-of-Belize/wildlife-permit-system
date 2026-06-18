import type { PageServerLoad } from './$types';
import { listApplications } from '$lib/server/queries/applications';
import { listRanges } from '$lib/server/queries/common';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const status = url.searchParams.get('status') || undefined;
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const [result, ranges] = await Promise.all([
		listApplications({ rangeId, status, limit, offset: (page - 1) * limit }),
		listRanges()
	]);

	return {
		applications: result.applications,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page,
		status: status || '',
		ranges
	};
};
