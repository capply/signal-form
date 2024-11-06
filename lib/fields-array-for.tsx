import type { ReactNode } from "react";
import { createContext, useContext, useMemo } from "react";
import { useSignal, computed, useSignalValue } from "signals-react-safe";
import type { FieldsForProps } from "./fields-for";
import { useFieldsArray } from "~/use-fields-array";
import { FieldsContext, useFieldsContext } from "~/fields-context";
import type { ReadonlySignal } from "signals-react-safe";

export type FieldsArrayRow = {
  remove(): void;
  index: number;
  length: ReadonlySignal<number>;
};

let FieldsArrayRowContext = createContext<FieldsArrayRow | undefined>(
  undefined
);

export function useFieldsArrayRow() {
  let context = useContext(FieldsArrayRowContext);
  if (context) {
    return context;
  } else {
    throw new Error("row context is not defined");
  }
}

export function useFieldsArrayRowLength(): number {
  let context = useFieldsArrayRow();
  let value = useSignalValue(context.length);
  return value;
}

export function FieldsArrayFor({
  name,
  children,
}: FieldsForProps): JSX.Element {
  let array = useFieldsArray(name);
  let keys = useSignalValue(array.keys);
  let innerMemo = useMemo(
    () => <FieldsArrayForInner name={name} keys={keys} children={children} />,
    [keys.join(",")]
  );
  return innerMemo;
}

function FieldsArrayForInner({
  keys,
  name,
  children,
}: FieldsForProps & { keys: string[] }): JSX.Element {
  return (
    <>
      {keys.map((key, index) => (
        <FieldsArrayRowFor name={name} index={index} key={key}>
          {children}
        </FieldsArrayRowFor>
      ))}
    </>
  );
}

export type FieldsArrayRowForProps = {
  name: string;
  index: number;
  children?: ReactNode;
};

function FieldsArrayRowFor({
  name,
  index,
  children,
}: FieldsArrayRowForProps): JSX.Element {
  let parentContext = useFieldsContext();
  let touched = useSignal({});
  let values = computed(
    () =>
      (parentContext.data.value[name] &&
        parentContext.data.value[name][index]) ||
      {}
  );
  let newContext: FieldsContext = {
    path: [parentContext.path, name].filter(Boolean).join(".") + `[${index}]`,
    data: values,
    touched: computed(() => touched.value),
    setTouched(subName) {
      touched.value = { ...touched.value, [subName]: true };
    },
    setValue(subName, value) {
      let array = parentContext.data.value[name].slice() || [];
      array[index] ||= {};
      if (array[index][subName] !== value) {
        array[index] = { ...array[index], [subName]: value };
        parentContext.setValue(name, array);
      }
    },
  };
  let row = {
    index,
    length: computed(() => parentContext.data.value[name].length),
    remove() {
      let array = parentContext.data.value[name].slice() || [];
      array.splice(index, 1);
      parentContext.setValue(name, array);
    },
  };
  return (
    <FieldsArrayRowContext.Provider value={row}>
      <FieldsContext.Provider value={newContext}>
        {children}
      </FieldsContext.Provider>
    </FieldsArrayRowContext.Provider>
  );
}
