import { db } from '../db';
import { permits, applicants, ranges } from '../db/schema';
import { eq, ilike, and, or, desc, count, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	search?: string | null;
	status?: string | null;
	limit?: number;
	offset?: number;
}

export async function listPermits(params: ListParams) {
	const { rangeId, search, status, limit = 30, offset = 0 } = params;
	const conditions: SQL[] = [];

	if (rangeId) conditions.push(eq(permits.rangeId, rangeId));
	if (status) conditions.push(eq(permits.status, status));
	if (search) {
		const term = `%${search}%`;
		conditions.push(
			or(
				ilike(permits.permitNumber, term),
				ilike(permits.referenceNumber, term)
			)!
		);
	}

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(permits).where(where),
		db
			.select({
				id: permits.id,
				uuid: permits.uuid,
				permitNumber: permits.permitNumber,
				referenceNumber: permits.referenceNumber,
				applicationDate: permits.applicationDate,
				issueDate: permits.issueDate,
				numberOfPets: permits.numberOfPets,
				status: permits.status,
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				rangeName: ranges.name,
				createdAt: permits.createdAt
			})
			.from(permits)
			.leftJoin(applicants, eq(permits.applicantId, applicants.id))
			.leftJoin(ranges, eq(permits.rangeId, ranges.id))
			.where(where)
			.orderBy(desc(permits.createdAt))
			.limit(limit)
			.offset(offset)
	]);

	return { permits: rows, total: countResult[0]?.total ?? 0 };
}

export async function getPermitByUuid(uuid: string) {
	const rows = await db
		.select({
			id: permits.id,
			uuid: permits.uuid,
			applicantId: permits.applicantId,
			rangeId: permits.rangeId,
			applicationId: permits.applicationId,
			infoSource: permits.infoSource,
			permitNumber: permits.permitNumber,
			referenceNumber: permits.referenceNumber,
			applicationDate: permits.applicationDate,
			issueDate: permits.issueDate,
			numberOfPets: permits.numberOfPets,
			status: permits.status,
			housing: permits.housing,
			pictureUrl: permits.pictureUrl,
			permitComments: permits.permitComments,
			createdAt: permits.createdAt,
			updatedAt: permits.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid,
			rangeName: ranges.name
		})
		.from(permits)
		.leftJoin(applicants, eq(permits.applicantId, applicants.id))
		.leftJoin(ranges, eq(permits.rangeId, ranges.id))
		.where(eq(permits.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
