const express = require('express');
const helmet = require('helmet');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();

// Security
app.use(helmet());

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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Test route
app.get('/', (req, res) => {
    res.send('Wildlife Permit System is running!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});