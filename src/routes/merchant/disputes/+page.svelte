<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Avatar, Pill, Banner, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { disputesStore } from '$lib/stores';

	onMount(() => { disputesStore.load(); });
</script>

<StatusBar />
<AppBar title="Contestações" sub="{disputesStore.data?.filter(d => d.status === 'OPEN').length ?? 0} abertas" />

{#if disputesStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if disputesStore.error}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><ErrorState sub={disputesStore.error} onretry={() => disputesStore.load()} /></div>
{:else if !disputesStore.data || disputesStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><EmptyState icon="flag" title="Sem contestações" sub="Nenhuma contestação encontrada" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<Banner tone="red" icon="flag" title="Contestações precisam de revisão">
			Resolva depressa para retomar a pontuação dos clientes e manter a confiança.
		</Banner>
		<div class="mz-list">
			{#each disputesStore.data as it}
				<a href={it.status === 'OPEN' ? '/merchant/disputes/resolve' : undefined} class="mz-row" style="align-items:flex-start;padding:14px;text-decoration:none;color:inherit">
					<Avatar name={it.customerName ?? 'Cliente'} tone="green" size={42} />
					<div class="mz-row__main">
						<div class="mz-row__title">{it.issueType}</div>
						<div class="mz-row__sub">{it.customerName} · {it.planProduct}</div>
						<div style="font-size:11.5px;color:var(--faint);margin-top:3px;font-weight:500">{it.openedAt}</div>
					</div>
					<div class="mz-row__end">
						{#if it.status === 'OPEN'}
							<Pill tone="red" dot>Aberta</Pill>
						{:else}
							<Pill tone="green" icon="check">Resolvida</Pill>
						{/if}
						<Icon name="chevR" size={16} style="color:var(--faint);margin-top:2px" />
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}

<HomeIndicator />
