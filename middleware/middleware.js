// middleware.js
module.exports = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            next();
        } else {
            res.redirect('/login');
        }
    },
    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            next();
        } else if (req.session.user && req.session.user.role === 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/login');
        }
    },
    isUser: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'user') {
            next();
        } else if (req.session.user && req.session.user.role === 'admin') {
            res.redirect('/admin');
        } else {
            res.redirect('/login');
        }
    },
    restrictToAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            next();
        } else if (req.session.user && req.session.user.role === 'user') {
            res.redirect('/user');
        } else {
            res.redirect('/login');
        }
    },
    restrictToUser: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'user') {
            res.redirect('/user');
        } else {
            next();
        }
    }
};
