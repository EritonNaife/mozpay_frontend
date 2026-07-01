<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StatusBar, Icon, Pill, Btn, Card, Footer, MonogramAvatar, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { plansStore } from '$lib/stores';

	let id = $state('');

	onMount(() => {
		id = $page.params.id ?? '';
		if (id) plansStore.loadPlan(id);
	});
</script>

<StatusBar />

<!-- Header -->
<div class="mz-appbar" style="padding-top:6px">
	<button class="mz-appbar__btn" aria-label="Voltar" onclick={() => goto('/customer/plans')}>
		<Icon name="back" size={20} />
	</button>
	<div class="mz-appbar__t">
		<div class="mz-appbar__title" style="font-size:18px">{plansStore.current?.merchantName ?? 'O meu plano'}</div>
	</div>
	{#if plansStore.current}<Pill tone="green" dot>Activo</Pill>{/if}
</div>

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="220px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><ErrorState sub={plansStore.error} onretry={() => plansStore.loadPlan(id)} /></div>
{:else if !plansStore.current}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><EmptyState icon="doc" title="Plano não encontrado" sub="Este plano não existe ou foi removido" /></div>
{:else}
	{@const plan = plansStore.current}
	{@const total = plan.total ?? 0}
	{@const paid = plan.paid ?? 0}
	{@const remaining = plan.remaining ?? 0}
	{@const pct = total > 0 ? Math.round((paid / total) * 100) : 0}
	{@const schedule = plan.schedule ?? []}
	<div class="mz-body mz-body--pad" style="gap:16px;overflow:hidden">
		<!-- Total block -->
		<div style="display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center">
			<MonogramAvatar name={plan.merchantName ?? ''} size={52} />
			<div class="mz-money" style="font-size:28px;font-weight:600;letter-spacing:-.8px">{money(total)}</div>
			<div style="font-size:12px;color:var(--muted)">Valor total do plano</div>
		</div>

		<!-- Slim progress bar -->
		<div>
			<div style="display:flex;justify-content:space-between;margin-bottom:6px">
				<span style="font-size:11px;font-weight:600;color:var(--blue-800)">{pct}% pago</span>
				<span style="font-size:11px;color:var(--muted)">{money(remaining)} restantes</span>
			</div>
			<div style="width:100%;height:4px;border-radius:2px;background:var(--surface-2);overflow:hidden">
				<div style="width:{pct}%;height:100%;border-radius:2px;background:var(--blue-800)"></div>
			</div>
		</div>

		<!-- Totals card -->
		<Card pad flat>
			<div style="display:flex;justify-content:space-between;padding:5px 0">
				<span style="font-size:13px;color:var(--muted);font-weight:500">Total</span>
				<span class="mz-money" style="font-size:13.5px;font-weight:600;color:var(--ink)">{money(total)}</span>
			</div>
			<div style="display:flex;justify-content:space-between;padding:10px 0 5px;border-top:1px solid rgba(0,0,0,.04)">
				<span style="font-size:13px;color:var(--muted);font-weight:500">Pago</span>
				<span class="mz-money" style="font-size:13.5px;font-weight:600;color:var(--blue-800)">{money(paid)}</span>
			</div>
			<div style="display:flex;justify-content:space-between;padding:10px 0 5px;border-top:1px solid rgba(0,0,0,.04)">
				<span style="font-size:13px;color:var(--muted);font-weight:500">Restante</span>
				<span class="mz-money" style="font-size:13.5px;font-weight:600;color:var(--ink)">{money(remaining)}</span>
			</div>
		</Card>

		<!-- Prestações -->
		<div>
			<div class="mz-eyebrow" style="margin-bottom:10px">Prestações</div>
			<div class="mz-list mz-list--card mz-list--divided">
				{#each schedule as s (s.n)}
					<div class="mz-row" style="padding:12px 4px">
						<div style="width:28px;height:28px;border-radius:50%;flex:0 0 auto;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:600;font-size:11px;background:{s.status === 'paid' ? 'var(--green-tint)' : 'var(--surface-2)'};color:{s.status === 'paid' ? 'var(--green)' : 'var(--ink-2)'}">
							{#if s.status === 'paid'}<Icon name="check" size={13} stroke={2.2} />{:else}{s.n}{/if}
						</div>
						<div class="mz-row__main">
							<div class="mz-row__title" style="font-size:14px">Prestação {s.n}</div>
							<div class="mz-row__sub">{s.date}</div>
						</div>
						<div class="mz-row__end">
							<span class="mz-money" style="font-size:13.5px;font-weight:600">{money(s.amount)}</span>
							<span style="font-size:10px;font-weight:600;letter-spacing:.03em;color:{s.status === 'paid' ? 'var(--green)' : 'var(--amber)'}">{s.status === 'paid' ? 'Pago' : 'Vence hoje'}</span>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<Footer>
		<Btn variant="primary" block lg icon="send" onclick={() => goto('/customer/payment?planId=' + id)}>Pagar {money(plan.nextAmount ?? 0)}</Btn>
	</Footer>
{/if}

<HomeIndicator />
