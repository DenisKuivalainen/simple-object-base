import fs from "fs"
import { SOBRecord } from "./types";

const makePath = (path?: string) => `${process.env.ROOT_DIR}/database/${path || ""}`;
const makeTableName = (n: string) => `${n}.sob`;

const checkDB = (db: string) => {
  try {
    if (!db || !db.length) throw Error();

    fs.readdirSync(makePath(db));
    return true;
  } catch (e) {
    return false;
  }
};

const checkTable = (db: string, table: string) => {
  try {
    if (!db || !db.length || !table || !table.length) throw Error();

    return fs.readdirSync(makePath(db)).some((t) => t === makeTableName(table));
  } catch (e) {
    return false;
  }
};

const createDB = (db: string) => {
  try {
    fs.mkdirSync(makePath(db));
    return true;
  } catch (e) {
    return false;
  }
};

const createTable = (db: string, table: string) => {
  try {
    if (checkTable(db, table)) throw Error();

    fs.writeFileSync(
      makePath(`${db}/${makeTableName(table)}`),
      JSON.stringify([])
    );
    return true;
  } catch (e) {
    return false;
  }
};

const deleteDB = (db: string) => {
  try {
    if (!checkDB(db)) throw Error();
    fs.readdirSync(makePath(db)).forEach((f) => {
      fs.rmSync(makePath(`${db}/${f}`));
    });
    fs.rmdirSync(makePath(db));
    return true;
  } catch (e) {
    return false;
  }
};

const deleteTable = (db: string, table: string) => {
  try {
    if (!checkTable(db, table)) throw Error();
    fs.rmSync(makePath(`${db}/${makeTableName(table)}`));
    return true;
  } catch (e) {
    return false;
  }
};

const updateTable = (db: string, table: string, data: Record<string, any>) => {
  try {
    if (!checkTable(db, table)) throw Error();

    fs.writeFileSync(
      makePath(`${db}/${makeTableName(table)}`),
      JSON.stringify(data)
    );
    return true;
  } catch (e) {
    return false;
  }
};

const readTable = (db: string, table: string) => {
  try {
    if (!checkTable(db, table)) throw Error();

    const data = fs.readFileSync(makePath(`${db}/${makeTableName(table)}`));
    return JSON.parse(data.toString()) as SOBRecord[];
  } catch (e) {
    return;
  }
};

export default {
  checkDB,
  checkTable,
  createDB,
  deleteDB,
  createTable,
  deleteTable,
  updateTable,
  readTable,
};
