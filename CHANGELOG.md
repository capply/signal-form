# signal-form

## 0.7.3

### Patch Changes

- 2e2dc41: Remove `id` spcecial case for field arrays

## 0.7.2

### Patch Changes

- e2fa983: Add set did submit function

## 0.7.1

### Patch Changes

- bb2330c: Improve change event handling and add filter property

## 0.7.0

### Minor Changes

- 187df71: Switch to using signals-react-safe. This is a breaking change, since signals are no longer automatically subscribed. In most cases, you should use the `useFieldData`, `useFormContextData`, etc... hooks instead of accessing signals directly.

## 0.6.5

### Patch Changes

- 0784d09: Fix error in validate method

## 0.6.4

### Patch Changes

- d4b31a8: Validate search params

## 0.6.3

### Patch Changes

- ae4b547: Remove errorResponse helper, as it interferes with vite tree-shaking

## 0.6.2

### Patch Changes

- bd8a6ca: Add context in onSubmit callback

## 0.6.1

### Patch Changes

- fa22d63: Add formRef and useSubmit hook

## 0.6.0

### Minor Changes

- 7cd3f65: React to schema changes dynamically

## 0.5.0

### Minor Changes

- f36fcdf: Automatically set data value if field has a value in the DOM

## 0.4.1

### Patch Changes

- 3b0bbaa: Don't package node dependencies

## 0.4.0

### Minor Changes

- 879d914: Separate remix entrypoint

### Patch Changes

- 4a7ffba: Set server errors on form context rathern than breaking memoization
- 14b799e: Automatically convert form data in validate

## 0.3.0

### Minor Changes

- cfefbae: Add schema implementation
- c5f9839: Add support for multi selects

### Patch Changes

- 208da03: Improve reactive forms by not updating value if it hasn't changed

## 0.2.2

### Patch Changes

- 4515d6a: Add support for external form data

## 0.2.1

### Patch Changes

- dd18f9a: Fix form id hidden field value

## 0.2.0

### Minor Changes

- 73d6f31: Added support for signals 2.0

## 0.1.4

### Patch Changes

- 5449d69: Relax react and signals-react dependencies

## 0.1.3

### Patch Changes

- 501c49d: Fix useFieldsContext

## 0.1.2

### Patch Changes

- 096fbab: Pass signal value to input

## 0.1.1

### Patch Changes

- 7e99b57: Relax remix dependencies

## 0.1.0

### Minor Changes

- d5174f4: Import project

### Patch Changes

- d53903a: Initial release
