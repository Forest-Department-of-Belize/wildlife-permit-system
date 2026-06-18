import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listRanges } from '$lib/server/queries/common';
import { listApplicants } from '$lib/server/queries/applicants';
import { createApplication } from '$lib/server/commands/applications';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ url, locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const [ranges, applicantsResult] = await Promise.all([
		listRanges(),
		listApplicants({ rangeId, limit: 1000, offset: 0 })
	]);
	const preselectedApplicantId = url.searchParams.get('applicant') ? Number(url.searchParams.get('applicant')) : undefined;
	return { ranges, applicants: applicantsResult.applicants, preselectedApplicantId };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id') as string;

		if (!applicantId?.trim()) return fail(400, { error: 'Applicant is required' });

		const rangeId = (fd.get('range_id') as string) || locals.user?.rangeId?.toString();

		const application = await createApplication({
			applicantId: Number(applicantId),
			rangeId: rangeId ? Number(rangeId) : null,
			infoSource: (fd.get('info_source') as string) || undefined,
			status: (fd.get('status') as string) || 'Pending',
			applicationDate: (fd.get('application_date') as string) || null,
			applicationSigned: fd.get('application_signed') === 'on',
			followupDone: fd.get('followup_done') === 'on',
			followupDetails: (fd.get('followup_details') as string) || undefined,
			appliedPreviously: fd.get('applied_previously') === 'on',
			appliedPreviouslyDate: (fd.get('applied_previously_date') as string) || null,
			previouslyApproved: fd.get('previously_approved') === 'on',
			applicationExperience: (fd.get('application_experience') as string) || undefined,
			applicationComments: (fd.get('application_comments') as string) || undefined,
			notes: (fd.get('notes') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Application created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/applications/${application.uuid}`);
	}
};
