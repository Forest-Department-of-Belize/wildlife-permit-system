import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const flash = cookies.get('flash');
	if (flash) {
		cookies.delete('flash', { path: '/' });
		try {
			return { user: locals.user, flash: JSON.parse(flash) };
		} catch {
			// ignore
		}
	}
	return { user: locals.user };
};
