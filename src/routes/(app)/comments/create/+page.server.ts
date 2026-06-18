import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listApplicants } from '$lib/server/queries/applicants';
import { createComment } from '$lib/server/commands/comments';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ url, locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const applicantsResult = await listApplicants({ rangeId, limit: 1000, offset: 0 });
	const preselectedApplicantId = url.searchParams.get('applicant') ? Number(url.searchParams.get('applicant')) : undefined;
	return { applicants: applicantsResult.applicants, preselectedApplicantId };
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id') as string;

		if (!applicantId?.trim()) return fail(400, { error: 'Applicant is required' });

		const comment = await createComment({
			applicantId: Number(applicantId),
			commentDate: (fd.get('comment_date') as string) || null,
			commentComments: (fd.get('comment_comments') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Comment created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/comments/${comment.uuid}`);
	}
};
