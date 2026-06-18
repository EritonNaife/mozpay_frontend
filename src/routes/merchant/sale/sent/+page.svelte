<script lang="ts">
	import { StatusBar, AppBar, Btn, Pill, Footer, HomeIndicator, Icon, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { toast } from '$lib/stores/toast.svelte.js';
	import { draftSale } from '$lib/stores/draftSale.svelte.js';
	import { createPlan } from '$lib/api/plans.js';

	let sending = $state(true);
	let error = $state<string | null>(null);
	let productName = $state(draftSale.product);

	const steps = [
		{ lbl: 'Venda criada', done: true, active: false },
		{ lbl: 'SMS de confirmação enviado', done: true, active: false },
		{ lbl: 'A aguardar confirmação do cliente', done: false, active: true },
		{ lbl: 'Plano activo', done: false, active: false },
	];

	onMount(async () => {
		if (draftSale.isEmpty) {
			sending = false;
			error = 'Nenhuma venda para enviar.';
			return;
		}
		const res = await createPlan({
			productValueCentavos: draftSale.value,
			downPaymentCentavos: draftSale.downPayment,
			installmentCount: draftSale.installmentCount,
			firstDueDate: draftSale.firstDueDate,
			customerName: draftSale.customerName,
			customerPhoneNumber: draftSale.phone,
			productName: draftSale.product,
		});
		if (res.ok) {
			draftSale.reset();
		} else {
			error = res.message || res.error || 'Não foi possível criar o plano.';
		}
		sending = false;
	});

	function goHome() {
		goto('/merchant');
	}

	function retry() {
		sending = true;
		error = null;
		window.location.reload();
	}
</script>

<StatusBar />
<AppBar back />
<div class="mz-body mz-body--pad">
	{#if sending}
		<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;color:var(--muted)">
			<div class="mz-dot" style="width:48px;height:48px;border-radius:50%;background:var(--blue-tint);display:flex;align-items:center;justify-content:center">
				<Icon name="send" size={24} stroke={2} style="color:var(--blue-800)" />
			</div>
			<span>A enviar o pedido de confirmação...</span>
		</div>
	{:else if error}
		<div style="flex:1;display:flex;flex-direction:column;justify-content:center">
			<ErrorState title="Erro ao criar o plano" sub={error} retryLabel="Tentar novamente" onretry={retry} />
		</div>
	{:else}
		<div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:14px">
			<div style="width:84px;height:84px;border-radius:50%;background:var(--blue-tint);display:flex;align-items:center;justify-content:center">
				<div style="width:60px;height:60px;border-radius:50%;background:var(--blue-800);display:flex;align-items:center;justify-content:center;color:#fff">
					<Icon name="send" size={26} stroke={2} />
				</div>
			</div>
			<h1 class="mz-h1" style="margin-top:18px;font-size:23px">Pedido enviado</h1>
			<p class="mz-sub" style="margin-top:8px;max-width:290px">Enviamos um SMS ao cliente com o link de confirmação. O plano fica pendente até confirmar.</p>
		</div>
		<div class="mz-card mz-card--pad" style="margin-top:22px">
			<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
				<span style="font-weight:700;font-size:13.5px">{productName || 'Produto'}</span>
				<Pill tone="amber" dot>Aguarda confirmação</Pill>
			</div>
			{#each steps as s}
				<div style="display:flex;align-items:center;gap:11px;padding:6px 0">
					<div style="width:22px;height:22px;border-radius:50%;flex:0 0 auto;background:{s.done ? 'var(--green)' : s.active ? 'var(--amber-tint)' : 'var(--surface-2)'};border:{s.active ? '2px solid var(--amber)' : 'none'};display:flex;align-items:center;justify-content:center;color:#fff">
						{#if s.done}<Icon name="check" size={13} stroke={2.6} />{/if}
						{#if s.active}<span class="mz-dot" style="background:var(--amber);width:8px;height:8px"></span>{/if}
					</div>
					<span style="font-size:13.5px;font-weight:{s.active ? 700 : 500};color:{s.done ? 'var(--ink)' : s.active ? 'var(--amber)' : 'var(--faint)'}">{s.lbl}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>
<Footer>
	<Btn variant="ghost" block icon="refresh" onclick={() => toast.show('SMS reenviado', 'success')}>Reenviar SMS de confirmação</Btn>
	<Btn variant="primary" block onclick={goHome}>Voltar ao início</Btn>
</Footer>
<HomeIndicator />
