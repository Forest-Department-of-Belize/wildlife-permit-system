import { db } from '../db';
import { parrots } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface ParrotData {
	applicantId: number;
	speciesId?: number | null;
	permitId?: number | null;
	rangeId?: number | null;
	bandNumber?: string;
	petName?: string;
	sex?: string;
	parrotAgeMonths?: number | null;
	methodObtained?: string;
	periodOfOwnershipMonths?: number | null;
	housingDetails?: string;
	hasParrot?: boolean;
	whyNoParrot?: string;
	isHealthy?: boolean;
	healthComments?: string;
	stories?: string;
	birdComments?: string;
	infoSource?: string;
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
			bandNumber: data.bandNumber || null,
			petName: data.petName || null,
			sex: data.sex || null,
			parrotAgeMonths: data.parrotAgeMonths || null,
			methodObtained: data.methodObtained || null,
			periodOfOwnershipMonths: data.periodOfOwnershipMonths || null,
			housingDetails: data.housingDetails || null,
			hasParrot: data.hasParrot ?? false,
			whyNoParrot: data.whyNoParrot || null,
			isHealthy: data.isHealthy ?? true,
			healthComments: data.healthComments || null,
			stories: data.stories || null,
			birdComments: data.birdComments || null,
			infoSource: data.infoSource || null,
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
