import * as Yup from "yup";

export type YupSchemaValues = Yup.Schema<any> | Yup.Ref;

export type YupSchema<T extends object> = {
  [K in keyof T]: YupSchemaValues;
};

export type CallbacksSchema<T extends object> = {
  [K in keyof T]: (object: T) => boolean;
};

export type FormValidationSchema<T extends object> = {
  [K in keyof T]: ((object: T) => boolean) | YupSchemaValues;
};

export type FormValidationError<T extends object> = {
  [K in keyof T]: string;
};

export interface FormValidation<T extends object> {
  canValidate: boolean;
  errors: FormValidationError<T>[];
}

export type FormSelectItemCommon = {
  label: string;
  value: string;
};

export type FormSelectItemSemanticUI = {
  key: string;
  value: string;
  text: string;
};

export type FormSelectItem = FormSelectItemCommon & FormSelectItemSemanticUI;

export interface FormSelect<T> {
  suggestions: FormSelectItem[];
  selected: FormSelectItem | undefined;
  onSelect: (object?: T) => void;
  onClear: () => void;
}
