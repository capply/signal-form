import type { StoryObj, Meta } from "@storybook/react";

import {
  AddButton,
  FieldsArrayFor,
  Input,
  SignalForm,
  useField,
  useFieldsContext,
} from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { useComputed, useSignalEffect } from "@preact/signals-react";

const meta = {
  title: "SignalForm/Input",
  component: SignalForm,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof SignalForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Calculated: Story = {
  render() {
    function FullName(): JSX.Element {
      let firstName = useField<string>("firstName");
      let lastName = useField<string>("lastName");

      let fullName = useComputed(() => {
        return [firstName.data.value, lastName.data.value]
          .filter(Boolean)
          .join(" ");
      });

      return (
        <p>
          <label>
            Full name: <Input readOnly name="fullName" value={fullName} />
          </label>
        </p>
      );
    }

    return (
      <SignalForm
        defaultData={{ color: "blue", size: 0, beatle: "paul", isActive: true }}
      >
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
        <FullName />
      </SignalForm>
    );
  },
};

export const Duplicate: Story = {
  render() {
    return (
      <SignalForm
        defaultData={{ color: "blue", size: 0, beatle: "paul", isActive: true }}
      >
        <p>
          <label>
            Name: <Input name="name" />
          </label>
        </p>
        <p>
          <label>
            Name: <Input name="name" />
          </label>
        </p>
      </SignalForm>
    );
  },
};

type Row = {
  amount: number;
};

export const Reactive: Story = {
  render() {
    function Fields(): JSX.Element {
      let context = useFieldsContext();

      useSignalEffect(() => {
        let rows: Row[] = context.data.value.rows || [];
        let total = rows
          .map((r) => Number(r.amount) || 0)
          .reduce((a, b) => a + b, 0);
        context.setValue("total", total);
      });
      return (
        <>
          <ul>
            <FieldsArrayFor name="rows">
              <li>
                <Input name="amount" type="number" />
              </li>
            </FieldsArrayFor>
          </ul>
          <AddButton name="rows" data={{ amount: 0 }}>
            Add row
          </AddButton>
          <p>
            <label>Total:</label>
          </p>
          <p>
            <Input name="total" readOnly />
          </p>
        </>
      );
    }
    return (
      <SignalForm defaultData={{ rows: [{ amount: 0 }] }}>
        <Fields />
      </SignalForm>
    );
  },
};
