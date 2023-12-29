import { useContext, useMemo } from "react";
import { signal as createSignal, computed } from "@preact/signals-react";
import type { ReadonlySignal } from "@preact/signals-react";
import { FormContext, FieldsContext } from "./context";
import type { ValidationError } from "~/utils/validate";
import { useSignals } from "@preact/signals-react/runtime";

export type Field<T> = {
  name: string;
  data: ReadonlySignal<T | undefined>;
  errors: ReadonlySignal<ValidationError[]>;
  touched: ReadonlySignal<boolean>;
  isValid: ReadonlySignal<boolean>;
  setTouched(): void;
  setData(value: T): void;
};

export type UseFieldOptions = {
  defaultValue?: any;
};

export function useField<T>(
  fieldName: string,
  options: UseFieldOptions = {}
): Field<T> {
  useSignals();

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
        data: computed(
          () => fieldContext.data.value[fieldName] ?? options.defaultValue
        ),
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
      let fieldSignal = createSignal<T | undefined>(options.defaultValue);
      let touchedSignal = createSignal(false);
      return {
        name: fieldName,
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
