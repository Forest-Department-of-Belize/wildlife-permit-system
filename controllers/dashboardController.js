const pool = require('../db/index');
const { getRangeFilter } = require('../middleware/rangeFilter');

const index = async (req, res) => {
    try {
        const rangeId = getRangeFilter(req);
        const rangeFilter = rangeId ? 'WHERE range_id = $1' : '';
        const params = rangeId ? [rangeId] : [];

        const applicantsResult = await pool.query(
            `SELECT COUNT(*) FROM applicants`,
            []
        );

        const permitsResult = await pool.query(
            `SELECT COUNT(*) FROM permits 
             ${rangeId ? 'WHERE range_id = $1' : ''} 
             AND status = 'Active'`,
            params
        );

        const inspectionsResult = await pool.query(
            `SELECT COUNT(*) FROM inspections 
             ${rangeId ? 'WHERE range_id = $1 AND' : 'WHERE'} 
             inspection_status = 'scheduled'`,
            params
        );

        const parrrotsResult = await pool.query(
            `SELECT COUNT(*) FROM parrots WHERE confiscated = true`
        );

        res.render('dashboard/index', {
            title: 'Dashboard',
            stats: {
                applicants: applicantsResult.rows[0].count,
                active_permits: permitsResult.rows[0].count,
                pending_inspections: inspectionsResult.rows[0].count,
                confiscated_parrots: parrrotsResult.rows[0].count
            }
        });

    } catch (err) {
        console.error(err);
        res.render('dashboard/index', {
            title: 'Dashboard',
            stats: {
                applicants: 0,
                active_permits: 0,
                pending_inspections: 0,
                confiscated_parrots: 0
            }
        });
    }
};

module.exports = { index };