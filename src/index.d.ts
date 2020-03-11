import { FormValidationSchema, FormValidation } from "./Types";

export declare const useFormValidation: <T extends object>(
	schema: FormValidationSchema<T>,
	object: T
) => FormValidation<T>;

export declare const useFormState: <T extends object>(
	object?: T
) => [T, (key: keyof T, attribute: any) => void];
