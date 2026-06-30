import type { ApiResult } from '../client';
import type { PaymentRecord, PaymentRecordDetail, PaymentRegistrationSession } from '../types';
import { addPayment, getPaymentDetail, payments, plans, recordPaymentSession, uuid } from './data';

export async function startPaymentRegistrationSession(planId: string): Promise<ApiResult<PaymentRegistrationSession>> {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return { ok: false, error: 'NOT_FOUND', message: 'Plano não encontrado' };
    const session: PaymentRegistrationSession = { id: uuid(), planId, openedAt: new Date().toISOString() };
    recordPaymentSession(session);
    return { ok: true, data: session };
}

export async function recordPayment(
    registrationSessionId: string,
    amountCentavos: number,
    method: string,
    _idempotencyKey: string,
): Promise<ApiResult<PaymentRecordDetail>> {
    const session = payments.find((p) => p.registrationSessionId === registrationSessionId);
    const planId = session?.planId ?? plans[0].id;
    const payment: PaymentRecord = {
        id: uuid(),
        planId,
        registrationSessionId,
        amountCentavos,
        method: method as PaymentRecord['method'],
        status: 'RECORDED',
        disputed: false,
        recordedAt: new Date().toISOString(),
    };
    addPayment(payment);
    return { ok: true, data: getPaymentDetail(payment.id)! };
}

export async function listPayments(planId: string): Promise<ApiResult<PaymentRecord[]>> {
    return { ok: true, data: payments.filter((p) => p.planId === planId) };
}

export async function confirmPayment(id: string): Promise<ApiResult<PaymentRecord>> {
    const payment = payments.find((p) => p.id === id);
    if (!payment) return { ok: false, error: 'NOT_FOUND', message: 'Pagamento não encontrado' };
    return { ok: true, data: payment };
}
