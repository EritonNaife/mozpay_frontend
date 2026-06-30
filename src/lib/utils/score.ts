export type ScoreTone = 'green' | 'amber' | 'red';

export interface ScoreInfo {
	tone: ScoreTone;
	merchant: string;
	customer: string;
}

export function scoreInfo(score: number, backendLabel?: string): ScoreInfo {
	if (score >= 80 || backendLabel === 'Excellent') return { tone: 'green', merchant: 'Baixo risco', customer: 'Excelente' };
	if (score >= 40 || backendLabel === 'Building') return { tone: 'amber', merchant: 'Médio risco', customer: 'Em construção' };
	return { tone: 'red', merchant: 'Alto risco', customer: 'Precisa de atenção' };
}
