// @flow
import React from "react";
import {users} from "../graph";
import {
  AutocompleteArrayInput,
  List,
  Datagrid,
  DateField,
  DateInput,
  ArrayField,
  ArrayInput,
  BooleanField,
  NumberInput,
  TextField,
  SimpleForm,
  TextInput,
  Edit,
  Create,
  SimpleFormIterator,
  BooleanInput,
} from "react-admin";

export const InitiativeList = (props: Object) => (
  <List {...props}>
    <Datagrid rowClick="edit">
      <TextField label="Initiative Name" source="title" />
      <BooleanField label="Completed" source="completed" />
      <DateField label="Last Updated" source="timestampIso" />
    </Datagrid>
  </List>
);

export const InitiativeEdit = (props: Object) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput label="Title" source="title" />
        <DateInput label="Date" source="timestampIso" />
        <NumberInput
          label="Weight While Incomplete"
          source="weight.incomplete"
        />
        <NumberInput label="Weight When Completed" source="weight.complete" />
        <BooleanInput label="Completed" source="completed" />
        {/*
        <ArrayInput source="champions">
          <SimpleFormIterator>
            <AutocompleteInput label="champion" />
          </SimpleFormIterator>
        </ArrayInput>
        */}
        <AutocompleteArrayInput
          source="champions"
          parse={(v) => {
            console.log("outgoing: ", v);
            return v;
          }}
          allowDuplicates={false}
          translateChoice={false}
          choices={users}
          optionValue="address"
          optionText="description"
          label="Champions"
        />
      </SimpleForm>
    </Edit>
  );
};

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
