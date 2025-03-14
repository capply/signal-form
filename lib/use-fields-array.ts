import { useMemo } from "react";
import { computed } from "signals-react-safe";
import type { ReadonlySignal } from "signals-react-safe";
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
        (field.data.value || []).map((row, index) => index.toString())
      ),
      push(value: T) {
        field.setData([...(field.data.value || []), value]);
      },
      insertAt(index, value) {
        let newValues = field.data.value?.slice() || [];
        newValues.splice(index, 0, value);
        field.setData(newValues);
      },
      updateAt(index, cb) {
        let newValues = field.data.value?.slice() || [];
        newValues.splice(index, 1, cb(newValues[index]));
        field.setData(newValues);
      },
      removeAt(index) {
        let newValues = field.data.value?.slice() || [];
        newValues.splice(index, 1);
        field.setData(newValues);
      },
    };
  }, [fieldName, field]);
}
