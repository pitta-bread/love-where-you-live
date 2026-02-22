export type TravelMode = 'drive' | 'transit' | 'walk';

export interface AnchorSummary {
	name: string;
	mode: TravelMode;
	cadenceLabel: string;
}

export interface PropertyCardSummary {
	title: string;
	area: string;
	priceGbp: number;
	lifestyleMatch: number;
	commuteMins: number;
	gymMins: number;
	schoolMins: number;
}
