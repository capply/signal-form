import { useFieldErrors, useFieldTouched } from "~/use-field";

export type FieldErrorsProps = {
  name: string;
};

export function FieldErrors({ name }: FieldErrorsProps) {
  let touched = useFieldTouched(name);
  let errors = useFieldErrors(name);

  if (!touched || errors.length === 0) {
    return null;
  } else {
    return (
      <ul className="field-errors">
        {errors.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    );
  }
}
