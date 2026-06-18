import { db } from '../db';
import { applications, applicants, ranges } from '../db/schema';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	status?: string | null;
	limit?: number;
	offset?: number;
}

export async function listApplications(params: ListParams) {
	const { rangeId, status, limit = 50, offset = 0 } = params;
	const conditions: SQL[] = [];
	if (rangeId) conditions.push(eq(applications.rangeId, rangeId));
	if (status) conditions.push(eq(applications.status, status));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(applications).where(where),
		db
			.select({
				id: applications.id,
				uuid: applications.uuid,
				eriApplicationId: applications.eriApplicationId,
				status: applications.status,
				applicationDate: applications.applicationDate,
				infoSource: applications.infoSource,
				applicationSigned: applications.applicationSigned,
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				rangeName: ranges.name,
				createdAt: applications.createdAt
			})
			.from(applications)
			.leftJoin(applicants, eq(applications.applicantId, applicants.id))
			.leftJoin(ranges, eq(applications.rangeId, ranges.id))
			.where(where)
			.orderBy(desc(applications.createdAt))
			.limit(limit)
			.offset(offset)
	]);

	return { applications: rows, total: countResult[0]?.total ?? 0 };
}

export async function getApplicationByUuid(uuid: string) {
	const rows = await db
		.select({
			id: applications.id,
			uuid: applications.uuid,
			eriApplicationId: applications.eriApplicationId,
			applicantId: applications.applicantId,
			rangeId: applications.rangeId,
			infoSource: applications.infoSource,
			status: applications.status,
			applicationDate: applications.applicationDate,
			applicationSigned: applications.applicationSigned,
			followupDone: applications.followupDone,
			followupDetails: applications.followupDetails,
			appliedPreviously: applications.appliedPreviously,
			appliedPreviouslyDate: applications.appliedPreviouslyDate,
			previouslyApproved: applications.previouslyApproved,
			applicationExperience: applications.applicationExperience,
			applicationComments: applications.applicationComments,
			notes: applications.notes,
			createdAt: applications.createdAt,
			updatedAt: applications.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid,
			rangeName: ranges.name
		})
		.from(applications)
		.leftJoin(applicants, eq(applications.applicantId, applicants.id))
		.leftJoin(ranges, eq(applications.rangeId, ranges.id))
		.where(eq(applications.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
