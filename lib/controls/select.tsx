import { forwardRef } from "react";
import type { SelectHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<string>(name);

    return (
      <select
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
