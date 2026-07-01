<script lang="ts">
	import { onMount } from 'svelte';
	import {
		StatusBar,
		AppBar,
		Btn,
		Select,
		Segmented,
		MetricCard,
		MethodChip,
		Pill,
		Icon,
		Skeleton,
		ErrorState,
	} from '$lib/components/index.js';
	import { money, METHOD, PAYMENT_STATUS } from '$lib/utils/index.js';
	import { paymentsStore, customersStore, plansStore, toast } from '$lib/stores';
	import type { PaymentHistoryItem } from '$lib/api/types';

	type Method = 'mpesa' | 'cash' | 'bank';

	// Local reactive copy of the payment-history feed so inline registrations can prepend rows.
	let history = $state<PaymentHistoryItem[] | null>(null);
	let filter = $state('all');
	let showReg = $state(false);

	// ── Register form state ──
	let custId = $state('');
	let planId = $state('');
	let amount = $state('');
	let method = $state<Method>('mpesa');

	let selCustomer = $derived((customersStore.data ?? []).find((c) => c.id === custId) ?? null);
	let custPlans = $derived(selCustomer ? (plansStore.data ?? []).filter((p) => p.customerId === custId) : []);
	let selPlan = $derived(custPlans.find((p) => p.id === planId) ?? null);
	let amountNum = $derived(parseInt(amount, 10) || 0);
	let valid = $derived(!!custId && (custPlans.length === 0 || !!planId) && amountNum > 0);

	let customerOpts = $derived((customersStore.data ?? []).map((c) => ({ value: c.id, label: c.name })));
	let planOpts = $derived(
		custPlans.map((p) => ({
			value: p.id,
			label: `${p.productName ?? '—'} (${p.currentInstallment ?? 0}/${p.installmentsTotal ?? 0})`,
		})),
	);

	// On customer change: auto-select the sole plan (or clear).
	$effect(() => {
		if (custPlans.length === 1) {
			planId = custPlans[0].id;
		} else {
			planId = '';
			amount = '';
		}
	});

	// On plan change: suggest the per-installment amount.
	$effect(() => {
		if (selPlan) {
			const remaining = selPlan.remaining ?? 0;
			const left = Math.max(1, (selPlan.installmentsTotal ?? 0) - (selPlan.currentInstallment ?? 0) + 1);
			amount = String(Math.round(remaining / left));
		}
	});

	let filtered = $derived((history ?? []).filter((p) => filter === 'all' || p.method === filter));

	const filterOpts = [
		{ value: 'all', label: 'Todos' },
		{ value: 'mpesa', label: 'M-Pesa' },
		{ value: 'cash', label: 'Dinheiro' },
		{ value: 'bank', label: 'Transf.' },
	];

	const methodBtns: Method[] = ['mpesa', 'cash', 'bank'];
	const tableCols = '80px 1.6fr 1.4fr 1fr 120px 110px';

	function resetForm() {
		custId = '';
		planId = '';
		amount = '';
		method = 'mpesa';
	}

	function closeForm() {
		showReg = false;
		resetForm();
	}

	function confirm() {
		if (!valid || !selCustomer) return;
		const ref = METHOD[method].refPrefix + String(Math.floor(10000 + Math.random() * 90000));
		const time = new Date().toLocaleTimeString('pt', { hour: '2-digit', minute: '2-digit' });
		const row: PaymentHistoryItem = {
			id: `local-${Date.now()}`,
			customer: selCustomer.name,
			plan: selPlan?.productName ?? '—',
			amount: amountNum,
			method,
			status: 'confirmed',
			date: '30 Jun',
			time,
			ref,
		};
		history = [row, ...(history ?? [])];
		toast.show('Pagamento registado com sucesso', 'success');
		closeForm();
	}

	onMount(async () => {
		customersStore.load();
		plansStore.load();
		await paymentsStore.loadHistory();
		if (paymentsStore.history) history = [...paymentsStore.history];
	});
</script>

<StatusBar />
<AppBar title="Pagamentos" sub="{(history ?? []).length} transacções">
	{#snippet action()}
		{#if !showReg}
			<Btn variant="primary" sm icon="plus" onclick={() => (showReg = true)}>Registar Pagamento</Btn>
		{/if}
	{/snippet}
</AppBar>

{#if paymentsStore.error && history === null}
	<div class="mz-body mz-body--pad" style="gap:14px"><ErrorState sub={paymentsStore.error} onretry={() => paymentsStore.loadHistory()} /></div>
{:else if history === null}
	<div class="mz-body mz-body--pad" style="gap:14px"><Skeleton height="220px" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:14px">
		<!-- Inline register form -->
		{#if showReg}
			<div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:18px 20px">
				<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px">
					<span style="font-family:var(--display);font-weight:600;font-size:16px;letter-spacing:-.2px">Registar pagamento</span>
					<button
						type="button"
						aria-label="Fechar"
						onclick={closeForm}
						style="width:30px;height:30px;border-radius:8px;border:1px solid var(--line);background:var(--surface);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted)"
					>
						<Icon name="close" size={14} stroke={2} />
					</button>
				</div>

				<div class="grid gap-3.5 md:grid-cols-2">
					<Select label="Cliente" bind:value={custId} options={customerOpts} placeholder="Seleccionar cliente…" />
					<Select label="Plano" bind:value={planId} options={planOpts} placeholder="—" disabled={!custId || custPlans.length === 0} />

					<div class="mz-field">
						<span class="mz-field__lbl">Valor</span>
						<div style="display:flex;align-items:center;gap:6px">
							<input
								class="mz-field__inp"
								inputmode="numeric"
								placeholder="0"
								value={amount}
								oninput={(e) => (amount = e.currentTarget.value.replace(/[^0-9]/g, ''))}
								style="flex:1;min-width:0"
							/>
							<span style="font-size:13px;font-weight:600;color:var(--muted);flex:0 0 auto">MT</span>
						</div>
					</div>

					<div class="mz-field" style="gap:6px">
						<span class="mz-field__lbl">Método</span>
						<div style="display:flex;gap:6px">
							{#each methodBtns as m (m)}
								{@const on = method === m}
								<button
									type="button"
									onclick={() => (method = m)}
									style="flex:1 1 0;height:38px;border-radius:10px;border:{on ? '2px solid var(--blue-800)' : '1.5px solid var(--line)'};background:{on ? 'var(--blue-tint)' : 'var(--surface)'};color:{on ? 'var(--blue-800)' : 'var(--ink-2)'};font-family:var(--ui);font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;transition:all 120ms"
								>
									<Icon name={METHOD[m].icon} size={14} stroke={1.8} />
									{METHOD[m].label}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<div style="display:flex;justify-content:flex-end;margin-top:16px;padding-top:14px;border-top:1px solid var(--line-2)">
					<Btn variant="green" icon="check" disabled={!valid} onclick={confirm}>Confirmar</Btn>
				</div>
			</div>
		{/if}

		<!-- Metric strip -->
		{#if paymentsStore.historyStats}
			{@const stats = paymentsStore.historyStats}
			<div class="grid gap-3 grid-cols-2 sm:grid-cols-3">
				<MetricCard label="Total recebido (Jun)" value={money(stats.totalConfirmed)} tone="green" />
				<MetricCard label="Pendentes" value="{stats.pendingCount} pagamento{stats.pendingCount !== 1 ? 's' : ''}" tone="amber" />
				<MetricCard label="Método mais usado" value={METHOD[stats.mostUsedMethod].label} tone="blue" />
			</div>
		{/if}

		<!-- Filter bar -->
		<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
			<div style="flex:0 1 auto;min-width:0">
				<Segmented options={filterOpts} bind:value={filter} />
			</div>
			<span style="margin-left:auto;font-size:12px;color:var(--muted)">{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
		</div>

		<!-- History table -->
		<div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow-x:auto">
			<div style="min-width:640px">
				<div style="display:grid;grid-template-columns:{tableCols};padding:10px 16px;border-bottom:1px solid var(--line)">
					{#each ['Data', 'Cliente', 'Plano', 'Valor', 'Método', 'Estado'] as h (h)}
						<div style="font-size:10.5px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase">{h}</div>
					{/each}
				</div>
				{#each filtered as p, i (p.id)}
					{@const st = PAYMENT_STATUS[p.status]}
					<div style="display:grid;grid-template-columns:{tableCols};padding:12px 16px;align-items:center;{i ? 'border-top:1px solid var(--line-2)' : ''}">
						<div>
							<div style="font-size:13px;font-weight:500;color:var(--ink)">{p.date}</div>
							<div style="font-size:10.5px;color:var(--muted)">{p.time}</div>
						</div>
						<div style="font-size:13px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{p.customer}</div>
						<div style="font-size:13px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{p.plan}</div>
						<div class="mz-money" style="font-size:13.5px;font-weight:600">{money(p.amount)}</div>
						<div><MethodChip method={p.method} /></div>
						<div><Pill tone={st.tone} dot>{st.label}</Pill></div>
					</div>
				{/each}
				{#if filtered.length === 0}
					<div style="padding:32px 16px;text-align:center;color:var(--muted);font-size:13px">Sem pagamentos nesta categoria.</div>
				{/if}
			</div>
		</div>

		<div style="height:24px"></div>
	</div>
{/if}
