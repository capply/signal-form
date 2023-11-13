import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type RadioInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  name: string;
  value: string;
};

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ name, value, onChange, ...props }, ref) => {
    let field = useField<string>(name);

    return (
      <input
        type="radio"
        ref={ref}
        {...props}
        name={field.name}
        checked={field.value.value?.toString() === value.toString()}
        onChange={(e) => {
          onChange?.(e);
          field.setValue(value);
          field.setTouched();
        }}
        value={value}
      />
    );
  }
);
