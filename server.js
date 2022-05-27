const express = require("express");
const bodyParser = require("body-parser");
const {
  putDB,
  deleteDB,
  getItem,
  putItem,
  updateItem,
  deleteItem,
  putTable,
} = require("./lib/endpoints");
const { deleteTable } = require("./lib/metods");
require("dotenv").config();

const app = express();
const port = 4001;

app.use(bodyParser.json());
app.use((req, res, next) => {
  if (req.baseUrl !== "" && req.headers["x-api-key"] !== process.env.API_KEY) {
    res.status(403);
    res.send({ error: "Api key not specified" });
    return;
  }
  return next();
});

app.post("/:db/:table/get", getItem);
app.put("/:db/:table/put", putItem);
app.post("/:db/:table/update", updateItem);
app.delete("/:db/:table/delete", deleteItem);

app.put("/:db/:table", putTable);
app.delete("/:db/:table", deleteTable);

app.put("/:db", putDB);
app.delete("/:db", deleteDB);

app.use(express.static("build"));

app.use((err, req, res, next) => {
  res.status(400);
  res.send({ error: err.message });
});

app.listen(port, () => {
  console.log(`DB listening on port ${port}`);
});
