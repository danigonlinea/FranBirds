export default {
  create: `CREATE TABLE IF NOT EXISTS bird(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT,
        notes TEXT,
        gender TEXT DEFAULT 'Macho',
        photo TEXT,
        fatherId INTEGER,
        motherId INTEGER
      );`,
};
