import { db } from '../db';
import { users, districts, ranges, parrotSpecies } from '../db/schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface CreateUserData {
	firstName: string;
	lastName: string;
	email: string;
	roleId: number;
	rangeId?: number | null;
}

export async function createUser(data: CreateUserData) {
	const inviteToken = crypto.randomUUID();
	const inviteExpires = new Date(Date.now() + 48 * 3600000);

	const result = await db
		.insert(users)
		.values({
			firstName: data.firstName,
			lastName: data.lastName,
			email: data.email,
			roleId: data.roleId,
			rangeId: data.rangeId || null,
			inviteToken,
			inviteTokenExpires: inviteExpires,
			isActive: true,
			firstLogin: true
		})
		.returning();

	return { user: result[0], inviteToken };
}

export async function updateUser(uuid: string, data: Partial<CreateUserData>) {
	const result = await db
		.update(users)
		.set({ ...data, rangeId: data.rangeId || null, updatedAt: sql`NOW()` })
		.where(eq(users.uuid, uuid))
		.returning();

	return result[0];
}

export async function updateProfile(uuid: string, firstName: string, lastName: string, email: string, newPassword?: string) {
	const updates: Record<string, unknown> = { firstName, lastName, email, updatedAt: sql`NOW()` };
	if (newPassword) {
		updates.password = await bcrypt.hash(newPassword, 10);
		updates.firstLogin = false;
	}
	const result = await db.update(users).set(updates).where(eq(users.uuid, uuid)).returning();
	return result[0];
}

export async function deactivateUser(uuid: string) {
	await db.update(users).set({ isActive: false, updatedAt: sql`NOW()` }).where(eq(users.uuid, uuid));
}

export async function reactivateUser(uuid: string) {
	await db.update(users).set({ isActive: true, updatedAt: sql`NOW()` }).where(eq(users.uuid, uuid));
}

export async function resendInvite(uuid: string) {
	const inviteToken = crypto.randomUUID();
	const inviteExpires = new Date(Date.now() + 48 * 3600000);
	const result = await db
		.update(users)
		.set({ inviteToken, inviteTokenExpires: inviteExpires })
		.where(eq(users.uuid, uuid))
		.returning();

	return { user: result[0], inviteToken };
}

export async function createDistrict(name: string) {
	const result = await db.insert(districts).values({ name }).returning();
	return result[0];
}

export async function updateDistrict(uuid: string, name: string) {
	const result = await db.update(districts).set({ name, updatedAt: sql`NOW()` }).where(eq(districts.uuid, uuid)).returning();
	return result[0];
}

export async function deleteDistrict(uuid: string) {
	await db.delete(districts).where(eq(districts.uuid, uuid));
}

export async function createRange(name: string, districtId: number) {
	const result = await db.insert(ranges).values({ name, districtId }).returning();
	return result[0];
}

export async function updateRange(uuid: string, name: string, districtId: number) {
	const result = await db.update(ranges).set({ name, districtId, updatedAt: sql`NOW()` }).where(eq(ranges.uuid, uuid)).returning();
	return result[0];
}

export async function deleteRange(uuid: string) {
	await db.delete(ranges).where(eq(ranges.uuid, uuid));
}

export async function createSpecies(commonName: string, scientificName?: string, imageUrl?: string) {
	const result = await db.insert(parrotSpecies).values({ commonName, scientificName: scientificName || null, imageUrl: imageUrl || null }).returning();
	return result[0];
}

export async function updateSpecies(uuid: string, commonName: string, scientificName?: string, imageUrl?: string) {
	const updates: Record<string, unknown> = { commonName, scientificName: scientificName || null, updatedAt: sql`NOW()` };
	if (imageUrl !== undefined) updates.imageUrl = imageUrl || null;
	const result = await db.update(parrotSpecies).set(updates).where(eq(parrotSpecies.uuid, uuid)).returning();
	return result[0];
}
