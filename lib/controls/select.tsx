import { batch } from "@preact/signals-react";
import { forwardRef, useCallback } from "react";
import type { ChangeEventHandler, SelectHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<string>(name, { defaultValue: "" });

    let onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
      (e) => {
        onChange?.(e);
        batch(() => {
          field.setData(e.target.value);
          field.setTouched();
        });
      },
      []
    );

    return (
      <select
        ref={ref}
        {...props}
        name={field.name}
        value={field.data.value}
        onChange={onChangeHandler}
      />
    );
  }
);
