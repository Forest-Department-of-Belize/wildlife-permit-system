import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getApplicantByUuid, getApplicantParrots, getApplicantPermits, getApplicantApplications, getApplicantInspections, getApplicantCalls, getApplicantOffenses } from '$lib/server/queries/applicants';
import { getApplicantComments } from '$lib/server/queries/comments';
import { updateApplicantNotes, updateApplicantStatus, deleteApplicant } from '$lib/server/commands/applicants';

export const load: PageServerLoad = async ({ params }) => {
	const applicant = await getApplicantByUuid(params.uuid);
	if (!applicant) error(404, 'Applicant not found');

	const [parrots, permits, applications, inspections, calls, offenses, comments] = await Promise.all([
		getApplicantParrots(applicant.id),
		getApplicantPermits(applicant.id),
		getApplicantApplications(applicant.id),
		getApplicantInspections(applicant.id),
		getApplicantCalls(applicant.id),
		getApplicantOffenses(applicant.id),
		getApplicantComments(applicant.id)
	]);

	return { applicant, parrots, permits, applications, inspections, calls, offenses, comments };
};

export const actions: Actions = {
	updateNotes: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		await updateApplicantNotes(params.uuid, (fd.get('applicant_notes') as string) || '');
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Notes saved' }), { path: '/', maxAge: 30 });
		redirect(302, `/applicants/${params.uuid}`);
	},
	updateStatus: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		await updateApplicantStatus(params.uuid, fd.get('process_status') as string);
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Status updated' }), { path: '/', maxAge: 30 });
		redirect(302, `/applicants/${params.uuid}`);
	},
	delete: async ({ params, cookies }) => {
		try {
			await deleteApplicant(params.uuid);
			cookies.set('flash', JSON.stringify({ type: 'success', message: 'Applicant deleted' }), { path: '/', maxAge: 30 });
			redirect(302, '/applicants');
		} catch (e: any) {
			if (e.code === '23503') {
				cookies.set('flash', JSON.stringify({ type: 'error', message: 'Cannot delete: applicant has related records' }), { path: '/', maxAge: 30 });
				redirect(302, `/applicants/${params.uuid}`);
			}
			throw e;
		}
	}
};
