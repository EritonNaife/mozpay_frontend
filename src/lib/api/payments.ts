import { api } from '../api';
import type { ApiResult } from '../api';
import type { PaymentRecord, PaymentRecordDetail, PaymentRegistrationSession } from './types';

interface PaymentRegistrationSessionRaw {
	id: string;
	plan_id: string;
	opened_at: string;
}

interface PaymentAllocationRaw {
	installment_id: string;
	sequence: number;
	allocated_centavos: number;
}

interface PaymentRecordDetailRaw {
	id: string;
	plan_id: string;
	registration_session_id: string;
	amount_centavos: number;
	method: string;
	status: string;
	disputed: boolean;
	recorded_at: string;
	allocations: PaymentAllocationRaw[];
}

interface PaymentRecordRaw {
	id: string;
	plan_id: string;
	registration_session_id: string;
	amount_centavos: number;
	method: string;
	status: string;
	disputed: boolean;
	recorded_at: string;
}

function mapPaymentRecord(raw: PaymentRecordRaw): PaymentRecord {
	return {
		id: raw.id,
		planId: raw.plan_id,
		registrationSessionId: raw.registration_session_id,
		amountCentavos: raw.amount_centavos,
		method: raw.method as PaymentRecord['method'],
		status: raw.status as PaymentRecord['status'],
		disputed: raw.disputed,
		recordedAt: raw.recorded_at,
	};
}

function mapPaymentRecordDetail(raw: PaymentRecordDetailRaw): PaymentRecordDetail {
	return {
		...mapPaymentRecord(raw),
		allocations: raw.allocations.map((a) => ({
			installmentId: a.installment_id,
			sequence: a.sequence,
			allocatedCentavos: a.allocated_centavos,
		})),
	};
}

export async function startPaymentRegistrationSession(planId: string): Promise<ApiResult<PaymentRegistrationSession>> {
	const res = await api<PaymentRegistrationSessionRaw>('/payments/registration-sessions', {
		method: 'POST',
		body: { plan_id: planId },
	});
	if (!res.ok) return res;
	return {
		ok: true,
		data: {
			id: res.data.id,
			planId: res.data.plan_id,
			openedAt: res.data.opened_at,
		},
	};
}

export async function recordPayment(
	registrationSessionId: string,
	amountCentavos: number,
	method: string,
	idempotencyKey: string,
): Promise<ApiResult<PaymentRecordDetail>> {
	const res = await api<PaymentRecordDetailRaw>('/payments', {
		method: 'POST',
		headers: { 'Idempotency-Key': idempotencyKey },
		body: {
			registration_session_id: registrationSessionId,
			amount_centavos: amountCentavos,
			method: method,
		},
	});
	if (!res.ok) return res;
	return { ok: true, data: mapPaymentRecordDetail(res.data) };
}

export async function listPayments(planId: string): Promise<ApiResult<PaymentRecord[]>> {
	const res = await api<PaymentRecordRaw[]>(`/plans/${planId}/payments`, { method: 'GET' });
	if (!res.ok) return res;
	return { ok: true, data: res.data.map(mapPaymentRecord) };
}

export async function confirmPayment(_id: string): Promise<ApiResult<PaymentRecord>> {
	return { ok: false, error: 'NOT_IMPLEMENTED' };
}
