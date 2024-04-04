import * as yup from "yup";

export const schema = {
  ...yup,
  textField: () => yup.string().transform((v) => v || undefined),
  numberField: () => yup.number().transform((v) => (v ? Number(v) : undefined)),
  checkBox: () =>
    yup
      .boolean()
      .transform(
        (v) => !![v].flat().find((i) => [true, "on", "true"].includes(i))
      ),
  select: (options: string[]) => yup.string().oneOf(options),
  radioButton: (options: string[]) => yup.string().oneOf(options),
};
