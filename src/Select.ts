import { useMemo, useState } from "react";
import { FormSelect, FormSelectItem } from "./Types";
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
  }, [objects]);

  const onSelect = (object?: T) => setObjectSelected(object);

  const onClear = () => setObjectSelected(undefined);

  return {
    suggestions,
    onSelect,
    onClear,
    objectSelected,
    itemSelected: objectSelected && format(objectSelected)
  };
}
