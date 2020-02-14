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
          // console.log({ rows, rowsAffected, insertId });
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

export const getBirdsForSelectAsParent = async (gender, currentBirdId, onSuccess, onError) => {
  query(sentencesSQL.getBirdsForSelectAsParent, [gender, currentBirdId], onSuccess, onError);
};

/* SELECT globalId, id, type, gender, fatherId, motherId, notes, photo, (SELECT globalId FROM bird WHERE fatherId=?) AS 'fatherIdGlobal', (SELECT globalId FROM bird WHERE motherId=?) AS 'motherIdGlobal' FROM bird WHERE a.globalId = ? */

export const getBirdByGlobal = async (globalId, onSuccess, onError) => {
  query(sentencesSQL.getBirdByGlobalId, [globalId, globalId, globalId], onSuccess, onError);
};

export const searchBirds = async (textToSearch = '', onSuccess, onError) => {
  query(
    sentencesSQL.searchBirds,
    [`%${textToSearch}%`, `%${textToSearch}%`, `%${textToSearch}%`],
    onSuccess,
    onError
  );
};

export const insertBird = async (args = {}, onSuccess, onError) => {
  // Sort the values as it is designed in database
  const { id, type, gender, fatherIdGlobal = null, motherIdGlobal = null, notes, photo } = args;
  // Make the query with the sorted values as expected by the insert bird query.
  query(
    sentencesSQL.insertBird,
    [id, type, gender, fatherIdGlobal, motherIdGlobal, notes, photo],
    onSuccess,
    onError
  );
};

/* SELECT a.globalId, a.id, a.type, a.gender, a.fatherId AS 'fatherIdGlobal', a.motherId AS 'motherIdGlobal',
a.notes, a.photo,
(SELECT b.id FROM bird b WHERE b.globalId = (SELECT d.fatherId FROM bird d WHERE d.globalId = ?)) AS 'fatherId',
(SELECT c.id FROM bird c WHERE c.globalId = (SELECT e.motherId FROM bird e WHERE e.globalId = ?))) AS 'motherId' FROM bird a WHERE a.globalId = ?
 */
export const updateBird = async (args = {}, onSuccess, onError) => {
  // Sort the values as it is designed in database
  const {
    globalId,
    id,
    type,
    gender,
    fatherIdGlobal = null,
    motherIdGlobal = null,
    notes,
    photo,
  } = args;
  // Make the query with the sorted values as expected by the insert bird query.

  query(
    sentencesSQL.updateBird,
    [id, type, gender, fatherIdGlobal, motherIdGlobal, notes, photo, globalId],
    onSuccess,
    onError
  );
};

export const deleteBird = async (globalId, onSuccess, onError) => {
  query(sentencesSQL.deleteBird, [globalId], onSuccess, onError);
};
