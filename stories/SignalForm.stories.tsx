import type { StoryObj, Meta } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";

import {
  CheckBoxInput,
  FieldsArrayFor,
  FieldsFor,
  Input,
  RadioInput,
  Select,
  Form,
  TextArea,
  schema,
  useFormContextData,
} from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { RemoveButton } from "~/controls/remove-button";
import { AddButton } from "~/controls/add-button";
import { useSignal, useSignalValue } from "signals-react-safe";
import { FieldErrors } from "~/controls/field-errors";

function FormValues(): JSX.Element {
  let data = useFormContextData();
  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "SignalForm/SignalForm",
  component: Form,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <Form
        defaultData={{ color: "blue", size: 0, beatle: "paul", isActive: true }}
      >
        <p>
          <label>
            Title: <Input name="title" />
          </label>
        </p>
        <p>
          <label>
            Price: <Input name="price" type="number" />
          </label>
        </p>
        <p>
          <label>
            <CheckBoxInput name="isActive" /> Active
          </label>
        </p>
        <p>
          <label>
            <RadioInput name="color" value="red" /> Red
          </label>
        </p>
        <p>
          <label>
            <RadioInput name="color" value="green" /> Green
          </label>
        </p>
        <p>
          <label>
            <RadioInput name="color" value="blue" /> Blue
          </label>
        </p>
        <p>
          <label>
            <Input name="size" type="range" min={0} max={100} /> Size
          </label>
        </p>
        <p>
          <label>
            <Select name="beatle">
              <option value="john">John</option>
              <option value="paul">Paul</option>
              <option value="george">George</option>
              <option value="ringo">Ringo</option>
            </Select>
          </label>
        </p>
        <p>
          <label>
            Notes:
            <br />
            <TextArea name="notes" />
          </label>
        </p>
        <FormValues />
      </Form>
    );
  },
};

export const Nested: Story = {
  render() {
    return (
      <Form>
        <p>
          <label>
            Title: <Input name="title" />
          </label>
        </p>
        <FieldsFor name="author">
          <p>
            <label>
              First name: <Input name="firstName" />
            </label>
          </p>
          <p>
            <label>
              Last name: <Input name="lastName" />
            </label>
          </p>
        </FieldsFor>
        <FormValues />
      </Form>
    );
  },
};

export const Array: Story = {
  render() {
    return (
      <Form>
        <p>
          <label>
            Title: <Input name="title" />
          </label>
        </p>
        <FieldsArrayFor name="authors">
          <p>
            <label>
              First name: <Input name="firstName" />
            </label>
          </p>
          <p>
            <label>
              Last name: <Input name="lastName" />
            </label>
          </p>
          <RemoveButton>Remove author</RemoveButton>
          <hr />
        </FieldsArrayFor>
        <AddButton name="authors">Add author</AddButton>
        <FormValues />
      </Form>
    );
  },
};

export const Controlled: Story = {
  render() {
    let formData = useSignal({ title: "Monkey" });

    function ShowTitle() {
      let data = useSignalValue(formData);
      return <>{data.title}</>;
    }

    return (
      <>
        <Form data={formData}>
          <p>
            <label htmlFor="title">Title</label>
            <Input name="title" id="title" />
          </p>
        </Form>
        <p>
          <button
            type="button"
            onClick={() =>
              (formData.value = { title: formData.value.title?.toUpperCase() })
            }
          >
            Uppercase
          </button>
        </p>
        <p>
          Hello <ShowTitle />
        </p>
      </>
    );
  },
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);
    await canvas.findByText("Hello Monkey");
    let titleInput = await canvas.findByLabelText("Title");

    userEvent.clear(titleInput);
    await canvas.findByText("Hello");

    await userEvent.type(titleInput, "Theodore", { delay: 10 });

    await canvas.findByText("Hello Theodore");

    let uppercaseButton = await canvas.findByText("Uppercase", {
      selector: "button",
    });

    userEvent.click(uppercaseButton);

    await canvas.findByText("Hello THEODORE");
  },
};

export const Schema: Story = {
  render() {
    let Schema = schema.object().shape({
      firstName: schema.textField().required(),
      lastName: schema.textField().required(),
      beatle: schema.select(["john", "paul", "george"]),
      email: schema.textField(),
      isAdmin: schema.checkBox(),
    });

    function Result(): JSX.Element {
      let data = useFormContextData();

      return <div data-testid="result">{JSON.stringify(data)}</div>;
    }

    return (
      <Form schema={Schema}>
        <p>
          <label htmlFor="firstName">First name</label>
          <Input name="firstName" id="firstName" />
          <FieldErrors name="firstName" />
        </p>
        <p>
          <label htmlFor="lastName">Last name</label>
          <Input name="lastName" id="lastName" />
          <FieldErrors name="lastName" />
        </p>
        <p>
          <label htmlFor="email">Email</label>
          <Input name="email" id="email" />
          <FieldErrors name="email" />
        </p>
        <p>
          <label htmlFor="beatle">Favorite Beatle</label>
          <Select name="beatle" id="beatle">
            <option value="john">John</option>
            <option value="paul">Paul</option>
            <option value="george">George</option>
            <option value="ringo">Ringo</option>
          </Select>
          <FieldErrors name="beatle" />
        </p>
        <p>
          <CheckBoxInput name="isAdmin" id="isAdmin" />
          <label htmlFor="isAdmin">Admin</label>
          <FieldErrors name="isAdmin" />
        </p>

        <Result />
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);

    let firstNameInput = await canvas.findByLabelText("First name");
    await userEvent.type(firstNameInput, "Theodore", { delay: 10 });

    let lastNameInput = await canvas.findByLabelText("Last name");
    await userEvent.type(lastNameInput, "Theosson", { delay: 10 });

    let adminField = await canvas.findByLabelText("Admin");
    await userEvent.click(adminField);

    let beatleField = await canvas.findByLabelText("Favorite Beatle");
    await userEvent.selectOptions(beatleField, "Ringo");
    await canvas.findByText(
      "beatle must be one of the following values: john, paul, george"
    );
    await userEvent.selectOptions(beatleField, "John");

    userEvent.clear(lastNameInput);

    await canvas.findByText("lastName is a required field");

    await userEvent.type(lastNameInput, "Bjarnesson", { delay: 10 });

    let resultDiv = await canvas.findByTestId("result");

    let formValues = JSON.parse(resultDiv.textContent || "{}");

    expect(formValues.firstName).toEqual("Theodore");
    expect(formValues.lastName).toEqual("Bjarnesson");
    expect(formValues.beatle).toEqual("john");
    expect(formValues.isAdmin).toEqual(true);
  },
};
