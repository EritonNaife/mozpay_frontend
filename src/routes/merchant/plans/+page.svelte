<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { StatusBar, AppBar, Pill, Icon, Btn, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { Avatar } from '$lib/merchant';
	import { money, PLAN_STATUS } from '$lib/shared/utils/index.js';
	import { plansStore } from '$lib/shared';

	onMount(() => { plansStore.load(); });
</script>

<StatusBar />
<AppBar title="Vendas" sub="{plansStore.data?.length ?? 0} planos activos">
	{#snippet action()}
		<Btn variant="primary" sm icon="plus" onclick={() => goto('/merchant/sale/create')}>Nova Venda</Btn>
	{/snippet}
</AppBar>

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><ErrorState sub={plansStore.error} onretry={() => plansStore.load()} /></div>
{:else if !plansStore.data || plansStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><EmptyState icon="doc" title="Sem vendas" sub="Nenhum plano activo" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<div class="mz-list mz-list--card mz-list--divided">
			{#each plansStore.data as p (p.id)}
				{@const ps = p.state ? PLAN_STATUS[p.state] : { tone: 'slate' as const, label: '—' }}
				<button
					class="mz-row"
					type="button"
					style="width:100%;text-align:left;background:transparent;border:none;cursor:pointer"
					onclick={() => goto(`/merchant/customers/${p.customerId}`)}
				>
					<Avatar name={p.customerName ?? ''} gradient size={36} />
					<div class="mz-row__main">
						<div class="mz-row__title">{p.customerName ?? '—'}</div>
						<div class="mz-row__sub">{p.productName ?? '—'} · {p.currentInstallment ?? 0}/{p.installmentsTotal ?? 0} prest.</div>
					</div>
					<div class="mz-row__end" style="flex-direction:row;align-items:center;gap:10px">
						<span class="mz-money" style="font-size:14px;font-weight:600">{money(p.remaining ?? 0)}</span>
						<Pill tone={ps.tone} dot>{ps.label}</Pill>
						<Icon name="chevR" size={14} stroke={1.8} style="color:var(--muted)" />
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}
