import { db } from '../db';
import { applicants, permits, inspections, parrots } from '../db/schema';
import { eq, count, sql, desc } from 'drizzle-orm';

export async function getDashboardStats(rangeId: number | null) {
	const [applicantCount, activePermitCount, pendingInspectionCount, confiscatedCount, recentInspections] =
		await Promise.all([
			db.select({ total: count() }).from(applicants),
			rangeId
				? db.select({ total: count() }).from(permits)
						.where(sql`${permits.rangeId} = ${rangeId} AND ${permits.status} = 'Active'`)
				: db.select({ total: count() }).from(permits).where(eq(permits.status, 'Active')),
			rangeId
				? db.select({ total: count() }).from(inspections)
						.where(sql`${inspections.rangeId} = ${rangeId} AND ${inspections.inspectionStatus} = 'scheduled'`)
				: db.select({ total: count() }).from(inspections).where(eq(inspections.inspectionStatus, 'scheduled')),
			db.select({ total: count() }).from(parrots).where(eq(parrots.confiscated, true)),
			db.execute(
				rangeId
					? sql`SELECT i.inspection_date, i.inspection_status, i.inspector_name,
							a.first_name || ' ' || a.last_name as applicant_name, a.uuid as applicant_uuid
						FROM inspections i LEFT JOIN applicants a ON a.id = i.applicant_id
						WHERE i.range_id = ${rangeId} ORDER BY i.inspection_date DESC LIMIT 5`
					: sql`SELECT i.inspection_date, i.inspection_status, i.inspector_name,
							a.first_name || ' ' || a.last_name as applicant_name, a.uuid as applicant_uuid
						FROM inspections i LEFT JOIN applicants a ON a.id = i.applicant_id
						ORDER BY i.inspection_date DESC LIMIT 5`
			)
		]);

	return {
		stats: {
			applicants: applicantCount[0]?.total ?? 0,
			activePermits: activePermitCount[0]?.total ?? 0,
			pendingInspections: pendingInspectionCount[0]?.total ?? 0,
			confiscatedParrots: confiscatedCount[0]?.total ?? 0
		},
		recentInspections: recentInspections.rows
	};
}

export async function getDashboardChartData(rangeId: number | null) {
	const [permitsByStatus, permitsByStation, applicantsByStation, inspectionsByStatus] =
		await Promise.all([
			rangeId
				? db.execute(sql`SELECT status, COUNT(*)::int as count FROM permits WHERE range_id = ${rangeId} GROUP BY status ORDER BY count DESC`)
				: db.execute(sql`SELECT status, COUNT(*)::int as count FROM permits GROUP BY status ORDER BY count DESC`),
			db.execute(
				sql`SELECT r.name as station, COUNT(p.id)::int as count
					FROM ranges r LEFT JOIN permits p ON p.range_id = r.id
					${rangeId ? sql`AND p.range_id = ${rangeId}` : sql``}
					GROUP BY r.name ORDER BY count DESC LIMIT 8`
			),
			db.execute(
				sql`SELECT r.name as station, COUNT(a.id)::int as count
					FROM ranges r LEFT JOIN applicants a ON a.range_id = r.id
					${rangeId ? sql`AND a.range_id = ${rangeId}` : sql``}
					GROUP BY r.name ORDER BY count DESC LIMIT 8`
			),
			rangeId
				? db.execute(sql`SELECT inspection_status, COUNT(*)::int as count FROM inspections WHERE range_id = ${rangeId} GROUP BY inspection_status`)
				: db.execute(sql`SELECT inspection_status, COUNT(*)::int as count FROM inspections GROUP BY inspection_status`)
		]);

	return {
		permitsByStatus: permitsByStatus.rows,
		permitsByStation: permitsByStation.rows,
		applicantsByStation: applicantsByStation.rows,
		inspectionsByStatus: inspectionsByStatus.rows
	};
}
