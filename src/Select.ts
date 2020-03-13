import { useMemo, useState, useEffect } from "react";
import {
  FormSelect,
  FormSelectItem,
  FormSelectComponentProps,
  FormSelectComponentStore
} from "./Types";
import _ from "lodash";

export function useFormSelect<T extends object>(
  objects: T[],
  format: (object: T) => FormSelectItem,
  defaultItem?: T
): FormSelect<T> {
  const [objectSelected, setObjectSelected] = useState<T | undefined>(
    defaultItem
  );

  const suggestions = useMemo<FormSelectItem[]>(() => {
    return objects.map(format);
  }, [objects, format]);

  const onSelect = (object: T) => setObjectSelected(object);

  const onClear = () => setObjectSelected(defaultItem);

  return {
    suggestions,
    onSelect,
    onClear,
    objectSelected,
    itemSelected: objectSelected && format(objectSelected)
  };
}

// More convenient for many selects in a single component

// We use a FormSelectComponent to wrap the useFormSelect
// and we store the values in a ref to get them using a key

type FormSelectComponentStored<T extends object> = {
  [K in keyof T]: FormSelect<T>;
};

export function useFormSelectComponentsStore<
  T extends object
>(): FormSelectComponentStore<T> {
  const [store, setStore] = useState<FormSelectComponentStored<T>>({} as any);

  const doGet = (key: keyof T) => store[key] || {};

  const doStore = (key: keyof T, values: FormSelect<T>) =>
    setStore((store: FormSelectComponentStored<T>) => {
      store[key] = values;
      return _.cloneDeep(store);
    });

  return {
    get: doGet,
    store: doStore
  };
}

export function FormSelectComponent<T extends object>(
  props: FormSelectComponentProps<T>
): JSX.Element {
  const values = useFormSelect<T>(
    props.objects,
    props.format,
    props.defaultItem
  );
  useEffect(() => {
    if (
      props.componentsStore &&
      _.isEmpty(props.componentsStore.get(props.id))
    ) {
      props.componentsStore.store(props.id, values);
    }
  }, [props.componentsStore, props.id, values]);

  return props.render(values);
}
