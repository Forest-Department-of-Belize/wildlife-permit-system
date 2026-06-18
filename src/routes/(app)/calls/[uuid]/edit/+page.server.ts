import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getCallByUuid } from '$lib/server/queries/calls';
import { listApplicants } from '$lib/server/queries/applicants';
import { updateCall } from '$lib/server/commands/calls';

export const load: PageServerLoad = async ({ params }) => {
	const [call, applicantsResult] = await Promise.all([
		getCallByUuid(params.uuid),
		listApplicants({ limit: 1000, offset: 0 })
	]);
	if (!call) error(404, 'Call not found');
	return { call, applicants: applicantsResult.applicants };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		try {
			await updateCall(params.uuid, {
				applicantId: Number(fd.get('applicant_id')),
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
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Call updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update call' });
		}
		redirect(302, `/calls/${params.uuid}`);
	}
};
