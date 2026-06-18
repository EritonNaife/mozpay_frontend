import { api } from '../api';
import type { ApiResult } from '../api';
import type { ScoreLabel } from './types';

interface CustomerScoreRaw {
	score: number;
	label: ScoreLabel;
}

export interface CustomerScore {
	score: number;
	label: ScoreLabel;
}

export async function getCustomerScore(): Promise<ApiResult<CustomerScore>> {
	const res = await api<CustomerScoreRaw>('/scoring/score', { method: 'GET' });
	if (!res.ok) return res;
	return {
		ok: true,
		data: {
			score: res.data.score,
			label: res.data.label,
		},
	};
}
