const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const path = require('path');
const pool = require('./db/index');
require('dotenv').config();

const app = express();

// Security
app.use(helmet({
    contentSecurityPolicy: false
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 8
    }
}));

// Global variables for views
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.success = req.session.success || null;
    res.locals.error = req.session.error || null;
    delete req.session.success;
    delete req.session.error;
    next();
});

// Routes
app.use('/', require('./routes/auth'));
app.use('/dashboard', require('./routes/dashboard'));
app.use('/applicants', require('./routes/applicants'));
app.use('/parrots', require('./routes/parrots'));
app.use('/permits', require('./routes/permits'));
app.use('/applications', require('./routes/applications'));
app.use('/inspections', require('./routes/inspections'));
app.use('/calls', require('./routes/calls'));
app.use('/offenses', require('./routes/offenses'));
app.use('/species', require('./routes/species'));
app.use('/districts', require('./routes/districts'));
app.use('/ranges', require('./routes/ranges'));
app.use('/users', require('./routes/users'));

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', { title: 'Page Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('500', { title: 'Server Error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});