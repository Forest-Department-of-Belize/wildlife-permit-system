import type { PageServerLoad } from './$types';
import { listUsers } from '$lib/server/queries/common';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return { users: [] };
	const users = await listUsers();
	return { users };
};
