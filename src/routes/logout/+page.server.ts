import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete('session', { path: '/' });
	redirect(302, '/login');
};
