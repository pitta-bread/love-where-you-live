import type { ProjectCreateInput, TravelMode } from '$lib/types/domain';
import {
	DEFAULT_PROJECT_FORM_VALUES,
	type ProjectFieldErrors,
	type ProjectFormValues
} from '$lib/types/project-form';

const VALID_MODES: TravelMode[] = ['drive', 'transit', 'walk'];

export interface ParsedProjectForm {
	values: ProjectFormValues;
	fieldErrors: ProjectFieldErrors;
	data?: ProjectCreateInput;
}

function valueFromForm(formData: FormData, key: keyof ProjectFormValues): string {
	const value = formData.get(key);
	if (typeof value !== 'string') {
		return DEFAULT_PROJECT_FORM_VALUES[key];
	}

	return value.trim();
}

export function hasProjectFieldErrors(fieldErrors: ProjectFieldErrors): boolean {
	return Object.values(fieldErrors).some((fieldError) => fieldError !== undefined);
}

export function parseProjectForm(formData: FormData): ParsedProjectForm {
	const values: ProjectFormValues = {
		name: valueFromForm(formData, 'name'),
		area: valueFromForm(formData, 'area'),
		default_transport_mode: valueFromForm(formData, 'default_transport_mode')
	};

	const fieldErrors: ProjectFieldErrors = {};

	if (!values.name) {
		fieldErrors.name = 'Name is required.';
	} else if (values.name.length > 120) {
		fieldErrors.name = 'Name must be 120 characters or fewer.';
	}

	if (!values.area) {
		fieldErrors.area = 'Area is required.';
	} else if (values.area.length > 120) {
		fieldErrors.area = 'Area must be 120 characters or fewer.';
	}

	if (!VALID_MODES.includes(values.default_transport_mode as TravelMode)) {
		fieldErrors.default_transport_mode = 'Default transport must be drive, transit, or walk.';
	}

	if (hasProjectFieldErrors(fieldErrors)) {
		return { values, fieldErrors };
	}

	return {
		values,
		fieldErrors,
		data: {
			name: values.name,
			area: values.area,
			default_transport_mode: values.default_transport_mode as TravelMode
		}
	};
}
