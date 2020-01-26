export default {
  getAllBirds: 'SELECT * FROM bird',
  getBirds: 'SELECT * FROM bird WHERE gender = ?',
  searchBirds: `SELECT * FROM bird WHERE id LIKE ? OR type LIKE ? OR notes LIKE ?`,
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, gender = ?, fatherId = ?, motherId = ?, notes = ?, photo = ? WHERE globalId = ?`,
  deleteBird: `DELETE FROM bird WHERE globalId = ?`,
};
