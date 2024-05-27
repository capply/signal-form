import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import type { FormProps as RemixFormProps } from "@remix-run/react";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useEffect, useId, useMemo } from "react";
import type { Signal } from "@preact/signals-react";
import type { AnyObjectSchema, InferType } from "yup";
import { FieldsContext, FormContext, useFormContext } from "~/context";
import type { ErrorActionData, ValidationErrorResult } from "~/utils/validate";
import { createFormContext } from "./create-form-context";
import type { DeepPartial } from "./utils/deep-partial";
import { json } from "@remix-run/node";

export * from "./index";

export type FormProps<S extends AnyObjectSchema> = {
  children?: ReactNode;
  schema?: S;
  defaultData?: DeepPartial<InferType<S>>;
  data?: Signal<InferType<S>>;
} & RemixFormProps;

export const Form = forwardRef(
  <S extends AnyObjectSchema>(
    {
      children,
      schema,
      defaultData,
      data,
      id,
      onSubmit,
      ...props
    }: FormProps<S>,
    ref: ForwardedRef<HTMLFormElement>
  ): JSX.Element => {
    let actionData = useActionData<ErrorActionData | undefined>();
    let formId = useId();

    useEffect(() => {
      if (actionData?.errors) {
        formContext.setErrors(actionData.errors);
      }
    }, [actionData?.errors]);

    let formContext: FormContext<S> = useMemo(() => {
      return createFormContext<S>({
        submittedErrors: actionData?.errors,
        submittedData: actionData?.input,
        defaultData,
        data,
        schema,
        id: id || formId,
        onSubmit,
      });
    }, []);

    return (
      <RemixForm
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
      </RemixForm>
    );
  }
);

export function errorResponse(error: ValidationErrorResult) {
  return json<ErrorActionData>(
    { errors: error.errors, input: error.input },
    { status: 422 }
  );
}

export function useIsSubmitting() {
  let navigation = useNavigation();
  let form = useFormContext();

  return (
    navigation.state === "submitting" &&
    navigation.formData?.get("_formId") === form.formId
  );
}
