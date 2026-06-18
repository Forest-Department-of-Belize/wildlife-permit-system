import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getCommentByUuid } from '$lib/server/queries/comments';
import { deleteComment } from '$lib/server/commands/comments';

export const load: PageServerLoad = async ({ params }) => {
	const comment = await getCommentByUuid(params.uuid);
	if (!comment) error(404, 'Comment not found');
	return { comment };
};

export const actions: Actions = {
	delete: async ({ params, cookies }) => {
		try {
			await deleteComment(params.uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Comment deleted' }), { path: '/', maxAge: 30 });
			redirect(302, '/comments');
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete comment' }), { path: '/', maxAge: 30 });
				redirect(302, `/comments/${params.uuid}`);
			}
			throw e;
		}
	}
};
