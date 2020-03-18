# Form-Hooks

Lightweight hooks to deal with React forms

`npm i form-hooks-light --save`

# API

- Sets a state for an object, with a generic type-safe setter

```typescript
useFormState: <T extends object>(object?: T) => [formState, setFormState];
```

- Validation schema are made using a mix of Yup (https://github.com/jquense/yup)
  and boolean validation functions

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
  foo2: Yup.number.max(10)
};
```

- Tool for selects

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
  id: string;
  render: (values: FormSelect<T>) => JSX.Element;
  objects: T[];
  format: (object: T) => FormSelectItem;
  componentsStore?: FormSelectComponentStore<T>;
  defaultItem?: T;
): JSX.Element

export function useFormSelectComponentsStore<
  T extends object
>(): {
  get: (key: string) => FormSelect<T>;
  store: (key: string, values: FormSelect<T>) => void;
}
```

<b>Example</b>

```jsx
const App = () => {
  const componentsStore = useFormSelectComponentsStore();
  const { objectSelected, onSelect, onClear } = componentsStore.get("id");

  return (
    <FormSelectComponent
      id="id"
      objects={[
        {
          foo: "foo"
        }
      ]}
      format={() => ({
        value: "foo",
        label: "foo"
      })}
      render={() => <>foo</>}
      componentsStore={componentsStore}
    />
  );
};
```
