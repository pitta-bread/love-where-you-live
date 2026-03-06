import { describe, expect, it } from 'vitest';
import { hasProjectFieldErrors, parseProjectForm } from './project-form';

function formData(overrides: Partial<Record<string, string>> = {}): FormData {
	const data = new FormData();
	const defaults: Record<string, string> = {
		name: 'Bristol Move',
		area: 'Somerset',
		default_transport_mode: 'drive'
	};

	for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
		if (value !== undefined) {
			data.set(key, value);
		}
	}

	return data;
}

describe('parseProjectForm', () => {
	it('returns a parsed payload for valid values', () => {
		const parsed = parseProjectForm(formData());

		expect(hasProjectFieldErrors(parsed.fieldErrors)).toBe(false);
		expect(parsed.data).toEqual({
			name: 'Bristol Move',
			area: 'Somerset',
			default_transport_mode: 'drive'
		});
	});

	it('returns an error for empty name', () => {
		const parsed = parseProjectForm(formData({ name: '   ' }));

		expect(parsed.fieldErrors.name).toBe('Name is required.');
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for empty area', () => {
		const parsed = parseProjectForm(formData({ area: '' }));

		expect(parsed.fieldErrors.area).toBe('Area is required.');
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for unsupported default transport', () => {
		const parsed = parseProjectForm(formData({ default_transport_mode: 'bike' }));

		expect(parsed.fieldErrors.default_transport_mode).toBe(
			'Default transport must be drive, transit, or walk.'
		);
		expect(parsed.data).toBeUndefined();
	});
});
