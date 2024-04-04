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
  select: <T extends string>(options: readonly T[], message?: string) =>
    yup.mixed<T>().oneOf(options, message),
  selectMultiple: <T extends string>(options: readonly T[], message?: string) =>
    yup
      .array()
      .of(yup.mixed<T>().required())
      .ensure()
      .test({
        name: "oneOf",
        message:
          message ||
          `must be one of the following values: ${options.join(", ")}`,
        test: (value) => (value || []).every((v) => v && options.includes(v)),
      }),
  radioButton: <T extends string>(options: readonly T[]) =>
    yup.mixed<T>().oneOf(options),
};
