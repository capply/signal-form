import type { StoryObj, Meta } from "@storybook/react";

import { Input, SignalForm } from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { useField } from "~/use-field";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Example/SignalForm",
  component: SignalForm,
  decorators: [createRemixStoryDecorator()],
  render() {
    let name = useField<string>("name");
    return (
      <SignalForm>
        <Input name="name" />
        <p style={{ color: "white" }}>{name.data.value}</p>
      </SignalForm>
    );
  },
} satisfies Meta<typeof SignalForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
};
