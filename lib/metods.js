const fs = require("./fileSystem");

const createDB = (db) => {
  if (fs.checkDB(db)) throw Error(`DB "${db}" already exists.`);
  if (!fs.createDB(db)) throw Error("Failed to create DB.");
  return "DB successfully created.";
};

const deleteDB = (db) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.deleteDB(db)) throw Error("Failed to delete DB.");
  return "DB successfully deleted.";
};

const createTable = (db, table) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (fs.checkTable(db, table)) throw Error(`Table "${table}" already exists.`);
  if (!fs.createTable(db, table)) throw Error("Failed to create table.");
  return "Table successfully created.";
};

const deleteTable = (db, table) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  if (!fs.deleteTable(db, table)) throw Error("Failed to delete Table.");
  return "Table successfully deleted.";
};

const get = (db, table, searchFields) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);

  const data = fs.readTable(db, table);
  if (!data) throw Error(`Failed to read from table "${table}".`);

  if (searchFields) {
    const fieldsArr = Object.entries(searchFields);
    if (fieldsArr.length) {
      return data.filter((d) => {
        return fieldsArr.every(([k, v]) => {
          return d[k] === v;
        });
      });
    }
  }

  return data;
};

const put = (db, table, data) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  if (!data) throw Error(`Data not specified.`);
  if (!data.id) throw Error(`ID not specified.`);

  const dataInDB = fs.readTable(db, table);
  if (!dataInDB) throw Error(`Failed to read from table "${table}".`);

  if (dataInDB.some((d) => d.id === data.id))
    throw Error(`ID already excists in table "${table}".`);

  if (!fs.updateTable(db, table, [...dataInDB, data]))
    throw Error(`Failed to write to table "${table}".`);

  return "Item created successfully.";
};

const update = (db, table, data) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  if (!data) throw Error(`Data not specified.`);
  if (!data.id) throw Error(`ID not specified.`);
  if (Object.keys(data).length < 2)
    throw Error(`No update parameters specified.`);

  const dataInDB = fs.readTable(db, table);
  if (!dataInDB) throw Error(`Failed to read from table "${table}".`);

  const updatedObject = dataInDB.filter((d) => d.id === data.id)[0];
  if (!updatedObject)
    throw Error(
      `Object with ID "${data.id}" does not exist in table "${table}".`
    );

  const restData = dataInDB.filter((d) => d.id !== data.id);

  if (!fs.updateTable(db, table, [...restData, { ...updatedObject, ...data }]))
    throw Error(`Failed to write to table "${table}".`);

  return "Item updated successfully.";
};

const _delete = (db, table, searchFields) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  const data = fs.readTable(db, table);
  if (!data) throw Error(`Failed to read from table "${table}".`);

  const fieldsArr = Object.entries(searchFields);

  const afterDelete =
    searchFields && fieldsArr.length
      ? data.filter((d) => {
          return !fieldsArr.every(([k, v]) => {
            return d[k] === v;
          });
        })
      : [];

  if (!fs.updateTable(db, table, afterDelete))
    throw Error(`Failed to write to table "${table}".`);
  if (data.length - afterDelete.length === 0) return "No items were deleted.";
  return data.length - afterDelete.length > 1
    ? "Items deleted successfully."
    : "Item deleted successfully.";
};

module.exports = {
  createDB,
  deleteDB,
  createTable,
  deleteTable,
  get,
  put,
  update,
  delete: _delete,
};
