export default {
  getAllBirds: 'SELECT * FROM bird',
  getBirds: 'SELECT * FROM bird WHERE gender = ?',
  getBirdsForSelectAsParent: 'SELECT * FROM bird WHERE gender = ? AND globalId != ?',
  getBird: 'SELECT * FROM bird WHERE globalId = ?',
  getBirdByGlobalId:
    "SELECT a.globalId, a.id, a.type, a.gender, a.fatherId AS 'fatherIdGlobal', a.motherId AS 'motherIdGlobal', a.notes, a.photo, (SELECT b.id FROM bird b WHERE b.globalId = (SELECT d.fatherId FROM bird d WHERE d.globalId = ?)) AS 'fatherId', (SELECT c.id FROM bird c WHERE c.globalId = (SELECT e.motherId FROM bird e WHERE e.globalId = ?)) AS 'motherId' FROM bird a WHERE a.globalId = ?",
  getBirdBrothersByGlobal: `SELECT a.globalId, a.id, a.gender, a.fatherId, a.motherId FROM bird a
   WHERE (a.fatherId = (SELECT b.fatherId FROM bird b WHERE b.globalId = ?)
   OR a.motherId = (SELECT c.motherId FROM bird c WHERE c.globalId = ?) )
   AND a.globalId != ?`,
  getBirdChildrenByGlobal:
    'SELECT globalId, id, gender, fatherId, motherId FROM bird WHERE fatherId = ? OR motherId = ?',
  searchBirds: `SELECT * FROM bird WHERE id LIKE ? OR type LIKE ? OR notes LIKE ?`,
  searchBirdsByGender: `SELECT * FROM bird WHERE globalId != ? AND gender = ? AND (id LIKE ? OR type LIKE ? OR notes LIKE ?)`,
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, gender = ?, fatherId = ?, motherId = ?, notes = ?, photo = ? WHERE globalId = ?`,
  deleteBird: `DELETE FROM bird WHERE globalId = ?`,
};
