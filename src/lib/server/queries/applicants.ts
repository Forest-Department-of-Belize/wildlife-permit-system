import { db } from '../db';
import { applicants, districts, permits, parrots, inspections, calls, compoundOffenses, users, ranges, applications } from '../db/schema';
import { eq, ilike, sql, and, or, count, desc, asc } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';

interface ListParams {
	rangeId?: number | null;
	search?: string | null;
	limit?: number;
	offset?: number;
	letter?: string | null;
	district?: string | null;
	status?: string | null;
}

export async function listApplicants(params: ListParams) {
	const { rangeId, search, limit = 30, offset = 0, letter, district, status } = params;
	const conditions: SQL[] = [];

	if (rangeId) conditions.push(eq(applicants.rangeId, rangeId));
	if (search) {
		const term = `%${search}%`;
		conditions.push(
			or(
				ilike(applicants.firstName, term),
				ilike(applicants.lastName, term),
				ilike(applicants.contactNumber, term),
				ilike(applicants.email, term),
				ilike(applicants.governmentIdNumber, term),
				ilike(applicants.address1, term)
			)!
		);
	}
	if (letter) conditions.push(ilike(applicants.lastName, `${letter}%`));
	if (district) conditions.push(eq(applicants.districtId, Number(district)));
	if (status) conditions.push(eq(applicants.processStatus, status));

	const where = conditions.length > 0 ? and(...conditions) : undefined;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(applicants).where(where),
		db
			.select({
				id: applicants.id,
				uuid: applicants.uuid,
				firstName: applicants.firstName,
				middleName: applicants.middleName,
				lastName: applicants.lastName,
				contactNumber: applicants.contactNumber,
				email: applicants.email,
				processStatus: applicants.processStatus,
				districtName: districts.name,
				createdAt: applicants.createdAt,
				permitCount: sql<number>`(SELECT COUNT(*) FROM permits p WHERE p.applicant_id = ${applicants.id})`.as('permit_count'),
				parrotCount: sql<number>`(SELECT COUNT(*) FROM parrots pr WHERE pr.applicant_id = ${applicants.id})`.as('parrot_count'),
				pendingInspectionCount: sql<number>`(SELECT COUNT(*) FROM inspections i WHERE i.applicant_id = ${applicants.id} AND i.inspection_status = 'scheduled')`.as('pending_inspection_count')
			})
			.from(applicants)
			.leftJoin(districts, eq(applicants.districtId, districts.id))
			.where(where)
			.orderBy(asc(applicants.lastName), asc(applicants.firstName))
			.limit(limit)
			.offset(offset)
	]);

	return { applicants: rows, total: countResult[0]?.total ?? 0 };
}

export async function getApplicantByUuid(uuid: string) {
	const rows = await db
		.select({
			id: applicants.id,
			uuid: applicants.uuid,
			eriApplicantId: applicants.eriApplicantId,
			firstName: applicants.firstName,
			middleName: applicants.middleName,
			lastName: applicants.lastName,
			dateOfBirth: applicants.dateOfBirth,
			address1: applicants.address1,
			address2: applicants.address2,
			districtId: applicants.districtId,
			rangeId: applicants.rangeId,
			contactNumber: applicants.contactNumber,
			contactNumberWhatsapp: applicants.contactNumberWhatsapp,
			contactSecondary: applicants.contactSecondary,
			contactSecondaryWhatsapp: applicants.contactSecondaryWhatsapp,
			email: applicants.email,
			occupation: applicants.occupation,
			company: applicants.company,
			governmentIdType: applicants.governmentIdType,
			governmentIdNumber: applicants.governmentIdNumber,
			applicantStatus: applicants.applicantStatus,
			infoSource: applicants.infoSource,
			parrotDiet: applicants.parrotDiet,
			enclosureType: applicants.enclosureType,
			cageLocation: applicants.cageLocation,
			cageSizeFeet: applicants.cageSizeFeet,
			sharedSeparate: applicants.sharedSeparate,
			doesFlyFree: applicants.doesFlyFree,
			flyFreeWhen: applicants.flyFreeWhen,
			areWingsCut: applicants.areWingsCut,
			applicantComments: applicants.applicantComments,
			ownershipComments: applicants.ownershipComments,
			processStatus: applicants.processStatus,
			applicantNotes: applicants.applicantNotes,
			createdAt: applicants.createdAt,
			updatedAt: applicants.updatedAt,
			districtName: districts.name
		})
		.from(applicants)
		.leftJoin(districts, eq(applicants.districtId, districts.id))
		.where(eq(applicants.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}

export async function getApplicantParrots(applicantId: number) {
	return db
		.select({
			id: parrots.id,
			uuid: parrots.uuid,
			petName: parrots.petName,
			bandNumber: parrots.bandNumber,
			sex: parrots.sex,
			parrotAgeMonths: parrots.parrotAgeMonths,
			isHealthy: parrots.isHealthy,
			confiscated: parrots.confiscated,
			speciesName: sql<string>`(SELECT common_name FROM parrot_species WHERE id = ${parrots.speciesId})`.as('species_name'),
			createdAt: parrots.createdAt
		})
		.from(parrots)
		.where(eq(parrots.applicantId, applicantId))
		.orderBy(desc(parrots.createdAt));
}

export async function getApplicantPermits(applicantId: number) {
	return db
		.select({
			id: permits.id,
			uuid: permits.uuid,
			permitNumber: permits.permitNumber,
			referenceNumber: permits.referenceNumber,
			applicationDate: permits.applicationDate,
			issueDate: permits.issueDate,
			numberOfPets: permits.numberOfPets,
			status: permits.status,
			rangeName: ranges.name,
			createdAt: permits.createdAt
		})
		.from(permits)
		.leftJoin(ranges, eq(permits.rangeId, ranges.id))
		.where(eq(permits.applicantId, applicantId))
		.orderBy(desc(permits.createdAt));
}

export async function getApplicantApplications(applicantId: number) {
	return db
		.select({
			id: applications.id,
			uuid: applications.uuid,
			status: applications.status,
			applicationDate: applications.applicationDate,
			notes: applications.notes,
			rangeName: ranges.name,
			createdAt: applications.createdAt
		})
		.from(applications)
		.leftJoin(ranges, eq(applications.rangeId, ranges.id))
		.where(eq(applications.applicantId, applicantId))
		.orderBy(desc(applications.createdAt));
}

export async function getApplicantInspections(applicantId: number) {
	return db
		.select()
		.from(inspections)
		.where(eq(inspections.applicantId, applicantId))
		.orderBy(desc(inspections.inspectionDate));
}

export async function getApplicantCalls(applicantId: number) {
	return db
		.select({
			id: calls.id,
			uuid: calls.uuid,
			numberCalled: calls.numberCalled,
			callDate: calls.callDate,
			language: calls.language,
			isFunctional: calls.isFunctional,
			isAnswered: calls.isAnswered,
			isApplicant: calls.isApplicant,
			isFullyCompleted: calls.isFullyCompleted,
			callComments: calls.callComments,
			officerName: sql<string>`COALESCE(${calls.officerName}, ${users.firstName} || ' ' || ${users.lastName})`.as('officer_display'),
			createdAt: calls.createdAt
		})
		.from(calls)
		.leftJoin(users, eq(calls.officerId, users.id))
		.where(eq(calls.applicantId, applicantId))
		.orderBy(desc(calls.callDate));
}

export async function getApplicantOffenses(applicantId: number) {
	return db
		.select({
			id: compoundOffenses.id,
			uuid: compoundOffenses.uuid,
			offenseDate: compoundOffenses.offenseDate,
			illegalWildlife: compoundOffenses.illegalWildlife,
			handTame: compoundOffenses.handTame,
			cageConfiscated: compoundOffenses.cageConfiscated,
			officerName: sql<string>`COALESCE(${compoundOffenses.officerName}, ${users.firstName} || ' ' || ${users.lastName})`.as('officer_display'),
			rangeName: ranges.name,
			createdAt: compoundOffenses.createdAt
		})
		.from(compoundOffenses)
		.leftJoin(users, eq(compoundOffenses.officerId, users.id))
		.leftJoin(ranges, eq(compoundOffenses.rangeId, ranges.id))
		.where(eq(compoundOffenses.applicantId, applicantId))
		.orderBy(desc(compoundOffenses.offenseDate));
}

export async function searchApplicants(query: string, rangeId?: number | null) {
	const term = `%${query}%`;
	const conditions: SQL[] = [
		or(
			ilike(applicants.firstName, term),
			ilike(applicants.lastName, term),
			ilike(applicants.email, term),
			ilike(applicants.contactNumber, term),
			ilike(applicants.governmentIdNumber, term)
		)!
	];
	if (rangeId) conditions.push(eq(applicants.rangeId, rangeId));

	return db
		.select({
			id: applicants.id,
			uuid: applicants.uuid,
			firstName: applicants.firstName,
			lastName: applicants.lastName,
			contactNumber: applicants.contactNumber,
			email: applicants.email,
			districtName: districts.name
		})
		.from(applicants)
		.leftJoin(districts, eq(applicants.districtId, districts.id))
		.where(and(...conditions))
		.orderBy(asc(applicants.lastName), asc(applicants.firstName))
		.limit(50);
}
