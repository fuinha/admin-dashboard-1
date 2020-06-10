import React from "react";
import {Admin, Resource} from "react-admin";
import {
  InitiativeList,
  InitiativeEdit,
  InitiativeCreate,
} from "./components/Initiatives";
import jsonServerProvider from "ra-data-json-server";
import {initGraph, initPlugins, project} from "./graph";
const dataProvider = jsonServerProvider("http://localhost:3005");
initGraph(dataProvider);
const App = () => (
  <Admin dataProvider={dataProvider}>
    <Resource
      name="initiatives"
      list={InitiativeList}
      edit={InitiativeEdit}
      create={InitiativeCreate}
    />
  </Admin>
);

export default App;
