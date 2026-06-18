<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StatusBar, AppBar, Icon, Pill, Banner, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { plansStore } from '$lib/stores';

	onMount(() => {
		const id = $page.params.id ?? '';
		if (id) plansStore.loadPlan(id);
	});

	const ringMap: Record<string, string> = { green: 'var(--green)', amber: 'var(--amber)', slate: 'var(--line)' };

	function instPill(status: string): { tone: string; icon: string | null; label: string } {
		if (status === 'PAID') return { tone: 'green', icon: 'check', label: 'Paga' };
		if (status === 'PENDING') return { tone: 'amber', icon: 'clock', label: 'A seguir' };
		return { tone: 'slate', icon: null, label: 'A pagar' };
	}
</script>

<StatusBar />
<AppBar title="O meu plano" back />

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><ErrorState sub={plansStore.error} onretry={() => plansStore.loadPlan($page.params.id ?? '')} /></div>
{:else if !plansStore.current}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><EmptyState icon="doc" title="Plano não encontrado" sub="Este plano não existe ou foi removido" /></div>
{:else}
	{@const plan = plansStore.current}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<!-- Balance card -->
		<div class="mz-card mz-card--pad">
			<div style="display:flex;justify-content:space-between;align-items:flex-start">
				<div>
					<div style="font-size:12px;color:var(--muted);font-weight:600">Falta pagar</div>
					<div class="mz-money" style="font-size:28px;font-weight:600;letter-spacing:-.6px;margin-top:2px">{money(plan.remainingBalanceCentavos / 100)}</div>
					<div style="font-size:12px;color:var(--muted);margin-top:2px">{plan.merchantName ?? plan.id}</div>
				</div>
				<Pill tone="green" dot>Activo</Pill>
			</div>
			<div class="mz-prog" style="margin-top:14px"><div class="mz-prog__f" style="width:27%;background:var(--blue-700)"></div></div>
			<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11.5px;color:var(--muted);font-weight:600">
				<span>{plan.totalPaidCentavos > 0 ? 'Pagamentos iniciados' : 'Nenhum pagamento ainda'}</span><span>{plan.installments.filter(i => i.status === 'PAID').length} de {plan.installments.length} prestações</span>
			</div>
		</div>

		<!-- Payment calendar -->
		<span class="mz-h2" style="font-size:15.5px;margin-top:2px">Calendário de pagamentos</span>
		<div class="mz-list" style="margin-top:-4px">
			{#each plan.installments as inst}
				{@const cfg = instPill(inst.status)}
				{@const ring = ringMap[cfg.tone] ?? 'var(--line)'}
				<div class="mz-row" style="padding:12px 15px">
					<div style="width:30px;height:30px;border-radius:50%;flex:0 0 auto;border:2px solid {ring};background:{inst.status === 'PAID' ? 'var(--green)' : 'transparent'};color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:600;font-size:12px">
						{#if inst.status === 'PAID'}
							<Icon name="check" size={14} stroke={2.6} />
						{:else}
							<span style="color:var(--ink-2)">{inst.sequence}</span>
						{/if}
					</div>
					<div class="mz-row__main">
						<div class="mz-row__title" style="font-size:14px">Prestação {inst.sequence}</div>
						<div class="mz-row__sub">Vence {inst.dueDate}</div>
					</div>
					<div class="mz-row__end">
						<span class="mz-money" style="font-size:14px;font-weight:600">{money(inst.amountDueCentavos / 100)}</span>
						<Pill tone={cfg.tone as any} icon={cfg.icon}>{cfg.label}</Pill>
					</div>
				</div>
			{/each}
		</div>

		<Banner tone="blue" icon="info">
			Paga directamente ao comerciante (numerário, M-Pesa ou banco). Depois confirma aqui que o pagamento foi feito.
		</Banner>
	</div>
{/if}

<HomeIndicator />
