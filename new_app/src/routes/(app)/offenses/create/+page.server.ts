import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createOffense } from '$lib/server/commands/offenses';
import { listApplicants } from '$lib/server/queries/applicants';
import { listRanges } from '$lib/server/queries/common';

export const load: PageServerLoad = async ({ url }) => {
	const applicantId = url.searchParams.get('applicant') || undefined;
	const [applicantsResult, ranges] = await Promise.all([
		listApplicants({ limit: 1000, offset: 0 }),
		listRanges()
	]);
	return {
		applicants: applicantsResult.applicants,
		ranges,
		preselectedApplicantId: applicantId ? Number(applicantId) : undefined
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id');

		if (!applicantId) return fail(400, { error: 'Applicant is required' });

		const offense = await createOffense({
			applicantId: Number(applicantId),
			officerId: locals.user!.id,
			officerName: `${locals.user!.firstName} ${locals.user!.lastName}`,
			rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : (locals.user!.rangeId || null),
			offenseDate: (fd.get('offense_date') as string) || null,
			illegalWildlife: (fd.get('illegal_wildlife') as string) || undefined,
			cageSizeFeet: (fd.get('cage_size_feet') as string) || undefined,
			cageLocation: (fd.get('cage_location') as string) || undefined,
			reasonConfiscated: (fd.get('reason_confiscated') as string) || undefined,
			handTame: fd.get('hand_tame') === 'on',
			priorHistory: fd.get('prior_history') === 'on',
			cageConfiscated: fd.get('cage_confiscated') === 'on',
			signedOfficer: fd.get('signed_officer') === 'on',
			signedOffender: fd.get('signed_offender') === 'on',
			signedDate: (fd.get('signed_date') as string) || null,
			healthIssues: (fd.get('health_issues') as string) || undefined,
			dietNotes: (fd.get('diet_notes') as string) || undefined,
			offenseComments: (fd.get('offense_comments') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Offense logged successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/offenses/${offense.uuid}`);
	}
};
