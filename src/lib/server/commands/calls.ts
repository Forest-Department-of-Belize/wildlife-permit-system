import { db } from '../db';
import { calls } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface CallData {
	applicantId: number;
	officerId?: number | null;
	officerName?: string;
	numberCalled?: string;
	callDate?: string | null;
	language?: string;
	isFunctional?: boolean;
	isAnswered?: boolean;
	isApplicant?: boolean;
	knowApplicant?: boolean;
	relationApplicant?: string;
	newApplicantContact?: string;
	isFullyCompleted?: boolean;
	scheduledFollowup?: boolean;
	followupDate?: string | null;
	callNowConsent?: boolean;
	callLaterConsent?: boolean;
	callLaterDate?: string | null;
	consentsDigitalResources?: boolean;
	numNeighborsParrots?: number;
	neighborhoodDescription?: string;
	callComments?: string;
}

export async function createCall(data: CallData) {
	const result = await db
		.insert(calls)
		.values({
			applicantId: data.applicantId,
			officerId: data.officerId || null,
			officerName: data.officerName || null,
			numberCalled: data.numberCalled || null,
			callDate: data.callDate || null,
			language: data.language || null,
			isFunctional: data.isFunctional ?? false,
			isAnswered: data.isAnswered ?? false,
			isApplicant: data.isApplicant ?? false,
			knowApplicant: data.knowApplicant ?? false,
			relationApplicant: data.relationApplicant || null,
			newApplicantContact: data.newApplicantContact || null,
			isFullyCompleted: data.isFullyCompleted ?? false,
			scheduledFollowup: data.scheduledFollowup ?? false,
			followupDate: data.followupDate || null,
			callNowConsent: data.callNowConsent ?? false,
			callLaterConsent: data.callLaterConsent ?? false,
			callLaterDate: data.callLaterDate || null,
			consentsDigitalResources: data.consentsDigitalResources ?? false,
			numNeighborsParrots: data.numNeighborsParrots ?? 0,
			neighborhoodDescription: data.neighborhoodDescription || null,
			callComments: data.callComments || null
		})
		.returning();

	return result[0];
}

export async function updateCall(uuid: string, data: Partial<CallData>) {
	const result = await db
		.update(calls)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(calls.uuid, uuid))
		.returning();

	return result[0];
}
