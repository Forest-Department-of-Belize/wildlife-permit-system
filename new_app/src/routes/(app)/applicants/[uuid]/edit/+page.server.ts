import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getApplicantByUuid } from '$lib/server/queries/applicants';
import { listDistricts } from '$lib/server/queries/common';
import { updateApplicant } from '$lib/server/commands/applicants';

export const load: PageServerLoad = async ({ params }) => {
	const [applicant, districts] = await Promise.all([
		getApplicantByUuid(params.uuid),
		listDistricts()
	]);
	if (!applicant) error(404, 'Applicant not found');
	return { applicant, districts };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		try {
		await updateApplicant(params.uuid, {
			firstName: (fd.get('first_name') as string).trim(),
			middleName: (fd.get('middle_name') as string) || undefined,
			lastName: (fd.get('last_name') as string).trim(),
			dateOfBirth: (fd.get('date_of_birth') as string) || undefined,
			address1: (fd.get('address1') as string) || undefined,
			address2: (fd.get('address2') as string) || undefined,
			districtId: fd.get('district_id') ? Number(fd.get('district_id')) : undefined,
			contactNumber: (fd.get('contact_number') as string) || undefined,
			contactNumberWhatsapp: fd.get('contact_number_whatsapp') === 'on',
			contactNumberSecondary: (fd.get('contact_number_secondary') as string) || undefined,
			contactNumberSecondaryWhatsapp: fd.get('contact_number_secondary_whatsapp') === 'on',
			email: (fd.get('email') as string) || undefined,
			occupation: (fd.get('occupation') as string) || undefined,
			company: (fd.get('company') as string) || undefined,
			governmentIdType: (fd.get('government_id_type') as string) || undefined,
			governmentIdNumber: (fd.get('government_id_number') as string) || undefined,
			parrotDiet: (fd.get('parrot_diet') as string) || undefined,
			enclosureType: (fd.get('enclosure_type') as string) || undefined,
			cageLocation: (fd.get('cage_location') as string) || undefined,
			cageSizeFeet: (fd.get('cage_size_feet') as string) || undefined,
			sharedSeparate: (fd.get('shared_separate') as string) || undefined,
			doesFlyFree: fd.get('does_fly_free') === 'on',
			flyFreeWhen: (fd.get('fly_free_when') as string) || undefined,
			areWingsCut: fd.get('are_wings_cut') === 'on',
			applicantComments: (fd.get('applicant_comments') as string) || undefined,
			ownershipComments: (fd.get('ownership_comments') as string) || undefined,
			processStatus: (fd.get('process_status') as string) || 'Pending Call'
		});
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Applicant updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update applicant' });
		}
		redirect(302, `/applicants/${params.uuid}`);
	}
};
