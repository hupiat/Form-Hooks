import * as Yup from "yup";

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

export type FormValidationSchema<T extends object> = {
  [K in keyof T]?: FormValidationSchemaFunction<T> | YupSchemaValues;
};

export type FormValidationError<T extends object> = {
  [K in keyof T]: string;
};

export interface FormValidation<T extends object> {
  canValidate: boolean;
  errors: FormValidationError<T>[];
}
