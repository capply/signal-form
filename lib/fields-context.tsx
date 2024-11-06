import { createContext, useContext } from "react";
import { useSignalValue, type ReadonlySignal } from "signals-react-safe";

export type Touched = Record<string, boolean>;
export type FieldsContext = {
  path?: string;
  data: ReadonlySignal<Record<string, any>>;
  touched: ReadonlySignal<Touched>;
  setTouched(name: string): void;
  setValue(name: string, value: any): void;
};

export const FieldsContext = createContext<FieldsContext | undefined>(
  undefined
);

export function useFieldsContext() {
  let context = useContext(FieldsContext);
  if (context) {
    return context;
  } else {
    throw new Error("fields context is not defined");
  }
}

export function useFieldsContextData<T = any>(): T {
  let context = useFieldsContext();
  let value = useSignalValue(context.data);
  return value as T;
}

export function useFieldsContextTouched(): Touched {
  let context = useFieldsContext();
  let value = useSignalValue(context.touched);
  return value;
}
