import type { ReactNode } from "react";
import { useSignal, computed } from "signals-react-safe";
import { FieldsContext, useFieldsContext } from "~/fields-context";

export type FieldsForProps = {
  name: string;
  children?: ReactNode;
};

export function FieldsFor({ name, children }: FieldsForProps): JSX.Element {
  let parentContext = useFieldsContext();
  let touched = useSignal({});
  let newContext: FieldsContext = {
    path: parentContext.path ? `${parentContext.path}.${name}` : name,
    data: computed(() => parentContext.data.value[name] || {}),
    touched: computed(() => touched.value),
    setTouched(subName) {
      touched.value = { ...touched.value, [subName]: true };
    },
    setValue(subName, value) {
      let currentValue = parentContext.data.value[name] || {};
      if (currentValue[subName] !== value) {
        parentContext.setValue(name, { ...currentValue, [subName]: value });
      }
    },
  };
  return (
    <FieldsContext.Provider value={newContext}>
      {children}
    </FieldsContext.Provider>
  );
}
