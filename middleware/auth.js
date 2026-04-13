const isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    req.session.error = 'Please login to continue';
    res.redirect('/login');
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