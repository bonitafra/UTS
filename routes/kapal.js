const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Rute untuk menampilkan daftar kapal
router.get('/', (req, res) => {
    const query = "SELECT * FROM kapal";
    db.query(query, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat mengambil data kapal.');
        }
        res.render('kapal', { kapal: result });
    });
});

// Rute untuk menampilkan halaman tambah kapal
router.get('/tambah', (req, res) => {
    res.render('addkapal');
});

// Proses untuk menambah kapal baru
router.post('/tambah', (req, res) => {
    const { nama, jenis, jadwal, status } = req.body;
    const query = "INSERT INTO kapal (nama, jenis, jadwal, status) VALUES (?, ?, ?, ?)";
    
    db.query(query, [nama, jenis, jadwal, status], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menambahkan kapal.');
        }
        res.redirect('/kapal');
    });
});

// Rute untuk menampilkan halaman edit kapal
router.get('/edit/:id', (req, res) => {
    const kapalId = req.params.id;
    const query = "SELECT * FROM kapal WHERE id = ?";
    
    db.query(query, [kapalId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat mengambil data kapal.');
        }
        if (result.length > 0) {
            res.render('edit', { kapal: result[0] });
        } else {
            res.status(404).send('Kapal tidak ditemukan');
        }
    });
});

// Proses untuk mengupdate data kapal
router.post('/edit/:id', (req, res) => {
    const kapalId = req.params.id;
    const { nama, jenis, jadwal, status } = req.body;

    const query = "UPDATE kapal SET nama = ?, jenis = ?, jadwal = ?, status = ? WHERE id = ?";
    db.query(query, [nama, jenis, jadwal, status, kapalId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat memperbarui data kapal.');
        }
        res.redirect('/kapal');
    });
});

// Proses untuk menghapus kapal
router.post('/hapus/:id', (req, res) => {
    const kapalId = req.params.id;
    const query = "DELETE FROM kapal WHERE id = ?";

    db.query(query, [kapalId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Terjadi kesalahan saat menghapus kapal.');
        }
        res.redirect('/kapal');
    });
});

module.exports = router;
