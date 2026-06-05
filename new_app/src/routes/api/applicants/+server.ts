import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { searchApplicants } from '$lib/server/queries/applicants';
import { getRangeFilter } from '$lib/utils/range-filter';

export const GET: RequestHandler = async ({ locals, url }) => {
	if (!locals.user) return json([], { status: 401 });
	const q = url.searchParams.get('q') || '';
	if (!q) return json([]);
	const rangeId = getRangeFilter(locals.user);
	const results = await searchApplicants(q, rangeId);
	return json(results);
};
