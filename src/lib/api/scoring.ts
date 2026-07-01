import { api } from './client';
import type { ApiResult } from './client';
import type { ScoreLabel } from './types';

/** A single trust-score factor row (customer score screen). */
export interface ScoreFactor {
	icon: string; // e.g. 'check' | 'clock'
	label: string;
	value: string;
	tone: 'green' | 'amber' | 'red' | 'slate';
}

interface CustomerScoreRaw {
	score: number;
	label: ScoreLabel;
	tier?: string;
	scoreOutOf?: number;
	factors?: ScoreFactor[];
}

export interface CustomerScore {
	score: number;
	label: ScoreLabel;
	// Optional customer-reference display fields
	tier?: string; // e.g. 'Perfil em consolidação'
	scoreOutOf?: number; // e.g. 100
	factors?: ScoreFactor[];
}

export async function getCustomerScore(): Promise<ApiResult<CustomerScore>> {
	const res = await api<CustomerScoreRaw>('/scoring/score', { method: 'GET' });
	if (!res.ok) return res;
	return {
		ok: true,
		data: {
			score: res.data.score,
			label: res.data.label,
			tier: res.data.tier,
			scoreOutOf: res.data.scoreOutOf,
			factors: res.data.factors,
		},
	};
}
