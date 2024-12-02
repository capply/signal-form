import type { FormEventHandler } from "react";
import { createContext, useContext } from "react";
import { useSignalValue, type ReadonlySignal } from "signals-react-safe";
import type { ValidationError, ValidationResult } from "~/utils/validate";
import type { AnyObjectSchema, InferType } from "yup";
import type { FieldsContext, Touched } from "~/fields-context";

export type FormContext<S extends AnyObjectSchema> = FieldsContext & {
  errors: ReadonlySignal<ValidationError[]>;
  result: ReadonlySignal<any>;
  didSubmit: ReadonlySignal<boolean>;
  formId: string;
  validate(): ValidationResult<InferType<S>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  setErrors(errors: ValidationError[]): void;
  setDidSubmit(value: boolean): void;
  formRef: React.RefObject<HTMLFormElement>;
};

export const FormContext = createContext<FormContext<any> | undefined>(
  undefined
);

export function useFormContext<S extends AnyObjectSchema = any>() {
  let context = useContext(FormContext) as FormContext<S>;
  if (context) {
    return context;
  } else {
    throw new Error("form context is not defined");
  }
}

export function useFormContextData<T = any>(): T {
  let context = useFormContext();
  let value = useSignalValue(context.data);
  return value as T;
}

export function useFormContextTouched(): Touched {
  let context = useFormContext();
  let value = useSignalValue(context.touched);
  return value;
}

export function useFormContextDidSubmit(): boolean {
  let context = useFormContext();
  let value = useSignalValue(context.didSubmit);
  return value;
}

export function useFormContextErrors(): ValidationError[] {
  let context = useFormContext();
  let value = useSignalValue(context.errors);
  return value;
}

export function useFormContextResult<
  S extends AnyObjectSchema = any
>(): InferType<S> {
  let context = useFormContext();
  let value = useSignalValue(context.result);
  return value;
}
