const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin, isUser, restrictToAdmin } = require('../middleware/middleware');
const User = require('../models/userModel');
const Product = require('../models/productModel');

// User view
router.get('/user', isAuthenticated, isUser, (req, res) => {
    Product.getAllProducts((products) => {
        res.render('user', { user: req.session.user, products });
    });
});

// Admin view
router.get('/admin', isAuthenticated, restrictToAdmin, (req, res) => {
    User.getAllUsers((users) => {
        res.render('admin', { user: req.session.user, users });
    }, true); // Exclude admin users
});

module.exports = router;
