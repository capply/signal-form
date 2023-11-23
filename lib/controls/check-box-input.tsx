import { batch } from "@preact/signals-react";
import { forwardRef, useCallback } from "react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type CheckBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  name: string;
};

export const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<boolean>(name, { defaultValue: false });

    let onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onChange?.(e);
        batch(() => {
          field.setData(e.target.checked);
          field.setTouched();
        });
      },
      []
    );

    return (
      <>
        <input
          type="checkbox"
          ref={ref}
          {...props}
          name={field.name}
          checked={field.data.value}
          onChange={onChangeHandler}
          value="true"
        />
        <input type="hidden" name={field.name} value="false" />
      </>
    );
  }
);
