/* eslint-disable prefer-let/prefer-let */
import { useContext, useMemo } from "react";
import { signal as createSignal, computed } from "@preact/signals-react";
import type { ReadonlySignal } from "@preact/signals-react";
import { FormContext, FieldsContext } from "./context";
import type { ValidationError } from "~/utils/validate";

export type Field<T> = {
  name: string;
  value: ReadonlySignal<T | undefined>;
  errors: ReadonlySignal<ValidationError[]>;
  touched: ReadonlySignal<boolean>;
  isValid: ReadonlySignal<boolean>;
  setTouched(): void;
  setValue(value: T): void;
};

export type UseFieldOptions = {
  defaultValue?: any;
};

export function useField<T>(
  fieldName: string,
  options: UseFieldOptions = {}
): Field<T> {
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
        value: computed(
          () => fieldContext.values.value[fieldName] || options.defaultValue
        ),
        errors,
        touched,
        isValid,
        setTouched() {
          fieldContext.setTouched(fieldName);
        },
        setValue(value) {
          fieldContext.setValue(fieldName, value);
        },
      };
    } else {
      let fieldSignal = createSignal<T | undefined>(options.defaultValue);
      let touchedSignal = createSignal(false);
      return {
        name: fieldName,
        value: computed(() => fieldSignal.value),
        errors: computed(() => []),
        touched: computed(() => touchedSignal.value),
        isValid: computed(() => true),
        setTouched() {
          touchedSignal.value = true;
        },
        setValue(value) {
          fieldSignal.value = value;
        },
      };
    }
  }, [fieldName, formContext, fieldContext]);
}
