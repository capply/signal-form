import type { StoryObj, Meta } from "@storybook/react";

import {
  AddButton,
  FieldsArrayFor,
  Input,
  Form,
  useField,
  useFieldsContext,
} from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { useComputed, useSignalEffect } from "signals-react-safe";

const meta = {
  title: "SignalForm/Input",
  component: Form,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof Form>;

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
      <Form
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
      </Form>
    );
  },
};

export const Duplicate: Story = {
  render() {
    return (
      <Form
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
      </Form>
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
      <Form defaultData={{ rows: [{ amount: 0 }] }}>
        <Fields />
      </Form>
    );
  },
};

export const Filtered: Story = {
  render() {
    return (
      <Form>
        <p>
          <label>
            Code:{" "}
            <Input name="name" filter={(v) => v.toUpperCase().slice(0, 6)} />
          </label>
        </p>
      </Form>
    );
  },
};
