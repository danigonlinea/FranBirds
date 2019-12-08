export default {
  getAllBirds: 'SELECT * FROM bird',
  insertBird: `INSERT INTO bird (type, notes, gender, photo, fatherId, motherId) values (?, ?, ?, ?, ?, ?)`,
};
