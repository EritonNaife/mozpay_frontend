<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { StatusBar, AppBar, Avatar, Pill, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { RISK, money } from '$lib/utils/index.js';
	import { customersStore } from '$lib/stores';

	onMount(() => { customersStore.load(); });
</script>

<StatusBar />
<AppBar title="Clientes" sub="{customersStore.data?.length ?? 0} clientes activos" />

{#if customersStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if customersStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><ErrorState sub={customersStore.error} onretry={() => customersStore.load()} /></div>
{:else if !customersStore.data || customersStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><EmptyState icon="users" title="Sem clientes" sub="Nenhum cliente encontrado" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<div class="mz-list mz-list--card">
			{#each customersStore.data as c (c.id)}
				{@const rk = RISK[c.risk ?? 'low']}
				<button type="button" class="mz-row" style="text-align:left;width:100%;background:none;border:none;cursor:pointer" onclick={() => goto(`/merchant/customers/${c.id}`)}>
					<Avatar name={c.name} gradient size={38} />
					<div class="mz-row__main">
						<div class="mz-row__title">{c.name}</div>
						<div class="mz-row__sub">{c.activePlans} plano(s) · Último pag. {c.lastPayment}</div>
					</div>
					<div style="display:flex;align-items:center;gap:10px">
						<span class="mz-money" style="font-size:14px;font-weight:600;color:var(--ink)">{money(c.totalOwing ?? 0)}</span>
						<Pill tone={rk.tone} dot>{rk.label}</Pill>
					</div>
					<Icon name="chevR" size={14} stroke={1.8} style="color:var(--muted);flex-shrink:0" />
				</button>
			{/each}
		</div>
	</div>
{/if}
<HomeIndicator />
