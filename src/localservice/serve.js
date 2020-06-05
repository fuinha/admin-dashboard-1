// @flow

const fs = require("fs");
const jsonServer = require("json-server");
import type {
  UnshapedInitiativeV1,
  UnshapedInitiativeV2,
  ShapedInitiativeV010,
  ShapedInitiativeV020,
} from "./ShapedInitiative";
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
  const files: Array<string> = fs
    .readdirSync(validPath)
    .filter((f) => RegExp(".json$").test(f));
  for (const fileName of files) {
    const initObj = JSON.parse(fs.readFileSync(validPath + fileName, "utf8"));
    initiatives.push(getShapedInitiativeFile(initObj));
  }
  return initiatives;
};

const getShapedInitiativeFile = (fileJSON) => {
  if (fileJSON[0].type === "0.1.0") {
    return getShapedV010File((fileJSON: UnshapedInitiativeV1));
  }
  return getShapedV020File((fileJSON: UnshapedInitiativeV2));
};

const getShapedV010File = (
  fileJSON: UnshapedInitiativeV1
): ShapedInitiativeV010 => {
  const {type, version} = fileJSON[0];
  const {
    title,
    timestampIso,
    weight,
    completed,
    dependencies,
    references,
    contributions,
    champions,
  } = fileJSON[1];

  return {
    type,
    version,
    title,
    timestampIso,
    incompleteWeight: weight.incomplete,
    completeWeight: weight.complete,
    completed,
    dependencies,
    references,
    contributions,
    champions,
  };
};

const getShapedV020File = (
  fileJSON: UnshapedInitiativeV2
): ShapedInitiativeV020 => {
  const {type, version} = fileJSON[0];
  const {
    title,
    timestampIso,
    weight,
    completed,
    dependencies,
    references,
    contributions,
    champions,
  } = fileJSON[1];

  return {
    type,
    version,
    title,
    timestampIso,
    completed,
    champions,
    incompleteWeight: weight.incomplete,
    completeWeight: weight.complete,
    dependenciesId: dependencies && dependencies.identities, // flowlint-line prop-missing:off
    dependenciesUrl: dependencies && dependencies.urls,
    referencesId: references && references.identities, // flowlint-line prop-missing:off
    referencesUrl: references && references.urls,
    contributionsId: contributions && contributions.identities, // flowlint-line prop-missing:off
    contributionsUrl: contributions && contributions.urls,
  };
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
