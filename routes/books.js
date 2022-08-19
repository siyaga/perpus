const express = require('express');
const router = express.Router();

const books = require('../services/books');

router.get('/', async function (req, res, next) {
    try {

        res.json(await books.getMultiple(req.query.page));
    } catch (err) {
        console.error('Error while getting books', err.message);
        next(err);
    }
});
router.put('/:code', async function (req, res, next) {
    try {

        res.json(await books.update(req.params.code, req.body));
    } catch (err) {
        console.error('Error while getting books', err.message);
        next(err);
    }
});

module.exports = router;