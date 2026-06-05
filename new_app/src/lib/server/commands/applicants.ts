import { db } from '../db';
import { applicants } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface CreateApplicantData {
	firstName: string;
	middleName?: string;
	lastName: string;
	dateOfBirth?: string | null;
	address1?: string;
	address2?: string;
	districtId?: number | null;
	rangeId?: number | null;
	contactNumber?: string;
	contactNumberWhatsapp?: boolean;
	contactNumberSecondary?: string;
	contactNumberSecondaryWhatsapp?: boolean;
	email?: string;
	occupation?: string;
	company?: string;
	governmentIdType?: string;
	governmentIdNumber?: string;
	applicantStatus?: string;
	infoSource?: string;
	parrotDiet?: string;
	enclosureType?: string;
	cageLocation?: string;
	cageSizeFeet?: string;
	sharedSeparate?: string;
	doesFlyFree?: boolean;
	flyFreeWhen?: string;
	areWingsCut?: boolean;
	applicantComments?: string;
	ownershipComments?: string;
	processStatus?: string;
	applicantNotes?: string;
}

export async function createApplicant(data: CreateApplicantData) {
	const result = await db
		.insert(applicants)
		.values({
			firstName: data.firstName,
			middleName: data.middleName || null,
			lastName: data.lastName,
			dateOfBirth: data.dateOfBirth || null,
			address1: data.address1 || null,
			address2: data.address2 || null,
			districtId: data.districtId || null,
			rangeId: data.rangeId || null,
			contactNumber: data.contactNumber || null,
			contactNumberWhatsapp: data.contactNumberWhatsapp ?? false,
			contactNumberSecondary: data.contactNumberSecondary || null,
			contactNumberSecondaryWhatsapp: data.contactNumberSecondaryWhatsapp ?? false,
			email: data.email || null,
			occupation: data.occupation || null,
			company: data.company || null,
			governmentIdType: data.governmentIdType || null,
			governmentIdNumber: data.governmentIdNumber || null,
			applicantStatus: data.applicantStatus || null,
			infoSource: data.infoSource || null,
			parrotDiet: data.parrotDiet || null,
			enclosureType: data.enclosureType || null,
			cageLocation: data.cageLocation || null,
			cageSizeFeet: data.cageSizeFeet || null,
			sharedSeparate: data.sharedSeparate || null,
			doesFlyFree: data.doesFlyFree ?? false,
			flyFreeWhen: data.flyFreeWhen || null,
			areWingsCut: data.areWingsCut ?? false,
			applicantComments: data.applicantComments || null,
			ownershipComments: data.ownershipComments || null,
			processStatus: data.processStatus || 'Pending Call',
			applicantNotes: data.applicantNotes || null
		})
		.returning();

	return result[0];
}

export async function updateApplicant(uuid: string, data: Partial<CreateApplicantData>) {
	const result = await db
		.update(applicants)
		.set({
			...data,
			districtId: data.districtId || null,
			rangeId: data.rangeId || null,
			dateOfBirth: data.dateOfBirth || null,
			updatedAt: sql`NOW()`
		})
		.where(eq(applicants.uuid, uuid))
		.returning();

	return result[0];
}

export async function updateApplicantNotes(uuid: string, notes: string) {
	await db.update(applicants).set({ applicantNotes: notes, updatedAt: sql`NOW()` }).where(eq(applicants.uuid, uuid));
}

export async function updateApplicantStatus(uuid: string, status: string) {
	await db.update(applicants).set({ processStatus: status, updatedAt: sql`NOW()` }).where(eq(applicants.uuid, uuid));
}

export async function deleteApplicant(uuid: string) {
	await db.delete(applicants).where(eq(applicants.uuid, uuid));
}
