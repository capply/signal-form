import { batch } from "@preact/signals-react";
import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
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
        value={field.data.value || ""}
        onChange={(e) => {
          onChange?.(e);
          batch(() => {
            field.setData(e.target.value);
            field.setTouched();
          });
        }}
      />
    );
  }
);
