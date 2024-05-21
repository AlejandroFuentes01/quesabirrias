const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Database connection
require('./config/db');

// Set view engine to EJS
app.set('view engine', 'ejs');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Global middleware to check session for all routes except login and register
app.use((req, res, next) => {
    if (req.session.user || req.path === '/login' || req.path === '/register') {
        next();
    } else {
        res.redirect('/login');
    }
});

// Routes
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');

app.use('/', authRoutes);
app.use('/', indexRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
