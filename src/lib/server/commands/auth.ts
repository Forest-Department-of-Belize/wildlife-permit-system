import { db } from '../db';
import { users, roles, ranges } from '../db/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export async function authenticateUser(email: string, password: string) {
	const rows = await db
		.select({
			id: users.id,
			uuid: users.uuid,
			firstName: users.firstName,
			lastName: users.lastName,
			email: users.email,
			password: users.password,
			roleId: users.roleId,
			rangeId: users.rangeId,
			isActive: users.isActive,
			firstLogin: users.firstLogin,
			roleName: roles.name,
			permissions: roles.permissions,
			rangeName: ranges.name
		})
		.from(users)
		.leftJoin(roles, eq(users.roleId, roles.id))
		.leftJoin(ranges, eq(users.rangeId, ranges.id))
		.where(and(eq(users.email, email), eq(users.isActive, true)))
		.limit(1);

	const user = rows[0];
	if (!user || !user.password) return null;

	const valid = await bcrypt.compare(password, user.password);
	if (!valid) return null;

	return {
		id: user.id,
		uuid: user.uuid,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,
		role: user.roleName!,
		roleId: user.roleId!,
		rangeId: user.rangeId,
		rangeName: user.rangeName,
		permissions: (user.permissions as string[]) ?? [],
		firstLogin: user.firstLogin
	};
}

export async function createPasswordResetToken(email: string) {
	const token = crypto.randomUUID();
	const expires = new Date(Date.now() + 3600000);
	const result = await db
		.update(users)
		.set({ resetToken: token, resetTokenExpires: expires })
		.where(eq(users.email, email))
		.returning({ id: users.id });

	return result.length > 0 ? token : null;
}

export async function resetPassword(token: string, newPassword: string) {
	const hashed = await bcrypt.hash(newPassword, 10);
	const result = await db
		.update(users)
		.set({ password: hashed, resetToken: null, resetTokenExpires: null })
		.where(and(eq(users.resetToken, token), gt(users.resetTokenExpires, new Date())))
		.returning({ id: users.id });

	return result.length > 0;
}

export async function validateResetToken(token: string) {
	const rows = await db
		.select({ id: users.id })
		.from(users)
		.where(and(eq(users.resetToken, token), gt(users.resetTokenExpires, new Date())))
		.limit(1);

	return rows.length > 0;
}

export async function validateInviteToken(token: string) {
	const rows = await db
		.select({ id: users.id, firstName: users.firstName, lastName: users.lastName, email: users.email })
		.from(users)
		.where(and(eq(users.inviteToken, token), gt(users.inviteTokenExpires, new Date())))
		.limit(1);

	return rows[0] ?? null;
}

export async function setupAccount(token: string, password: string) {
	const hashed = await bcrypt.hash(password, 10);
	const result = await db
		.update(users)
		.set({ password: hashed, inviteToken: null, inviteTokenExpires: null, firstLogin: false })
		.where(and(eq(users.inviteToken, token), gt(users.inviteTokenExpires, new Date())))
		.returning({ id: users.id });

	return result.length > 0;
}
