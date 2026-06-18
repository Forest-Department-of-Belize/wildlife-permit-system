import { db } from '../db';
import { comments } from '../db/schema';
import { eq, sql } from 'drizzle-orm';

interface CommentData {
	applicantId: number;
	commentDate?: string | null;
	commentComments?: string;
}

export async function createComment(data: CommentData) {
	const result = await db
		.insert(comments)
		.values({
			applicantId: data.applicantId,
			commentDate: data.commentDate || null,
			commentComments: data.commentComments || null
		})
		.returning();

	return result[0];
}

export async function updateComment(uuid: string, data: Partial<CommentData>) {
	const result = await db
		.update(comments)
		.set({ ...data, updatedAt: sql`NOW()` })
		.where(eq(comments.uuid, uuid))
		.returning();

	return result[0];
}

export async function deleteComment(uuid: string) {
	await db.delete(comments).where(eq(comments.uuid, uuid));
}
