export interface ToastItem { id: number; message: string; tone?: 'info' | 'success' | 'error'; }

class ToastStore {
	items = $state<ToastItem[]>([]);

	show(message: string, tone: ToastItem['tone'] = 'info', ms = 2400) {
		const id = Date.now() + Math.random();
		this.items.push({ id, message, tone });
		setTimeout(() => this.dismiss(id), ms);
	}

	dismiss(id: number) {
		this.items = this.items.filter(t => t.id !== id);
	}
}

export const toast = new ToastStore();
