import type { PageServerLoad } from './$types';
import { listCalls } from '$lib/server/queries/calls';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const result = await listCalls({ limit, offset: (page - 1) * limit });

	return {
		calls: result.calls,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page
	};
};
