import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listRanges } from '$lib/server/queries/common';
import { searchApplicants } from '$lib/server/queries/applicants';
import { createInspection } from '$lib/server/commands/inspections';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const applicantId = url.searchParams.get('applicant') || undefined;

	const [ranges, applicants] = await Promise.all([
		listRanges(),
		searchApplicants('', rangeId)
	]);

	return { ranges, applicants, preselectedApplicantId: applicantId };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id') as string;

		if (!applicantId?.trim()) return fail(400, { error: 'Applicant is required' });

		const rangeId = (fd.get('range_id') as string) || locals.user?.rangeId?.toString();

		const inspection = await createInspection({
			applicantId: Number(applicantId),
			rangeId: rangeId ? Number(rangeId) : undefined,
			inspectorName: (fd.get('inspector_name') as string) || undefined,
			inspectionDate: (fd.get('inspection_date') as string) || undefined,
			inspectionStatus: (fd.get('inspection_status') as string) || 'scheduled',
			notes: (fd.get('notes') as string) || undefined,
			followupDate: (fd.get('followup_date') as string) || undefined,
			followupNotes: (fd.get('followup_notes') as string) || undefined,
			birdsDescribed: (fd.get('birds_described') as string) || undefined,
			handTame: fd.get('hand_tame') === 'on',
			instructionsForApplicant: (fd.get('instructions_for_applicant') as string) || undefined,
			expectedRecheck: (fd.get('expected_recheck') as string) || undefined,
			preconditionsComments: (fd.get('preconditions_comments') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Inspection created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/inspections/${inspection.uuid}`);
	}
};
