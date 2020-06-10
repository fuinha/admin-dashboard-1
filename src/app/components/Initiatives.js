// @flow
import React from "react";
import {users, activities, project} from "../graph";
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
  regex,
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
  const initiatives = activities.filter((a) =>
    /\u0000sourcecred\u0000initiatives\u0000initiative\u0000/.test(a.address)
  );
  return (
    <Edit title={`Edit Initiative: ${props.id}`} {...props}>
      <SimpleForm>
        <TextInput label="Title" source="title" />
        <DateInput label="Date" source="timestampIso" />
        <NumberInput
          label="Weight While Incomplete"
          source="weight.incomplete"
        />
        <NumberInput label="Weight When Completed" source="weight.complete" />
        <BooleanInput label="Completed" source="completed" />
        <AutocompleteArrayInput
          source="champions"
          format={userTextFinder}
          allowDuplicates={false}
          translateChoice={false}
          choices={users}
          optionValue="address"
          optionText="description"
          label="Champions"
          suggestionLimit={10}
        />
        <AutocompleteArrayInput
          source="dependencies"
          format={initiativeFinder(initiatives)}
          allowDuplicates={false}
          translateChoice={false}
          choices={initiatives}
          parse={(v) => {
            v = {entries: v};
            return v;
          }}
          optionValue="address"
          optionText="description"
          label="Dependencies"
          suggestionLimit={10}
        />
        <AutocompleteArrayInput
          source="references"
          allowDuplicates={false}
          translateChoice={false}
          choices={activities}
          format={activityFinder}
          parse={(v) => {
            v = {entries: v};

            return v;
          }}
          optionValue="address"
          optionText="description"
          label="References"
          suggestionLimit={10}
        />
        <ArrayInput label="Contributions" source="contributions.entries">
          <SimpleFormIterator>
            <TextInput label="Contribution Name" source="title" />
            <DateInput label="Date" source="timestampIso" />
            <NumberInput label="Weight" source="weight" />
            <AutocompleteArrayInput
              source="contributors"
              parse={(v) => {
                return v;
              }}
              format={userTextFinder}
              allowDuplicates={false}
              translateChoice={false}
              choices={users}
              optionValue="address"
              optionText="description"
              label="Contributors"
              suggestionLimit={10}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Edit>
  );
};

export const InitiativeCreate = (props: Object) => {
  const initiatives = activities.filter((a) =>
    /\u0000sourcecred\u0000initiatives\u0000initiative\u0000/.test(a.address)
  );
  return (
    <Create title="Create New Initiative" {...props}>
      <SimpleForm>
        <TextInput label="File Name" source="id" validate={validateFilename} />
        <TextInput label="Title" source="title" />
        <DateInput label="Date" source="timestampIso" />
        <NumberInput
          label="Weight While Incomplete"
          source="weight.incomplete"
        />
        <NumberInput label="Weight When Completed" source="weight.complete" />
        <BooleanInput label="Completed" source="completed" />
        <AutocompleteArrayInput
          source="champions"
          format={userTextFinder}
          allowDuplicates={false}
          translateChoice={false}
          choices={users}
          optionValue="address"
          optionText="description"
          label="Champions"
          suggestionLimit={10}
        />
        <AutocompleteArrayInput
          source="dependencies"
          format={initiativeFinder(initiatives)}
          allowDuplicates={false}
          translateChoice={false}
          choices={initiatives}
          parse={(v) => {
            v = {entries: v};
            return v;
          }}
          optionValue="address"
          optionText="description"
          label="Dependencies"
          suggestionLimit={10}
        />
        <AutocompleteArrayInput
          source="references"
          allowDuplicates={false}
          translateChoice={false}
          choices={activities}
          format={activityFinder}
          parse={(v) => {
            v = {entries: v};
            return v;
          }}
          optionValue="address"
          optionText="description"
          label="References"
          suggestionLimit={10}
        />
        <ArrayInput label="Contributions" source="contributions.entries">
          <SimpleFormIterator>
            <TextInput label="Contribution Name" source="title" />
            <DateInput label="Date" source="timestampIso" />
            <NumberInput label="Weight" source="weight" />
            <AutocompleteArrayInput
              source="contributors"
              parse={(v) => {
                return v;
              }}
              format={userTextFinder}
              allowDuplicates={false}
              translateChoice={false}
              choices={users}
              optionValue="address"
              optionText="description"
              label="Contributors"
              suggestionLimit={10}
            />
          </SimpleFormIterator>
        </ArrayInput>
      </SimpleForm>
    </Create>
  );
};

const validateFilename = regex(
  /^[a-z0-9-]+.json$/,
  "File names can only contain lowercase letters, dashes and the '.json' file extension"
);

// hacky temporary solution to implementing the url resolver in the frontend
const userTextFinder = (v) => {
  if (!v) v = [];
  let resolvedV = [...v];

  v.forEach((c, idx) => {
    if (/^http/.test(c)) {
      const splitUrl = c.split("/");
      let resolvedUser = users.find((u) => u.description.includes(c));
      if (resolvedUser) {
        resolvedV[idx] = resolvedUser.address;
        return;
      }
      const {identities} = project[1];
      const resolvedIdentity = identities.find(({username, aliases}) =>
        aliases.find((a) => a.includes(splitUrl[splitUrl.length - 1]))
      );
      if (resolvedIdentity) {
        let resolvedUser = users.find((u) =>
          u.description.includes(resolvedIdentity.username)
        );
        resolvedV[idx] = resolvedUser.address;
        return;
      }

      let fuzzyResolvedUser = users.find((u) =>
        u.description.includes(splitUrl[splitUrl.length - 1])
      );

      if (fuzzyResolvedUser) {
        resolvedV[idx] = fuzzyResolvedUser.address;
        return;
      }
    }
  });
  return resolvedV;
};

const initiativeFinder = (initiatives) => (v) => {
  if (!v) v = {};
  if (!v.urls) v.urls = [];
  if (!v.entries) v.entries = [];
  v.urls.forEach((url) => {
    const shapedUrl = initiatives.find((i) => i.address.includes(url));
    if (shapedUrl) v.entries.push(shapedUrl);
  });
  return v.entries;
};

const activityFinder = (v) => {
  if (!v) v = {};
  if (!v.urls) v.urls = [];
  if (!v.entries) v.entries = [];
  v.urls.forEach((url) => {
    const shapedUrl = activities.find((i) => i.address.includes(url));
    if (shapedUrl) v.entries.push(shapedUrl);
  });
  return v.entries;
};
