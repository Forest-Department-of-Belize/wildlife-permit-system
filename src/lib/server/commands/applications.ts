import { db } from '../db';
import { applications } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface ApplicationData {
	applicantId: number;
	rangeId?: number | null;
	infoSource?: string;
	status?: string;
	applicationDate?: string | null;
	applicationSigned?: boolean;
	followupDone?: boolean;
	followupDetails?: string;
	appliedPreviously?: boolean;
	appliedPreviouslyDate?: string | null;
	previouslyApproved?: boolean;
	applicationExperience?: string;
	applicationComments?: string;
	notes?: string;
}

export async function createApplication(data: ApplicationData) {
	const result = await db
		.insert(applications)
		.values({
			applicantId: data.applicantId,
			rangeId: data.rangeId || null,
			infoSource: data.infoSource || null,
			status: data.status || 'Pending',
			applicationDate: data.applicationDate || null,
			applicationSigned: data.applicationSigned ?? false,
			followupDone: data.followupDone ?? false,
			followupDetails: data.followupDetails || null,
			appliedPreviously: data.appliedPreviously ?? false,
			appliedPreviouslyDate: data.appliedPreviouslyDate || null,
			previouslyApproved: data.previouslyApproved ?? false,
			applicationExperience: data.applicationExperience || null,
			applicationComments: data.applicationComments || null,
			notes: data.notes || null
		})
		.returning();

	return result[0];
}

export async function updateApplication(uuid: string, data: Partial<ApplicationData>) {
	const result = await db
		.update(applications)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(applications.uuid, uuid))
		.returning();

	return result[0];
}

export async function deleteApplication(uuid: string) {
	await db.delete(applications).where(eq(applications.uuid, uuid));
}
