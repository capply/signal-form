import { batch } from "signals-react-safe";
import { forwardRef, useCallback, useEffect } from "react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";
import { useField, useFieldData } from "~/use-field";
import { useForwardedRef } from "~/utils/use-forwarded-ref";

export type CheckBoxInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  name: string;
  onAfterChange?: ChangeEventHandler<HTMLInputElement>;
};

export const CheckBoxInput = forwardRef<HTMLInputElement, CheckBoxInputProps>(
  ({ name, onChange, onAfterChange, ...props }, forwardedRef) => {
    let field = useField(name);
    let value = useFieldData<boolean>(name, false);
    let ref = useForwardedRef(forwardedRef);

    useEffect(() => {
      if (ref.current) {
        field.setData(ref.current.checked);
      }
    }, []);

    let onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
      (e) => {
        onChange?.(e);
        if (!e.isDefaultPrevented()) {
          batch(() => {
            field.setData(e.target.checked);
            field.setTouched();
          });
        }
        onAfterChange?.(e);
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
          checked={value}
          onChange={onChangeHandler}
          value="true"
        />
        <input type="hidden" name={field.name} value="false" />
      </>
    );
  }
);
