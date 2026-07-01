<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { StatusBar, HomeIndicator, MetricCard, Btn, Segmented, Avatar, Pill, Icon, Skeleton, ErrorState } from '$lib/components/index.js';
	import { PLAN_STATUS, money } from '$lib/utils/index.js';
	import { merchantStore, merchantProfileStore, plansStore, toast } from '$lib/stores';

	let filter = $state('todos');
	const filterOptions = [
		{ value: 'todos', label: 'Todos' },
		{ value: 'hoje', label: 'Hoje' },
		{ value: 'atraso', label: 'Atraso' },
	];

	let menuOpenId = $state<string | null>(null);
	let menuX = $state(0);
	let menuY = $state(0);

	let stats = $derived(merchantStore.stats);

	let rows = $derived((plansStore.data ?? []).filter((p) => {
		if (filter === 'hoje') return p.state === 'due_today';
		if (filter === 'atraso') return p.state === 'overdue';
		return true;
	}));

	let menuPlan = $derived(rows.find((r) => r.id === menuOpenId) ?? null);

	function toggleMenu(e: MouseEvent, id: string) {
		e.stopPropagation();
		if (menuOpenId === id) { menuOpenId = null; return; }
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		menuX = r.right;
		menuY = r.bottom + 4;
		menuOpenId = id;
	}
	function closeMenu() { menuOpenId = null; }

	function verCliente(customerId?: string) {
		closeMenu();
		if (customerId) goto(`/merchant/customers/${customerId}`);
	}
	function registarPagamento() { closeMenu(); goto('/merchant/payment'); }
	function enviarLembrete() { closeMenu(); toast.show('Lembrete enviado', 'success'); }

	function reload() { merchantStore.loadStats(); plansStore.load(); }

	onMount(() => {
		merchantProfileStore.load();
		merchantStore.loadStats();
		plansStore.load();
	});
</script>

<StatusBar />

<div class="mz-body mz-body--pad" style="gap:14px">
	{#if stats && plansStore.data}
		{@const s = stats}
		<!-- Metric strip -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
			<MetricCard label="Total a receber" value={money(s.totalReceivable)} tone="neutral" />
			<MetricCard label="Vence hoje" value={money(s.dueToday)} sub="{s.dueTodayCount} planos" tone="amber" />
			<MetricCard label="Em atraso" value={money(s.overdue)} sub="{s.overdueCount} plano · {s.overdueDays} dias" tone="red" />
			<MetricCard label="A confirmar" value={money(s.pending)} sub="{s.pendingCount} plano" tone="blue" />
		</div>

		<!-- Action bar -->
		<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
			<Btn variant="primary" sm icon="plus" onclick={() => goto('/merchant/sale/create')}>Nova Venda</Btn>
			<Btn variant="ghost" sm icon="check" onclick={() => goto('/merchant/payment')}>Registar Pagamento</Btn>
			<div style="margin-left:auto;width:fit-content">
				<Segmented options={filterOptions} bind:value={filter} />
			</div>
		</div>

		<!-- Data table -->
		<div class="mz-card" style="overflow:hidden;padding:0">
			<div class="dash-scroll">
				<div class="dash-grid dash-head">
					<div>Cliente</div>
					<div>Produto</div>
					<div>Restante</div>
					<div>Estado</div>
					<div></div>
				</div>
				{#each rows as p, i (p.id)}
					{@const st = PLAN_STATUS[p.state ?? 'active']}
					<div class="dash-grid dash-row" class:dash-row--bt={i > 0}>
						<div style="display:flex;align-items:center;gap:10px;min-width:0">
							<Avatar name={p.customerName ?? ''} gradient size={36} />
							<div style="min-width:0">
								<div style="font-size:13px;font-weight:600;color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{p.customerName}</div>
								<div style="font-size:12px;color:var(--muted)">{p.currentInstallment}/{p.installmentsTotal} prest.</div>
							</div>
						</div>
						<div style="font-size:13px;color:var(--ink-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{p.productName}</div>
						<div class="mz-money" style="font-size:13.5px;font-weight:600">{money(p.remaining ?? 0)}</div>
						<div><Pill tone={st.tone} dot>{st.label}</Pill></div>
						<div style="position:relative;display:flex;justify-content:flex-end">
							<button type="button" class="dash-more" aria-label="Acções" onclick={(e) => toggleMenu(e, p.id)}>
								<Icon name="more" size={16} stroke={1.8} />
							</button>
						</div>
					</div>
				{/each}
				{#if rows.length === 0}
					<div style="padding:32px 16px;text-align:center;color:var(--muted);font-size:13px">Sem planos nesta categoria.</div>
				{/if}
			</div>
		</div>
	{:else if merchantStore.error}
		<ErrorState sub={merchantStore.error} onretry={reload} />
	{:else}
		<Skeleton height="360px" />
	{/if}
</div>

{#if menuOpenId}
	<button type="button" class="dash-overlay" aria-label="Fechar menu" onclick={closeMenu}></button>
	<div class="dash-menu" style="top:{menuY}px;left:{menuX}px">
		<button type="button" class="dash-menu__i" onclick={() => verCliente(menuPlan?.customerId)}>
			<Icon name="user" size={14} stroke={1.6} />Ver cliente
		</button>
		<button type="button" class="dash-menu__i" onclick={registarPagamento}>
			<Icon name="check" size={14} stroke={1.6} />Registar pagamento
		</button>
		<button type="button" class="dash-menu__i" onclick={enviarLembrete}>
			<Icon name="send" size={14} stroke={1.6} />Enviar lembrete
		</button>
	</div>
{/if}

<HomeIndicator />

<style>
	.dash-scroll { overflow-x: auto; -webkit-overflow-scrolling: touch; }
	.dash-grid {
		display: grid;
		grid-template-columns: 168px 120px 104px 96px 52px;
		min-width: 540px;
		align-items: center;
	}
	@media (min-width: 1024px) {
		.dash-grid { grid-template-columns: 2fr 1.5fr 1fr 110px 52px; min-width: 0; }
	}
	.dash-head { padding: 11px 16px; border-bottom: 1px solid var(--line); }
	.dash-head > div { font-size: 10.5px; font-weight: 700; color: var(--muted); letter-spacing: .06em; text-transform: uppercase; }
	.dash-row { padding: 12px 16px; }
	.dash-row--bt { border-top: 1px solid var(--line-2); }
	.dash-more {
		width: 30px; height: 30px; border-radius: 9px;
		border: 1px solid var(--line); background: var(--surface); color: var(--ink-2);
		display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
	}
	.dash-more:hover { background: var(--blue-tint); color: var(--blue-800); }
	.dash-overlay { position: fixed; inset: 0; z-index: 100; background: transparent; border: none; padding: 0; cursor: default; }
	.dash-menu {
		position: fixed; z-index: 101; transform: translateX(-100%);
		width: 200px; background: var(--surface); border: 1px solid var(--line);
		border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, .12); padding: 4px;
	}
	.dash-menu__i {
		display: flex; align-items: center; gap: 8px; width: 100%;
		padding: 9px 12px; border: none; background: transparent; border-radius: 8px;
		cursor: pointer; font-family: var(--ui); font-size: 12.5px; font-weight: 500;
		color: var(--ink); text-align: left;
	}
	.dash-menu__i:hover { background: var(--blue-tint); }
</style>
