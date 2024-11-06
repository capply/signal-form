import type { ReadonlySignal } from "signals-react-safe";
import { batch, useComputedValue } from "signals-react-safe";
import { forwardRef, useCallback, useEffect } from "react";
import type { ChangeEventHandler, InputHTMLAttributes } from "react";
import { useField } from "~/use-field";
import { useForwardedRef } from "../utils/use-forwarded-ref";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value"
> & {
  name: string;
  value?: string | ReadonlySignal<string>;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ name, value, onChange, ...props }, forwardedRef) => {
    let field = useField<string>(name);
    let ref = useForwardedRef(forwardedRef);

    useEffect(() => {
      if (ref.current) {
        field.setData(ref.current.value);
      }
    }, []);

    let valueResult = useComputedValue<string>(() => {
      if (typeof value === "string") {
        return value;
      } else if (value) {
        return value.value;
      } else {
        return field.data.value || "";
      }
    });

    let onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
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
      <input
        ref={ref}
        {...props}
        name={field.name}
        value={valueResult}
        onChange={onChangeHandler}
      />
    );
  }
);
