import type { AnchorCreateInput, TravelMode } from '$lib/types/domain';
import {
	DEFAULT_ANCHOR_FORM_VALUES,
	type AnchorFieldErrors,
	type AnchorFormValues
} from '$lib/types/anchor-form';

const VALID_MODES: TravelMode[] = ['drive', 'transit', 'walk'];

export interface ParsedAnchorForm {
	values: AnchorFormValues;
	fieldErrors: AnchorFieldErrors;
	data?: AnchorCreateInput;
}

function valueFromForm(formData: FormData, key: keyof AnchorFormValues): string {
	const value = formData.get(key);
	if (typeof value !== 'string') {
		return DEFAULT_ANCHOR_FORM_VALUES[key];
	}

	return value.trim();
}

function parseIntegerInRange(value: string, min: number, max: number): number | null {
	if (!/^\d+$/.test(value)) {
		return null;
	}

	const parsed = Number(value);
	if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
		return null;
	}

	return parsed;
}

export function hasFieldErrors(fieldErrors: AnchorFieldErrors): boolean {
	return Object.values(fieldErrors).some((fieldError) => fieldError !== undefined);
}

export function parseAnchorForm(formData: FormData): ParsedAnchorForm {
	const values: AnchorFormValues = {
		name: valueFromForm(formData, 'name'),
		address: valueFromForm(formData, 'address'),
		mode: valueFromForm(formData, 'mode'),
		frequency_per_week: valueFromForm(formData, 'frequency_per_week'),
		importance_weight: valueFromForm(formData, 'importance_weight')
	};

	const fieldErrors: AnchorFieldErrors = {};

	if (!values.name) {
		fieldErrors.name = 'Name is required.';
	} else if (values.name.length > 120) {
		fieldErrors.name = 'Name must be 120 characters or fewer.';
	}

	if (!values.address) {
		fieldErrors.address = 'Address is required.';
	} else if (values.address.length > 255) {
		fieldErrors.address = 'Address must be 255 characters or fewer.';
	}

	if (!VALID_MODES.includes(values.mode as TravelMode)) {
		fieldErrors.mode = 'Mode must be drive, transit, or walk.';
	}

	const frequencyPerWeek = parseIntegerInRange(values.frequency_per_week, 1, 14);
	if (frequencyPerWeek === null) {
		fieldErrors.frequency_per_week = 'Frequency must be an integer between 1 and 14.';
	}

	const importanceWeight = parseIntegerInRange(values.importance_weight, 1, 5);
	if (importanceWeight === null) {
		fieldErrors.importance_weight = 'Importance must be an integer between 1 and 5.';
	}

	if (hasFieldErrors(fieldErrors) || frequencyPerWeek === null || importanceWeight === null) {
		return { values, fieldErrors };
	}

	return {
		values,
		fieldErrors,
		data: {
			name: values.name,
			address: values.address,
			mode: values.mode as TravelMode,
			frequency_per_week: frequencyPerWeek,
			importance_weight: importanceWeight
		}
	};
}
