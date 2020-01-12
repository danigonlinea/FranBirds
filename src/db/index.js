import * as SQLite from 'expo-sqlite';
import info from './info';
import database from './database';
import sentencesSQL from './sentencesSQL';

const nullCallback = v => console.log('Null Callback');

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
        (_, { rows, rowsAffected, insertId }) => {
          return (
            onSuccess instanceof Function &&
            onSuccess({
              result: JSON.parse(JSON.stringify(rows._array)),
              count: rows.length,
              rawRows: rows,
              rowsAffected,
              insertId,
            })
          );
        },
        (ts, error) => onError(ts, error)
      );
    },
    err => console.log('Query Error: ', error),
    success => console.log('Query successfully executed')
  );
};

export const createDatabase = () => {
  query(database.create, [], nullCallback, nullCallback);
};

export const getAllBirds = async (onSuccess, onError) => {
  query(sentencesSQL.getAllBirds, [], onSuccess, onError);
};

export const insertBird = async (args = {}, onSuccess, onError) => {
  // Sort the values as it is designed in database
  const { id, type, gender, fatherId = 0, motherId = 0, notes, photo } = args;
  // Make the query with the sorted values as expected by the insert bird query.
  query(
    sentencesSQL.insertBird,
    [id, type, gender, fatherId, motherId, notes, photo],
    onSuccess,
    onError
  );
};

export const updateBird = async (args = {}, onSuccess, onError) => {
  // Sort the values as it is designed in database
  const { globalId, id, type, gender, fatherId = 0, motherId = 0, notes, photo } = args;
  // Make the query with the sorted values as expected by the insert bird query.

  query(
    sentencesSQL.updateBird,
    [id, type, gender, fatherId, motherId, notes, photo, globalId],
    onSuccess,
    onError
  );
};
