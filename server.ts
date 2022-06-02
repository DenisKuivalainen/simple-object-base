import express, { Express } from "express";
import bodyParser from "body-parser";
import endpoints from "./lib/endpoints";
import middleware from "./lib/middleware";

const {
  putDB,
  deleteDB,
  getItem,
  putItem,
  updateItem,
  batchUpdate,
  deleteItem,
  putTable,
  deleteTable,
} = endpoints;

const app: Express = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(middleware.apiKeyCheck);

app.use(middleware.logger);

app.post("/:db/:table/get", getItem);
app.put("/:db/:table/put", putItem);
app.post("/:db/:table/update", updateItem);
app.post("/:db/:table/update/batch", batchUpdate);
app.delete("/:db/:table/delete", deleteItem);

app.put("/:db/:table", putTable);
app.delete("/:db/:table", deleteTable);

app.put("/:db", putDB);
app.delete("/:db", deleteDB);

app.use(express.static("build"));

app.use(middleware.errorHandler);

app.listen(port, () => {
  console.log(`SOB listening on port ${port}`);
});
