import { describe, expect, it } from 'vitest';
import { hasFieldErrors, parseAnchorForm } from './anchor-form';

function formData(overrides: Partial<Record<string, string>> = {}): FormData {
	const data = new FormData();
	const defaults: Record<string, string> = {
		name: 'Temple Quay Office',
		address: '1 Glass Wharf, Bristol BS2 0EL',
		mode: 'transit',
		frequency_per_week: '5',
		importance_weight: '4'
	};

	for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
		if (value !== undefined) {
			data.set(key, value);
		}
	}

	return data;
}

describe('parseAnchorForm', () => {
	it('returns a parsed payload for valid values', () => {
		const parsed = parseAnchorForm(formData());

		expect(hasFieldErrors(parsed.fieldErrors)).toBe(false);
		expect(parsed.data).toEqual({
			name: 'Temple Quay Office',
			address: '1 Glass Wharf, Bristol BS2 0EL',
			mode: 'transit',
			frequency_per_week: 5,
			importance_weight: 4
		});
	});

	it('returns an error for empty name', () => {
		const parsed = parseAnchorForm(formData({ name: '   ' }));

		expect(parsed.fieldErrors.name).toBe('Name is required.');
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for empty address', () => {
		const parsed = parseAnchorForm(formData({ address: '' }));

		expect(parsed.fieldErrors.address).toBe('Address is required.');
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for unsupported travel mode', () => {
		const parsed = parseAnchorForm(formData({ mode: 'bike' }));

		expect(parsed.fieldErrors.mode).toBe('Mode must be drive, transit, or walk.');
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for frequency outside supported range', () => {
		const parsed = parseAnchorForm(formData({ frequency_per_week: '0' }));

		expect(parsed.fieldErrors.frequency_per_week).toBe(
			'Frequency must be an integer between 1 and 14.'
		);
		expect(parsed.data).toBeUndefined();
	});

	it('returns an error for non-integer importance weight', () => {
		const parsed = parseAnchorForm(formData({ importance_weight: '2.5' }));

		expect(parsed.fieldErrors.importance_weight).toBe(
			'Importance must be an integer between 1 and 5.'
		);
		expect(parsed.data).toBeUndefined();
	});
});
