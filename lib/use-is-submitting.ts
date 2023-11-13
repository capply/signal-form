import { useNavigation } from "@remix-run/react";
import { useFormContext } from "~/context";

export function useIsSubmitting() {
  let navigation = useNavigation();
  let form = useFormContext();

  return (
    navigation.state === "submitting" &&
    navigation.formData?.get("_formId") === form.formId
  );
}
