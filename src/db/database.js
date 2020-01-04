export default {
  create: `CREATE TABLE IF NOT EXISTS bird(
            globalId INTEGER PRIMARY KEY AUTOINCREMENT,
            id TEXT UNIQUE,
            type TEXT,
            notes TEXT,
            gender TEXT DEFAULT 'Macho',
            photo TEXT,
            fatherId INTEGER,
            motherId INTEGER
          );`,
};
