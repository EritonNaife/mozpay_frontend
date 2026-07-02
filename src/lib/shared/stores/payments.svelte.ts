import {
	listPayments,
	listPaymentHistory,
	getPaymentStats,
	recordPayment,
	startPaymentRegistrationSession,
} from '$lib/shared/api';
import type {
	PaymentHistoryItem,
	PaymentHistoryStats,
	PaymentRecord,
	PaymentRecordDetail,
	PaymentRegistrationSession,
} from '$lib/shared/api/types';

class PaymentsStore {
	data: PaymentRecord[] | null = $state(null);
	history: PaymentHistoryItem[] | null = $state(null);
	historyStats: PaymentHistoryStats | null = $state(null);
	registrationSession: PaymentRegistrationSession | null = $state(null);
	lastPayment: PaymentRecordDetail | null = $state(null);
	loading = $state(false);
	error: string | null = $state(null);

	async load(planId: string) {
		this.loading = true;
		this.error = null;
		const res = await listPayments(planId);
		if (res.ok) {
			this.data = res.data;
		} else if (res.error === 'NOT_IMPLEMENTED') {
			this.data = [];
		} else {
			this.error = res.message || res.error;
		}
		this.loading = false;
	}

	/** Load the merchant payment-history feed and its aggregate stats. */
	async loadHistory() {
		this.loading = true;
		this.error = null;
		const [rows, stats] = await Promise.all([listPaymentHistory(), getPaymentStats()]);
		if (rows.ok) {
			this.history = rows.data;
		} else if (rows.error === 'NOT_IMPLEMENTED') {
			this.history = [];
		} else {
			this.error = rows.message || rows.error;
		}
		if (stats.ok) {
			this.historyStats = stats.data;
		} else if (stats.error === 'NOT_IMPLEMENTED') {
			this.historyStats = null;
		} else {
			this.error = stats.message || stats.error;
		}
		this.loading = false;
	}

	async startSession(planId: string): Promise<PaymentRegistrationSession | null> {
		this.loading = true;
		this.error = null;
		const res = await startPaymentRegistrationSession(planId);
		if (res.ok) {
			this.registrationSession = res.data;
			this.loading = false;
			return res.data;
		}
		this.error = res.message || res.error;
		this.loading = false;
		return null;
	}

	async record(
		registrationSessionId: string,
		amountCentavos: number,
		method: string,
		idempotencyKey: string,
	): Promise<PaymentRecordDetail | null> {
		this.loading = true;
		this.error = null;
		const res = await recordPayment(registrationSessionId, amountCentavos, method, idempotencyKey);
		if (res.ok) {
			this.lastPayment = res.data;
			this.loading = false;
			return res.data;
		}
		this.error = res.message || res.error;
		this.loading = false;
		return null;
	}
}

export const paymentsStore = new PaymentsStore();
