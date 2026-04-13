const hasPermission = (permission) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        const permissions = req.session.user.permissions || [];

        if (permissions.includes(permission)) {
            return next();
        }

        req.session.error = 'You do not have permission to perform this action';
        res.redirect('/dashboard');
    };
};

module.exports = { hasPermission };