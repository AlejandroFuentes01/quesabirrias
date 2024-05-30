const db = require('../config/db');

const User = {
    findByUsername: (username, callback) => {
        db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
            if (err) throw err;
            callback(result[0]);
        });
    },
    findByEmail: (email, callback) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
            if (err) throw err;
            callback(result[0]);
        });
    },
    createUser: (user, callback) => {
        db.query('INSERT INTO users SET ?', user, (err, result) => {
            if (err) throw err;
            callback(result.insertId);
        });
    },
    getAllUsers: (callback, excludeAdmin = false) => {
        let query = 'SELECT * FROM users';
        if (excludeAdmin) {
            query += ' WHERE role != "admin"';
        }
        db.query(query, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    deleteUser: (userId, callback) => {
        db.query('DELETE FROM users WHERE id = ?', [userId], (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }
};

module.exports = User;
