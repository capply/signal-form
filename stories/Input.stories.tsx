import type { StoryObj, Meta } from "@storybook/react";

import { Input, SignalForm, useField } from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { useComputed } from "@preact/signals-react";

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
