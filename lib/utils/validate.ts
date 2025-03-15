import type { AnyObjectSchema, InferType } from "yup";
import { parseFormData } from "~/utils/parse-form-data";

export type ValidationError = { path: string; message: string; type: string };

export type ValidationSuccessResult<T> = {
  ok: true;
  status: "valid";
  input: any;
  data: T;
};

export type ValidationErrorResult = {
  ok: false;
  status: "error";
  input: any;
  errors: ValidationError[];
};

export type ValidationResult<T> =
  | ValidationSuccessResult<T>
  | ValidationErrorResult;

export type ErrorActionData = {
  input: any;
  errors: ValidationError[];
};

export class ValidationErrorException extends Error {
  constructor(public data: any, public errors: ValidationError[]) {
    super(`Validation error: ${errors.map((e) => e.message).join(", ")}`);
  }
}

export function validateSync<T extends AnyObjectSchema>(
  schema: T,
  input: any
): ValidationResult<InferType<T>> {
  try {
    let validationResult = schema.validateSync(parseFormData(input), {
      abortEarly: false,
    });
    return { ok: true, input, status: "valid", data: validationResult };
  } catch (error: any) {
    if (error.inner) {
      let newErrors = error.inner.map((e: any) => ({
        path: e.path,
        message: e.message,
        type: e.type,
      }));
      return { ok: false, input, status: "error", errors: newErrors };
    } else {
      throw error;
    }
  }
}

export async function validate<T extends AnyObjectSchema>(
  schema: T,
  input: any
): Promise<ValidationResult<InferType<T>>> {
  try {
    let validationResult = await schema.validate(parseFormData(input), {
      abortEarly: false,
    });
    return { ok: true, input, status: "valid", data: validationResult };
  } catch (error: any) {
    if (error.inner) {
      let newErrors = error.inner.map((e: any) => ({
        path: e.path,
        message: e.message,
        type: e.type,
      }));
      return { ok: false, input, status: "error", errors: newErrors };
    } else {
      throw error;
    }
  }
}

export async function validateOrThrow<T extends AnyObjectSchema>(
  schema: T,
  input: any
): Promise<InferType<T>> {
  let result = await validate(schema, input);
  if (result.ok) {
    return result.data;
  } else {
    throw new ValidationErrorException(input, result.errors);
  }
}

export async function validateRequest<T extends AnyObjectSchema>(
  schema: T,
  request: Request
): Promise<ValidationResult<InferType<T>>> {
  let formData = await request.formData();
  return await validate(schema, formData);
}

export async function validateRequestOrThrow<T extends AnyObjectSchema>(
  schema: T,
  request: Request
): Promise<InferType<T>> {
  let formData = await request.formData();
  return await validateOrThrow(schema, formData);
}
