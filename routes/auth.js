const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Render halaman register
router.get('/register', (req, res) => {
    res.render('register');
});

// Proses register user
router.post('/register', (req, res) => {
    const { email, password } = req.body;

    const checkQuery = "SELECT * FROM pengguna WHERE email = ?";
    db.query(checkQuery, [email], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (results.length > 0) {
            return res.status(400).send('Email sudah terdaftar');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const query = "INSERT INTO pengguna (email, password) VALUES (?, ?)";

        db.query(query, [email, hashedPassword], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            res.redirect('/auth/login'); // Arahkan ke login setelah register
        });
    });
});


// Render halaman login
router.get('/login', (req, res) => {
    res.render('login');
});

// Proses login user 
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = "SELECT * FROM pengguna WHERE email = ?";
    db.query(query, [email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
        }
        if (result.length > 0) {
            const user = result[0];

            if (bcrypt.compareSync(password, user.password)) {
                req.session.user = user;
                // Redirect ke halaman profil setelah login
                res.redirect('/auth/profile');
            } else {
                res.send('Incorrect password');
            }
        } else {
            res.send('User Not Found');
        }
    });
});

// Render halaman profil user
router.get('/profile', (req, res) => {
    if (req.session.user) {
        const userId = req.session.user.id; // Ambil ID pengguna dari session

        // Ambil data kapal yang berkaitan dengan pengguna
        const query = "SELECT * FROM kapal"; // Sesuaikan dengan logika yang diinginkan
        db.query(query, (err, kapal) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Terjadi kesalahan saat mengambil data kapal.');
            }
            res.render('profile', { user: req.session.user, kapal });
        });
    } else {
        res.redirect('/auth/login'); // Redirect ke login jika pengguna belum login
    }
});

// Proses Logout 
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect('/auth/profile'); // Atau sesuaikan dengan alur yang diinginkan
        }
        res.redirect('/auth/login'); // Redirect ke login setelah logout
    });
});

module.exports = router;
