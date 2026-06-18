import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { createCall } from '$lib/server/commands/calls';
import { listApplicants } from '$lib/server/queries/applicants';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ url, locals }) => {
	const applicantId = url.searchParams.get('applicant') || undefined;
	const rangeId = getRangeFilter(locals.user!);
	const applicantsResult = await listApplicants({ rangeId, limit: 1000, offset: 0 });
	return {
		applicants: applicantsResult.applicants,
		preselectedApplicantId: applicantId ? Number(applicantId) : undefined
	};
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id');

		if (!applicantId) return fail(400, { error: 'Applicant is required' });

		const call = await createCall({
			applicantId: Number(applicantId),
			officerId: locals.user!.id,
			officerName: `${locals.user!.firstName} ${locals.user!.lastName}`,
			numberCalled: (fd.get('number_called') as string) || undefined,
			callDate: (fd.get('call_date') as string) || null,
			language: (fd.get('language') as string) || undefined,
			isFunctional: fd.get('is_functional') === 'on',
			isAnswered: fd.get('is_answered') === 'on',
			isApplicant: fd.get('is_applicant') === 'on',
			isFullyCompleted: fd.get('is_fully_completed') === 'on',
			callNowConsent: fd.get('call_now_consent') === 'on',
			callLaterConsent: fd.get('call_later_consent') === 'on',
			callLaterDate: (fd.get('call_later_date') as string) || null,
			consentsDigitalResources: fd.get('consents_digital_resources') === 'on',
			numNeighborsParrots: fd.get('num_neighbors_parrots') ? Number(fd.get('num_neighbors_parrots')) : undefined,
			neighborhoodDescription: (fd.get('neighborhood_description') as string) || undefined,
			callComments: (fd.get('call_comments') as string) || undefined,
			knowApplicant: fd.get('know_applicant') === 'on',
			relationApplicant: (fd.get('relation_applicant') as string) || undefined,
			newApplicantContact: (fd.get('new_applicant_contact') as string) || undefined,
			scheduledFollowup: fd.get('scheduled_followup') === 'on',
			followupDate: (fd.get('followup_date') as string) || null
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Call logged successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/calls/${call.uuid}`);
	}
};
