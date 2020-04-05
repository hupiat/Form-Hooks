# Formook

Lightweight hooks to deal with React forms

`npm i form-hooks-light --save`

# API

<b>Sets a state for an object, with a generic type-safe setter</b>

```typescript
useFormState: <T extends object>(object?: T) => [formState, setFormState];
```

<b>Validation schema are made using a mix of Yup (https://github.com/jquense/yup) and boolean validation functions</b>

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

<b>Tool for selects</b>

FormSelectItem supports common format ({ value, label }) and
specific SemanticUI format ({ key, value, text })

```typescript
useFormSelect<T extends object>(
  objects: T[],
  format: (object: T) => FormSelectItem,
  defaultItem?: T
): {
  suggestions: FormSelectItem[];
  onSelect: (object: T) => void;
  onClear: () => void;
  itemSelected: FormSelectItem | undefined;
  objectSelected: T | undefined;
};
```

Solution for many selects in a single component

```typescript
FormSelectComponent<T extends object>(
  id?: string;
  render: (values: FormSelect<T>) => JSX.Element;
  objects: T[];
  format: (object: T) => FormSelectItem;
  formSelectStore?: FormSelectComponentStore<T>;
  defaultItem?: T;
): JSX.Element

export function useFormSelectStore<
  T extends object
>(): {
  get: (key: string) => FormSelect<T>;
  store: (key: string, values: FormSelect<T>) => void;
}
```

<b>Example</b>

```jsx
const App = () => {
  const formSelectStore = useFormSelectStore();
  const { objectSelected, onSelect, onClear } = formSelectStore.get("id");

  return (
    <FormSelectComponent
      id="id"
      objects={[
        {
          foo: "foo",
        },
      ]}
      format={() => ({
        value: "foo",
        label: "foo",
      })}
      render={() => <>foo</>}
      formSelectStore={formSelectStore}
    />
  );
};
```
