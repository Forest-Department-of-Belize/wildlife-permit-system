import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) return {};
	return {};
};

export const actions: Actions = {
	default: async () => {
		return fail(400, { error: 'Import not yet implemented' });
	}
};
