<script lang="ts">
	import { StatusBar, AppBar, Btn, Field, Footer, HomeIndicator, Icon, Segmented } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { draftSale } from '$lib/stores/draftSale.svelte.js';

	const instOpts = [
		{ value: '1', label: '1 prestação' },
		{ value: '2', label: '2 prestações' },
		{ value: '3', label: '3 prestações' },
	];

	let valStr = $state(String(draftSale.value || ''));
	let dpStr = $state(String(draftSale.downPayment || ''));
	let instStr = $state(String(draftSale.installmentCount));

	function persist() {
		draftSale._persist();
	}
</script>

<StatusBar />
<AppBar title="Nova venda" sub="A prestações · consentida pelo cliente" back />
<div class="mz-body mz-body--pad" style="gap:12px">
	<div style="display:flex;flex-direction:column;gap:10px">
		<Field label="Nome do cliente" bind:value={draftSale.customerName} input oninput={persist} />
		<div>
			<Field label="Telefone do cliente" bind:value={draftSale.phone} input type="tel" inputmode="tel" oninput={persist} />
			<div style="display:flex;gap:6px;align-items:center;margin-top:7px;margin-left:2px;color:var(--muted);font-size:11.5px">
				<Icon name="send" size={14} stroke={1.9} style="color:var(--blue-800)" />
				O pedido de confirmação é enviado para este número.
			</div>
		</div>
		<Field label="Produto" bind:value={draftSale.product} input oninput={persist} />
		<div style="display:flex;gap:10px">
			<div style="flex:1 1 0">
				<Field label="Valor do produto" bind:value={valStr} input type="numeric" inputmode="numeric" oninput={(v) => { draftSale.value = Number(v) || 0; persist(); }} />
			</div>
			<div style="flex:1 1 0">
				<Field label="Entrada" bind:value={dpStr} input type="numeric" inputmode="numeric" oninput={(v) => { draftSale.downPayment = Number(v) || 0; persist(); }} />
			</div>
		</div>
		<div>
			<span class="mz-lbl" style="margin-left:2px">Número de prestações</span>
			<div style="margin-top:7px">
				<Segmented options={instOpts} bind:value={instStr} onchange={(v) => { draftSale.installmentCount = Number(v); persist(); }} />
			</div>
		</div>
		<Field label="Primeira data de vencimento" type="date" bind:value={draftSale.firstDueDate} input oninput={persist} />
	</div>
	<div class="mz-card mz-card--pad" style="background:var(--blue-tint);border:none;display:flex;align-items:center;justify-content:space-between">
		<span style="font-size:13px;font-weight:600;color:var(--blue-800)">Saldo a financiar</span>
		<span class="mz-money" style="font-size:20px;font-weight:600;color:var(--blue-900)">{draftSale.balanceLabel}</span>
	</div>
</div>
<Footer><Btn variant="primary" block lg iconEnd="fwd" onclick={() => goto('/merchant/sale/preview')}>Pré-visualizar plano</Btn></Footer>
<HomeIndicator />
