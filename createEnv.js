const generateApiKey = require("generate-api-key");
const fs = require("fs");
const { env } = require("process");

const keys = ["ACCESS_KEY", "API_KEY"];

const envFilePath = `${__dirname}/.env`;

const createNewEnv = () =>
  fs.writeFileSync(
    envFilePath,
    keys.map((k) => `${k}=${generateApiKey()}`).join("\n")
  );

if (fs.readdirSync(__dirname).every((f) => f !== ".env")) {
  createNewEnv();
} else {
  let envs = fs
    .readFileSync(envFilePath)
    .toString()
    .split(/\n/)
    .filter((l) => l.length)
    .map((l) => l.split("=").map((v) => v.replace(/ */g, "")));

  if (!envs.length) {
    createNewEnv();
  } else {
    for (const i in keys) {
      const key = keys[i];

      if (
        envs.every((f) => {
          return f[0] !== key;
        })
      ) {
        envs.push([key, generateApiKey()]);
      }
    }

    fs.writeFileSync(
      envFilePath,
      envs.map((e) => `${e[0]}=${e[1]}`).join("\n")
    );
  }
}
