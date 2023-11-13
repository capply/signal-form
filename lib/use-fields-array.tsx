import { useMemo } from "react";
import { computed } from "@preact/signals-react";
import type { ReadonlySignal } from "@preact/signals-react";
import type { Field } from "./use-field";
import { useField } from "./use-field";

type FieldArray<T> = Field<T[]> & {
  keys: ReadonlySignal<string[]>;
  push(value: T): void;
  insertAt(index: number, value: T): void;
  updateAt(index: number, cb: (value: T | undefined) => T): void;
  removeAt(index: number): void;
};

export function useFieldsArray<T = any>(fieldName: string): FieldArray<T> {
  let field = useField<T[]>(fieldName);
  return useMemo(() => {
    return {
      ...field,
      keys: computed(() =>
        (field.value.value || []).map((row, index) => (row as any)?.id || index)
      ),
      push(value: T) {
        field.setValue([...(field.value.value || []), value]);
      },
      insertAt(index, value) {
        let newValues = field.value.value?.slice() || [];
        newValues.splice(index, 0, value);
        field.setValue(newValues);
      },
      updateAt(index, cb) {
        let newValues = field.value.value?.slice() || [];
        newValues.splice(index, 1, cb(newValues[index]));
        field.setValue(newValues);
      },
      removeAt(index) {
        let newValues = field.value.value?.slice() || [];
        newValues.splice(index, 1);
        field.setValue(newValues);
      },
    };
  }, [fieldName, field]);
}
