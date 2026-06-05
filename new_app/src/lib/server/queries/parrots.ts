import { db } from '../db';
import { parrots, applicants, parrotSpecies } from '../db/schema';
import { eq, and, count, desc, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	limit?: number;
	offset?: number;
}

export async function listParrots(params: ListParams) {
	const { rangeId, limit = 50, offset = 0 } = params;
	const conditions: SQL[] = [];
	if (rangeId) conditions.push(eq(parrots.rangeId, rangeId));
	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(parrots).where(where),
		db
			.select({
				id: parrots.id,
				uuid: parrots.uuid,
				petName: parrots.petName,
				bandNumber: parrots.bandNumber,
				sex: parrots.sex,
				parrotAgeMonths: parrots.parrotAgeMonths,
				isHealthy: parrots.isHealthy,
				confiscated: parrots.confiscated,
				speciesName: parrotSpecies.commonName,
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				createdAt: parrots.createdAt
			})
			.from(parrots)
			.leftJoin(applicants, eq(parrots.applicantId, applicants.id))
			.leftJoin(parrotSpecies, eq(parrots.speciesId, parrotSpecies.id))
			.where(where)
			.orderBy(desc(parrots.createdAt))
			.limit(limit)
			.offset(offset)
	]);

	return { parrots: rows, total: countResult[0]?.total ?? 0 };
}

export async function getParrotByUuid(uuid: string) {
	const rows = await db
		.select({
			id: parrots.id,
			uuid: parrots.uuid,
			applicantId: parrots.applicantId,
			speciesId: parrots.speciesId,
			permitId: parrots.permitId,
			rangeId: parrots.rangeId,
			bandNumber: parrots.bandNumber,
			petName: parrots.petName,
			sex: parrots.sex,
			parrotAgeMonths: parrots.parrotAgeMonths,
			methodObtained: parrots.methodObtained,
			periodOfOwnershipMonths: parrots.periodOfOwnershipMonths,
			housingDetails: parrots.housingDetails,
			hasParrot: parrots.hasParrot,
			whyNoParrot: parrots.whyNoParrot,
			isHealthy: parrots.isHealthy,
			healthComments: parrots.healthComments,
			stories: parrots.stories,
			birdComments: parrots.birdComments,
			infoSource: parrots.infoSource,
			eriBirdId: parrots.eriBirdId,
			confiscated: parrots.confiscated,
			inspectionId: parrots.inspectionId,
			createdAt: parrots.createdAt,
			updatedAt: parrots.updatedAt,
			speciesName: parrotSpecies.commonName,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid
		})
		.from(parrots)
		.leftJoin(applicants, eq(parrots.applicantId, applicants.id))
		.leftJoin(parrotSpecies, eq(parrots.speciesId, parrotSpecies.id))
		.where(eq(parrots.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}
