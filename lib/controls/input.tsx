import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { useField } from "~/use-field";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<string>(name);

    return (
      <input
        ref={ref}
        {...props}
        name={field.name}
        value={field.value.value || ""}
        onChange={(e) => {
          onChange?.(e);
          field.setValue(e.target.value);
          field.setTouched();
        }}
      />
    );
  }
);
