import type { StoryObj, Meta } from "@storybook/react";

import {
  CheckBoxInput,
  FieldsArrayFor,
  FieldsFor,
  Input,
  RadioInput,
  Select,
  SignalForm,
  TextArea,
  useFormContext,
} from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { RemoveButton } from "~/controls/remove-button";
import { AddButton } from "~/controls/add-button";

function FormValues(): JSX.Element {
  let form = useFormContext();
  return <pre>{JSON.stringify(form.data.value, null, 2)}</pre>;
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Example/SignalForm",
  component: SignalForm,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof SignalForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    return (
      <SignalForm
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
      </SignalForm>
    );
  },
};

export const Nested: Story = {
  render() {
    return (
      <SignalForm>
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
      </SignalForm>
    );
  },
};

export const Array: Story = {
  render() {
    return (
      <SignalForm>
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
      </SignalForm>
    );
  },
};
