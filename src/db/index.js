import * as SQLite from 'expo-sqlite';
import info from './info';
import database from './database';

export { default as Query } from './query';

const getDatabase = () => {
  return SQLite.openDatabase(info.name, info.version, info.description);
};

export const createDatabase = () => {
  const db = getDatabase();

  console.log(database.create);
  db.transaction(
    tx => {
      tx.executeSql(
        database.create,
        [],
        ({ ...props }) => console.log('create', props),
        error => console.log('Error: ', error)
      );
    },
    err => console.log(err),
    success => console.log(success)
  );
};

export const getAllBirds = async () => {
  const db = getDatabase();

  db.transaction(
    tx => {
      tx.executeSql(
        'SELECT * FROM bird',
        [],
        ({ ...props }) => console.log('Select', props),
        error => console.log('Error: ', error)
      );
    },
    err => console.log(err),
    success => console.log(success)
  );
};

export const insertBird = async birdData => {
  const db = await getDatabase();

  const insertId = await db.transaction(
    tx =>
      tx.executeSql(
        `INSERT INTO birds (type, notes, gender, photo, fatherId, motherId) values
                           ('Canario', 'Ojos marrones, 'Macho', null, null, null)`,
        null,
        (_, { rows: { _array }, insertId, rowsAffected }) => insertId
      ),
    null
  );

  console.log('Inserted: ', insertId);
  return insertId;
};
