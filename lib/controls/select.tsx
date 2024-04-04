import { batch } from "@preact/signals-react";
import { forwardRef, useCallback } from "react";
import type { ChangeEventHandler, SelectHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ multiple, ...props }, ref) => {
    if (multiple) {
      return <MultipleSelect {...props} multiple ref={ref} />;
    } else {
      return <SingleSelect {...props} ref={ref} />;
    }
  }
);

export const SingleSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, multiple, onChange, ...props }, ref) => {
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
        multiple={multiple}
        ref={ref}
        {...props}
        name={field.name}
        value={field.data.value}
        onChange={onChangeHandler}
      />
    );
  }
);

export const MultipleSelect = forwardRef<HTMLSelectElement, SelectProps>(
  ({ name, multiple, onChange, ...props }, ref) => {
    let field = useField<string[]>(name, { defaultValue: "" });

    let onChangeHandler: ChangeEventHandler<HTMLSelectElement> = useCallback(
      (e) => {
        onChange?.(e);
        batch(() => {
          field.setData(Array.from(e.target.selectedOptions, (o) => o.value));
          field.setTouched();
        });
      },
      []
    );

    return (
      <select
        multiple={multiple}
        ref={ref}
        {...props}
        name={field.name}
        value={field.data.value}
        onChange={onChangeHandler}
      />
    );
  }
);
