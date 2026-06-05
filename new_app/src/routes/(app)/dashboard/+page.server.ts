import type { PageServerLoad } from './$types';
import { getDashboardStats } from '$lib/server/queries/dashboard';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const { stats, recentInspections } = await getDashboardStats(rangeId);
	return { stats, recentInspections };
};
