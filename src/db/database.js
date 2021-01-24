export default {
  createJailTable: `CREATE TABLE IF NOT EXISTS jail(
              jailId INTEGER PRIMARY KEY AUTOINCREMENT,
              reference TEXT UNIQUE,
              notes TEXT,
            );`,
  createBirdTable: `CREATE TABLE IF NOT EXISTS bird(
          globalId INTEGER PRIMARY KEY AUTOINCREMENT,
          id TEXT UNIQUE,
          type TEXT,
          notes TEXT,
          gender TEXT DEFAULT 'Macho',
          photo TEXT,
          fatherId INTEGER,
          motherId INTEGER,
          fk_jail INTEGER DEFAULT NULL,
          FOREIGN KEY (fk_jail) REFERENCES jail(jailId)
        );`,
};
