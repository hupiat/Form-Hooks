# Formook

Validation hook to deal with React forms

`npm i formook --save`

# API

Validation schemas are made using a mix of :

- Yup (https://github.com/jquense/yup)
- Joi (https://hapi.dev/module/joi/)
- Boolean validation functions, which can return strings as the error messages (meaning the validation result is assumed false)

**The validation will be triggered only when the object is updated**

Note that Yup and Joi can't be used both at the same time, you need to use the function **switchHighLevelValidation** to define your schema library

```typescript
function switchHighLevelValidation: (
  schemaType: HighLevelSchema
) => HighLevelSchema;

function useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T,
  options?: FormValidationOptions
): {
  canValidate: boolean;
  errors: FormValidationError < T > [];
};
```

<b>Types</b>

```typescript
type HighLevelSchema = "yup" | "joi";

type FormValidationSchemaFunction<T extends object> = (
  object: T
) => boolean | string;

type FormValidationErrors<T extends object> = {
  [K in keyof T]?: string;
};

type FormValidationOptions = Yup.ValidateOptions | Joi.ValidationOptions;
```

<b>Example</b>

```typescript
interface Test {
  foo: number;
  foo2: string;
}

const object = await fetchData();

const schema: FormValidationSchema<Test> = {
  foo: Yup.number.max(10),
  foo2: (object: Test) =>
    foo.length > 5 || "Input should be at least 6 chars long",
};

// If you are using joi

switchHighLevelValidation("joi");

const schema: FormValidationSchema<Test> = {
  foo: Joi.number.max(10),
};
```
