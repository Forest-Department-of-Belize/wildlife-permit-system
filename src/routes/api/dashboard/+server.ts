import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDashboardChartData } from '$lib/server/queries/dashboard';
import { getRangeFilter } from '$lib/utils/range-filter';

export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.user) return json({ error: 'Unauthorized' }, { status: 401 });
	const rangeId = getRangeFilter(locals.user);
	const data = await getDashboardChartData(rangeId);
	return json(data);
};
