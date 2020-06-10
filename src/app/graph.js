// @flow
import {Graph} from "sourcecred/src/core/graph";
import {fromJSON} from "sourcecred/src/analysis/pluginDeclaration";

export let graph;
export let plugins;
export let users = [];
export let activities = [];
export let project;

export async function initGraph(apiProvider): Promise<void> {
  const {
    data: {graph: weightedGraphJSON},
  } = await apiProvider.getOne("graphs", {id: 0});
  const [, {graphJSON}] = JSON.parse(weightedGraphJSON);
  graph = Graph.fromJSON(graphJSON);
  await initPlugins(apiProvider);
  loadActivity();
  loadUsers();
  await loadProject(apiProvider);
}

export async function loadProject(apiProvider): Promise<void> {
  const {
    data: {project: serializedProjectJSON},
  } = await apiProvider.getOne("project", {id: 0});
  const projectJSON = JSON.parse(serializedProjectJSON);
  project = projectJSON;
}
export async function initPlugins(apiProvider): Promise<void> {
  const {
    data: {plugins: serializedPluginsJSON},
  } = await apiProvider.getOne("plugins", {id: 0});
  const pluginsJSON = JSON.parse(serializedPluginsJSON);
  plugins = fromJSON(pluginsJSON);
}
export function loadActivity() {
  const activityPrefixes = plugins.reduce((acc, {nodeTypes}) => {
    nodeTypes.forEach(
      (type) =>
        !["Bot", "User", "Identity", "Like"].find((n) => n === type.name) &&
        acc.push(type.prefix)
    );
    return acc;
  }, []);
  activityPrefixes.forEach((prefix) => {
    let activityIterator = graph.nodes({prefix});
    let nextActivity = activityIterator.next();
    while (!nextActivity.done) {
      let activity = {
        ...nextActivity.value,
      };
      activities.push(activity);
      nextActivity = activityIterator.next();
    }
  });
}
export function loadUsers() {
  const userPrefixes = plugins.reduce((acc, {userTypes}) => {
    userTypes.forEach((type) => acc.push(type.prefix));
    return acc;
  }, []);
  userPrefixes.forEach((prefix) => {
    let userIterator = graph.nodes({prefix});
    let nextUser = userIterator.next();
    while (!nextUser.done) {
      let user = {
        ...nextUser.value,
      };
      users.push(user);
      nextUser = userIterator.next();
    }
  });
}
