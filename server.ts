import express, {Express, Request, Response, NextFunction} from "express"
import bodyParser from "body-parser";
import endpoints from "./lib/endpoints"

const {
  putDB,
  deleteDB,
  getItem,
  putItem,
  updateItem,
  deleteItem,
  putTable,
  deleteTable
} = endpoints


const app: Express = express();
const port = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use((req: Request, res: Response, next: NextFunction) => {
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

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(400);
  res.send({ error: err.message });
});

app.listen(port, () => {
  console.log(`SOB listening on port ${port}`);
});