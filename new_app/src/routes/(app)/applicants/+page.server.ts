import type { PageServerLoad } from './$types';
import { listApplicants } from '$lib/server/queries/applicants';
import { listDistricts } from '$lib/server/queries/common';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const search = url.searchParams.get('search') || undefined;
	const page = parseInt(url.searchParams.get('page') || '1');
	const letter = url.searchParams.get('letter') || undefined;
	const district = url.searchParams.get('district') || undefined;
	const status = url.searchParams.get('status') || undefined;
	const limit = 30;

	const [result, districts] = await Promise.all([
		listApplicants({ rangeId, search, limit, offset: (page - 1) * limit, letter, district, status }),
		listDistricts()
	]);

	return {
		applicants: result.applicants,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page,
		search: search || '',
		letter: letter || '',
		district: district || '',
		status: status || '',
		districts
	};
};
