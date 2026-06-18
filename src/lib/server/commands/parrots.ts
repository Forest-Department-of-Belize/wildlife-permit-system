import { db } from '../db';
import { parrots } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface ParrotData {
	applicantId: number;
	speciesId?: number | null;
	permitId?: number | null;
	rangeId?: number | null;
	infoSource?: string;
	banded?: boolean;
	bandNumber?: string;
	parrotStatus?: string;
	endDate?: string | null;
	petName?: string;
	sex?: string;
	justificationSexByApplicant?: string;
	parrotAgeDescription?: string;
	parrotAgeMonths?: number | null;
	dateParrotAgeDescribed?: string | null;
	methodObtained?: string;
	townObtained?: string;
	districtObtain?: string;
	periodOfOwnership?: string;
	periodOfOwnershipMonths?: number | null;
	datePeriodProvided?: string | null;
	speciesDescripByApplicant?: string;
	parrotPicture?: string;
	housingDetails?: string;
	hasParrot?: boolean;
	whyNoParrot?: string;
	whenNoParrot?: string;
	whereNoParrot?: string;
	dateParrotLossInfoProvided?: string | null;
	newOwner?: string;
	newOwnerAddress?: string;
	newOwnerContact?: string;
	isHealthy?: boolean;
	healthComments?: string;
	healthCommsByProfessional?: string;
	stories?: string;
	birdComments?: string;
	confiscated?: boolean;
	inspectionId?: number | null;
}

export async function createParrot(data: ParrotData) {
	const result = await db
		.insert(parrots)
		.values({
			applicantId: data.applicantId,
			speciesId: data.speciesId || null,
			permitId: data.permitId || null,
			rangeId: data.rangeId || null,
			infoSource: data.infoSource || null,
			banded: data.banded ?? false,
			bandNumber: data.bandNumber || null,
			parrotStatus: data.parrotStatus || null,
			endDate: data.endDate || null,
			petName: data.petName || null,
			sex: data.sex || null,
			justificationSexByApplicant: data.justificationSexByApplicant || null,
			parrotAgeDescription: data.parrotAgeDescription || null,
			parrotAgeMonths: data.parrotAgeMonths || null,
			dateParrotAgeDescribed: data.dateParrotAgeDescribed || null,
			methodObtained: data.methodObtained || null,
			townObtained: data.townObtained || null,
			districtObtain: data.districtObtain || null,
			periodOfOwnership: data.periodOfOwnership || null,
			periodOfOwnershipMonths: data.periodOfOwnershipMonths || null,
			datePeriodProvided: data.datePeriodProvided || null,
			speciesDescripByApplicant: data.speciesDescripByApplicant || null,
			parrotPicture: data.parrotPicture || null,
			housingDetails: data.housingDetails || null,
			hasParrot: data.hasParrot ?? false,
			whyNoParrot: data.whyNoParrot || null,
			whenNoParrot: data.whenNoParrot || null,
			whereNoParrot: data.whereNoParrot || null,
			dateParrotLossInfoProvided: data.dateParrotLossInfoProvided || null,
			newOwner: data.newOwner || null,
			newOwnerAddress: data.newOwnerAddress || null,
			newOwnerContact: data.newOwnerContact || null,
			isHealthy: data.isHealthy ?? true,
			healthComments: data.healthComments || null,
			healthCommsByProfessional: data.healthCommsByProfessional || null,
			stories: data.stories || null,
			birdComments: data.birdComments || null,
			confiscated: data.confiscated ?? false,
			inspectionId: data.inspectionId || null
		})
		.returning();

	return result[0];
}

export async function updateParrot(uuid: string, data: Partial<ParrotData>) {
	const result = await db
		.update(parrots)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(parrots.uuid, uuid))
		.returning();

	return result[0];
}

export async function deleteParrot(uuid: string) {
	await db.delete(parrots).where(eq(parrots.uuid, uuid));
}
