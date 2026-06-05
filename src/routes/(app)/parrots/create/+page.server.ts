import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listSpecies, listRanges } from '$lib/server/queries/common';
import { searchApplicants } from '$lib/server/queries/applicants';
import { createParrot } from '$lib/server/commands/parrots';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ locals, url }) => {
	const rangeId = getRangeFilter(locals.user!);
	const applicantId = url.searchParams.get('applicant') || undefined;

	const [species, ranges, applicants] = await Promise.all([
		listSpecies(),
		listRanges(),
		searchApplicants('', rangeId)
	]);

	return { species, ranges, applicants, preselectedApplicantId: applicantId };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id') as string;

		if (!applicantId?.trim()) return fail(400, { error: 'Applicant is required' });

		const rangeId = (fd.get('range_id') as string) || locals.user?.rangeId?.toString();

		const parrot = await createParrot({
			applicantId: Number(applicantId),
			speciesId: fd.get('species_id') ? Number(fd.get('species_id')) : undefined,
			permitId: fd.get('permit_id') ? Number(fd.get('permit_id')) : undefined,
			rangeId: rangeId ? Number(rangeId) : undefined,
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

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Parrot added successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/parrots/${parrot.uuid}`);
	}
};
