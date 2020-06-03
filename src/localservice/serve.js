// @flow
const fs = require("fs");
const jsonServer = require("json-server");
const server = jsonServer.create();
const middlewares = jsonServer.defaults();

// TODO: process path input parameter and ensure it's a valid cred repo
const validPath = "../sc-cred/initiatives/";
const loadFiles = () => {
  const db = {};
  db.initiatives = loadInitiatives();
  fs.writeFileSync("db.json", JSON.stringify(db), "utf8");
};

const loadInitiatives = () => {
  const initiatives = [];
  const files = fs
    .readdirSync(validPath)
    .filter((f) => RegExp(".json$").test(f));
  for (const fileName of files) {
    const initObj = JSON.parse(fs.readFileSync(validPath + fileName, "utf8"));
    const shapedInit = {
      ...initObj,
      id: initiatives.length,
    };
    initiatives.push(shapedInit);
  }
  return initiatives;
};

// TODO load contributors on the client side
// it's not really useful to do any of this processing here
// const loadContributors = () => {
//   contributors = [];
// };

if (process.mainModule.filename === __filename) {
  loadFiles();
  const router = jsonServer.router("db.json");
  server.use(middlewares);
  server.use(router);
  server.listen(3005, () => {
    console.log("JSON Server is running");
  });
} else module.exports = loadFiles;
