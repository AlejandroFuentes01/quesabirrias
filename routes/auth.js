const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const { validatePassword } = require('../middleware/validator');
const { isAuthenticated, isUser, isAdmin, restrictToAdmin } = require('../middleware/middleware');

// Render login page
router.get('/login', (req, res) => {
    res.render('login');
});

// Handle login
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    User.findByUsername(username, (user) => {
        if (!user) {
            return res.render('login', { error: 'Usuario o contraseña incorrecta.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
                req.session.user = user;
                if (user.role === 'admin') {
                    res.redirect('/admin');
                } else {
                    res.redirect('/products');
                }
            } else {
                return res.render('login', { error: 'Usuario o contraseña incorrecta.' });
            }
        });
    });
});

// Render register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle registration
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!validatePassword(password)) {
        return res.render('register', { error: 'La contraseña debe tener al menos 8 caracteres, incluyendo una mayúscula, un número y un carácter especial.' });
    }

    User.findByUsername(username, (existingUserByUsername) => {
        if (existingUserByUsername) {
            return res.render('register', { error: 'El nombre de usuario ya está en uso.' });
        }

        User.findByEmail(email, (existingUserByEmail) => {
            if (existingUserByEmail) {
                return res.render('register', { error: 'El correo electrónico ya está en uso.' });
            }

            bcrypt.hash(password, 10, (err, hash) => {
                if (err) throw err;

                const newUser = {
                    username,
                    email,
                    password: hash,
                    role: 'user' // Set the role to 'user' by default
                };

                User.createUser(newUser, (insertId) => {
                    res.render('register', { success: 'Registro exitoso. ¡Bienvenido!' });
                });
            });
        });
    });
});

// Handle logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Get all users (for admin)
router.get('/users', isAuthenticated, isAdmin, restrictToAdmin, (req, res) => {
    User.getAllUsers((users) => {
        res.render('admin', { user: req.session.user, users });
    }, true); // Exclude admin users
});

// Delete a user (for admin)
router.post('/delete-user', isAuthenticated, isAdmin, restrictToAdmin, (req, res) => {
    const { userId } = req.body;
    User.deleteUser(userId, () => {
        res.redirect('/users');
    });
});

// Get all products (for users)
router.get('/products', isAuthenticated, isUser, (req, res) => {
    Product.getAllProducts((products) => {
        res.render('user', { user: req.session.user, products });
    });
});

// Add a product (for users)
router.post('/add-product', isAuthenticated, isUser, (req, res) => {
    const { name, quantity, price } = req.body;
    const added_by = req.session.user.username;

    const newProduct = {
        name,
        quantity,
        price,
        added_by
    };

    Product.addProduct(newProduct, () => {
        res.redirect('/products');
    });
});

module.exports = router;
