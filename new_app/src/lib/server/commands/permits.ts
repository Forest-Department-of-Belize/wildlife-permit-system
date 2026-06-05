import { db } from '../db';
import { permits } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface PermitData {
	applicantId: number;
	rangeId?: number | null;
	infoSource?: string;
	permitNumber?: string;
	referenceNumber?: string;
	applicationDate?: string | null;
	issueDate?: string | null;
	numberOfPets?: number;
	status?: string;
	housing?: string;
	pictureUrl?: string;
	permitComments?: string;
}

export async function createPermit(data: PermitData) {
	const result = await db
		.insert(permits)
		.values({
			applicantId: data.applicantId,
			rangeId: data.rangeId || null,
			infoSource: data.infoSource || null,
			permitNumber: data.permitNumber || null,
			referenceNumber: data.referenceNumber || null,
			applicationDate: data.applicationDate || null,
			issueDate: data.issueDate || null,
			numberOfPets: data.numberOfPets ?? 0,
			status: data.status || 'Processing',
			housing: data.housing || null,
			pictureUrl: data.pictureUrl || null,
			permitComments: data.permitComments || null
		})
		.returning();

	return result[0];
}

export async function updatePermit(uuid: string, data: Partial<PermitData>) {
	const result = await db
		.update(permits)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(permits.uuid, uuid))
		.returning();

	return result[0];
}
