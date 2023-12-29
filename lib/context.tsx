import type { FormEventHandler } from "react";
import { createContext, useContext } from "react";
import type { ReadonlySignal } from "@preact/signals-react";
import type { ValidationError, ValidationResult } from "~/utils/validate";
import type { AnyObjectSchema, InferType } from "yup";
import { useSignals } from "@preact/signals-react/runtime";

export type Touched = Record<string, boolean>;
export type FieldsContext = {
  path?: string;
  data: ReadonlySignal<Record<string, any>>;
  touched: ReadonlySignal<Touched>;
  setTouched(name: string): void;
  setValue(name: string, value: any): void;
};

export type FormContext<S extends AnyObjectSchema> = FieldsContext & {
  errors: ReadonlySignal<ValidationError[]>;
  result: ReadonlySignal<any>;
  didSubmit: ReadonlySignal<boolean>;
  formId: string;
  validate(): ValidationResult<InferType<S>>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

export const FormContext = createContext<FormContext<any> | undefined>(
  undefined
);
export const FieldsContext = createContext<FieldsContext | undefined>(
  undefined
);

export function useFormContext<S extends AnyObjectSchema = any>() {
  useSignals();
  let context = useContext(FormContext) as FormContext<S>;
  if (context) {
    return context;
  } else {
    throw new Error("form context is not defined");
  }
}

export function useFieldsContext() {
  useSignals();
  let context = useContext(FieldsContext);
  if (context) {
    return context;
  } else {
    throw new Error("fields context is not defined");
  }
}
