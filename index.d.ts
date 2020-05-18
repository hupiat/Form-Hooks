import { FormValidation, FormValidationSchema } from "./src/Types";

export declare const useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T
) => FormValidation<T>;
