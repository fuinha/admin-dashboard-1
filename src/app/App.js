import React from "react";
import {Admin, Resource, ListGuesser} from "react-admin";
import {
  InitiativeList,
  InitiativeEdit,
  InitiativeCreate,
} from "./components/Initiatives";
import jsonServerProvider from "ra-data-json-server";
import {initGraph, initPlugins} from "./graph";
const dataProvider = jsonServerProvider("http://localhost:3005");
initGraph(dataProvider);
//initPlugins(dataProvider);
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
