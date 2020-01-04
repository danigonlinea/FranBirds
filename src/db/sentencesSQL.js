export default {
  getAllBirds: 'SELECT * FROM bird',
  insertBird: `INSERT INTO bird (id, type, gender, fatherId, motherId, notes, photo) values (?, ?, ?, ?, ?, ?, ?)`,
};
