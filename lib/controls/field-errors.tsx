import { useField } from "~/use-field";

export type FieldErrorsProps = {
  name: string;
};

export function FieldErrors({ name }: FieldErrorsProps) {
  let field = useField(name);

  if (!field.touched.value || field.errors.value.length === 0) {
    return null;
  } else {
    return (
      <ul className="field-errors">
        {field.errors.value.map((error, index) => (
          <li key={index}>{error.message}</li>
        ))}
      </ul>
    );
  }
}
