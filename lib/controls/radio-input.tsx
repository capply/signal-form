import { batch, useComputed } from "@preact/signals-react";
import { forwardRef, useCallback } from "react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";
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
    let isChecked = useComputed(() => {
      return field.data.value?.toString() === value.toString();
    });

    let onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onChange?.(e);
        batch(() => {
          field.setData(value);
          field.setTouched();
        });
      },
      []
    );

    return (
      <input
        type="radio"
        ref={ref}
        {...props}
        name={field.name}
        checked={isChecked.value}
        onChange={onChangeHandler}
        value={value}
      />
    );
  }
);
