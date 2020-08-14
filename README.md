## Resume

Validation hook to deal with React forms

Designed to be used with a single object, allowing strong autocompletion

The validation trigger is debounced to optimize performances

`npm i formook --save`

## API

Validation schemas are made using a mix of :

- Yup (https://github.com/jquense/yup)
- Joi (https://hapi.dev/tutorials/validation/)
- Boolean validation functions, which can return strings as the error messages (meaning the validation result is assumed false). They are not present in joi, and unlike yup, they take the complete object in parameter

**The validation will be triggered only when the object is updated**

It forces you to update your object reference when you want to switch between schemas, but you should not need it as the dynamic schemas are made possible with functions

Note that Yup and Joi can't be used both at the same time, you need to use the function **switchHighLevelValidation** to define your schema library **(yup by default)**

```typescript
function switchHighLevelValidation: (
  schemaType: HighLevelSchema
) => HighLevelSchema;

function useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T,
  options?: FormValidationOptions
) => {
  canValidate: boolean;
  errors: FormValidationError<T> [];
};
```

## Types

```typescript
type HighLevelSchema = "yup" | "joi";

type FormValidationSchemaFunction<T extends object> = (
  object: T
) => boolean | string;

type FormValidationErrors<T extends object> =
  | {
      [K in keyof T]?: string;
    }
  // This one is needed because of joi errors
  | { [K: string]: string };

type FormValidationOptions = Yup.ValidateOptions | Joi.ValidationOptions;
```

## Example

```typescript
interface Test {
  foo: number;
  foo2: string;
}

const object: Test = await fetchData();

let schema: FormValidationSchema<Test> = {
  foo: Yup.number.max(10),
  foo2: (object: Test) =>
    object.foo2.length > 5 || "Input should be at least 6 chars long",
};

// If you are using joi

switchHighLevelValidation("joi");

schema = {
  foo: Joi.number.max(10),
};

const { canValidate, errors } = useFormValidation(schema, object);
```
