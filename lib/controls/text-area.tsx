import type { ReadonlySignal } from "signals-react-safe";
import { batch, useComputedValue } from "signals-react-safe";
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
  onAfterChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, value, onChange, onAfterChange, ...props }, forwardedRef) => {
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

    let onChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      (e) => {
        onChange?.(e);
        if (!e.isDefaultPrevented()) {
          batch(() => {
            field.setData(e.target.value);
            field.setTouched();
          });
        }
        onAfterChange?.(e);
      },
      []
    );

    return (
      <textarea
        ref={ref}
        {...props}
        name={field.name}
        value={valueResult}
        onChange={onChangeHandler}
      />
    );
  }
);
