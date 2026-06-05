import type { Actions, PageServerLoad } from './$types';
import { error, fail, redirect } from '@sveltejs/kit';
import { getOffenseByUuid } from '$lib/server/queries/offenses';
import { listRanges } from '$lib/server/queries/common';
import { updateOffense } from '$lib/server/commands/offenses';

export const load: PageServerLoad = async ({ params }) => {
	const [offense, ranges] = await Promise.all([
		getOffenseByUuid(params.uuid),
		listRanges()
	]);
	if (!offense) error(404, 'Offense not found');
	return { offense, ranges };
};

export const actions: Actions = {
	default: async ({ request, params, cookies }) => {
		const fd = await request.formData();
		try {
		await updateOffense(params.uuid, {
			officerName: (fd.get('officer_name') as string) || undefined,
			rangeId: fd.get('range_id') ? Number(fd.get('range_id')) : undefined,
			offenseDate: (fd.get('offense_date') as string) || undefined,
			illegalWildlife: (fd.get('illegal_wildlife') as string) || undefined,
			cageSizeFeet: (fd.get('cage_size_feet') as string) || undefined,
			cageLocation: (fd.get('cage_location') as string) || undefined,
			reasonConfiscated: (fd.get('reason_confiscated') as string) || undefined,
			handTame: fd.get('hand_tame') === 'on',
			priorHistory: fd.get('prior_history') === 'on',
			cageConfiscated: fd.get('cage_confiscated') === 'on',
			signedOfficer: fd.get('signed_officer') === 'on',
			signedOffender: fd.get('signed_offender') === 'on',
			signedDate: (fd.get('signed_date') as string) || undefined,
			healthIssues: (fd.get('health_issues') as string) || undefined,
			dietNotes: (fd.get('diet_notes') as string) || undefined,
			offenseComments: (fd.get('offense_comments') as string) || undefined
		});
		cookies.set('flash', JSON.stringify({ type: 'success', message: 'Offense updated' }), { path: '/', maxAge: 30 });
		} catch (e) {
			if (e instanceof Response || (e as any)?.status) throw e;
			return fail(500, { error: 'Failed to update offense' });
		}
		redirect(302, `/offenses/${params.uuid}`);
	}
};
