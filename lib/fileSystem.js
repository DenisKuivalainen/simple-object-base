const fs = require("fs");

const makePath = (path = "") => `${__dirname}/../database/${path}`;
const makeTableName = (n) => `${n}.sob`;

const checkDB = (db) => {
  try {
    if (!db || !db.length) throw Error();

    fs.readdirSync(makePath(db));
    return true;
  } catch (e) {
    return false;
  }
};

const checkTable = (db, table) => {
  try {
    if (!db || !db.length || !table || !table.length) throw Error();

    return fs.readdirSync(makePath(db)).some((t) => t === makeTableName(table));
  } catch (e) {
    return false;
  }
};

const createDB = (db) => {
  try {
    fs.mkdirSync(makePath(db));
    return true;
  } catch (e) {
    return false;
  }
};

const createTable = (db, table) => {
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

const deleteDB = (db) => {
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

const deleteTable = (db, table) => {
  try {
    if (!checkTable(db, table)) throw Error();
    fs.rmSync(makePath(`${db}/${makeTableName(table)}`));
    return true;
  } catch (e) {
    return false;
  }
};

const updateTable = (db, table, data) => {
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

const readTable = (db, table) => {
  try {
    if (!checkTable(db, table)) throw Error();

    const data = fs.readFileSync(makePath(`${db}/${makeTableName(table)}`));
    return JSON.parse(data.toString());
  } catch (e) {
    return;
  }
};

module.exports = {
  checkDB,
  checkTable,
  createDB,
  deleteDB,
  createTable,
  deleteTable,
  updateTable,
  readTable,
};
