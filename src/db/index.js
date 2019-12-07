import * as SQLite from 'expo-sqlite';
import info from './info';
import database from './database';

export { default as Query } from './query';

export const createDatabase = async () => {
  const db = await SQLite.openDatabase({
    name: info.name,
    version: info.version,
    description: info.description,
  });

  await db.transaction(tx => {
    tx.executeSql(database.create);
  });
};
