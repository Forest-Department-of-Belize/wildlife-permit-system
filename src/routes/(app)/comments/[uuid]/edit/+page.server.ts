import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getCommentByUuid } from '$lib/server/queries/comments';
import { listApplicants } from '$lib/server/queries/applicants';
import { updateComment } from '$lib/server/commands/comments';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ params, locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const [comment, applicantsResult] = await Promise.all([
		getCommentByUuid(params.uuid),
		listApplicants({ rangeId, limit: 1000, offset: 0 })
	]);
	if (!comment) error(404, 'Comment not found');
	return { comment, applicants: applicantsResult.applicants };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		try {
			await updateComment(params.uuid, {
				applicantId: Number(fd.get('applicant_id')),
				commentDate: (fd.get('comment_date') as string) || null,
				commentComments: (fd.get('comment_comments') as string) || undefined
			});
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Comment updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update comment' });
		}
		redirect(302, `/comments/${params.uuid}`);
	}
};
