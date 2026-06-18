import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getApplicationByUuid } from '$lib/server/queries/applications';
import { listRanges } from '$lib/server/queries/common';
import { listApplicants } from '$lib/server/queries/applicants';
import { updateApplication } from '$lib/server/commands/applications';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ params, locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const [application, ranges, applicantsResult] = await Promise.all([
		getApplicationByUuid(params.uuid),
		listRanges(),
		listApplicants({ rangeId, limit: 1000, offset: 0 })
	]);
	if (!application) error(404, 'Application not found');
	return { application, ranges, applicants: applicantsResult.applicants };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		try {
			await updateApplication(params.uuid, {
				applicantId: Number(fd.get('applicant_id')),
				rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : null,
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
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Application updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update application' });
		}
		redirect(302, `/applications/${params.uuid}`);
	}
};
