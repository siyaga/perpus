const db = require('./db');
const helper = require('../helper');
const config = require('../config');
const moment = require("moment-timezone");
const dayjs = require('dayjs');

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

async function PinjamBuku(body) {
    const putBooks = await db.query(`Select max_pinjam from members where code="${body.code_members}"`);
    const getBooks = await db.query(`SELECT stock FROM books WHERE code="${body.code_books}"`);
    const getPenalty = await db.query(`Select id,tanggal_pinjam,tanggal_pengembalian, penalty from pinjam where code_members="${body.code_members}"`);
    let validasiMessage;
    const checkPenalty = getPenalty[0].penalty;
    if (checkPenalty < new Date() || checkPenalty === null || checkPenalty === undefined) {
        if (putBooks.length < 1 || body.code_members === null || body.code_members === undefined) return validasiMessage = "data members tidak ditemukan";
        if (getBooks.length < 1 || body.code_books === null || body.code_books === undefined) return validasiMessage = "data buku tidak ditemukan";
        let message;


        const addBooks = putBooks[0].max_pinjam;

        const minBooks = getBooks[0].stock;


        if (addBooks === null && minBooks === null && addBooks === undefined && minBooks === undefined) {
            return message = `Data Not Null`;
        }

        if (addBooks >= 2) {
            return message = 'Tidak boleh Pinjam Lebih dari 2 buku'
        }
        if (minBooks <= 0) {
            return message = 'Buku sudah dipinjam'
        }



        const pinjam_sekarang = 'now()'

        const insertPinjam = await db.query(`INSERT INTO pinjam 
    (tanggal_pinjam, tanggal_pengembalian, code_members, code_books) 
    VALUES 
    (${pinjam_sekarang}, now() + interval 7 day, "${body.code_members}", "${body.code_books}")`);
        const pinjam_member = await db.query(
            `UPDATE members SET max_pinjam=${addBooks + 1} WHERE code="${body.code_members}"`
        );
        const update_stok = await db.query(`UPDATE books SET stock=${minBooks - 1} WHERE code="${body.code_books}"`);


        if (pinjam_member.affectedRows && update_stok.affectedRows && insertPinjam.affectedRows) {
            return message = 'Borrows books has successfully';
        } else {
            return message = 'Error in borrows members';
        }


    } else {

        return validasiMessage = `Anda tidak bisa meminjam buku di karenakan terkena penalty 3 hari pengembalian`;

    }



}
async function PengembalianBuku(body) {


    const putBooks = await db.query(`Select max_pinjam from members where code="${body.code_members}"`);
    const getBooks = await db.query(`SELECT stock FROM books WHERE code="${body.code_books}"`);
    let validasiMessage;
    if (putBooks.length < 1 || body.code_members === null || body.code_members === undefined) return validasiMessage = "data members tidak ditemukan";
    if (getBooks.length < 1 || body.code_books === null || body.code_books === undefined) return validasiMessage = "data buku tidak ditemukan";
    const getPenalty = await db.query(`Select id,tanggal_pinjam,tanggal_pengembalian, penalty from pinjam where code_members="${body.code_members}" AND code_books="${body.code_books}"`);

    let message;
    if (getPenalty < 1) {
        return message = `Tidak Ada buku yang di pinjam`
    }
    const addBooks = putBooks[0].max_pinjam;
    const minBooks = getBooks[0].stock;
    const checkPinjamTanggal = getPenalty[0].tanggal_pengembalian;
    const checkIdPinjam = getPenalty[0].id;
    if (addBooks === null && minBooks === null && addBooks === undefined && minBooks === undefined) {
        return message = `Data Not Null`;
    }
    console.log(checkPinjamTanggal < new Date());
    if (checkPinjamTanggal < new Date()) {
        const TerkenaPenalty = await db.query(`UPDATE pinjam SET penalty=now() + interval 3 day WHERE code_members="${body.code_members}" AND code_books="${body.code_books}"`);
        const pinjam_member = await db.query(
            `UPDATE members SET max_pinjam=${addBooks - 1} WHERE code="${body.code_members}"`
        );
        const update_stok = await db.query(`UPDATE books SET stock=${minBooks + 1} WHERE code="${body.code_books}"`);
        if (pinjam_member.affectedRows && update_stok.affectedRows && TerkenaPenalty.affectedRows) return message = `Pengambalain buku berhasil dan anda terkena penalty selama 3 hari`;
    }
    if (checkPinjamTanggal.length < 1 || checkPinjamTanggal === undefined) {
        return message = `Tidak ada peminjaman buku`;
    }

    console.log(checkIdPinjam)
    const deletePinjaman = await db.query(`DELETE FROM pinjam WHERE id=${checkIdPinjam}`);
    const pinjam_member = await db.query(
        `UPDATE members SET max_pinjam=${addBooks - 1} WHERE code="${body.code_members}"`
    );
    const update_stok = await db.query(`UPDATE books SET stock=${minBooks + 1} WHERE code="${body.code_books}"`);


    if (pinjam_member.affectedRows && update_stok.affectedRows && deletePinjaman.affectedRows) {
        return message = 'Buku berhasil di kembalikan';
    } else {
        return message = 'Error in borrows members';
    }



}


module.exports = {
    getMultiple,
    PinjamBuku,
    PengembalianBuku
}