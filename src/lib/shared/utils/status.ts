/** Shared status/label maps (framework-agnostic). `Tone` matches the Pill tone union. */
export type Tone = 'green' | 'amber' | 'red' | 'blue' | 'slate';

export const PLAN_STATUS = {
	active:    { label: 'Activo',      tone: 'green' as Tone },
	due_today: { label: 'Vence hoje',  tone: 'amber' as Tone },
	overdue:   { label: 'Em atraso',   tone: 'red'   as Tone },
	pending:   { label: 'Pendente',    tone: 'blue'  as Tone },
} as const;

export const RISK = {
	low:    { label: 'Baixo', tone: 'green' as Tone },
	medium: { label: 'Médio', tone: 'amber' as Tone },
	high:   { label: 'Alto',  tone: 'red'   as Tone },
} as const;

export const RISK_LONG = {
	low:    { label: 'Baixo risco', tone: 'green' as Tone },
	medium: { label: 'Médio risco', tone: 'amber' as Tone },
	high:   { label: 'Alto risco',  tone: 'red'   as Tone },
} as const;

export const METHOD = {
	mpesa: { label: 'M-Pesa',         icon: 'mpesa', refPrefix: 'MP-' },
	cash:  { label: 'Dinheiro',       icon: 'cash',  refPrefix: 'CX-' },
	bank:  { label: 'Transferência',  icon: 'bank',  refPrefix: 'TB-' },
} as const;

export const PAYMENT_STATUS = {
	confirmed: { label: 'Confirmado', tone: 'green' as Tone },
	pending:   { label: 'Pendente',   tone: 'amber' as Tone },
} as const;

export const DISPUTE_STATUS = {
	open:     { label: 'Aberta',    tone: 'red'   as Tone, icon: 'flag'  },
	review:   { label: 'Em análise', tone: 'amber' as Tone, icon: 'clock' },
	resolved: { label: 'Resolvida', tone: 'green' as Tone, icon: 'check' },
} as const;
