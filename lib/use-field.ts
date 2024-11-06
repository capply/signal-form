import { useContext, useMemo } from "react";
import { signal as createSignal, computed } from "signals-react-safe";
import type { ReadonlySignal } from "signals-react-safe";
import { FieldsContext } from "./fields-context";
import { FormContext } from "./form-context";
import type { ValidationError } from "~/utils/validate";
import { useSignalValue } from "signals-react-safe";

export type Field<T> = {
  name: string;
  id: string;
  data: ReadonlySignal<T | undefined>;
  errors: ReadonlySignal<ValidationError[]>;
  touched: ReadonlySignal<boolean>;
  isValid: ReadonlySignal<boolean>;
  setTouched(): void;
  setData(value: T): void;
};

export type UseFieldOptions<D = undefined> = {
  defaultValue?: D;
};

export function useField<T>(fieldName: string): Field<T | undefined> {
  const formContext = useContext(FormContext);
  const fieldContext = useContext(FieldsContext);

  return useMemo(() => {
    if (formContext && fieldContext) {
      const fullPath = fieldContext.path
        ? `${fieldContext.path}.${fieldName}`
        : fieldName;

      const errors = computed(() =>
        formContext.errors.value.filter((error) => error.path === fullPath)
      );
      const touched = computed(
        () =>
          formContext.didSubmit.value ||
          fieldContext.touched.value[fieldName] ||
          false
      );

      const isValid = computed(() => !touched.value || !errors.value.length);

      return {
        name: fullPath,
        id: fullPath.replace(/[^a-zA-Z0-9]/g, "-"),
        data: computed(() => fieldContext.data.value[fieldName]),
        errors,
        touched,
        isValid,
        setTouched() {
          fieldContext.setTouched(fieldName);
        },
        setData(value) {
          fieldContext.setValue(fieldName, value);
        },
      };
    } else {
      let fieldSignal = createSignal<T | undefined>(undefined);
      let touchedSignal = createSignal(false);
      return {
        name: fieldName,
        id: fieldName.replace(/[^a-zA-Z0-9]/g, "-"),
        data: computed(() => fieldSignal.value),
        errors: computed(() => []),
        touched: computed(() => touchedSignal.value),
        isValid: computed(() => true),
        setTouched() {
          touchedSignal.value = true;
        },
        setData(value) {
          fieldSignal.value = value;
        },
      };
    }
  }, [fieldName, formContext, fieldContext]);
}

export function useFieldData<T>(fieldName: string): T | undefined;
export function useFieldData<T>(fieldName: string, defaultValue: T): T;
export function useFieldData<T>(
  fieldName: string,
  defaultValue?: T
): T | undefined {
  let field = useField<T>(fieldName);
  let value = useSignalValue(field.data);
  return value || defaultValue;
}

export function useFieldTouched(fieldName: string): boolean {
  let field = useField(fieldName);
  let value = useSignalValue(field.touched);
  return value;
}

export function useFieldErrors(fieldName: string): ValidationError[] {
  let field = useField(fieldName);
  let value = useSignalValue(field.errors);
  return value;
}
