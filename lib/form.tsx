import { Form, useActionData } from "@remix-run/react";
import type { FormProps } from "@remix-run/react";
import type { FormEventHandler, ReactNode } from "react";
import { useId, useMemo } from "react";
import { signal } from "@preact/signals-react";
import type { AnyObjectSchema, InferType } from "yup";
import { FieldsContext, FormContext } from "~/context";
import type {
  ValidationResult,
  ValidationError,
  ErrorActionData,
} from "~/utils/validate";
import { validateSync } from "~/utils/validate";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

export type SignalFormProps<S extends AnyObjectSchema> = {
  children?: ReactNode;
  schema?: S;
  defaultData?: DeepPartial<InferType<S>>;
} & FormProps;

export function SignalForm<S extends AnyObjectSchema>({
  children,
  schema,
  defaultData,
  id,
  onSubmit,
  ...props
}: SignalFormProps<S>): JSX.Element {
  let actionData = useActionData<ErrorActionData | undefined>();

  let formId = useId();

  let formContext: FormContext<S> = useMemo(() => {
    return createFormContext<S>({
      submittedData: actionData?.input,
      submittedErrors: actionData?.errors,
      defaultData,
      schema,
      id: id || formId,
      onSubmit,
    });
  }, [actionData]);

  return (
    <Form id={id || formId} {...props} onSubmit={formContext.onSubmit}>
      <FormContext.Provider value={formContext}>
        <FieldsContext.Provider value={formContext}>
          <input type="hidden" name="_formId" value={id || formId} />
          {children}
        </FieldsContext.Provider>
      </FormContext.Provider>
    </Form>
  );
}

type CreateFormContextOptions<S extends AnyObjectSchema> = {
  submittedErrors?: ValidationError[];
  submittedData?: any;
  defaultData?: DeepPartial<InferType<S>>;
  schema?: S;
  id: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

function createFormContext<S extends AnyObjectSchema>({
  submittedErrors,
  submittedData,
  defaultData,
  schema,
  id,
  onSubmit,
}: CreateFormContextOptions<S>): FormContext<S> {
  let result = signal(undefined);
  let data = signal(submittedData || defaultData || {});
  let errors = signal<ValidationError[]>(submittedErrors || []);
  let touched = signal({});
  let didSubmit = signal(!!submittedData);

  function validate(): ValidationResult<InferType<S>> {
    if (schema) {
      let validationResult = validateSync(schema, data.value);
      if (validationResult.ok) {
        errors.value = [];
        result.value = validationResult.data;
        return validationResult;
      } else {
        errors.value = validationResult.errors;
        result.value = undefined;
        return validationResult;
      }
    } else {
      return {
        ok: true,
        input: data.value,
        status: "valid",
        data: data.value,
      };
    }
  }

  return {
    data,
    result,
    errors,
    touched,
    didSubmit,
    formId: id,
    validate,
    onSubmit(event) {
      onSubmit?.(event);
      if (!event.isPropagationStopped()) {
        didSubmit.value = true;
        let validationResult = validate();
        if (validationResult.status === "error") {
          // eslint-disable-next-line no-console
          console.error("validation failed", validationResult.errors);
          event.stopPropagation();
          event.preventDefault();
        }
      }
    },
    setTouched(name) {
      touched.value = { ...touched.value, [name]: true };
    },
    setValue(name, value) {
      data.value = { ...data.value, [name]: value };
      validate();
    },
  };
}
