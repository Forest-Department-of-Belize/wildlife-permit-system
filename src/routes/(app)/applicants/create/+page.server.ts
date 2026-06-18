import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listDistricts, listRanges } from '$lib/server/queries/common';
import { createApplicant } from '$lib/server/commands/applicants';

export const load: PageServerLoad = async () => {
	const [districts, ranges] = await Promise.all([listDistricts(), listRanges()]);
	return { districts, ranges };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const firstName = fd.get('first_name') as string;
		const lastName = fd.get('last_name') as string;

		if (!firstName?.trim()) return fail(400, { error: 'First name is required' });
		if (!lastName?.trim()) return fail(400, { error: 'Last name is required' });

		const rangeId = (fd.get('range_id') as string) || locals.user?.rangeId?.toString();

		const applicant = await createApplicant({
			firstName: firstName.trim(),
			middleName: (fd.get('middle_name') as string) || undefined,
			lastName: lastName.trim(),
			dateOfBirth: (fd.get('date_of_birth') as string) || undefined,
			address1: (fd.get('address1') as string) || undefined,
			address2: (fd.get('address2') as string) || undefined,
			districtId: fd.get('district_id') ? Number(fd.get('district_id')) : undefined,
			rangeId: rangeId ? Number(rangeId) : undefined,
			contactNumber: (fd.get('contact_number') as string) || undefined,
			contactNumberWhatsapp: fd.get('contact_number_whatsapp') === 'on',
			contactSecondary: (fd.get('contact_secondary') as string) || undefined,
			contactSecondaryWhatsapp: fd.get('contact_secondary_whatsapp') === 'on',
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

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Applicant added successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/applicants/${applicant.uuid}`);
	}
};
