import { batch, useComputedValue } from "signals-react-safe";
import { forwardRef, useCallback, useEffect } from "react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";
import { useField } from "~/use-field";
import { useForwardedRef } from "~/utils/use-forwarded-ref";

export type RadioInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  name: string;
  value: string;
  onAfterChange?: ChangeEventHandler<HTMLInputElement>;
};

export const RadioInput = forwardRef<HTMLInputElement, RadioInputProps>(
  ({ name, value, onChange, onAfterChange, ...props }, forwardedRef) => {
    let field = useField<string>(name);
    let isChecked = useComputedValue(() => {
      return field.data.value?.toString() === value.toString();
    });

    let ref = useForwardedRef(forwardedRef);

    useEffect(() => {
      if (ref.current?.checked) {
        field.setData(ref.current.value);
      }
    }, []);

    let onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onChange?.(e);
        if (!e.isDefaultPrevented()) {
          batch(() => {
            field.setData(value);
            field.setTouched();
          });
        }
        onAfterChange?.(e);
      },
      []
    );

    return (
      <input
        type="radio"
        ref={ref}
        {...props}
        name={field.name}
        checked={isChecked}
        onChange={onChangeHandler}
        value={value}
      />
    );
  }
);
