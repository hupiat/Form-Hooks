import {
  FormValidation,
  FormValidationSchema,
  HighLevelSchema,
  FormValidationOptions,
} from "./src/Types";

export declare const switchHighLevelValidation: (
  schemaType: HighLevelSchema
) => HighLevelSchema;

export declare const useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T,
  options?: FormValidationOptions
) => FormValidation<T>;
