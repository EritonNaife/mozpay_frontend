<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { Avatar, BarChart } from '$lib/merchant';
	import { money, grp } from '$lib/shared/utils/index.js';
	import { merchantStore, customersStore } from '$lib/merchant';
	import { plansStore, paymentsStore } from '$lib/shared';

	type StatTone = 'green' | 'amber' | 'blue' | 'neutral';
	const stFg: Record<StatTone, string> = { green: 'var(--green)', amber: 'var(--amber)', blue: 'var(--blue-800)', neutral: 'var(--ink)' };
	const stBg: Record<StatTone, string> = { green: 'var(--green-tint)', amber: 'var(--amber-tint)', blue: 'var(--blue-tint)', neutral: 'var(--surface-2)' };

	const methodItems = [
		{ key: 'mpesa', label: 'M-Pesa', color: 'var(--green)' },
		{ key: 'cash', label: 'Dinheiro', color: 'var(--amber)' },
		{ key: 'bank', label: 'Transferência', color: 'var(--blue-800)' },
	] as const;

	const eyebrow = 'font-size:10.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:12px';
	const chartCard = 'background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;padding:18px 20px';

	let stats = $derived(merchantStore.stats);

	let growth = $derived(
		stats ? (((stats.collected - stats.collectedPrev) / stats.collectedPrev) * 100).toFixed(1).replace('.', ',') : '0,0',
	);
	let lastRate = $derived(stats && stats.collectionRates.length ? stats.collectionRates[stats.collectionRates.length - 1].rate : 0);
	let monthlyBars = $derived((stats?.monthlyCollections ?? []).map((m) => ({ label: m.month, value: m.amount })));

	let avgPlan = $derived.by(() => {
		const list = plansStore.data ?? [];
		if (!list.length) return 0;
		return list.reduce((sum, p) => sum + (p.total ?? 0), 0) / list.length;
	});

	let topCustomers = $derived.by(() => {
		const list = [...(customersStore.data ?? [])];
		list.sort((a, b) => (b.totalOwing ?? 0) - (a.totalOwing ?? 0));
		return list.slice(0, 5);
	});
	let topMax = $derived(topCustomers[0]?.totalOwing ?? 1);

	let methodCounts = $derived.by(() => {
		const counts: Record<string, number> = { mpesa: 0, cash: 0, bank: 0 };
		for (const p of paymentsStore.history ?? []) {
			if (counts[p.method] !== undefined) counts[p.method]++;
		}
		return counts;
	});
	let methodTotal = $derived(Math.max((paymentsStore.history ?? []).length, 1));

	onMount(() => {
		merchantStore.loadStats();
		customersStore.load();
		plansStore.load();
		paymentsStore.loadHistory();
	});
</script>

{#snippet statCard(label: string, value: string, sub: string | undefined, icon: string, tone: StatTone)}
	<div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden;padding:14px 16px;min-width:0">
		<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
			<div style="width:32px;height:32px;border-radius:9px;background:{stBg[tone]};color:{stFg[tone]};display:flex;align-items:center;justify-content:center;flex-shrink:0">
				<Icon name={icon} size={16} stroke={1.8} />
			</div>
			<span style="font-size:12px;color:var(--muted);font-weight:500">{label}</span>
		</div>
		<div class="mz-money" style="font-size:22px;color:{stFg[tone]}">{value}</div>
		{#if sub}<div style="font-size:11px;color:var(--muted);margin-top:4px">{sub}</div>{/if}
	</div>
{/snippet}

<StatusBar />
<AppBar title="Estatísticas" sub="Resumo de Junho 2026" />

{#if merchantStore.loading && !stats}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden"><Skeleton height="420px" /></div>
{:else if merchantStore.error}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden"><ErrorState sub={merchantStore.error} onretry={() => merchantStore.loadStats()} /></div>
{:else if !stats}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden"><EmptyState icon="wallet" title="Sem estatísticas" sub="Ainda não há dados para mostrar" /></div>
{:else}
	{@const s = stats}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden">
		<!-- Summary cards -->
		<div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
			{@render statCard('Receita mensal', money(s.collected), '↑ ' + growth + '% vs. Mai', 'wallet', 'green')}
			{@render statCard('Taxa de cobrança', lastRate + '%', lastRate >= 85 ? 'Excelente' : 'A melhorar', 'check', lastRate >= 85 ? 'green' : 'amber')}
			{@render statCard('Planos activos', String(s.activePlans), s.completedPlans + ' concluídos', 'doc', 'blue')}
			{@render statCard('Valor médio / plano', money(avgPlan), undefined, 'receipt', 'neutral')}
		</div>

		<!-- Charts row 1 -->
		<div class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3.5">
			<div style={chartCard}>
				<div style={eyebrow}>Cobranças mensais</div>
				<BarChart data={monthlyBars} activeIndex={monthlyBars.length - 1} height={180} valueFormat={(v) => grp(v / 1000) + 'k'} />
			</div>
			<div style={chartCard}>
				<div style={eyebrow}>Métodos de pagamento</div>
				<div style="display:flex;flex-direction:column;gap:14px">
					<div style="display:flex;height:10px;border-radius:5px;overflow:hidden">
						{#each methodItems as it (it.key)}
							<div style="flex:{methodCounts[it.key]};background:{it.color};transition:flex .6s ease"></div>
						{/each}
					</div>
					{#each methodItems as it (it.key)}
						{@const pct = Math.round((methodCounts[it.key] / methodTotal) * 100)}
						<div style="display:flex;align-items:center;gap:10px">
							<div style="width:10px;height:10px;border-radius:3px;background:{it.color};flex-shrink:0"></div>
							<span style="flex:1;font-size:13px;font-weight:500;color:var(--ink)">{it.label}</span>
							<span style="font-size:12px;font-weight:600;color:var(--muted);font-variant-numeric:tabular-nums">{methodCounts[it.key]}</span>
							<span style="font-size:12px;font-weight:600;color:var(--ink);font-variant-numeric:tabular-nums;width:36px;text-align:right">{pct}%</span>
						</div>
					{/each}
				</div>
			</div>
		</div>

		<!-- Charts row 2 -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
			<div style={chartCard}>
				<div style={eyebrow}>Top clientes por saldo</div>
				<div style="display:flex;flex-direction:column;gap:10px">
					{#each topCustomers as c (c.id)}
						<div style="display:flex;align-items:center;gap:10px">
							<Avatar name={c.name} gradient size={28} />
							<div style="flex:1;min-width:0">
								<div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:4px">
									<span style="font-size:12.5px;font-weight:600;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{c.name}</span>
									<span class="mz-money" style="font-size:12px;font-weight:600;color:var(--ink);flex-shrink:0">{money(c.totalOwing ?? 0)}</span>
								</div>
								<div style="height:5px;border-radius:3px;background:var(--surface-2);overflow:hidden">
									<div style="height:100%;width:{((c.totalOwing ?? 0) / topMax) * 100}%;border-radius:3px;background:var(--blue-800);transition:width .6s ease"></div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div style={chartCard}>
				<div style={eyebrow}>Taxa de cobrança mensal</div>
				<div style="display:flex;flex-direction:column;gap:10px">
					{#each s.collectionRates as r, i (r.month + i)}
						{@const last = i === s.collectionRates.length - 1}
						<div style="display:flex;align-items:center;gap:10px">
							<span style="width:28px;font-size:11px;color:{last ? 'var(--ink)' : 'var(--muted)'};font-weight:{last ? 600 : 400};text-align:right;flex-shrink:0">{r.month}</span>
							<div style="flex:1;height:8px;border-radius:4px;background:var(--surface-2);overflow:hidden">
								<div style="height:100%;width:{r.rate}%;border-radius:4px;background:{r.rate >= 85 ? 'var(--green)' : r.rate >= 80 ? 'var(--amber)' : 'var(--red)'};transition:width .8s ease"></div>
							</div>
							<span style="width:32px;font-size:11px;font-weight:600;color:{last ? 'var(--ink)' : 'var(--muted)'};text-align:right;flex-shrink:0;font-variant-numeric:tabular-nums">{r.rate}%</span>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<HomeIndicator />
