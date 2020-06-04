// @flow
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  Create,
  BooleanInput,
} from "react-admin";

export const InitiativeList = (props: Object) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField label="Initiative Name" source="title" />
      <TextField label="Last Updated" source="timestampIso" />
    </Datagrid>
  </List>
);

export const InitiativeEdit = (props: Object) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput label="Title" source="title" />
      <BooleanInput label="Completed" source="completed" />
    </SimpleForm>
  </Edit>
);

export const InitiativeCreate = (props: Object) => {
  console.log(props);
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput label="Title" source="title" />
        <BooleanInput label="Completed" source="completed" />
      </SimpleForm>
    </Create>
  );
};
