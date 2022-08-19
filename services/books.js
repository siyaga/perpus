const db = require('./db');
const helper = require('../helper');
const config = require('../config');


async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(`SELECT * FROM books where stock=1 LIMIT ${offset}, ${config.listPerPage}`);
    const data = helper.emtyOrRows(rows);
    const meta = {
        page
    };

    return {
        data,
        meta
    }
}

async function update(code, books) {
    const result = db.query(
        `UPDATE books SET title="${books.title}", author="${books.author}", stock=${books.stock} WHERE code="${code}"`
    );
    let message = 'Error in updating books';

    if (result.affectedRows) {
        message = 'Books update successfully';
    }

    return {
        message
    };

}

module.exports = {
    getMultiple,
    update
}