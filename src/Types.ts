import * as Yup from "yup";

export type YupSchema<T extends object> = {
	[K in keyof T]: Yup.Schema<any> | Yup.Ref;
};

export type CallbacksSchema<T extends object> = {
	[K in keyof T]: (object: T) => boolean;
};

export type FormValidationSchema<T extends object> = {
	[K in keyof T]: ((object: T) => boolean) | Yup.Schema<any> | Yup.Ref;
};

export type FormValidationError<T extends object> = {
	[K in keyof T]: string;
};

export interface FormValidation<T extends object> {
	canValidate: boolean;
	errors: FormValidationError<T>[];
}
