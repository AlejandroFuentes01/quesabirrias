const db = require('../config/db');

const Product = {
    getAllProducts: (callback) => {
        db.query('SELECT * FROM products', (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },
    addProduct: (product, callback) => {
        db.query('INSERT INTO products SET ?', product, (err, result) => {
            if (err) throw err;
            callback(result.insertId);
        });
    }
};

module.exports = Product;
