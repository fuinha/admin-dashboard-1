// @flow
const fs = require("fs");
const pathJoin = require("path").join;
const rootDir = "../sc-cred/";

const getGraph = async (
  dir: string,
  targetFile: string = "weightedGraph.json"
): Promise<string | void> => {
  const files: Array<Dirent> = await fs.promises.readdir(dir, {
    withFileTypes: true,
  });
  // console.log("dir: ", dir);
  // console.log("files: ", files);
  if (files.map((f) => f.name).includes(targetFile))
    return pathJoin(dir, targetFile);
  let search = files
    .filter((f) => f.isDirectory())
    .map(async (f) => {
      return await getGraph(pathJoin(dir, f.name), targetFile);
    });
  if (search.length > 0) {
    let results: Array<string | void> = await Promise.all(search);
    return results.find((e) => !!e) || undefined;
  }
};

if (process.mainModule.filename === __filename) {
  getGraph(rootDir).then(console.log).catch(console.error);
} else module.exports = getGraph;

type Dirent = {|
  name: string,
  type: number,
  isDirectory: function,
|};
