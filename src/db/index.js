import * as SQLite from 'expo-sqlite';
import info from './info';
import database from './database';
import sentencesSQL from './sentencesSQL';
import strings from '../utils/strings';

const nullCallback = v => console.log('Null Callback');

const getDatabase = () => {
  return SQLite.openDatabase(info.name, info.version, info.description);
};

const query = (querySQL, argsArray, onSuccess, onError) => {
  const db = getDatabase();

  let result = undefined;

  db.transaction(
    tx => {
      tx.executeSql(
        querySQL,
        argsArray,
        (_, { rows, rowsAffected, insertId }) => {
          result = {
            result: JSON.parse(JSON.stringify(rows._array)),
            count: rows.length,
            rawRows: rows,
            rowsAffected,
            insertId,
          };

          return result;
        },
        (ts, error) => onError(ts, error)
      );
    },
    err => console.log('Query Error: ', error),
    () => onSuccess instanceof Function && onSuccess(result)
  );
};

export const createDatabase = () => {
  query(database.create, [], nullCallback, nullCallback);
};

export const getAllBirds = async (onSuccess, onError) => {
  query(sentencesSQL.getAllBirds, [], onSuccess, onError);
};

export const getBirds = async (gender, onSuccess, onError) => {
  if (gender === strings.gender[0]) {
    query(sentencesSQL.getAllBirds, [], onSuccess, onError);
  } else {
    query(sentencesSQL.getBirds, [gender], onSuccess, onError);
  }
};

export const insertBird = async (args = {}, onSuccess, onError) => {
  // Sort the values as it is designed in database
  const { id, type, gender, fatherId = null, motherId = null, notes, photo } = args;
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
  const { globalId, id, type, gender, fatherId = null, motherId = null, notes, photo } = args;
  // Make the query with the sorted values as expected by the insert bird query.

  query(
    sentencesSQL.updateBird,
    [id, type, gender, fatherId, motherId, notes, photo, globalId],
    onSuccess,
    onError
  );
};

export const deleteBird = async (globalId, onSuccess, onError) => {
  query(sentencesSQL.deleteBird, [globalId], onSuccess, onError);
};
