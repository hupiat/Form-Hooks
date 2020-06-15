import * as Yup from "yup";
import Joi from "@hapi/joi";

export type Environment = "test" | "default";

export type HighLevelSchema = "yup" | "joi";

export type JoiSchemaValues = Joi.Schema | Joi.Reference;

export type JoiSchema<T extends object> = {
  [K in keyof T]: JoiSchemaValues;
};

export type YupSchemaValues = Yup.Schema<any> | Yup.Ref;

export type YupSchema<T extends object> = {
  [K in keyof T]: YupSchemaValues;
};

export type FormValidationSchemaFunction<T extends object> = (
  object: T
) => boolean | string;

export type CallbacksSchema<T extends object> = {
  [K in keyof T]: FormValidationSchemaFunction<T>;
};

export type FormValidationSchemaGeneric<
  T extends object,
  SV extends YupSchemaValues | JoiSchemaValues
> = {
  [K in keyof T]?: FormValidationSchemaFunction<T> | SV;
};

export type FormValidationSchema<T extends object> =
  | FormValidationSchemaGeneric<T, YupSchemaValues>
  | FormValidationSchemaGeneric<T, JoiSchemaValues>;

export type FormValidationErrors<T extends object> =
  | {
      [K in keyof T]?: string;
    }
  | { [K: string]: string };

export type FormValidationOptions = Yup.ValidateOptions | Joi.ValidationOptions;

export interface FormValidation<T extends object> {
  canValidate: boolean;
  errors: FormValidationErrors<T>;
}
