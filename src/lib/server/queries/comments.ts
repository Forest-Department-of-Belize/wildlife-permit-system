import { db } from '../db';
import { comments, applicants } from '../db/schema';
import { eq, count, desc, sql } from 'drizzle-orm';

interface ListParams {
	limit?: number;
	offset?: number;
}

export async function listComments(params: ListParams) {
	const { limit = 50, offset = 0 } = params;

	const [countResult, rows] = await Promise.all([
		db.select({ total: count() }).from(comments),
		db
			.select({
				id: comments.id,
				uuid: comments.uuid,
				eriCommentId: comments.eriCommentId,
				commentDate: comments.commentDate,
				commentComments: comments.commentComments,
				applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
				applicantUuid: applicants.uuid,
				createdAt: comments.createdAt
			})
			.from(comments)
			.leftJoin(applicants, eq(comments.applicantId, applicants.id))
			.orderBy(desc(comments.commentDate))
			.limit(limit)
			.offset(offset)
	]);

	return { comments: rows, total: countResult[0]?.total ?? 0 };
}

export async function getCommentByUuid(uuid: string) {
	const rows = await db
		.select({
			id: comments.id,
			uuid: comments.uuid,
			eriCommentId: comments.eriCommentId,
			applicantId: comments.applicantId,
			commentDate: comments.commentDate,
			commentComments: comments.commentComments,
			createdAt: comments.createdAt,
			updatedAt: comments.updatedAt,
			applicantName: sql<string>`${applicants.firstName} || ' ' || ${applicants.lastName}`.as('applicant_name'),
			applicantUuid: applicants.uuid
		})
		.from(comments)
		.leftJoin(applicants, eq(comments.applicantId, applicants.id))
		.where(eq(comments.uuid, uuid))
		.limit(1);

	return rows[0] ?? null;
}

export async function getApplicantComments(applicantId: number) {
	return db
		.select({
			id: comments.id,
			uuid: comments.uuid,
			commentDate: comments.commentDate,
			commentComments: comments.commentComments,
			createdAt: comments.createdAt
		})
		.from(comments)
		.where(eq(comments.applicantId, applicantId))
		.orderBy(desc(comments.commentDate));
}
