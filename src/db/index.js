import * as SQLite from 'expo-sqlite';
import info from './info';
import database from './database';
import sentencesSQL from './sentencesSQL';

const nullCallback = v => console.log('Object', v);

const getDatabase = () => {
  return SQLite.openDatabase(info.name, info.version, info.description);
};

const query = (querySQL, argsArray, onSuccess, onError) => {
  const db = getDatabase();

  db.transaction(
    tx => {
      tx.executeSql(
        querySQL,
        argsArray,
        (_, { rows, rowsAffected, insertedId }) =>
          onSuccess instanceof Function && onSuccess({ rows, rowsAffected, insertedId }),
        error => onError(error)
      );
    },
    err => console.log('Query Error: ', error),
    success => console.log('Query successfully executed')
  );
};

export const createDatabase = () => {
  query(database.create, [], nullCallback, nullCallback);
};

export const getAllBirds = async (args = [], onSuccess, onError) => {
  query(sentencesSQL.getAllBirds, args, onSuccess, onError);
};

export const insertBird = async (args = [], onSuccess, onError) => {
  query(sentencesSQL.insertBird, args, onSuccess, onError);
};
