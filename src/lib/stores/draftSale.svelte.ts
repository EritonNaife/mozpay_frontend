import { money } from '$lib/utils/money.js';

export interface ScheduleItem { n: number; amount: number; rounded: boolean; }

const KEY = 'mz_draft_sale';

function defaultDueDate() {
	const d = new Date();
	d.setDate(d.getDate() + 30);
	return d.toISOString().slice(0, 10);
}

function load() {
	if (typeof sessionStorage === 'undefined') return null;
	try { return JSON.parse(sessionStorage.getItem(KEY) ?? 'null'); } catch { return null; }
}

class DraftSale {
	customerName = $state('');
	phone = $state('');
	product = $state('');
	value = $state(0);
	downPayment = $state(0);
	installmentCount = $state(3);
	firstDueDate = $state(defaultDueDate());

	_persist() {
		if (typeof sessionStorage === 'undefined') return;
		sessionStorage.setItem(KEY, JSON.stringify({
			customerName: this.customerName,
			phone: this.phone,
			product: this.product,
			value: this.value,
			downPayment: this.downPayment,
			installmentCount: this.installmentCount,
			firstDueDate: this.firstDueDate,
		}));
	}

	constructor() {
		const s = load();
		if (s) Object.assign(this, s);
		if (!this.firstDueDate) this.firstDueDate = defaultDueDate();
	}

	get balance() { return Math.max(0, this.value - this.downPayment); }
	get balanceLabel() { return money(this.balance); }

	get schedule(): ScheduleItem[] {
		const n = Math.max(1, this.installmentCount);
		const base = Math.floor(this.balance / n);
		const out: ScheduleItem[] = [];
		let acc = 0;
		for (let i = 0; i < n; i++) {
			const isLast = i === n - 1;
			const amt = isLast ? this.balance - acc : base;
			acc += amt;
			out.push({ n: i + 1, amount: amt, rounded: isLast && amt !== base });
		}
		return out;
	}

	get isEmpty() { return !this.product && this.value === 0; }

	reset() {
		Object.assign(this, { customerName: '', phone: '', product: '', value: 0, downPayment: 0, installmentCount: 3, firstDueDate: defaultDueDate() });
		this._persist();
	}
}

export const draftSale = new DraftSale();
