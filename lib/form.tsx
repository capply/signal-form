import type { FormHTMLAttributes, ForwardedRef, ReactNode } from "react";
import { forwardRef, useId, useMemo } from "react";
import type { Signal } from "@preact/signals-react";
import type { AnyObjectSchema, InferType } from "yup";
import { FieldsContext, FormContext } from "~/context";
import type { ValidationError } from "~/utils/validate";
import { createFormContext } from "./create-form-context";
import type { DeepPartial } from "./utils/deep-partial";

export type FormProps<S extends AnyObjectSchema> = {
  children?: ReactNode;
  schema?: S;
  defaultData?: DeepPartial<InferType<S>>;
  data?: Signal<InferType<S>>;
  submittedData?: DeepPartial<InferType<S>>;
  submittedErrors?: ValidationError[];
} & FormHTMLAttributes<HTMLFormElement>;

export const Form = forwardRef(
  <S extends AnyObjectSchema>(
    {
      children,
      schema,
      defaultData,
      data,
      id,
      onSubmit,
      submittedData,
      submittedErrors,
      ...props
    }: FormProps<S>,
    ref: ForwardedRef<HTMLFormElement>
  ): JSX.Element => {
    let formId = useId();

    let formContext: FormContext<S> = useMemo(() => {
      return createFormContext<S>({
        submittedErrors,
        submittedData,
        defaultData,
        data,
        schema,
        id: id || formId,
        onSubmit,
      });
    }, []);

    return (
      <form
        id={id || formId}
        {...props}
        onSubmit={formContext.onSubmit}
        ref={ref}
      >
        <FormContext.Provider value={formContext}>
          <FieldsContext.Provider value={formContext}>
            <input type="hidden" name="_formId" value={id || formId} />
            {children}
          </FieldsContext.Provider>
        </FormContext.Provider>
      </form>
    );
  }
);
