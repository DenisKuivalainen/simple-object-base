import fs from "./fileSystem";
import { SOBData, SOBRecord } from "./types";

const createDB = (db: string) => {
  if (fs.checkDB(db)) throw Error(`DB "${db}" already exists.`);
  if (!fs.createDB(db)) throw Error("Failed to create DB.");
  return "DB successfully created.";
};

const deleteDB = (db: string) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.deleteDB(db)) throw Error("Failed to delete DB.");
  return "DB successfully deleted.";
};

const createTable = (db: string, table: string) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (fs.checkTable(db, table)) throw Error(`Table "${table}" already exists.`);
  if (!fs.createTable(db, table)) throw Error("Failed to create table.");
  return "Table successfully created.";
};

const deleteTable = (db: string, table: string) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  if (!fs.deleteTable(db, table)) throw Error("Failed to delete Table.");
  return "Table successfully deleted.";
};

const get = (db: string, table: string, searchFields: SOBData) => {
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

const put = (db: string, table: string, data: SOBRecord) => {
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

const update = (db: string, table: string, data: SOBRecord) => {
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

const batchUpdate = (
  db: string,
  table: string,
  { items: data }: { items: SOBRecord[] }
) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  if (!data || !data.length) throw Error(`No data to update.`);
  if (data.some((d) => !d.id)) throw Error(`Not all items have specified ID.`);
  if (data.some((d) => Object.keys(d).length < 2))
    throw Error(`Not all items have specified update parameters.`);

  const tableData = fs.readTable(db, table);
  if (!tableData) throw Error(`Failed to read from table "${table}".`);
  if(!data.every(({id}) => 
    tableData.some(d => d.id === id)
  ))throw Error(`Some IDs of provided items do not exist in table "${table}".`);

  const updatedItems = [
    ...tableData.filter((d) => data.every(({ id }) => id !== d.id)),
    ...tableData
      .filter((d) => data.some(({ id }) => id === d.id))
      .map((d) => {
        const u = data.filter(({ id }) => id === d.id)[0];
        return { ...d, ...u };
      }),
  ];
  if (!fs.updateTable(db, table, updatedItems))
    throw Error(`Failed to write to table "${table}".`);

  return "Item updated successfully.";
};

const _delete = (db: string, table: string, id: string) => {
  if (!fs.checkDB(db)) throw Error(`DB "${db}" does not exist.`);
  if (!fs.checkTable(db, table))
    throw Error(`Table "${table}" does not exist.`);
  const data = fs.readTable(db, table);
  if (!data) throw Error(`Failed to read from table "${table}".`);

  const afterDelete = data.filter((d) => d.id !== id);

  if (!fs.updateTable(db, table, afterDelete))
    throw Error(`Failed to write to table "${table}".`);
  if (data.length - afterDelete.length === 0) return "No items were deleted.";

  return "Item deleted successfully.";
};

export default {
  createDB,
  deleteDB,
  createTable,
  deleteTable,
  get,
  put,
  update,
  batchUpdate,
  delete: _delete,
};
