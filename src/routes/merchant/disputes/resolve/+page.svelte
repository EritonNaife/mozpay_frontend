<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Btn, Avatar, Pill, Banner, Footer, HomeIndicator, OptionCard, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast.svelte.js';
	import { disputesStore } from '$lib/stores';

	let resolution = $state('register');

	onMount(() => { disputesStore.load(); });
</script>

<StatusBar />
<AppBar title="Contestação" sub="Revisão do comerciante" back />

{#if disputesStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px"><Skeleton height="200px" /></div>
{:else if disputesStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px"><ErrorState sub={disputesStore.error} onretry={() => disputesStore.load()} /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:12px">
		<div class="mz-card mz-card--pad">
			<div style="display:flex;align-items:center;gap:11px">
				<Avatar name="Cliente" tone="green" size={40} />
				<div style="flex:1;min-width:0">
					<div style="font-weight:600;font-size:14.5px">Cliente</div>
					<div style="font-size:12px;color:var(--muted)">Contestação em revisão</div>
				</div>
				<Pill tone="red" dot>Aberta</Pill>
			</div>
			<div style="margin-top:12px;display:flex;align-items:center;gap:8px">
				<Pill tone="amber" icon="flag">A rever</Pill>
			</div>
		</div>

		<Banner tone="amber" icon="shield">
			A pontuação está <strong>em pausa</strong>. Não penalizamos o cliente enquanto a contestação estiver aberta.
		</Banner>

		<span class="mz-lbl" style="margin-left:2px;margin-top:2px">Como quer resolver?</span>
		<div style="display:flex;flex-direction:column;gap:9px" role="radiogroup" aria-label="Resolução">
			<OptionCard bind:value={resolution} option="register" title="Registar o pagamento" sub="Corrige o registo e retoma a pontuação a favor do cliente." icon="check" />
			<OptionCard bind:value={resolution} option="keep" title="Manter — sem alteração" sub="O registo está correcto. A pausa de pontuação é levantada." icon="close" />
		</div>
		<div style="display:flex;gap:7px;align-items:flex-start;color:var(--faint);font-size:11px;line-height:1.4">
			<Icon name="info" size={14} stroke={1.9} style="flex:0 0 auto;margin-top:1px" />
			O registo original é mantido. As correcções criam uma nova versão — nada é apagado.
		</div>
	</div>
{/if}

<Footer><Btn variant="primary" block lg onclick={() => { toast.show('Contestação resolvida', 'success'); goto('/merchant/disputes'); }}>Resolver contestação</Btn></Footer>
<HomeIndicator />
