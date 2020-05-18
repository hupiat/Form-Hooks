import { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import {
  FormValidationSchema,
  FormValidation,
  FormValidationError,
  CallbacksSchema,
  YupSchema,
} from "./Types";
import _ from "lodash";

const CALLBACK_VALIDATION_FAILED = (label: string) =>
  `Validation function for ${label} failed`;

export function useFormValidation<T extends object>(
  schema: FormValidationSchema<T>,
  object: T
): FormValidation<T> {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormValidationError<T>[]>([]);
  const callbacksSchema = useRef<CallbacksSchema<T>>({} as CallbacksSchema<T>);
  const yupSchema = useRef<Yup.ObjectSchema>();

  // Building differents schemas for yup and validation callbacks
  useEffect(() => {
    const tempSchema = _.cloneDeep(schema);
    Object.keys(schema)
      .map((key) => key as keyof T)
      .filter((key) => (schema[key] as any) instanceof Function)
      .forEach((key) => {
        callbacksSchema.current[key] = schema[key] as (object: T) => boolean;
        delete tempSchema[key];
      });

    yupSchema.current = Yup.object().shape(tempSchema as YupSchema<T>);
  }, [schema]);

  // Testing if validation is allowed, while populating errors object
  useEffect(() => {
    const errors: FormValidationError<T>[] = [];

    const pushError = (key: keyof T, message: string) => {
      errors[errors.length] = {
        [key]: message,
      } as FormValidationError<T>;
    };

    Object.keys(callbacksSchema.current)
      .map((key) => key as keyof T)
      .forEach((key) => {
        const res = callbacksSchema.current[key](object);
        if (typeof res === "string" || typeof res === "boolean") {
          pushError(
            key,
            typeof res === "string"
              ? res
              : CALLBACK_VALIDATION_FAILED(key as string)
          );
        }
      });
    if (yupSchema.current) {
      try {
        yupSchema.current.validateSync(object);
      } catch (e) {
        const err = e as Yup.ValidationError;
        pushError(err.path as keyof T, err.message);
      }
    }

    setErrors(errors);
    setCanValidate(errors.length <= 0);
  }, [object]);

  return {
    canValidate,
    errors,
  };
}
