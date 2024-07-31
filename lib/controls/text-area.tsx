import type { ReadonlySignal } from "@preact/signals-react";
import { batch, useComputed } from "@preact/signals-react";
import { forwardRef, useCallback, useEffect } from "react";
import type { ChangeEventHandler, TextareaHTMLAttributes } from "react";
import { useField } from "~/use-field";
import { useForwardedRef } from "~/utils/use-forwarded-ref";

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "value"
> & {
  name: string;
  value?: string | ReadonlySignal<string>;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, value, onChange, ...props }, forwardedRef) => {
    let field = useField<string>(name, { defaultValue: "" });
    let ref = useForwardedRef(forwardedRef);

    useEffect(() => {
      if (ref.current) {
        field.setData(ref.current.value);
      }
    }, []);

    let valueResult = useComputed(() => {
      if (typeof value === "string") {
        return value;
      } else if (value) {
        return value.value;
      } else {
        return field.data.value;
      }
    });

    let onChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
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
      <textarea
        ref={ref}
        {...props}
        name={field.name}
        value={valueResult.value}
        onChange={onChangeHandler}
      />
    );
  }
);
