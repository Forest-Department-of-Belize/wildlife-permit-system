import { db } from '../db';
import { compoundOffenses } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface OffenseData {
	applicantId: number;
	officerId?: number | null;
	officerName?: string;
	rangeId?: number | null;
	offenseDate?: string | null;
	illegalWildlife?: string;
	cageSizeFeet?: string;
	cageLocation?: string;
	reasonConfiscated?: string;
	handTame?: boolean;
	priorHistory?: boolean;
	cageConfiscated?: boolean;
	signedOfficer?: boolean;
	signedOffender?: boolean;
	signedDate?: string | null;
	healthIssues?: string;
	dietNotes?: string;
	offenseComments?: string;
}

export async function createOffense(data: OffenseData) {
	const result = await db
		.insert(compoundOffenses)
		.values({
			applicantId: data.applicantId,
			officerId: data.officerId || null,
			officerName: data.officerName || null,
			rangeId: data.rangeId || null,
			offenseDate: data.offenseDate || null,
			illegalWildlife: data.illegalWildlife || null,
			cageSizeFeet: data.cageSizeFeet || null,
			cageLocation: data.cageLocation || null,
			reasonConfiscated: data.reasonConfiscated || null,
			handTame: data.handTame ?? false,
			priorHistory: data.priorHistory ?? false,
			cageConfiscated: data.cageConfiscated ?? false,
			signedOfficer: data.signedOfficer ?? false,
			signedOffender: data.signedOffender ?? false,
			signedDate: data.signedDate || null,
			healthIssues: data.healthIssues || null,
			dietNotes: data.dietNotes || null,
			offenseComments: data.offenseComments || null
		})
		.returning();

	return result[0];
}

export async function updateOffense(uuid: string, data: Partial<OffenseData>) {
	const result = await db
		.update(compoundOffenses)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(compoundOffenses.uuid, uuid))
		.returning();

	return result[0];
}
