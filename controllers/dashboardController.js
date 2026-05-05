const pool = require('../db/index');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const rangeParam = rangeId ? [rangeId] : [];
        const rangeWhere = rangeId ? 'WHERE range_id = $1' : '';
        const rangeWhereA = rangeId ? 'WHERE a.range_id = $1' : '';

        const [
            applicantsResult,
            permitsResult,
            inspectionsResult,
            parrrotsResult,
            permitsByStatusResult,
            permitsByStationResult,
            applicantsByStationResult,
            inspectionsByStatusResult,
            recentInspectionsResult
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) FROM applicants'),
            pool.query(
                rangeId
                    ? "SELECT COUNT(*) FROM permits WHERE range_id = $1 AND status = 'Active'"
                    : "SELECT COUNT(*) FROM permits WHERE status = 'Active'",
                rangeParam
            ),
            pool.query(
                rangeId
                    ? "SELECT COUNT(*) FROM inspections WHERE range_id = $1 AND inspection_status = 'scheduled'"
                    : "SELECT COUNT(*) FROM inspections WHERE inspection_status = 'scheduled'",
                rangeParam
            ),
            pool.query('SELECT COUNT(*) FROM parrots WHERE confiscated = true'),
            pool.query(
                rangeId
                    ? "SELECT status, COUNT(*) as count FROM permits WHERE range_id = $1 GROUP BY status ORDER BY count DESC"
                    : "SELECT status, COUNT(*) as count FROM permits GROUP BY status ORDER BY count DESC",
                rangeParam
            ),
            pool.query(
                `SELECT r.name as station, COUNT(p.id) as count
                 FROM ranges r
                 LEFT JOIN permits p ON p.range_id = r.id ${rangeId ? 'AND p.range_id = $1' : ''}
                 GROUP BY r.name ORDER BY count DESC LIMIT 8`,
                rangeParam
            ),
            pool.query(
                `SELECT r.name as station, COUNT(a.id) as count
                 FROM ranges r
                 LEFT JOIN applicants a ON a.range_id = r.id ${rangeId ? 'AND a.range_id = $1' : ''}
                 GROUP BY r.name ORDER BY count DESC LIMIT 8`,
                rangeParam
            ),
            pool.query(
                rangeId
                    ? "SELECT inspection_status, COUNT(*) as count FROM inspections WHERE range_id = $1 GROUP BY inspection_status"
                    : "SELECT inspection_status, COUNT(*) as count FROM inspections GROUP BY inspection_status",
                rangeParam
            ),
            pool.query(
                `SELECT i.inspection_date, i.inspection_status, i.inspector_name,
                 a.first_name || ' ' || a.last_name as applicant_name, a.uuid as applicant_uuid
                 FROM inspections i
                 LEFT JOIN applicants a ON i.applicant_id = a.id
                 ${rangeId ? 'WHERE i.range_id = $1' : ''}
                 ORDER BY i.inspection_date DESC LIMIT 5`,
                rangeParam
            )
        ]);

        res.render('dashboard/index', {
            title: 'Dashboard',
            stats: {
                applicants: applicantsResult.rows[0].count,
                active_permits: permitsResult.rows[0].count,
                pending_inspections: inspectionsResult.rows[0].count,
                confiscated_parrots: parrrotsResult.rows[0].count
            },
            charts: {
                permitsByStatus: permitsByStatusResult.rows,
                permitsByStation: permitsByStationResult.rows,
                applicantsByStation: applicantsByStationResult.rows,
                inspectionsByStatus: inspectionsByStatusResult.rows
            },
            recentInspections: recentInspectionsResult.rows
        });

    } catch (err) {
        console.error(err);
        res.render('dashboard/index', {
            title: 'Dashboard',
            stats: { applicants: 0, active_permits: 0, pending_inspections: 0, confiscated_parrots: 0 },
            charts: { permitsByStatus: [], permitsByStation: [], applicantsByStation: [], inspectionsByStatus: [] },
            recentInspections: []
        });
    }
};

module.exports = { index };
