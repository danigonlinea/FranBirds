export default {
  getAllBirds: 'SELECT * FROM bird',
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
  updateBird: `UPDATE bird SET id = ?, type = ?, set gender = ?, set fatherId = ?, set motherId = ?, set notes = ?, set photo = ? WHERE id = ?`,
};
