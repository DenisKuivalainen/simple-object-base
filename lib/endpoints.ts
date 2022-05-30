import methods from "./metods"
import { Request, Response } from "express";

const putDB = (req: Request, res: Response) => {
  /**
   * @api {put} /:db Create new DB
   * @apiVersion 1.0.0
   * @apiGroup DB
   * @apiName putDB
   *
   * @apiParam (Path) {String} db DB name (should be unique)
   *
   * @apiHeader {String} access-key Acess key value
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "DB successfully created."
   *     }
   */
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res.send("Operation not permited");
    return;
  }
  res.send({ data: methods.createDB(req.params.db) });
};

const deleteDB = (req: Request, res: Response) => {
  /**
   * @api {delete} /:db Delete DB
   * @apiVersion 1.0.0
   * @apiGroup DB
   *  @apiName deleteDB
   *
   * @apiParam (Path) {String} db DB name (should exist)
   *
   * @apiHeader {String} access-key Acess key value
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "DB successfully deleted."
   *     }
   */
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res.send("Operation not permited");
    return;
  }
  res.send({ data: methods.deleteDB(req.params.db) });
};

const putTable = (req: Request, res: Response) => {
  /**
   * @api {put} /:db/:table Create new table
   * @apiVersion 1.0.0
   * @apiGroup Table
   *  @apiName putTable
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should be unique)
   *
   * @apiHeader {String} access-key Acess key value
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "Table successfully created."
   *     }
   */
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res.send("Operation not permited");
    return;
  }
  res.send({ data: methods.createTable(req.params.db, req.params.table) });
};

const deleteTable = (req: Request, res: Response) => {
  /**
   * @api {delete} /:db/:table Delete table
   * @apiVersion 1.0.0
   * @apiGroup Table
   *  @apiName deleteTable
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should exist)
   *
   * @apiHeader {String} access-key Acess key value
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "Table successfully deleted."
   *     }
   */
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res.send("Operation not permited");
    return;
  }
  res.send({ data: methods.deleteTable(req.params.db, req.params.table) });
};

const getItem = (req: Request, res: Response) => {
  /**
   * @api {post} /:db/:table/get Get object(s)
   * @apiVersion 1.0.0
   * @apiGroup Object
   *  @apiName getObject
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should exist)
   *
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiParam (Body) [params] Any destructed params that should be present in searched items. If no params specified, endpoint will return all object of the table
   *
   * @apiSuccess {Array} data  Array of found objects
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": [
   *         {"id": "uid1", "type": "a"},
   *         {"id": "uid2", "type": "c"}
   *       ]
   *     }
   */
  res.send({ data: methods.get(req.params.db, req.params.table, req.body) });
};

const putItem = (req: Request, res: Response) => {
  /**
   * @api {put} /:db/:table/put Put object
   * @apiVersion 1.0.0
   * @apiGroup Object
   *  @apiName putObject
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should exist)
   *
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiParam (Body) {String} id Unique ID of item
   * @apiParam (Body) [params] Any destructed params that should be present in created object
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "Item created successfully."
   *     }
   */
  res.send({ data: methods.put(req.params.db, req.params.table, req.body) });
};

const updateItem = (req: Request, res: Response) => {
  /**
   * @api {update} /:db/:table/update Update object
   * @apiVersion 1.0.0
   * @apiGroup Object
   *  @apiName updateObject
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should exist)
   *
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiParam (Body) {String} id Unique ID of item
   * @apiParam (Body) [params] Any destructed params that should be updated in the object
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "Item created successfully."
   *     }
   */
  res.send({ data: methods.update(req.params.db, req.params.table, req.body) });
};

const deleteItem = (req: Request, res: Response) => {
  /**
   * @api {delete} /:db/:table/delete Delete object
   * @apiVersion 1.1.0
   * @apiGroup Object
   *  @apiName deleteObject
   *
   * @apiParam (Path) {String} db DB name (should exist)
   * @apiParam (Path) {String} table Table name (should exist)
   *
   * @apiHeader {String} x-api-key Api key value
   *
   * @apiParam (Body) {String} id Unique ID of item that should be deleted
   *
   * @apiSuccess {String} data  Success message
   * @apiSuccessExample Success response:
   *     HTTP/1.1 200 OK
   *     {
   *       "data": "Item created successfully."
   *     }
   */
  res.send({ data: methods.delete(req.params.db, req.params.table, req.body.id as string) });
};

export default {
  putDB,
  deleteDB,
  putTable,
  deleteTable,
  getItem,
  putItem,
  updateItem,
  deleteItem,
};
