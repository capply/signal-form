import { batch } from "@preact/signals-react";
import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<string>(name, { defaultValue: "" });

    return (
      <textarea
        ref={ref}
        {...props}
        name={field.name}
        value={field.data as any}
        onChange={(e) => {
          onChange?.(e);
          batch(() => {
            field.setData(e.target.value);
            field.setTouched();
          });
        }}
      />
    );
  }
);
