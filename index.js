require("dotenv").config();
process.env.ROOT_DIR = __dirname;

require("./dist/server");
