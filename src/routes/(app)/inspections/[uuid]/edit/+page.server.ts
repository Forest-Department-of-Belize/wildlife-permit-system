import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getInspectionByUuid } from '$lib/server/queries/inspections';
import { listRanges } from '$lib/server/queries/common';
import { searchApplicants } from '$lib/server/queries/applicants';
import { updateInspection } from '$lib/server/commands/inspections';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ params, locals }) => {
	const rangeId = getRangeFilter(locals.user!);

	const [inspection, ranges, applicants] = await Promise.all([
		getInspectionByUuid(params.uuid),
		listRanges(),
		searchApplicants('', rangeId)
	]);

	if (!inspection) error(404, 'Inspection not found');
	return { inspection, ranges, applicants };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		try {
			await updateInspection(params.uuid, {
				applicantId: fd.get('applicant_id') ? Number(fd.get('applicant_id')) : undefined,
				rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : undefined,
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
				preconditionsComments: (fd.get('preconditions_comments') as string) || undefined,
				approxReportDate: (fd.get('approx_report_date') as string) || undefined,
				whenApproxReportDateProvided: (fd.get('when_approx_report_date_provided') as string) || undefined,
				dateAcquired: (fd.get('date_acquired') as string) || undefined,
				approxDateAcquired: (fd.get('approx_date_acquired') as string) || undefined,
				lessTwelveMonthsAcquired: fd.get('less_12_months_acquired') === 'on'
			});
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Inspection updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update inspection' });
		}
		redirect(302, `/inspections/${params.uuid}`);
	}
};
