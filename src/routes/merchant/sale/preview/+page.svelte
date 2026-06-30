<script lang="ts">
	import { StatusBar, AppBar, Btn, Pill, Banner, Footer, HomeIndicator, Icon, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { draftSale } from '$lib/stores/draftSale.svelte.js';
	import { previewPlan } from '$lib/api/plans.js';
	import { money0 } from '$lib/utils/money.js';
	import type { PlanPreviewResponse } from '$lib/api/types.js';

	let preview = $state<PlanPreviewResponse | null>(null);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		if (draftSale.isEmpty) {
			loading = false;
			return;
		}
		const res = await previewPlan({
			productValueCentavos: draftSale.value,
			downPaymentCentavos: draftSale.downPayment,
			installmentCount: draftSale.installmentCount,
			firstDueDate: draftSale.firstDueDate,
		});
		if (res.ok) {
			preview = res.data;
		} else {
			error = res.message || res.error || 'Não foi possível pré-visualizar o plano.';
		}
		loading = false;
	});
</script>

<StatusBar />
<AppBar title="Pré-visualizar plano" sub="Verifique antes de enviar" back />
<div class="mz-body mz-body--pad" style="gap:13px">
	{#if draftSale.isEmpty}
		<ErrorState title="Nenhum plano a pré-visualizar" sub="Crie uma venda primeiro" retryLabel="Criar venda" onretry={() => goto('/merchant/sale/create')} />
	{:else if loading}
		<div style="flex:1;display:flex;align-items:center;justify-content:center;color:var(--muted)">A carregar pré-visualização...</div>
	{:else if error}
		<ErrorState title="Erro na pré-visualização" sub={error} retryLabel="Tentar novamente" onretry={() => goto('/merchant/sale/create')} />
	{:else if preview}
		<div class="mz-card mz-card--pad">
			<div style="display:flex;align-items:center;gap:12px">
				<div style="width:44px;height:44px;border-radius:13px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;color:var(--ink-2)">
					<Icon name="phoneDev" size={22} stroke={1.7} />
				</div>
				<div style="flex:1;min-width:0">
					<div style="font-weight:600;font-size:15.5px;letter-spacing:-.2px">{draftSale.product || 'Produto'}</div>
					<div style="font-size:12.5px;color:var(--muted)">para {draftSale.customerName || 'Cliente'} · {draftSale.phone}</div>
				</div>
			</div>
			<div style="margin-top:6px">
				<div class="mz-key"><span class="mz-keyl">Valor do produto</span><span class="mz-keyv">{money0(draftSale.value)} MT</span></div>
				<div class="mz-key"><span class="mz-keyl">Entrada paga</span><span class="mz-keyv">− {money0(draftSale.downPayment)} MT</span></div>
				<div class="mz-key"><span class="mz-keyl" style="color:var(--ink);font-weight:700">Saldo restante</span><span class="mz-keyv" style="color:var(--blue-800);font-size:16px">{money0(preview.remainingBalanceCentavos)} MT</span></div>
			</div>
		</div>

		<div style="display:flex;align-items:center;justify-content:space-between">
			<span class="mz-h2" style="font-size:16px">Plano de {draftSale.installmentCount} prestações</span>
			<Pill tone="slate" icon="info">arredondado</Pill>
		</div>
		<div class="mz-list mz-list--card" style="margin-top:-3px">
			{#each preview.installments as inst}
				<div class="mz-row" style="padding:13px 15px">
					<div class="mz-step" style="background:var(--surface-2);color:var(--ink-2);width:34px;height:34px;border-radius:11px;font-size:13.5px">{inst.sequence}</div>
					<div class="mz-row__main">
						<div class="mz-row__title" style="font-size:14px">Prestação {inst.sequence}</div>
						<div class="mz-row__sub">{inst.dueDate}</div>
					</div>
					<span class="mz-money" style="font-size:15px;font-weight:600">{money0(inst.amountDueCentavos)} MT</span>
				</div>
			{/each}
		</div>
		<div style="margin-top:auto">
			<Banner tone="blue" icon="shield" title="Consentimento antes da obrigação">O cliente recebe um SMS para rever e confirmar. O plano só fica activo — e só conta para a pontuação — depois de ele confirmar.</Banner>
		</div>
	{/if}
</div>
<Footer><Btn variant="primary" block lg icon="send" onclick={() => { draftSale._persist(); goto('/merchant/sale/sent'); }}>Enviar para confirmação</Btn></Footer>
<HomeIndicator />
