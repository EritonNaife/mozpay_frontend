<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, Pill, Segmented, MonogramAvatar, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { plansStore } from '$lib/stores';
	import type { PlanStatus, PlanSummary } from '$lib/api/types';

	let search = $state('');
	let filter = $state('todos');

	const filterOpts = [
		{ value: 'todos', label: 'Todos' },
		{ value: 'ACTIVE', label: 'Activos' },
		{ value: 'PENDING_CONFIRMATION', label: 'Pendentes' },
		{ value: 'COMPLETED', label: 'Concluídos' }
	];

	function planPill(s: PlanStatus): { tone: 'green' | 'amber' | 'slate'; label: string } {
		if (s === 'ACTIVE') return { tone: 'green', label: 'Activo' };
		if (s === 'PENDING_CONFIRMATION') return { tone: 'amber', label: 'Pendente' };
		return { tone: 'slate', label: 'Concluído' };
	}

	// List rows only carry productName (merchantName lives on the plan detail),
	// so prefer the store, then the product, and never fall back to the UUID id.
	function planName(p: PlanSummary): string {
		return p.merchantName ?? p.productName ?? 'Plano';
	}

	let filtered = $derived(
		(plansStore.data ?? []).filter((p) => {
			const q = search.trim().toLowerCase();
			const matchSearch =
				!q ||
				(p.merchantName ?? '').toLowerCase().includes(q) ||
				(p.productName ?? '').toLowerCase().includes(q);
			const matchFilter = filter === 'todos' || p.status === filter;
			return matchSearch && matchFilter;
		})
	);

	onMount(() => { plansStore.load(); });
</script>

<StatusBar />
<AppBar title="Os meus planos" />

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px">
		<Skeleton height="52px" />
		<Skeleton height="44px" />
		<Skeleton height="220px" />
	</div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px"><ErrorState sub={plansStore.error} onretry={() => plansStore.load()} /></div>
{:else if !plansStore.data || plansStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:12px"><EmptyState icon="doc" title="Sem planos" sub="Ainda não tem planos de pagamento" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:13px">
		<!-- Search -->
		<div class="mz-field" style="flex-direction:row;align-items:center;gap:9px;padding:12px 16px">
			<Icon name="search" size={18} stroke={1.9} style="color:var(--faint)" />
			<input
				type="text"
				placeholder="Procurar por loja ou produto…"
				bind:value={search}
				class="mz-field__inp"
				aria-label="Procurar plano"
			/>
		</div>

		<!-- Status filter -->
		<Segmented options={filterOpts} bind:value={filter} />

		<!-- Plans list -->
		{#if filtered.length === 0}
			<div class="mz-empty">
				<Icon name="search" size={36} stroke={1.5} style="color:var(--faint)" />
				<div class="mz-h2" style="font-size:16px">Sem resultados</div>
				<p class="mz-sub">Nenhum plano corresponde à pesquisa</p>
			</div>
		{:else}
			<div class="mz-list mz-list--card">
				{#each filtered as p (p.id)}
					{@const pp = planPill(p.status)}
					<a href="/customer/plans/{p.id}" class="mz-row" style="text-decoration:none;color:inherit">
						<MonogramAvatar name={planName(p)} size={42} />
						<div class="mz-row__main">
							<div class="mz-row__title">{planName(p)}</div>
							<div class="mz-row__sub">{p.currentInstallment ?? 0}/{p.installmentsTotal ?? 0} prestações · {money(p.remaining ?? (p.remainingBalanceCentavos / 100))}</div>
						</div>
						<div class="mz-row__end">
							<Pill tone={pp.tone} dot>{pp.label}</Pill>
							<Icon name="chevR" size={16} style="color:var(--faint)" />
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
{/if}
