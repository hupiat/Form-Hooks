import { useMemo } from "react";
import { FormSelect, FormSelectItem } from "./Types";
import _ from "lodash";

export function useFormSelect<T extends object>(
  objects: T[],
  format: (object: T) => FormSelectItem,
  defaultItem?: T
): FormSelect<T> {
  const suggestions = useMemo<FormSelectItem[]>(() => {
    return objects.map(format);
  }, [objects]);

  const findSelectItem = (suggestion: FormSelectItem) =>
    objects.find(obj => _.isEqual(format(obj), suggestion)) || defaultItem;

  return {
    suggestions,
    findSelectItem
  };
}
