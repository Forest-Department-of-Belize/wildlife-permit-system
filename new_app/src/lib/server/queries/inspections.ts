import { db } from '../db';
import { inspections, applicants } from '../db/schema';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	status?: string | null;
	limit?: number;
	offset?: number;
}

export async function listInspections(params: ListParams) {
	const { rangeId, status, limit = 50, offset = 0 } = params;
	const conditions: SQL[] = [];
	if (rangeId) conditions.push(eq(inspections.rangeId, rangeId));
	if (status) conditions.push(eq(inspections.inspectionStatus, status));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(inspections).where(where),
		db
			.select({
				id: inspections.id,
				uuid: inspections.uuid,
				inspectionDate: inspections.inspectionDate,
				inspectionStatus: inspections.inspectionStatus,
				inspectorName: inspections.inspectorName,
				notes: inspections.notes,
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				createdAt: inspections.createdAt
			})
			.from(inspections)
			.leftJoin(applicants, eq(inspections.applicantId, applicants.id))
			.where(where)
			.orderBy(desc(inspections.inspectionDate))
			.limit(limit)
			.offset(offset)
	]);

	return { inspections: rows, total: countResult[0]?.total ?? 0 };
}

export async function getInspectionByUuid(uuid: string) {
	const rows = await db
		.select({
			id: inspections.id,
			uuid: inspections.uuid,
			applicantId: inspections.applicantId,
			rangeId: inspections.rangeId,
			inspectorName: inspections.inspectorName,
			inspectionDate: inspections.inspectionDate,
			inspectionStatus: inspections.inspectionStatus,
			notes: inspections.notes,
			followupDate: inspections.followupDate,
			followupNotes: inspections.followupNotes,
			birdsDescribed: inspections.birdsDescribed,
			handTame: inspections.handTame,
			instructionsForApplicant: inspections.instructionsForApplicant,
			expectedRecheck: inspections.expectedRecheck,
			preconditionsComments: inspections.preconditionsComments,
			createdAt: inspections.createdAt,
			updatedAt: inspections.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid
		})
		.from(inspections)
		.leftJoin(applicants, eq(inspections.applicantId, applicants.id))
		.where(eq(inspections.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
