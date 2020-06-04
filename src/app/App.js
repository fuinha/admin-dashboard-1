import React from "react";
import {Admin, Resource, EditGuesser} from "react-admin";
import {
  InitiativeList,
  InitiativeEdit,
  InitiativeCreate,
} from "./components/Initiatives";
import jsonServerProvider from "ra-data-json-server";

const dataProvider = jsonServerProvider("http://localhost:3005");
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
