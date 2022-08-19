const express = require('express');
const router = express.Router();
const members = require('../services/members');

router.get('/', async function (req, res, next) {
    try {
        res.json(await members.getMultiple(req.query.page));
    } catch (err) {
        console.error('Error while getting members', err.message);
        next(err);
    }
});
router.post('/pinjam', async function (req, res, next) {
    try {

        res.json(await members.PinjamBuku(req.body));
    } catch (err) {
        console.error('Error while getting members', err.message);
        next(err);
    }
});
router.put('/pengembalian', async function (req, res, next) {
    try {

        res.json(await members.PengembalianBuku(req.body));
    } catch (err) {
        console.error('Error while getting members', err.message);
        next(err);
    }
});


module.exports = router;