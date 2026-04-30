const isLoggedIn = (req, res, next) => {
    if (req.session && req.session.user) {
        // Refresh session on every request
        req.session.touch();
        return next();
    }
    // Destroy session completely
    req.session.destroy(() => {
        res.redirect('/login');
    });
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'Wildlife Program Manager') {
        return next();
    }
    req.session.error = 'You do not have permission to access this page';
    res.redirect('/dashboard');
};

const isAdminOrOIC = (req, res, next) => {
    if (req.session.user && 
        (req.session.user.role === 'Wildlife Program Manager' || 
         req.session.user.role === 'Range OIC')) {
        return next();
    }
    req.session.error = 'You do not have permission to access this page';
    res.redirect('/dashboard');
};

module.exports = { isLoggedIn, isAdmin, isAdminOrOIC };