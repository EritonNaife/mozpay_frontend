<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Btn, Banner, Footer, HomeIndicator, Icon, Skeleton, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { paymentsStore } from '$lib/stores';
	import { money } from '$lib/utils/index.js';

	onMount(() => {
		if (!paymentsStore.lastPayment && paymentsStore.registrationSession) {
			paymentsStore.load(paymentsStore.registrationSession.planId);
		}
	});

	const payment = $derived(paymentsStore.lastPayment);
	const methodLabel = $derived(() => {
		if (!payment) return '—';
		if (payment.method === 'M_PESA') return 'M-Pesa';
		if (payment.method === 'CASH') return 'Numerário';
		return 'Transferência bancária';
	});
</script>

<StatusBar />
<AppBar back />

{#if paymentsStore.loading}
	<div class="mz-body mz-body--pad"><Skeleton height="200px" /></div>
{:else if paymentsStore.error}
	<div class="mz-body mz-body--pad"><ErrorState sub={paymentsStore.error} /></div>
{:else if !payment}
	<div class="mz-body mz-body--pad">
		<div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:14px">
			<h1 class="mz-h1" style="margin-top:18px;font-size:23px">Nenhum pagamento recente</h1>
			<p class="mz-sub" style="margin-top:8px;max-width:280px">Volte ao registo para continuar.</p>
		</div>
	</div>
{:else}
	<div class="mz-body mz-body--pad">
		<div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:14px">
			<div style="width:84px;height:84px;border-radius:50%;background:var(--green-tint);display:flex;align-items:center;justify-content:center">
				<div style="width:60px;height:60px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;color:#fff">
					<Icon name="check" size={30} stroke={2.6} />
				</div>
			</div>
			<h1 class="mz-h1" style="margin-top:18px;font-size:23px">Pagamento registado</h1>
			<p class="mz-sub" style="margin-top:8px;max-width:280px">Enviámos uma confirmação por SMS ao cliente para ele poder verificar o registo.</p>
		</div>
		<div class="mz-card mz-card--pad" style="margin-top:22px">
			<div class="mz-key" style="padding-top:4px"><span class="mz-keyl">Montante</span><span class="mz-keyv">{money(payment.amountCentavos / 100)}</span></div>
			<div class="mz-key"><span class="mz-keyl">Método</span><span class="mz-keyv">{methodLabel()}</span></div>
			<div class="mz-key"><span class="mz-keyl">Prestação</span><span class="mz-keyv">{#if payment.allocations.length > 0}#{payment.allocations[0].sequence}{:else}—{/if}</span></div>
			<div class="mz-key"><span class="mz-keyl" style="color:var(--ink);font-weight:700">Novo saldo</span><span class="mz-keyv" style="color:var(--blue-800)">— MT</span></div>
		</div>
		<div style="margin-top:13px">
			<Banner tone="green" icon="arrowUp" title="Pontuação de confiança sobe">Pagamento a tempo. A pontuação do cliente melhora com cada prestação paga.</Banner>
		</div>
	</div>
{/if}

<Footer>
	<Btn variant="ghost" block onclick={() => goto('/merchant/customers')}>Ver planos</Btn>
	<Btn variant="primary" block onclick={() => goto('/merchant')}>Concluído</Btn>
</Footer>
<HomeIndicator />
