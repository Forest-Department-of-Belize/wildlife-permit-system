import type { PageServerLoad } from './$types';
import { listComments } from '$lib/server/queries/comments';

export const load: PageServerLoad = async ({ url }) => {
	const page = parseInt(url.searchParams.get('page') || '1');
	const limit = 30;

	const result = await listComments({ limit, offset: (page - 1) * limit });

	return {
		comments: result.comments,
		total: result.total,
		totalPages: Math.ceil(result.total / limit),
		page
	};
};
