import { Request, Response, NextFunction } from "express";
import fs from "fs";

const logger = (req: Request, res: Response, next: NextFunction) => {
  if (process.env.SHOW_STATISTICS) {
    res.on("finish", async () => {
      const status = res.statusCode;
      const path = req.path;
      const method = req.method;

      let statistics = JSON.parse(
        fs.readFileSync(`${process.env.ROOT_DIR}/statistics.json`).toString()
      );

      if (!statistics?.[path]) statistics[path] = {};
      if (!statistics?.[path]?.[method]) statistics[path][method] = {};
      if (!statistics?.[path]?.[method]?.[status]) {
        statistics[path][method][status] = 1;
      } else {
        statistics[path][method][status]++;
      }

      fs.writeFileSync(
        `${process.env.ROOT_DIR}/statistics.json`,
        JSON.stringify(statistics, null, 2)
      );
    });
  }
  next();
};

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(400);
  res.send({ error: err.message });
};

const apiKeyCheck = (req: Request, res: Response, next: NextFunction) => {
  if (req.baseUrl !== "" && req.headers["x-api-key"] !== process.env.API_KEY) {
    res.status(403);
    res.send({ error: "Api key not specified" });
    return;
  }
  return next();
};

export default {
  logger,
  errorHandler,
  apiKeyCheck,
};
