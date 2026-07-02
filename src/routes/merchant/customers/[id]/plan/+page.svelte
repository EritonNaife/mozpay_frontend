<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StatusBar, AppBar, Btn, Pill, Footer, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { goto } from '$app/navigation';
	import { money } from '$lib/shared/utils/index.js';
	import { plansStore } from '$lib/shared';

	onMount(() => {
		const id = $page.params.id ?? '';
		if (id) plansStore.loadPlan(id);
	});

	function instStyle(status: string) {
		const map: Record<string, { tone: string; icon: string | null; label: string; ring: string }> = {
			PAID: { tone: 'green', icon: 'check', label: 'Paga', ring: 'var(--green)' },
			PENDING: { tone: 'amber', icon: 'clock', label: 'Vence', ring: 'var(--amber)' },
			OVERDUE: { tone: 'red', icon: 'alert', label: 'Em atraso', ring: 'var(--red)' },
		};
		return map[status] ?? { tone: 'slate', icon: null, label: 'A pagar', ring: 'var(--line)' };
	}
</script>

<StatusBar />
<AppBar title="Plano" back>
	{#snippet action()}<div class="mz-appbar__btn"><Icon name="more" size={20} /></div>{/snippet}
</AppBar>

{#if plansStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if plansStore.error}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><ErrorState sub={plansStore.error} onretry={() => plansStore.loadPlan($page.params.id ?? '')} /></div>
{:else if !plansStore.current}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><EmptyState icon="doc" title="Plano não encontrado" sub="Este plano não existe ou foi removido" /></div>
{:else}
	{@const plan = plansStore.current}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<div class="mz-card mz-card--pad">
			<div style="display:flex;justify-content:space-between;align-items:flex-start">
				<div>
					<div style="font-size:12px;color:var(--muted);font-weight:600">Saldo restante</div>
					<div class="mz-money" style="font-size:28px;font-weight:600;letter-spacing:-.6px;margin-top:2px">{money(plan.remainingBalanceCentavos / 100)}</div>
				</div>
				<Pill tone="green" dot>Activo</Pill>
			</div>
			<div class="mz-prog" style="margin-top:14px"><div class="mz-prog__f" style="width:33%;background:var(--green)"></div></div>
			<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:11.5px;color:var(--muted);font-weight:600">
				<span>{plan.installments.filter(i => i.status === 'PAID').length} de {plan.installments.length} prestações pagas</span><span>{money(plan.totalPaidCentavos / 100)} pagos</span>
			</div>
		</div>

		<div class="mz-card mz-card--pad" style="padding-top:4px;padding-bottom:4px">
			<div class="mz-key"><span class="mz-keyl">Produto</span><span class="mz-keyv">{plan.productName ?? plan.id}</span></div>
			<div class="mz-key"><span class="mz-keyl">Cliente</span><span class="mz-keyv">{plan.customerName ?? '—'}</span></div>
			<div class="mz-key"><span class="mz-keyl">Comerciante</span><span class="mz-keyv">{plan.merchantName ?? '—'}</span></div>
		</div>

		<span class="mz-h2" style="font-size:15.5px;margin-top:2px">Calendário</span>
		<div class="mz-list mz-list--card" style="margin-top:-4px">
			{#each plan.installments as inst}
				{@const s = instStyle(inst.status)}
				<div class="mz-row" style="padding:12px 15px">
					<div style="width:30px;height:30px;border-radius:50%;flex:0 0 auto;border:2px solid {s.ring};background:{inst.status === 'PAID' ? 'var(--green)' : 'transparent'};color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:600;font-size:12px">
						{#if inst.status === 'PAID'}<Icon name="check" size={14} stroke={2.6} />{:else}<span style="color:var(--ink-2)">{inst.sequence}</span>{/if}
					</div>
					<div class="mz-row__main">
						<div class="mz-row__title" style="font-size:14px">Prestação {inst.sequence}</div>
						<div class="mz-row__sub">{inst.dueDate}</div>
					</div>
					<div class="mz-row__end">
						<span class="mz-money" style="font-size:14px;font-weight:600">{money(inst.amountDueCentavos / 100)}</span>
						<Pill tone={s.tone as any} icon={s.icon}>{s.label}</Pill>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<Footer><Btn variant="primary" block lg icon="wallet" onclick={() => goto('/merchant/payment/register')}>Registar pagamento</Btn></Footer>
<HomeIndicator />
