import type { SyntheticEvent } from "react";
import type { ReadonlySignal, Signal } from "@preact/signals-react";
import { signal } from "@preact/signals-react";
import type { AnyObjectSchema, InferType } from "yup";
import type { FormContext } from "~/context";
import type { ValidationResult, ValidationError } from "~/utils/validate";
import { validateSync } from "~/utils/validate";
import type { DeepPartial } from "./utils/deep-partial";

export type OnSubmitHandler = (
  event: SyntheticEvent<HTMLFormElement>,
  context: FormContext<any>
) => void;

type CreateFormContextOptions<S extends AnyObjectSchema> = {
  submittedErrors?: ValidationError[];
  submittedData?: any;
  defaultData?: DeepPartial<InferType<S>>;
  data?: Signal<InferType<S>>;
  schema: ReadonlySignal<S | undefined>;
  id: string;
  onSubmit?: OnSubmitHandler;
  formRef: React.RefObject<HTMLFormElement>;
};

export function createFormContext<S extends AnyObjectSchema>({
  submittedErrors,
  submittedData,
  defaultData,
  data: outerData,
  schema,
  id,
  onSubmit,
  formRef,
}: CreateFormContextOptions<S>): FormContext<S> {
  let result = signal(undefined);
  let data = outerData || signal(submittedData || defaultData || {});
  let errors = signal<ValidationError[]>(submittedErrors || []);
  let touched = signal({});
  let didSubmit = signal(!!submittedData);

  function validate(): ValidationResult<InferType<S>> {
    if (schema.value) {
      let validationResult = validateSync(schema.value, data.value);
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

  let context: FormContext<S> = {
    data,
    result,
    errors,
    touched,
    didSubmit,
    formId: id,
    formRef,
    validate,
    onSubmit(event) {
      onSubmit?.(event, context);
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

  return context;
}
