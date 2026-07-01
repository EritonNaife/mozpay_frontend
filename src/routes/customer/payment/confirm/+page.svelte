<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, Btn, Pill, Banner, Footer, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { notificationsStore } from '$lib/stores';

	onMount(() => { notificationsStore.load(); });
</script>

<StatusBar />
<AppBar title="Confirmar pagamento" sub="Registado pelo comerciante" back />

{#if notificationsStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<Banner tone="amber" icon="bell" title="Um comerciante registou um pagamento">
			Confirme se está correcto. A sua confirmação mantém o registo limpo e protege a sua pontuação.
		</Banner>

		<!-- Amount display -->
		<div class="mz-card mz-card--pad" style="text-align:center;padding-top:20px;padding-bottom:18px">
			<div style="font-size:12.5px;color:var(--muted);font-weight:600">Valor registado</div>
			<div class="mz-money" style="font-size:40px;font-weight:600;letter-spacing:-1.2px;margin-top:4px">— <span style="font-size:20px;color:var(--muted)">MT</span></div>
			<div style="display:inline-flex;margin-top:10px"><Pill tone="blue">Pagamento pendente</Pill></div>
		</div>

		<!-- Plan details -->
		<div class="mz-card mz-card--pad" style="padding-top:2px;padding-bottom:2px">
			<div class="mz-key"><span class="mz-keyl">Plano</span><span class="mz-keyv">—</span></div>
			<div class="mz-key"><span class="mz-keyl">Prestação</span><span class="mz-keyv">—</span></div>
			<div class="mz-key"><span class="mz-keyl">Saldo após confirmar</span><span class="mz-keyv" style="color:var(--blue-800)">— MT</span></div>
		</div>

		<!-- Info note -->
		<div style="margin-top:auto;display:flex;gap:7px;align-items:flex-start;color:var(--faint);font-size:11.5px;line-height:1.4">
			<Icon name="info" size={15} stroke={1.9} style="flex:0 0 auto;margin-top:1px" />
			Se não fez este pagamento ou o valor está errado, abra uma contestação — a sua pontuação fica protegida enquanto reveem.
		</div>
	</div>
{/if}

<Footer>
	<a href="/customer/payment/done" style="text-decoration:none"><Btn variant="green" block icon="check">Confirmar — está correcto</Btn></a>
	<a href="/customer/dispute" style="text-decoration:none"><Btn variant="ghost" block icon="flag" style="color:var(--red)">Contestar este registo</Btn></a>
</Footer>
<HomeIndicator />
