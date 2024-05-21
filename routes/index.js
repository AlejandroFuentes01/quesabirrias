const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/middleware');
const User = require('../models/userModel');

// User view
router.get('/user', isAuthenticated, (req, res) => {
    res.render('user', { user: req.session.user });
});

// Admin view
router.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    User.getAllUsers((users) => {
        res.render('admin', { user: req.session.user, users });
    });
});

module.exports = router;
