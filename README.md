# signal-form

Powerful form library for React/Remix using Signals

When building forms with React, especially in Remix applications, we want to have great performance, while also making it easy to build dynamic forms which react to user input and adapt to changes. These goals are seemingly at odds with each other. ReactHookForms and its derivatives, such as RemixValidatedForm tried to solve the performance problem by not storing the current form state in React state, instead opting for a DOM-based approach, where form components are generally uncontrolled. This works great for cases where forms are mostly static, but it become quite complicated when forms are dynamic.

With Signals, powered by the fantastic @preact/signal-react implementation, we can have our cake and eat it too! Blazing fast forms with surgical precision rerenders, combined with all state being easily accessible and all form fields being controlled. This finally allows us to build forms that are both fast in terms of render performance and so powerful that we can react to any change in the form.

## Installation

```
npm install signal-form
```

## Getting started

This is how you build a basic form with signal-form:

```tsx
import { SignalForm, Input, CheckBoxInput } from "signal-form";

export function UserForm(): JSX.Element {
  return (
    <SignalForm>
      <label>
        First name: <Input name="firstName" />
      </label>
      <label>
        Last name: <Input name="lastName" />
      </label>
      <label>
        Email: <Input name="email" />
      </label>
      <label>
        Admin <CheckBoxInput name="isAdmin" />
      </label>
    </SignalForm>
  );
}
```

As you can see, signal-form ships with some basic components for form elements. These are thin wrappers around the `input`, `select` and `textarea` tags respectively. You can create your own field components which wrap these to add more advanced capabilities for your fields, but you can also use these components directly.

## Adding a schema

Forms can be automatically validated by defining a schema using yup. Unlike with remix-validated-form, the schema is optional.

```tsx
import { SignalForm, Input, CheckBoxInput, schema } from "signal-form";

const Schema = schema.object().shape({
  firstName: schema.string().required(),
  lastName: schema.string().required(),
  email: schema.string(),
  lastName: schema.boolean(),
});

export function UserForm(): JSX.Element {
  return (
    <SignalForm schema={Schema}>
      <label>
        First name: <Input name="firstName" />
      </label>
      <label>
        Last name: <Input name="lastName" />
      </label>
      <label>
        Email: <Input name="email" />
      </label>
      <label>
        Admin <CheckBoxInput name="isAdmin" />
      </label>
    </SignalForm>
  );
}
```

Note that we're importing `schema` from `signal-form`, rather than using `yup` directly. This is a thin wrapper around `yup` that sets up some transforms which make the schema work better with form data.

## Nested objects

You can set up nested object structures by using the `FieldsFor` component:

```tsx
import { signalform, input, fieldsfor, schema } from "signal-form";

const schema = schema.object().shape({
  title: schema.string().required(),
  author: schema.object().shape({
    firstname: schema.string().required(),
    lastname: schema.string().required(),
  }),
});

export function postform(): jsx.element {
  return (
    <signalform schema={schema}>
      <label>
        title: <input name="title" />
      </label>
      <fieldsfor name="author">
        <label>
          first name: <input name="firstname" />
        </label>
        <label>
          last name: <input name="lastname" />
        </label>
      </fieldsfor>
    </signalform>
  );
}
```

Note that the `name` attribute of the `firstName` and `lastName` fields will be `author.firstName` and `author.lastName` respectively.

## Arrays

You can also use the `FieldsForArray` helper to add multiple rows to a form.
signal-form ships with the `AddButton` and `RemoveButton` helpers which wrap the
`button` element to add and remove items in the array, but you can also create
your own components to add/remove elements.

```tsx
import {
  SignalForm,
  Input,
  FieldsForArray,
  AddButton,
  RemoveButton,
  schema,
} from "signal-form";

const Schema = schema.object().shape({
  title: schema.string().required(),
  authors: schema.array().of(
    schema.object().shape({
      firstName: schema.string().required(),
      lastName: schema.string().required(),
    })
  ),
});

export function PostForm(): JSX.Element {
  return (
    <SignalForm schema={Schema}>
      <label>
        Title: <Input name="title" />
      </label>
      <FieldsForArray name="authors">
        <label>
          First name: <Input name="firstName" />
        </label>
        <label>
          Last name: <Input name="lastName" />
        </label>
        <RemoveButton>Remove author</RemoveButton>
      </FieldsForArray>
      <AddButton>Add author</AddButton>
    </SignalForm>
  );
}
```

## Fields

So far, we've been using the built in components of signal-form to construct
forms. If you're building your own field component, we encourage you to use
these components internally as well.

```tsx
import { Input, FieldErrors } from "signal-form";
import { useId } from "react";

type TextFieldProps = {
  name: string;
  label: string;
}

export function TextField({ name, label }: TextFieldProps): JSX.Element {
  let fieldId = useId();
  return (
    <p>
      <label htmlFor={fieldId}>{label}</label>
      <Input name={name} id={fieldId}>
      <FieldErrors name={name}>
    </p>
  );
}
```

The reason this is preferable to using the `input` element directly is for
performance. By using the `Input` helper, the whole field does not need to be
rerendered when the value of the field changes.

But to understand signal-form a bit better, let's look at how we would build
this same field component using the `useField` hook:

```tsx
import { useField } from "signal-form";
import { useId } from "react";

type TextFieldProps = {
  name: string;
  label: string;
};

export function TextField({ name, label }: TextFieldProps): JSX.Element {
  let field = useField(name);
  return (
    <p>
      <label htmlFor={fieldId}>{label}</label>
      <input
        name={field.name}
        value={field.value.value}
        onChange={(e) => {
          field.setTouched();
          field.setValue(e.target.value);
        }}
      />
      {field.errors.value.map((error, index) => (
        <p key={index}>{error.message}</p>;
      ))}
    </p>
  );
}
```

Let's unpack this a bit. The `useField` hook returns an object which allows you
to both read and write data, as well as get access to the error messages of the
field, if it has a schema.

Both `value` and `errors` are signals. If you don't know what a signal is,
please review this excellent blog post by the Preact team. To access the value
of these signals we need to access the `.value` property on them, this also
subscribes our `TextField` component to any changes to these signals, and it
will rerender if their values change.

If you're familiar with signals,
