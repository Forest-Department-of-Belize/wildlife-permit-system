const getRangeFilter = (req) => {
    const user = req.session.user;
    if (!user) return null;

    if (user.role === 'Wildlife Program Manager') {
        return null;
    }

    return user.range_id;
};

const applyRangeFilter = (query, rangeId, paramIndex = 1) => {
    if (rangeId) {
        return {
            query: query + ` AND range_id = $${paramIndex}`,
            params: [rangeId]
        };
    }
    return { query, params: [] };
};

module.exports = { getRangeFilter, applyRangeFilter };