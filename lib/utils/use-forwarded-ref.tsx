import type { RefObject } from "react";
import { type ForwardedRef, useRef, useImperativeHandle } from "react";

export function useForwardedRef<E>(
  forwardedRef: ForwardedRef<E>
): RefObject<E> {
  let ref = useRef<E>(null);
  useImperativeHandle(forwardedRef, () => ref.current as E);
  return ref;
}
