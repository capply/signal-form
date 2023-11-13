import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";
import { useField } from "~/use-field";

type CheckBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  name: string;
};

export const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<boolean>(name);

    return (
      <>
        <input
          type="checkbox"
          ref={ref}
          {...props}
          name={field.name}
          checked={field.value.value || false}
          onChange={(e) => {
            onChange?.(e);
            field.setValue(e.target.checked);
            field.setTouched();
          }}
          value="true"
        />
        <input type="hidden" name={field.name} value="false" />
      </>
    );
  }
);
