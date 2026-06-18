import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getParrotByUuid } from '$lib/server/queries/parrots';
import { listSpecies, listRanges } from '$lib/server/queries/common';
import { searchApplicants } from '$lib/server/queries/applicants';
import { updateParrot } from '$lib/server/commands/parrots';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ params, locals }) => {
	const rangeId = getRangeFilter(locals.user!);

	const [parrot, species, ranges, applicants] = await Promise.all([
		getParrotByUuid(params.uuid),
		listSpecies(),
		listRanges(),
		searchApplicants('', rangeId)
	]);

	if (!parrot) error(404, 'Parrot not found');
	return { parrot, species, ranges, applicants };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		try {
		await updateParrot(params.uuid, {
			applicantId: fd.get('applicant_id') ? Number(fd.get('applicant_id')) : undefined,
			speciesId: fd.get('species_id') ? Number(fd.get('species_id')) : undefined,
			permitId: fd.get('permit_id') ? Number(fd.get('permit_id')) : undefined,
			rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : undefined,
			bandNumber: (fd.get('band_number') as string) || undefined,
			petName: (fd.get('pet_name') as string) || undefined,
			sex: (fd.get('sex') as string) || undefined,
			parrotAgeMonths: fd.get('parrot_age_months') ? Number(fd.get('parrot_age_months')) : undefined,
			methodObtained: (fd.get('method_obtained') as string) || undefined,
			periodOfOwnershipMonths: fd.get('period_of_ownership_months') ? Number(fd.get('period_of_ownership_months')) : undefined,
			housingDetails: (fd.get('housing_details') as string) || undefined,
			hasParrot: fd.get('has_parrot') === 'on',
			whyNoParrot: (fd.get('why_no_parrot') as string) || undefined,
			isHealthy: fd.get('is_healthy') === 'on',
			healthComments: (fd.get('health_comments') as string) || undefined,
			stories: (fd.get('stories') as string) || undefined,
			birdComments: (fd.get('bird_comments') as string) || undefined,
			infoSource: (fd.get('info_source') as string) || undefined,
			confiscated: fd.get('confiscated') === 'on',
			inspectionId: fd.get('inspection_id') ? Number(fd.get('inspection_id')) : undefined,
			banded: fd.get('banded') === 'on',
			parrotStatus: (fd.get('parrot_status') as string) || undefined,
			endDate: (fd.get('end_date') as string) || null,
			justificationSexByApplicant: (fd.get('justification_sex_by_applicant') as string) || undefined,
			parrotAgeDescription: (fd.get('parrot_age_description') as string) || undefined,
			dateParrotAgeDescribed: (fd.get('date_parrot_age_described') as string) || null,
			townObtained: (fd.get('town_obtained') as string) || undefined,
			districtObtain: (fd.get('district_obtain') as string) || undefined,
			periodOfOwnership: (fd.get('period_of_ownership') as string) || undefined,
			datePeriodProvided: (fd.get('date_period_provided') as string) || null,
			speciesDescripByApplicant: (fd.get('species_descrip_by_applicant') as string) || undefined,
			parrotPicture: (fd.get('parrot_picture') as string) || undefined,
			whenNoParrot: (fd.get('when_no_parrot') as string) || undefined,
			whereNoParrot: (fd.get('where_no_parrot') as string) || undefined,
			dateParrotLossInfoProvided: (fd.get('date_parrot_loss_info_provided') as string) || null,
			newOwner: (fd.get('new_owner') as string) || undefined,
			newOwnerAddress: (fd.get('new_owner_address') as string) || undefined,
			newOwnerContact: (fd.get('new_owner_contact') as string) || undefined,
			healthCommsByProfessional: (fd.get('health_comms_by_professional') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Parrot updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update parrot' });
		}
		redirect(302, `/parrots/${params.uuid}`);
	}
};
