<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Avatar, Pill, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { scoreInfo } from '$lib/utils/index.js';
	import { customersStore } from '$lib/stores';

	onMount(() => { customersStore.load(); });
</script>

<StatusBar />
<AppBar title="Clientes" sub="{customersStore.data?.length ?? 0} no total">
	{#snippet action()}<div class="mz-appbar__btn"><Icon name="plus" size={20} stroke={2.1} /></div>{/snippet}
</AppBar>

{#if customersStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if customersStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><ErrorState sub={customersStore.error} onretry={() => customersStore.load()} /></div>
{:else if !customersStore.data || customersStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><EmptyState icon="users" title="Sem clientes" sub="Nenhum cliente encontrado" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<div class="mz-field" style="flex-direction:row;align-items:center;gap:9px;padding:12px 14px">
			<Icon name="search" size={18} stroke={1.9} style="color:var(--faint)" />
			<span style="color:var(--faint);font-size:14.5px">Procurar por nome ou número…</span>
		</div>
		<div class="mz-seg">
			<span class="mz-seg__i mz-seg__i--on">Todos</span>
			<span class="mz-seg__i">Em atraso</span>
			<span class="mz-seg__i">A confirmar</span>
		</div>
		<div class="mz-list">
			{#each customersStore.data as c}
				{@const info = scoreInfo(c.score)}
				<a href="/merchant/customers/{c.id}" class="mz-row" style="text-decoration:none;color:inherit">
					<Avatar name={c.name} tone={c.tone} size={44} />
					<div class="mz-row__main">
						<div class="mz-row__title">{c.name}</div>
						<div class="mz-row__sub">{c.activePlans} plano(s) activo(s)</div>
					</div>
					<div class="mz-row__end">
						<Pill tone={info.tone} dot>{info.merchant}</Pill>
						<span class="mz-money" style="font-size:12.5px;color:var(--muted);font-weight:600">{c.phone}</span>
					</div>
				</a>
			{/each}
		</div>
	</div>
{/if}
<HomeIndicator />
