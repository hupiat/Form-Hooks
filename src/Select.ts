import { useMemo, useState } from "react";
import { FormSelect, FormSelectItem } from "./Types";
import _ from "lodash";

export function useFormSelect<T extends object>(
  objects: T[],
  format: (object: T) => FormSelectItem,
  defaultItem?: T
): FormSelect<T> {
  const [selected, setSelected] = useState<T | undefined>(defaultItem);

  const suggestions = useMemo<FormSelectItem[]>(() => {
    return objects.map(format);
  }, [objects]);

  const onSelect = (object?: T) => setSelected(object);

  const onClear = () => setSelected(undefined);

  return {
    suggestions,
    onSelect,
    onClear,
    selected: selected && format(selected)
  };
}
