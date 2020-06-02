import { useEffect, useState, useRef } from "react";
import * as Yup from "yup";
import {
  FormValidationSchema,
  FormValidation,
  FormValidationErrors,
  CallbacksSchema,
  YupSchema,
  HighLevelSchema,
  JoiSchema,
  FormValidationOptions,
} from "./Types";
import _ from "lodash";
import Joi from "@hapi/joi";

let ENABLED_HL_SCHEMA: HighLevelSchema | null = "yup";

const DEBOUNCE_DELAY_MS: number = 350;

const VALIDATION_FAILED_DEF = (label: string) =>
  `Validation function for ${label} failed`;

export const switchHighLevelValidation = (schemaType: HighLevelSchema) =>
  (ENABLED_HL_SCHEMA = schemaType);

export function useFormValidation<T extends object>(
  schema: FormValidationSchema<T>,
  object: T,
  options?: FormValidationOptions
): FormValidation<T> {
  const [canValidate, setCanValidate] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormValidationErrors<T>>({});
  const callbacksSchema = useRef<CallbacksSchema<T>>({} as CallbacksSchema<T>);
  const highLevelSchema = useRef<Yup.ObjectSchema | Joi.ObjectSchema>();

  // Building differents schemas for high level ones and validation callbacks
  useEffect(() => {
    const tempSchema = _.cloneDeep(schema);

    Object.keys(schema)
      .filter((key) => (schema[key] as any) instanceof Function)
      .forEach((key) => {
        callbacksSchema.current[key] = schema[key] as (object: T) => boolean;
        delete tempSchema[key];
      });

    try {
      highLevelSchema.current =
        ENABLED_HL_SCHEMA === "yup"
          ? Yup.object().shape(tempSchema as YupSchema<T>)
          : Joi.object(tempSchema as JoiSchema<T>);
    } catch {
      throw Error(`Schema type mismatch : ${ENABLED_HL_SCHEMA}`);
    }
  }, [schema]);

  // Testing if validation is allowed, while populating errors object
  const validate = () => {
    const errors: FormValidationErrors<T> = {};

    const pushError = (key: keyof T, message: string) =>
      (errors[key] = message);

    Object.keys(callbacksSchema.current).forEach((key) => {
      const res = callbacksSchema.current[key](object);
      if (typeof res === "string" || (typeof res === "boolean" && !res)) {
        pushError(
          key as keyof T,
          typeof res === "string" ? res : VALIDATION_FAILED_DEF(key as string)
        );
      }
    });

    if (highLevelSchema.current) {
      if (ENABLED_HL_SCHEMA === "yup") {
        try {
          (highLevelSchema.current as Yup.ObjectSchema).validateSync(
            object,
            options as Yup.ValidateOptions
          );
        } catch (e) {
          const err = e as Yup.ValidationError;
          pushError(err.path as keyof T, err.message);
        }
      } else {
        const res = (highLevelSchema.current as Joi.ObjectSchema).validate(
          object,
          options as Joi.ValidationOptions
        );
        if (res.error) {
          pushError(res.error.name as keyof T, res.error.message);
        }
      }
    }

    setErrors(errors);
    setCanValidate(Object.keys(errors).length <= 0);
  };

  // We are debouncing validation to avoid too many re-renders
  useEffect(() => {
    const timeout = setTimeout(validate, DEBOUNCE_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [object]);

  return {
    canValidate,
    errors,
  };
}
