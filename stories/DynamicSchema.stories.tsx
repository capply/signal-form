import type { StoryObj, Meta } from "@storybook/react";

import { Input, Form, schema } from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { FieldErrors } from "~/controls/field-errors";
import { useState } from "react";
import { expect, userEvent, within } from "@storybook/test";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "SignalForm/DynamicSchema",
  component: Form,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof Form>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render() {
    let [required, setRequired] = useState(false);

    let Schema = schema.object().shape({
      title: required ? schema.string().required() : schema.string(),
    });

    return (
      <Form schema={Schema}>
        <p>
          <label>
            <input
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              type="checkbox"
            />
            Required title
          </label>
        </p>
        <p>
          <label>
            Title
            <br />
            <Input name="title" />
          </label>
        </p>
        <FieldErrors name="title" />
      </Form>
    );
  },
};

export const Test: Story = {
  ...Default,
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);

    let requiredCheckbox = await canvas.findByLabelText("Required title");
    let titleInput = await canvas.findByLabelText("Title");

    await userEvent.type(titleInput, "Hello", { delay: 10 });
    await userEvent.clear(titleInput);

    await expect(canvas.queryByText("title is a required field")).toBeNull();

    await userEvent.click(requiredCheckbox);

    await canvas.findByText("title is a required field");
    await userEvent.type(titleInput, "Hello", { delay: 10 });

    await expect(canvas.queryByText("title is a required field")).toBeNull();
  },
};
