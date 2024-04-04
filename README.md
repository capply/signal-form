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

Forms can be automatically validated by defining a schema using [yup][]. Unlike
with remix-validated-form, the schema is optional.

```tsx
import { SignalForm, Input, CheckBoxInput, schema } from "signal-form";

const Schema = schema.object().shape({
  firstName: schema.textField().required(),
  lastName: schema.textField().required(),
  email: schema.textField(),
  isAdmin: schema.checkBox(),
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

Note that we're importing `schema` from `signal-form`. The `schema` object
contains both all schema methods from [yup][], such as `object` and `string`,
but also has additional methods such as `textField` and `checkBox` which have
additional transforms to make working with the schemas more convenient.

Currently only [yup][] is supported as a schema validation library, alternative such
as [zod][] are not supported.

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

But to understand signal-form a bit better, let's look at how we could build
a simplified version of the same field component using the `useField` hook:

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
        value={field.data.value}
        onChange={(e) => {
          field.setData(e.target.value);
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

Both `data` and `errors` are signals. If you don't know what a signal is,
please review this excellent blog post by the Preact team. To access the value
of these signals we need to access the `.value` property on them, this also
subscribes our `TextField` component to any changes to these signals, and it
will rerender if their values change.

## Form context

If you're used to working with signals, you might be confused by the fact that
we need to call `setData` rather than writing to the value to the `data` signal
directly. This is because all state of the form is actually stored in the form
context, and `data` is a computed signal which derives its data from the form
context. Let's look at accessing the form context directly:

```tsx
import { useFormContext } from "signal-form";

export function FormData(): JSX.Element {
  let context = useFormContext(name);
  return <pre>{JSON.stringify(context.data.value, null, 2)}</pre>;
}
```

This simple component will print out all data that is stored in the form.

Since the `data` attribute of the form context is a signal, accessing `.value`
on it both gets the current form data, but also subscribes the component to
rerender if any of the data changes.

## Dynamic forms

Let's look at how we can use the form context to combine the first and last name to dynamically print the full name:

```tsx
import { SignalForm, useFormContext } from "signal-form";
import { TextField } from "./text-field" // our text field implementation from earlier

function FullName(): JSX.Element {
    let context = useFormContext();

    let { firstName, lastName = } = context.data.value;
    let fullName = [firstName, lastName].filter(Boolean).join(" ");

    return <p>Full name: {fullName}</p>;
}

export function UserForm(): JSX.Element {
  return (
    <SignalForm>
        <TextField name="firstName" label="First name"/>
        <TextField name="lastName" label="Last name"/>
        <FullName/>
    </SignalForm>
  );
}
```

Here we're using the `useFormContext` hook to grab the form context and extract
the first and last names from it, we then combine them into the full name and
print them out.

This implementation works great, but it is not optimal from a performance
perspective. _Any_ change to the form will cause the `FullName` component to
rerender, even if the `firstName` and `lastName` fields are unchanged. Right now
our form is small, so it probably doesn't matter. But as we build more
complicated forms, we probably want to be a bit more conservative. Thankfully we
can use the power of signals to improve the render performance of this component
a lot!

```tsx
import { useComputed } from "@preact/signals-react";

function FullName(): JSX.Element {
    let context = useFormContext();

    let fullName = useComputed(() => {
        let { firstName, lastName = } = context.data.value;
        return [firstName, lastName].filter(Boolean).join(" ");
    });

    return <p>Full name: {fullName}</p>;
}
```

First we're creating a computed signal using the `useComputed` hook. When we
render the signal like this into a text node directly, the value of the text
node is bound to the signal directly. In fact this component never re-renders,
even when the first and last name are changed!

## Fields context

Form context always gives us the full data of the entire form. But what if we
used the `FieldsFor` helper to create a nested object. If we used form context
here, we would have to reach into the `author` object to make this work:

```tsx
import { SignalForm, useFormContext } from "signal-form";
import { TextField } from "./text-field" // our text field implementation from earlier

function FullName(): JSX.Element {
    let context = useFormContext();

    let { firstName, lastName = } = context.data.value?.author;
    let fullName = [firstName, lastName].filter(Boolean).join(" ");

    return <p>Full name: {fullName}</p>;
}

export function UserForm(): JSX.Element {
  return (
    <SignalForm>
        <FieldsFor name="author">
            <TextField name="firstName" label="First name"/>
            <TextField name="lastName" label="Last name"/>
            <FullName/>
        </FieldsFor>
    </SignalForm>
  );
}
```

This is a bit inconvenient, since the `FullName` component needs to be aware of
the fact that it's a chilf of a `FieldsFor` component.

This is where the `useFieldsContext` hook comes in. It works similarly to `useFormContext` but gives us the current context instead:

```tsx
import { SignalForm, useFieldsContext } from "signal-form";
import { TextField } from "./text-field" // our text field implementation from earlier

function FullName(): JSX.Element {
    let context = useFieldsContext();

    let { firstName, lastName = } = context.data.value;
    let fullName = [firstName, lastName].filter(Boolean).join(" ");

    return <p>Full name: {fullName}</p>;
}

export function UserForm(): JSX.Element {
  return (
    <SignalForm>
      <FieldsFor name="author">
        <TextField name="firstName" label="First name"/>
        <TextField name="lastName" label="Last name"/>
        <FullName/>
      </FieldsFor>
    </SignalForm>
  );
}
```

Now our `FullName` component is more reuseable than before! We could even use it
in an array without making any changes to it!

```tsx
import { FullName } from "./full-name"; // same implementation

export function PostForm(): JSX.Element {
  return (
    <SignalForm schema={Schema}>
      <TextField name="title" label="Title" />
      <FieldsForArray name="authors">
        <TextField name="firstName" label="First name" />
        <TextField name="lastName" label="Last name" />
        <FullName />
        <RemoveButton>Remove author</RemoveButton>
      </FieldsForArray>
      <AddButton>Add author</AddButton>
    </SignalForm>
  );
}
```

[yup]: https://github.com/jquense/yup
[zod]: https://zod.dev
