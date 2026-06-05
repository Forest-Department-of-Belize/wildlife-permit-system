import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
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
			inspectionId: fd.get('inspection_id') ? Number(fd.get('inspection_id')) : undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Parrot updated' }), { path: '/', maxAge: 30 });
		redirect(302, `/parrots/${params.uuid}`);
	}
};
