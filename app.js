const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const pool = require('./db/index');
require('dotenv').config();

const app = express();

// Trust proxy for Render
app.set('trust proxy', 1);

// Security
app.use(helmet({ contentSecurityPolicy: false }));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    store: new PgSession({
        pool: pool,
        tableName: 'session',
        ttl: 600
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 10
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
app.use('/import', require('./routes/import'));

// 404 handler
app.use((req, res) => {
    res.status(404).send(`
        <div style="font-family:sans-serif;text-align:center;margin-top:100px">
            <h1 style="color:#2E7D32">404</h1>
            <h2>Page Not Found</h2>
            <a href="/dashboard" style="color:#2E7D32">Back to Dashboard</a>
        </div>
    `);
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send(`
        <div style="font-family:sans-serif;text-align:center;margin-top:100px">
            <h1 style="color:#d32f2f">500</h1>
            <h2>Server Error</h2>
            <p>${err.message}</p>
            <a href="/dashboard" style="color:#2E7D32">Back to Dashboard</a>
        </div>
    `);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});