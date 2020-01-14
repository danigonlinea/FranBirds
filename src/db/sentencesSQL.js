export default {
  getAllBirds: 'SELECT * FROM bird',
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, gender = ?, fatherId = ?, motherId = ?, notes = ?, photo = ? WHERE globalId = ?`,
  deleteBird: `DELETE FROM bird WHERE globalId = ?`,
};
