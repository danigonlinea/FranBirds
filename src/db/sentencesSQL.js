export default {
  getAllBirds: 'SELECT * FROM bird',
  getBirds: 'SELECT * FROM bird WHERE gender = ?',
  getBird: 'SELECT * FROM bird WHERE globalId = ?',
  getBirdByGlobalId:
    "SELECT a.globalId, a.id, a.type, a.gender, a.fatherId AS 'fatherIdGlobal', a.motherId AS 'motherIdGlobal', a.notes, a.photo, (SELECT b.id FROM bird b WHERE b.globalId = (SELECT d.fatherId FROM bird d WHERE d.globalId = ?)) AS 'fatherId', (SELECT c.id FROM bird c WHERE c.globalId = (SELECT e.motherId FROM bird e WHERE e.globalId = ?)) AS 'motherId' FROM bird a WHERE a.globalId = ?",
  searchBirds: `SELECT * FROM bird WHERE id LIKE ? OR type LIKE ? OR notes LIKE ?`,
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, gender = ?, fatherId = ?, motherId = ?, notes = ?, photo = ? WHERE globalId = ?`,
  deleteBird: `DELETE FROM bird WHERE globalId = ?`,
};
