import type { StoryObj, Meta } from "@storybook/react";
import { userEvent, within, expect } from "@storybook/test";

import { Select, Form, schema, useFormContext } from "~/index";
import { createRemixStoryDecorator } from "./utils/decorators";
import { FieldErrors } from "~/controls/field-errors";

const meta = {
  title: "SignalForm/Select",
  component: Form,
  decorators: [createRemixStoryDecorator()],
} satisfies Meta<typeof Form>;

export default meta;

type Story = StoryObj<typeof meta>;

function FormValues(): JSX.Element {
  let form = useFormContext();
  return (
    <pre data-testid="values">{JSON.stringify(form.data.value, null, 2)}</pre>
  );
}

export const Single: Story = {
  render() {
    let validPets = [
      "cat",
      "dog",
      "bird",
      "fish",
      "rabbit",
      "hamster",
    ] as const;

    let Schema = schema.object().shape({
      pet: schema.select(validPets, "that's not a pet!").required(),
    });

    return (
      <Form schema={Schema} defaultData={{ pet: "cat" }}>
        <p>
          <label htmlFor="pet">Pet</label>
        </p>
        <p>
          <Select name="pet" id="pet">
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="bird">Bird</option>
            <option value="fish">Fish</option>
            <option value="rabbit">Rabbit</option>
            <option value="hamster">Hamster</option>
            <option value="dinosaur">Dinosaur</option>
          </Select>
        </p>
        <FieldErrors name="pet" />
        <FormValues />

        <button type="submit">Submit</button>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);

    let petField = await canvas.findByLabelText("Pet");
    let valuesDiv = await canvas.findByTestId("values");

    expect(JSON.parse(valuesDiv.textContent!).pet).toEqual("cat");

    await userEvent.selectOptions(petField, "Bird");

    expect(JSON.parse(valuesDiv.textContent!).pet).toEqual("bird");

    await userEvent.selectOptions(petField, "Dinosaur");
    await canvas.findByText("that's not a pet!");
    await userEvent.click(canvasElement);
  },
};

export const SingleWithNoValue: Story = {
  render() {
    let Schema = schema.object().shape({
      pet: schema.string().required(),
    });

    return (
      <Form schema={Schema} defaultData={{}}>
        <p>
          <label htmlFor="pet">Pet</label>
        </p>
        <p>
          <Select name="pet" id="pet">
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="bird">Bird</option>
          </Select>
        </p>
        <FieldErrors name="pet" />
        <FormValues />

        <button type="submit">Submit</button>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);

    let petField = await canvas.findByLabelText("Pet");
    let valuesDiv = await canvas.findByTestId("values");

    expect(JSON.parse(valuesDiv.textContent!).pet).toEqual("cat");

    await userEvent.selectOptions(petField, "Bird");

    expect(JSON.parse(valuesDiv.textContent!).pet).toEqual("bird");
  },
};

export const Multiple: Story = {
  render() {
    let validPets = [
      "cat",
      "dog",
      "bird",
      "fish",
      "rabbit",
      "hamster",
    ] as const;

    let Schema = schema.object().shape({
      pets: schema
        .selectMultiple(validPets, "that's not a pet!")
        .required()
        .max(3, "cannot have more than three pets"),
    });

    return (
      <Form schema={Schema} defaultData={{ pets: ["cat", "dog"] }}>
        <p>
          <label htmlFor="pets">Pets</label>
        </p>
        <p>
          <Select name="pets" id="pets" multiple style={{ height: "10rem" }}>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="bird">Bird</option>
            <option value="fish">Fish</option>
            <option value="rabbit">Rabbit</option>
            <option value="hamster">Hamster</option>
            <option value="dinosaur">Dinosaur</option>
          </Select>
        </p>
        <FieldErrors name="pets" />
        <FormValues />

        <button type="submit">Submit</button>
      </Form>
    );
  },
  play: async ({ canvasElement }) => {
    let canvas = within(canvasElement);

    let petsField = await canvas.findByLabelText("Pets");
    let valuesDiv = await canvas.findByTestId("values");

    expect(JSON.parse(valuesDiv.textContent!).pets).toEqual(["cat", "dog"]);

    await userEvent.selectOptions(petsField, ["Bird", "Fish"]);

    await canvas.findByText("cannot have more than three pets");

    expect(JSON.parse(valuesDiv.textContent!).pets).toEqual([
      "cat",
      "dog",
      "bird",
      "fish",
    ]);

    await userEvent.deselectOptions(petsField, ["Cat", "Fish"]);
    expect(JSON.parse(valuesDiv.textContent!).pets).toEqual(["dog", "bird"]);

    await userEvent.selectOptions(petsField, ["Dinosaur"]);
    await canvas.findByText("that's not a pet!");
  },
};
