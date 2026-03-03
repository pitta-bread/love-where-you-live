export interface ProjectFormValues {
	name: string;
	area: string;
	default_transport_mode: string;
}

export interface ProjectFieldErrors {
	name?: string;
	area?: string;
	default_transport_mode?: string;
}

export interface ProjectActionFormState {
	values: ProjectFormValues;
	fieldErrors: ProjectFieldErrors;
	formError?: string | null;
}

export const DEFAULT_PROJECT_FORM_VALUES: ProjectFormValues = {
	name: '',
	area: '',
	default_transport_mode: 'drive'
};
