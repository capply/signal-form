import {
  Form as RemixForm,
  useActionData,
  useNavigation,
  useSubmit as useRemixSubmit,
} from "@remix-run/react";
import type { FormProps as RemixFormProps } from "@remix-run/react";
import type { ForwardedRef, ReactNode } from "react";
import { forwardRef, useEffect, useId, useMemo } from "react";
import { useSignal, type Signal } from "@preact/signals-react";
import type { AnyObjectSchema, InferType } from "yup";
import { FieldsContext, FormContext, useFormContext } from "~/context";
import type { ErrorActionData, ValidationErrorResult } from "~/utils/validate";
import { createFormContext } from "./create-form-context";
import type { DeepPartial } from "./utils/deep-partial";
import { json } from "@remix-run/node";
import { useForwardedRef } from "~/utils/use-forwarded-ref";

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
    forwardedRef: ForwardedRef<HTMLFormElement>
  ): JSX.Element => {
    let actionData = useActionData<ErrorActionData | undefined>();
    let formId = useId();
    let schemaSignal = useSignal(schema);

    useEffect(() => {
      if (actionData?.errors) {
        formContext.setErrors(actionData.errors);
      }
    }, [actionData?.errors]);

    let formRef = useForwardedRef(forwardedRef);

    let formContext: FormContext<S> = useMemo(() => {
      return createFormContext<S>({
        submittedErrors: actionData?.errors,
        submittedData: actionData?.input,
        defaultData,
        data,
        schema: schemaSignal,
        id: id || formId,
        onSubmit,
        formRef,
      });
    }, []);

    useEffect(() => {
      schemaSignal.value = schema;
      formContext.validate();
    }, [schema]);

    return (
      <RemixForm
        id={id || formId}
        {...props}
        onSubmit={formContext.onSubmit}
        ref={formRef}
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

export function useSubmit() {
  let remixSubmit = useRemixSubmit();
  let context = useFormContext();

  return () => remixSubmit(context.formRef.current);
}
