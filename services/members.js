const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const {
    query
} = require('express');

async function getMultiple(page = 1) {
    const offset = helper.getOffset(page, config.listPerPage);
    const rows = await db.query(`SELECT * FROM members LIMIT ${offset}, ${config.listPerPage}`);
    const data = helper.emtyOrRows(rows);
    const meta = {
        page
    };

    return {
        data,
        meta
    }
}

module.exports = {
    getMultiple
}