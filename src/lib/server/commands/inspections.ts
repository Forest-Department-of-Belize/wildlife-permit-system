import { db } from '../db';
import { inspections } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface InspectionData {
	applicantId: number;
	officerId?: number | null;
	rangeId?: number | null;
	inspectorName?: string;
	inspectionDate?: string | null;
	approxReportDate?: string | null;
	whenApproxReportDateProvided?: string | null;
	inspectionStatus?: string;
	notes?: string;
	followupDate?: string | null;
	followupNotes?: string;
	birdsDescribed?: string;
	handTame?: boolean;
	dateAcquired?: string | null;
	approxDateAcquired?: string;
	lessTwelveMonthsAcquired?: boolean;
	instructionsForApplicant?: string;
	expectedRecheck?: string | null;
	preconditionsComments?: string;
}

export async function createInspection(data: InspectionData) {
	const result = await db
		.insert(inspections)
		.values({
			applicantId: data.applicantId,
			officerId: data.officerId || null,
			rangeId: data.rangeId || null,
			inspectorName: data.inspectorName || null,
			inspectionDate: data.inspectionDate || null,
			approxReportDate: data.approxReportDate || null,
			whenApproxReportDateProvided: data.whenApproxReportDateProvided || null,
			inspectionStatus: data.inspectionStatus || 'scheduled',
			notes: data.notes || null,
			followupDate: data.followupDate || null,
			followupNotes: data.followupNotes || null,
			birdsDescribed: data.birdsDescribed || null,
			handTame: data.handTame ?? false,
			dateAcquired: data.dateAcquired || null,
			approxDateAcquired: data.approxDateAcquired || null,
			lessTwelveMonthsAcquired: data.lessTwelveMonthsAcquired ?? false,
			instructionsForApplicant: data.instructionsForApplicant || null,
			expectedRecheck: data.expectedRecheck || null,
			preconditionsComments: data.preconditionsComments || null
		})
		.returning();

	return result[0];
}

export async function updateInspection(uuid: string, data: Partial<InspectionData>) {
	const result = await db
		.update(inspections)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(inspections.uuid, uuid))
		.returning();

	return result[0];
}
