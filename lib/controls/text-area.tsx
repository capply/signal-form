import { forwardRef } from "react";
import type { TextareaHTMLAttributes } from "react";
import { useField } from "~/use-field";

export type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  name: string;
};

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ name, onChange, ...props }, ref) => {
    let field = useField<string>(name);

    return (
      <textarea
        ref={ref}
        {...props}
        name={field.name}
        value={field.value.value || ""}
        onChange={(e) => {
          onChange?.(e);
          field.setValue(e.target.value);
          field.setTouched();
        }}
      />
    );
  }
);
