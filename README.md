# Form-Hooks

Lightweight hooks to deal with React forms

`npm i form-hooks-light --save`

# API

```typescript
// Sets a state for an object, with a generic type-safe setter

useFormState: <T extends object>(object?: T) => [formState, setFormState];

// Validation schema are made using a mix of Yup (https://github.com/jquense/yup)
// and boolean functions like (object: T) => boolean

// Validation will be triggered only when the object is updated

useFormValidation: <T extends object>(
  schema: FormValidationSchema<T>,
  object: T
) => {
  canValidate: boolean;
  errors: FormValidationError < T > [];
};

// Tool for selects

useFormSelect<T extends object>(
  objects: T[],
  format: (object: T) => FormSelectItem,
  defaultItem?: T
): {
  suggestions: FormSelectItem[];
  selected: FormSelectItem | undefined;
  onSelect: (object?: T) => void;
  onClear: () => void;
};
```
