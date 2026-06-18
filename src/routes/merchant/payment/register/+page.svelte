<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StatusBar, AppBar, Btn, Avatar, Pill, Footer, HomeIndicator, OptionCard, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { plansStore, paymentsStore } from '$lib/stores';
	import { money, money0 } from '$lib/utils/index.js';
	import type { PlanSummary } from '$lib/api/types';

	let planId = $state('');
	let amountInput = $state('');
	let method = $state('M_PESA');
	let submitting = $state(false);
	let localError = $state('');

	let selectedPlan = $derived((plansStore.data ?? []).find((p) => p.id === planId) ?? null);
	let amountCentavos = $derived(() => {
		const normalized = amountInput.replace(/\./g, '').replace(',', '.');
		const value = parseFloat(normalized);
		if (!Number.isFinite(value) || value <= 0) return 0;
		return Math.round(value * 100);
	});
	let remainingMzn = $derived((selectedPlan?.remainingBalanceCentavos ?? 0) / 100);
	let exceedsBalance = $derived(amountCentavos() > (selectedPlan?.remainingBalanceCentavos ?? 0));

	onMount(() => {
		plansStore.load();
		const q = $page.url.searchParams.get('planId');
		if (q) planId = q;
	});

	function selectPlan(plan: PlanSummary) {
		planId = plan.id;
	}

	function methodLabel(m: string) {
		if (m === 'M_PESA') return { title: 'M-Pesa', sub: 'Transferência móvel', icon: 'mpesa' as const };
		if (m === 'CASH') return { title: 'Numerário', sub: 'Dinheiro em mão', icon: 'cash' as const };
		return { title: 'Transferência bancária', sub: 'Depósito ou IBAN', icon: 'bank' as const };
	}

	async function handleSubmit() {
		if (!selectedPlan || amountCentavos() <= 0 || exceedsBalance) return;
		localError = '';
		submitting = true;

		const session = await paymentsStore.startSession(selectedPlan.id);
		if (!session) {
			localError = paymentsStore.error || 'Não foi possível iniciar o registo.';
			submitting = false;
			return;
		}

		const idempotencyKey = `${selectedPlan.id}:${session.id}:${amountCentavos()}:${method}`;
		const payment = await paymentsStore.record(session.id, amountCentavos(), method, idempotencyKey);
		if (!payment) {
			localError = paymentsStore.error || 'Não foi possível registar o pagamento.';
			submitting = false;
			return;
		}

		submitting = false;
		goto('/merchant/payment/done');
	}
</script>

<StatusBar />
<AppBar title="Registar pagamento" back />

{#if plansStore.loading || !plansStore.data}
	<div class="mz-body mz-body--pad" style="gap:14px"><Skeleton height="200px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:14px"><ErrorState sub={plansStore.error} onretry={() => plansStore.load()} /></div>
{:else if !selectedPlan}
	<div class="mz-body mz-body--pad" style="gap:14px">
		<div class="mz-lbl">Seleccione um plano activo</div>
		{#each (plansStore.data ?? []).filter((p) => p.status === 'ACTIVE') as plan}
			<button class="mz-row" style="width:100%;text-align:left;background:none;border:1px solid var(--line);border-radius:18px;padding:14px" onclick={() => selectPlan(plan)}>
				<div style="width:42px;height:42px;border-radius:12px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><Icon name="doc" size={21} stroke={1.7} /></div>
				<div class="mz-row__main">
					<div class="mz-row__title">Plano {plan.id.slice(0, 8)}</div>
					<div class="mz-row__sub">{plan.installments.length} prestações · restam {money(plan.remainingBalanceCentavos / 100)}</div>
				</div>
				<Icon name="chevR" size={18} style="color:var(--faint)" />
			</button>
		{/each}
		{#if (plansStore.data ?? []).filter((p) => p.status === 'ACTIVE').length === 0}
			<EmptyState icon="doc" title="Sem planos activos" sub="Não há planos activos para registar pagamento." />
		{/if}
	</div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:14px">
		<div class="mz-card" style="padding:11px 13px;display:flex;align-items:center;gap:11px">
			<Avatar name="Cliente" tone="blue" size={38} />
			<div style="flex:1;min-width:0">
				<div style="font-weight:600;font-size:13.5px">Plano {selectedPlan.id.slice(0, 8)}</div>
				<div style="font-size:12px;color:var(--muted)">Restam {money(selectedPlan.remainingBalanceCentavos / 100)}</div>
			</div>
			<Pill tone="green" dot>Activo</Pill>
		</div>

		<div style="text-align:center;padding:14px 0 6px">
			<div class="mz-lbl" style="margin-bottom:8px">Montante recebido</div>
			<div style="display:flex;align-items:center;justify-content:center;gap:6px">
				<input
					type="text"
					inputmode="decimal"
					placeholder="0"
					bind:value={amountInput}
					class="mz-field__inp"
					style="width:140px;text-align:right;font-size:32px;font-weight:600;color:var(--ink);background:transparent;border:none"
				/>
				<span class="mz-money" style="font-size:22px;color:var(--muted);font-weight:600">MT</span>
			</div>
			{#if amountCentavos() > 0}
				<div style="margin-top:8px"><Pill tone={exceedsBalance ? 'red' : 'blue'}>{money(amountCentavos() / 100)}</Pill></div>
			{/if}
		</div>

		<div>
			<span class="mz-lbl" style="margin-left:2px">Método de pagamento</span>
			<div style="display:flex;flex-direction:column;gap:9px;margin-top:9px" role="radiogroup" aria-label="Método de pagamento">
				{#each ['M_PESA', 'CASH', 'BANK_TRANSFER'] as m}
					{@const lbl = methodLabel(m)}
					<OptionCard bind:value={method} option={m} title={lbl.title} sub={lbl.sub} icon={lbl.icon} />
				{/each}
			</div>
		</div>

		{#if localError}
			<div style="color:var(--red);font-size:13px;text-align:center">{localError}</div>
		{/if}

		<div style="margin-top:auto;display:flex;gap:8px;align-items:center;justify-content:center;color:var(--muted);font-size:11.5px;font-weight:500">
			<Icon name="info" size={15} stroke={1.9} />
			O MozPay regista o pagamento — não movimenta dinheiro.
		</div>
	</div>
{/if}

<Footer>
	{#if selectedPlan}
		<Btn
			variant="green"
			block
			lg
			icon="check"
			disabled={submitting || amountCentavos() <= 0 || exceedsBalance}
			onclick={handleSubmit}
		>
			{submitting ? 'A registar…' : 'Confirmar pagamento'}
		</Btn>
	{:else}
		<Btn variant="primary" block lg disabled onclick={() => {}}>Seleccione um plano</Btn>
	{/if}
</Footer>
<HomeIndicator />
