function getOffset(currentPage = 1, listPerpage) {
    return (currentPage - 1) * [listPerpage];

}

function emtyOrRows(rows) {
    if (!rows) {
        return [];
    }
    return rows
}

module.exports = {
    getOffset,
    emtyOrRows
}