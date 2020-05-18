# Formook

Validation hook to deal with React forms

`npm i formook --save`

# API

<b>Validation schemas are made using a mix of Yup (https://github.com/jquense/yup) and boolean validation functions</b>

```typescript
(object: T) => boolean;
```

Validation will be triggered only when the object is updated

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
type FormValidationSchema<T extends object> = {
  [K in keyof T]?: ((object: T) => boolean) | YupSchemaValues;
};

type FormValidationError<T extends object> = {
  [K in keyof T]: string;
} & { code: number };
```

<b>Example</b>

```typescript
interface Test {
  foo: string;
  foo2: number;
}

const schema: FormValidationSchema<Test> = {
  foo: (object: Test) => foo.length > 5,
  foo2: Yup.number.max(10),
};
```
