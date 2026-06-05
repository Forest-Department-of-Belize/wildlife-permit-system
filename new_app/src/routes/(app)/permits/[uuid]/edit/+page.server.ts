import type { Actions, PageServerLoad } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { getPermitByUuid } from '$lib/server/queries/permits';
import { listRanges } from '$lib/server/queries/common';
import { updatePermit } from '$lib/server/commands/permits';

export const load: PageServerLoad = async ({ params }) => {
	const [permit, ranges] = await Promise.all([
		getPermitByUuid(params.uuid),
		listRanges()
	]);
	if (!permit) error(404, 'Permit not found');
	return { permit, ranges };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();

		await updatePermit(params.uuid, {
			applicantId: Number(fd.get('applicant_id')),
			rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : null,
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

		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Permit updated' }), { path: '/', maxAge: 30 });
		redirect(302, `/permits/${params.uuid}`);
	}
};
