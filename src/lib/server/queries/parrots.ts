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
			eriBirdId: parrots.eriBirdId,
			eriApplicationId: parrots.eriApplicationId,
			infoSource: parrots.infoSource,
			banded: parrots.banded,
			bandNumber: parrots.bandNumber,
			parrotStatus: parrots.parrotStatus,
			endDate: parrots.endDate,
			petName: parrots.petName,
			sex: parrots.sex,
			justificationSexByApplicant: parrots.justificationSexByApplicant,
			parrotAgeDescription: parrots.parrotAgeDescription,
			parrotAgeMonths: parrots.parrotAgeMonths,
			dateParrotAgeDescribed: parrots.dateParrotAgeDescribed,
			methodObtained: parrots.methodObtained,
			townObtained: parrots.townObtained,
			districtObtain: parrots.districtObtain,
			periodOfOwnership: parrots.periodOfOwnership,
			periodOfOwnershipMonths: parrots.periodOfOwnershipMonths,
			datePeriodProvided: parrots.datePeriodProvided,
			speciesDescripByApplicant: parrots.speciesDescripByApplicant,
			parrotPicture: parrots.parrotPicture,
			housingDetails: parrots.housingDetails,
			hasParrot: parrots.hasParrot,
			whyNoParrot: parrots.whyNoParrot,
			whenNoParrot: parrots.whenNoParrot,
			whereNoParrot: parrots.whereNoParrot,
			dateParrotLossInfoProvided: parrots.dateParrotLossInfoProvided,
			newOwner: parrots.newOwner,
			newOwnerAddress: parrots.newOwnerAddress,
			newOwnerContact: parrots.newOwnerContact,
			isHealthy: parrots.isHealthy,
			healthComments: parrots.healthComments,
			healthCommsByProfessional: parrots.healthCommsByProfessional,
			stories: parrots.stories,
			birdComments: parrots.birdComments,
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
