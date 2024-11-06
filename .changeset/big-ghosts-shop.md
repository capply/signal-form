---
"signal-form": minor
---

Switch to using signals-react-safe. This is a breaking change, since signals are no longer automatically subscribed. In most cases, you should use the `useFieldData`, `useFormContextData`, etc... hooks instead of accessing signals directly.
