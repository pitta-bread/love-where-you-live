export type TravelMode = 'drive' | 'transit' | 'walk';

export interface AnchorCreateInput {
	name: string;
	mode: TravelMode;
	address: string;
	frequency_per_week: number;
	importance_weight: number;
}

export interface AnchorRead extends AnchorCreateInput {
	id: number;
	created_at: string;
	updated_at: string;
}

export interface ProjectCreateInput {
	name: string;
	area: string;
	default_transport_mode: TravelMode;
}

export interface ProjectRead extends ProjectCreateInput {
	id: number;
	search_started_at: string;
	created_at: string;
	updated_at: string;
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
