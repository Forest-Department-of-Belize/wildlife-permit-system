import { db } from '../db';
import { calls, applicants, users } from '../db/schema';
import { eq, count, desc, sql } from 'drizzle-orm';

interface ListParams {
	limit?: number;
	offset?: number;
}

export async function listCalls(params: ListParams) {
	const { limit = 50, offset = 0 } = params;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(calls),
		db
			.select({
				id: calls.id,
				uuid: calls.uuid,
				callDate: calls.callDate,
				numberCalled: calls.numberCalled,
				language: calls.language,
				isAnswered: calls.isAnswered,
				isFullyCompleted: calls.isFullyCompleted,
				callComments: calls.callComments,
				officerName: sql<string>`COALESCE(${calls.officerName}, ${users.firstName} || ' ' || ${users.lastName})`.as('officer_display'),
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				createdAt: calls.createdAt
			})
			.from(calls)
			.leftJoin(applicants, eq(calls.applicantId, applicants.id))
			.leftJoin(users, eq(calls.officerId, users.id))
			.orderBy(desc(calls.callDate))
			.limit(limit)
			.offset(offset)
	]);

	return { calls: rows, total: countResult[0]?.total ?? 0 };
}

export async function getCallByUuid(uuid: string) {
	const rows = await db
		.select({
			id: calls.id,
			uuid: calls.uuid,
			applicantId: calls.applicantId,
			officerId: calls.officerId,
			eriCallId: calls.eriCallId,
			officerName: calls.officerName,
			numberCalled: calls.numberCalled,
			callDate: calls.callDate,
			language: calls.language,
			isFunctional: calls.isFunctional,
			isAnswered: calls.isAnswered,
			isApplicant: calls.isApplicant,
			knowApplicant: calls.knowApplicant,
			relationApplicant: calls.relationApplicant,
			newApplicantContact: calls.newApplicantContact,
			isFullyCompleted: calls.isFullyCompleted,
			scheduledFollowup: calls.scheduledFollowup,
			followupDate: calls.followupDate,
			callNowConsent: calls.callNowConsent,
			callLaterConsent: calls.callLaterConsent,
			callLaterDate: calls.callLaterDate,
			consentsDigitalResources: calls.consentsDigitalResources,
			numNeighborsParrots: calls.numNeighborsParrots,
			neighborhoodDescription: calls.neighborhoodDescription,
			callComments: calls.callComments,
			createdAt: calls.createdAt,
			updatedAt: calls.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid
		})
		.from(calls)
		.leftJoin(applicants, eq(calls.applicantId, applicants.id))
		.where(eq(calls.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
