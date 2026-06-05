import { db } from '../db';
import { compoundOffenses, applicants, users, ranges } from '../db/schema';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	limit?: number;
	offset?: number;
}

export async function listOffenses(params: ListParams) {
	const { rangeId, limit = 50, offset = 0 } = params;
	const conditions: SQL[] = [];
	if (rangeId) conditions.push(eq(compoundOffenses.rangeId, rangeId));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(compoundOffenses).where(where),
		db
			.select({
				id: compoundOffenses.id,
				uuid: compoundOffenses.uuid,
				offenseDate: compoundOffenses.offenseDate,
				illegalWildlife: compoundOffenses.illegalWildlife,
				handTame: compoundOffenses.handTame,
				cageConfiscated: compoundOffenses.cageConfiscated,
				offenseComments: compoundOffenses.offenseComments,
				officerName: sql<string>`COALESCE(${compoundOffenses.officerName}, ${users.firstName} || ' ' || ${users.lastName})`.as('officer_display'),
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				rangeName: ranges.name,
				createdAt: compoundOffenses.createdAt
			})
			.from(compoundOffenses)
			.leftJoin(applicants, eq(compoundOffenses.applicantId, applicants.id))
			.leftJoin(users, eq(compoundOffenses.officerId, users.id))
			.leftJoin(ranges, eq(compoundOffenses.rangeId, ranges.id))
			.where(where)
			.orderBy(desc(compoundOffenses.offenseDate))
			.limit(limit)
			.offset(offset)
	]);

	return { offenses: rows, total: countResult[0]?.total ?? 0 };
}

export async function getOffenseByUuid(uuid: string) {
	const rows = await db
		.select({
			id: compoundOffenses.id,
			uuid: compoundOffenses.uuid,
			applicantId: compoundOffenses.applicantId,
			officerId: compoundOffenses.officerId,
			officerName: compoundOffenses.officerName,
			rangeId: compoundOffenses.rangeId,
			offenseDate: compoundOffenses.offenseDate,
			illegalWildlife: compoundOffenses.illegalWildlife,
			cageSizeFeet: compoundOffenses.cageSizeFeet,
			cageLocation: compoundOffenses.cageLocation,
			reasonConfiscated: compoundOffenses.reasonConfiscated,
			handTame: compoundOffenses.handTame,
			priorHistory: compoundOffenses.priorHistory,
			cageConfiscated: compoundOffenses.cageConfiscated,
			signedOfficer: compoundOffenses.signedOfficer,
			signedOffender: compoundOffenses.signedOffender,
			signedDate: compoundOffenses.signedDate,
			healthIssues: compoundOffenses.healthIssues,
			dietNotes: compoundOffenses.dietNotes,
			offenseComments: compoundOffenses.offenseComments,
			createdAt: compoundOffenses.createdAt,
			updatedAt: compoundOffenses.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid,
			rangeName: ranges.name
		})
		.from(compoundOffenses)
		.leftJoin(applicants, eq(compoundOffenses.applicantId, applicants.id))
		.leftJoin(users, eq(compoundOffenses.officerId, users.id))
		.leftJoin(ranges, eq(compoundOffenses.rangeId, ranges.id))
		.where(eq(compoundOffenses.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
