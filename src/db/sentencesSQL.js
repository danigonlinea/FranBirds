export default {
  getAllBirds: 'SELECT * FROM bird',
  getBirds: 'SELECT * FROM bird WHERE gender = ?',
  getBird: 'SELECT * FROM bird WHERE globalId = ?',
  getBirdByGlobalId:
    "SELECT a.id, a.type, a.gender, a.fatherId, a.motherId, a.notes, a.photo, b.id AS 'fatherIdLabel', c.id AS 'motherIdLabel' FROM bird a INNER JOIN bird b ON a.fatherId = b.globalId INNER JOIN bird c ON a.fatherId = c.globalId WHERE a.globalId = ?",
  searchBirds: `SELECT * FROM bird WHERE id LIKE ? OR type LIKE ? OR notes LIKE ?`,
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, gender = ?, fatherId = ?, motherId = ?, notes = ?, photo = ? WHERE globalId = ?`,
  deleteBird: `DELETE FROM bird WHERE globalId = ?`,
};
