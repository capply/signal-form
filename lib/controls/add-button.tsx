import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useFieldsArray } from "~/use-fields-array";

export type AddButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  name: string;
  data?: any;
};

export const AddButton = forwardRef<HTMLButtonElement, AddButtonProps>(
  ({ name, data, onClick, ...props }, ref) => {
    let array = useFieldsArray<string>(name);

    return (
      <button
        type="button"
        ref={ref}
        {...props}
        onClick={(e) => {
          onClick?.(e);
          array.push(data || {});
        }}
      />
    );
  }
);
