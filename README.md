# Formook

Validation hook to deal with React forms

`npm i formook --save`

# API

Validation schemas are made using a mix of Yup (https://github.com/jquense/yup) and boolean validation functions, which can return strings as the error messages (meaning the validation result is assumed false)

**Validation will be triggered only when the object is updated**

```typescript
useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T
) => {
  canValidate: boolean;
  errors: FormValidationError < T > [];
};
```

<b>Types</b>

```typescript
type FormValidationSchemaFunction<T extends object> = (
  object: T
) => boolean | string;

type FormValidationSchema<T extends object> = {
  [K in keyof T]?: FormValidationSchemaFunction<T> | YupSchemaValues;
};

type FormValidationError<T extends object> = {
  [K in keyof T]: string;
};
```

<b>Example</b>

```typescript
interface Test {
  foo: number;
  foo2: string;
}

const schema: FormValidationSchema<Test> = {
  foo: Yup.number.max(10),
  foo2: (object: Test) =>
    foo.length > 5 || "Input should be at least 6 chars long",
};
```
