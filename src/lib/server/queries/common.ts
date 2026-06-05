import { db } from '../db';
import { districts, ranges, parrotSpecies, roles, users } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

export async function listDistricts() {
	return db.select().from(districts).orderBy(asc(districts.name));
}

export async function getDistrictByUuid(uuid: string) {
	const rows = await db.select().from(districts).where(eq(districts.uuid, uuid)).limit(1);
	return rows[0] ?? null;
}

export async function listRanges(districtId?: number) {
	const query = db
		.select({
			id: ranges.id,
			uuid: ranges.uuid,
			name: ranges.name,
			districtId: ranges.districtId,
			districtName: districts.name,
			createdAt: ranges.createdAt,
			updatedAt: ranges.updatedAt
		})
		.from(ranges)
		.leftJoin(districts, eq(ranges.districtId, districts.id))
		.orderBy(asc(ranges.name));

	if (districtId) {
		return query.where(eq(ranges.districtId, districtId));
	}
	return query;
}

export async function getRangeByUuid(uuid: string) {
	const rows = await db
		.select({
			id: ranges.id,
			uuid: ranges.uuid,
			name: ranges.name,
			districtId: ranges.districtId,
			districtName: districts.name,
			createdAt: ranges.createdAt,
			updatedAt: ranges.updatedAt
		})
		.from(ranges)
		.leftJoin(districts, eq(ranges.districtId, districts.id))
		.where(eq(ranges.uuid, uuid))
		.limit(1);
	return rows[0] ?? null;
}

export async function listSpecies() {
	return db.select().from(parrotSpecies).orderBy(asc(parrotSpecies.commonName));
}

export async function getSpeciesByUuid(uuid: string) {
	const rows = await db.select().from(parrotSpecies).where(eq(parrotSpecies.uuid, uuid)).limit(1);
	return rows[0] ?? null;
}

export async function listRoles() {
	return db.select().from(roles).orderBy(asc(roles.name));
}

export async function listUsers() {
	return db
		.select({
			id: users.id,
			uuid: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			isActive: users.isActive,
			roleName: roles.name,
			rangeName: ranges.name,
			createdAt: users.createdAt
		})
		.from(users)
		.leftJoin(roles, eq(users.roleId, roles.id))
		.leftJoin(ranges, eq(users.rangeId, ranges.id))
		.orderBy(asc(users.lastName));
}

export async function getUserByUuid(uuid: string) {
	const rows = await db
		.select({
			id: users.id,
			uuid: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			roleId: users.roleId,
			rangeId: users.rangeId,
			isActive: users.isActive,
			firstLogin: users.firstLogin,
			roleName: roles.name,
			rangeName: ranges.name,
			createdAt: users.createdAt
		})
		.from(users)
		.leftJoin(roles, eq(users.roleId, roles.id))
		.leftJoin(ranges, eq(users.rangeId, ranges.id))
		.where(eq(users.uuid, uuid))
		.limit(1);
	return rows[0] ?? null;
}
