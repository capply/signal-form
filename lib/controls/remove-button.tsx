import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { useFieldsArrayRow } from "~/fields-array-for";

export type RemoveButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const RemoveButton = forwardRef<HTMLButtonElement, RemoveButtonProps>(
  ({ onClick, ...props }, ref) => {
    let row = useFieldsArrayRow();

    return (
      <button
        type="button"
        ref={ref}
        {...props}
        onClick={(e) => {
          onClick?.(e);
          row.remove();
        }}
      />
    );
  }
);
