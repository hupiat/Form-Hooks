import { useState } from "react";

export function useFormState<T extends object>(
	object?: T
): [T, (key: keyof T, attribute: any) => void] {
	const [formState, setFormState] = useState<T>(object || ({} as T));

	const handleUpdate = (key: keyof T, attribute: any): void => {
		if (formState[key] != null && typeof formState[key] !== typeof attribute) {
			throw Error(
				`Type mismatch ${typeof formState[key]} != ${typeof attribute}`
			);
		}
		setFormState({
			...formState,
			[key]: attribute
		});
	};

	return [formState, handleUpdate];
}
