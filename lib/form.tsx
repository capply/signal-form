import { Form, useActionData } from "@remix-run/react";
import type { FormProps } from "@remix-run/react";
import type { FormEventHandler, ForwardedRef, ReactNode } from "react";
import { forwardRef, useEffect, useId, useMemo } from "react";
import type { Signal } from "@preact/signals-react";
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
  data?: Signal<InferType<S>>;
} & FormProps;

export const SignalForm = forwardRef(
  <S extends AnyObjectSchema>(
    {
      children,
      schema,
      defaultData,
      data,
      id,
      onSubmit,
      ...props
    }: SignalFormProps<S>,
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
      <Form
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
      </Form>
    );
  }
);

type CreateFormContextOptions<S extends AnyObjectSchema> = {
  submittedErrors?: ValidationError[];
  submittedData?: any;
  defaultData?: DeepPartial<InferType<S>>;
  data?: Signal<InferType<S>>;
  schema?: S;
  id: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

function createFormContext<S extends AnyObjectSchema>({
  submittedErrors,
  submittedData,
  defaultData,
  data: outerData,
  schema,
  id,
  onSubmit,
}: CreateFormContextOptions<S>): FormContext<S> {
  let result = signal(undefined);
  let data = outerData || signal(submittedData || defaultData || {});
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
      if (data.value[name] !== value) {
        data.value = { ...data.value, [name]: value };
      }
      validate();
    },
    setErrors(value) {
      errors.value = value;
      result.value = undefined;
    },
  };
}
