<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Pill, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { plansStore } from '$lib/stores';
	import type { PlanStatus } from '$lib/api/types';

	let search = $state('');
	let filter: PlanStatus | 'todos' = $state('todos');

	let filtered = $derived((plansStore.data ?? []).filter(p => {
		const q = search.toLowerCase();
		const matchSearch = !q || p.id.toLowerCase().includes(q);
		const matchFilter = filter === 'todos' || p.status === filter;
		return matchSearch && matchFilter;
	}));

	const filterOpts: (PlanStatus | 'todos')[] = ['todos', 'ACTIVE', 'PENDING_CONFIRMATION', 'COMPLETED'];
	const filterLabels: Record<string, string> = { todos: 'Todos', ACTIVE: 'Activos', PENDING_CONFIRMATION: 'Pendentes', COMPLETED: 'Concluídos' };

	function planPill(s: PlanStatus): { tone: 'green' | 'amber' | 'slate'; label: string } {
		if (s === 'ACTIVE') return { tone: 'green', label: 'Activo' };
		if (s === 'PENDING_CONFIRMATION') return { tone: 'amber', label: 'Pendente' };
		return { tone: 'slate', label: 'Concluído' };
	}

	onMount(() => { plansStore.load(); });
</script>

<StatusBar />
<AppBar title="Os meus planos" />

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px"><Skeleton height="200px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px"><ErrorState sub={plansStore.error} onretry={() => plansStore.load()} /></div>
{:else if !plansStore.data || plansStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:12px"><EmptyState icon="doc" title="Sem planos" sub="Nenhum plano encontrado" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:12px">
		<div class="mz-field" style="flex-direction:row;align-items:center;gap:9px;padding:12px 14px">
			<Icon name="search" size={18} stroke={1.9} style="color:var(--faint)" />
			<input type="text" placeholder="Procurar plano…" bind:value={search} class="mz-field__inp" style="color:var(--ink)" />
		</div>

		<div class="mz-seg">
			{#each filterOpts as f}
				<button class="mz-seg__i" class:mz-seg__i--on={filter === f} onclick={() => filter = f}>
					{filterLabels[f]}
				</button>
			{/each}
		</div>

		<div class="grid gap-3 lg:grid-cols-2">
			{#each filtered as plan}
				{@const pp = planPill(plan.status)}
				<a href="/customer/plans/{plan.id}" class="mz-row" style="text-decoration:none;color:inherit;border-radius:18px;border:1px solid var(--line);box-shadow:var(--shadow-card);padding:14px">
					<div style="width:42px;height:42px;border-radius:12px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><Icon name="doc" size={21} stroke={1.7} /></div>
					<div class="mz-row__main">
						<div class="mz-row__title">{plan.id}</div>
						<div class="mz-row__sub">{money(plan.remainingBalanceCentavos / 100)} restantes</div>
					</div>
					<div class="mz-row__end">
						<Pill tone={pp.tone} dot>{pp.label}</Pill>
						<Icon name="chevR" size={16} style="color:var(--faint)" />
					</div>
				</a>
			{/each}
		</div>

		{#if filtered.length === 0}
			<div class="mz-empty">
				<Icon name="search" size={36} stroke={1.5} style="color:var(--faint)" />
				<div class="mz-h2" style="font-size:16px">Sem resultados</div>
				<p class="mz-sub">Nenhum plano corresponde à pesquisa</p>
			</div>
		{/if}
	</div>
{/if}
