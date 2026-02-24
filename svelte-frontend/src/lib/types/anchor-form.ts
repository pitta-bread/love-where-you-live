export interface AnchorFormValues {
	name: string;
	address: string;
	mode: string;
	frequency_per_week: string;
	importance_weight: string;
}

export interface AnchorFieldErrors {
	name?: string;
	address?: string;
	mode?: string;
	frequency_per_week?: string;
	importance_weight?: string;
}

export interface AnchorActionFormState {
	values: AnchorFormValues;
	fieldErrors: AnchorFieldErrors;
	formError?: string | null;
}

export const DEFAULT_ANCHOR_FORM_VALUES: AnchorFormValues = {
	name: '',
	address: '',
	mode: 'transit',
	frequency_per_week: '5',
	importance_weight: '3'
};
