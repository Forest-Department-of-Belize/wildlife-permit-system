import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { listRanges } from '$lib/server/queries/common';
import { listApplicants } from '$lib/server/queries/applicants';
import { createPermit } from '$lib/server/commands/permits';
import { getRangeFilter } from '$lib/utils/range-filter';

export const load: PageServerLoad = async ({ url, locals }) => {
	const rangeId = getRangeFilter(locals.user!);
	const [ranges, applicantsResult] = await Promise.all([
		listRanges(),
		listApplicants({ rangeId, limit: 1000, offset: 0 })
	]);
	const preselectedApplicantId = url.searchParams.get('applicant') ? Number(url.searchParams.get('applicant')) : undefined;
	return { ranges, applicants: applicantsResult.applicants, preselectedApplicantId };
};

export const actions: Actions = {
	default: async ({ request, locals, cookies }) => {
		const fd = await request.formData();
		const applicantId = fd.get('applicant_id') as string;

		if (!applicantId?.trim()) return fail(400, { error: 'Applicant is required' });

		const rangeId = (fd.get('range_id') as string) || locals.user?.rangeId?.toString();

		const permit = await createPermit({
			applicantId: Number(applicantId),
			rangeId: rangeId ? Number(rangeId) : null,
			infoSource: (fd.get('info_source') as string) || undefined,
			permitNumber: (fd.get('permit_number') as string) || undefined,
			referenceNumber: (fd.get('reference_number') as string) || undefined,
			applicationDate: (fd.get('application_date') as string) || null,
			issueDate: (fd.get('issue_date') as string) || null,
			numberOfPets: fd.get('number_of_pets') ? Number(fd.get('number_of_pets')) : 0,
			status: (fd.get('status') as string) || 'Processing',
			housing: (fd.get('housing') as string) || undefined,
			pictureUrl: (fd.get('picture_url') as string) || undefined,
			permitComments: (fd.get('permit_comments') as string) || undefined
		});

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Permit created successfully' }), { path: '/', maxAge: 30 });
		redirect(302, `/permits/${permit.uuid}`);
	}
};
