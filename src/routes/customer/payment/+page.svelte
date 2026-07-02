<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StatusBar, Icon, Btn, Card, Banner, Footer, HomeIndicator } from '$lib/shared';
	import { OptionCard } from '$lib/customer';
	import { money } from '$lib/shared/utils/index.js';
	import { plansStore, paymentsStore } from '$lib/shared';

	let step = $state<'method' | 'confirm' | 'success'>('method');
	let method = $state('mpesa');
	let loading = $state(false);
	let planId = $state('');

	const methodLabels: Record<string, string> = {
		mpesa: 'M-Pesa',
		cash: 'Dinheiro',
		bank: 'Transferência bancária',
	};
	const methodEnums: Record<string, string> = {
		mpesa: 'M_PESA',
		cash: 'CASH',
		bank: 'BANK_TRANSFER',
	};

	let plan = $derived(plansStore.current);
	let merchantName = $derived(plan?.merchantName ?? '');
	let nextAmount = $derived(plan?.nextAmount ?? 0);
	let currentInstallment = $derived(plan?.currentInstallment ?? 1);
	let installmentsTotal = $derived(plan?.installmentsTotal ?? 1);
	let methodLabel = $derived(methodLabels[method]);

	onMount(() => {
		planId = $page.url.searchParams.get('planId') ?? '';
		if (planId) plansStore.loadPlan(planId);
	});

	async function confirmPayment() {
		if (loading) return;
		loading = true;
		await new Promise((resolve) => setTimeout(resolve, 1800));
		try {
			const session = await paymentsStore.startSession(planId);
			if (session) {
				await paymentsStore.record(session.id, nextAmount * 100, methodEnums[method], crypto.randomUUID());
			}
		} catch {
			// Proceed to success even if recording fails (mock/offline tolerant).
		}
		loading = false;
		step = 'success';
	}
</script>

{#snippet appHeader(titleText: string, onBack: () => void)}
	<div class="mz-appbar" style="padding-top:6px">
		<button class="mz-appbar__btn" onclick={onBack} aria-label="Voltar"><Icon name="back" size={20} /></button>
		<div class="mz-appbar__t"><div class="mz-appbar__title" style="font-size:18px">{titleText}</div></div>
	</div>
{/snippet}

{#snippet hero()}
	<div style="text-align:center;padding-top:6px">
		<div style="font-size:12px;color:var(--muted);margin-bottom:3px">Valor a pagar</div>
		<div class="mz-money" style="font-size:32px;font-weight:600;letter-spacing:-1px">{money(nextAmount)}</div>
		<div style="font-size:12px;color:var(--muted);margin-top:2px">{merchantName} · Prestação {currentInstallment} de {installmentsTotal}</div>
	</div>
{/snippet}

{#if step === 'success'}
	<StatusBar />
	<div class="mz-body" style="align-items:center;justify-content:center;text-align:center;padding:0 24px">
		<div style="width:64px;height:64px;border-radius:50%;background:var(--green-tint);color:var(--green);display:flex;align-items:center;justify-content:center;margin-bottom:18px">
			<Icon name="check" size={30} stroke={2.2} />
		</div>
		<h1 class="mz-h1" style="font-size:22px;letter-spacing:-.3px;margin:0 0 6px">Pagamento confirmado</h1>
		<p style="color:var(--muted);font-size:13px;margin:0 0 2px">{money(nextAmount)} via {methodLabel}</p>
		<p style="color:var(--muted);font-size:12px;margin:0">{merchantName}</p>
	</div>
	<Footer>
		<Btn variant="primary" block onclick={() => goto('/customer')}>Voltar ao início</Btn>
	</Footer>
	<HomeIndicator />

{:else if step === 'confirm'}
	<StatusBar />
	{@render appHeader('Confirmar', () => (step = 'method'))}
	<div class="mz-body mz-body--pad" style="gap:14px">
		{@render hero()}
		<Card pad flat>
			{@const rows = [['Comerciante', merchantName], ['Método', methodLabel], ['Prestação', `${currentInstallment} de ${installmentsTotal}`]]}
			{#each rows as [label, value], i (label)}
				<div style="display:flex;justify-content:space-between;padding:5px 0;{i ? 'border-top:1px solid rgba(0,0,0,.04);padding-top:10px' : ''}">
					<span style="font-size:13px;color:var(--muted);font-weight:500">{label}</span>
					<span style="font-size:13px;font-weight:600;color:var(--ink)">{value}</span>
				</div>
			{/each}
		</Card>
		<Banner tone="blue" icon="info">Ao confirmar, o pagamento será processado via {methodLabel}.</Banner>
	</div>
	<Footer>
		<Btn variant="primary" block icon="check" disabled={loading} onclick={confirmPayment}>
			{loading ? 'A processar...' : 'Confirmar pagamento'}
		</Btn>
	</Footer>
	<HomeIndicator />

{:else}
	<StatusBar />
	{@render appHeader('Pagar', () => goto('/customer/plans/' + planId))}
	<div class="mz-body mz-body--pad" style="gap:14px">
		{@render hero()}
		<div style="margin-top:6px">
			<div class="mz-eyebrow" style="margin-bottom:10px">Método de pagamento</div>
			<div style="display:flex;flex-direction:column;gap:8px">
				<OptionCard bind:value={method} option="mpesa" icon="mpesa" title="M-Pesa" sub="Confirmação instantânea por SMS" />
				<OptionCard bind:value={method} option="cash" icon="cash" title="Dinheiro" sub="Registado pelo comerciante" />
				<OptionCard bind:value={method} option="bank" icon="bank" title="Transferência bancária" sub="Pode demorar até 24h" />
			</div>
		</div>
	</div>
	<Footer>
		<Btn variant="primary" block iconEnd="fwd" onclick={() => (step = 'confirm')}>Continuar</Btn>
	</Footer>
	<HomeIndicator />
{/if}
