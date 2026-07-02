<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { StatusBar, Pill, Btn, Card, Icon, Skeleton, HomeIndicator } from '$lib/shared';
	import { Avatar, ProgressBar } from '$lib/merchant';
	import { money, RISK_LONG, PLAN_STATUS, METHOD, DISPUTE_STATUS } from '$lib/shared/utils/index.js';
	import { customersStore } from '$lib/merchant';
	import { toast } from '$lib/shared';
	import type { CustomerDetail, PlanSummary, DisputeStatus } from '$lib/shared/api/types';

	let detail: CustomerDetail | null = $state(null);
	let loading = $state(true);

	onMount(async () => {
		const id = page.params.id ?? '';
		detail = await customersStore.loadDetail(id);
		loading = false;
	});

	const FALLBACK = { label: '—', tone: 'slate' as const };

	function riskInfo(risk?: 'low' | 'medium' | 'high') {
		return risk ? RISK_LONG[risk] : FALLBACK;
	}
	function planInfo(state?: PlanSummary['state']) {
		return state ? PLAN_STATUS[state] : FALLBACK;
	}
	function disputeInfo(status: DisputeStatus) {
		return DISPUTE_STATUS[status as 'open' | 'review' | 'resolved'] ?? { ...FALLBACK, icon: 'flag' };
	}

	function goBack() {
		goto('/merchant/customers');
	}
</script>

<StatusBar />

<div class="mz-appbar">
	<button class="mz-appbar__btn" aria-label="Voltar" onclick={goBack}><Icon name="back" size={20} /></button>
	<div class="mz-appbar__t">
		<div class="mz-appbar__title">Perfil do cliente</div>
	</div>
</div>

{#if loading}
	<div class="mz-body mz-body--pad" style="gap:16px;overflow:hidden"><Skeleton height="220px" /></div>
{:else if !detail}
	<div class="mz-body mz-body--pad" style="gap:16px;align-items:center;justify-content:center;text-align:center">
		<div style="font-size:15px;color:var(--muted)">Cliente não encontrado.</div>
		<Btn variant="primary" sm onclick={goBack}>Voltar</Btn>
	</div>
{:else}
	{@const customer = detail.customer}
	{@const plans = detail.plans}
	{@const payments = detail.payments}
	{@const disputes = detail.disputes}
	{@const rk = riskInfo(customer.risk)}
	<div class="mz-body mz-body--pad" style="gap:20px;overflow:hidden">
		<!-- Profile card -->
		<Card pad>
			<div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
				<Avatar name={customer.name} gradient size={52} />
				<div style="flex:1;min-width:160px">
					<div style="font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.2px">{customer.name}</div>
					<div style="font-size:13px;color:var(--muted);margin-top:2px">+258 {customer.phone}</div>
				</div>
				<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap">
					<Pill tone={rk.tone} dot>{rk.label}</Pill>
					<Btn variant="ghost" sm icon="send" onclick={() => toast.show('Lembrete enviado a ' + customer.name, 'success')}>Enviar lembrete</Btn>
				</div>
			</div>
			<div style="display:flex;gap:24px;margin-top:18px;padding-top:16px;border-top:1px solid var(--line-2);flex-wrap:wrap">
				<div>
					<div style="font-size:11px;color:var(--muted);font-weight:500;margin-bottom:3px">Planos activos</div>
					<div class="mz-money" style="font-size:15px;font-weight:600">{plans.length}</div>
				</div>
				<div>
					<div style="font-size:11px;color:var(--muted);font-weight:500;margin-bottom:3px">Total em dívida</div>
					<div class="mz-money" style="font-size:15px;font-weight:600">{money(customer.totalOwing ?? 0)}</div>
				</div>
				<div>
					<div style="font-size:11px;color:var(--muted);font-weight:500;margin-bottom:3px">Último pagamento</div>
					<div class="mz-money" style="font-size:15px;font-weight:600">{customer.lastPayment ?? '—'}</div>
				</div>
				<div>
					<div style="font-size:11px;color:var(--muted);font-weight:500;margin-bottom:3px">Score</div>
					<div class="mz-money" style="font-size:15px;font-weight:600">{customer.score}/100</div>
				</div>
			</div>
		</Card>

		<!-- Plans + Payments -->
		<div class="grid gap-4 lg:grid-cols-2">
			<!-- Plans -->
			<div>
				<div class="mz-eyebrow" style="margin-bottom:12px">Planos ({plans.length})</div>
				<Card>
					{#if plans.length === 0}
						<div style="padding:24px 16px;text-align:center;color:var(--muted);font-size:13px">Sem planos activos.</div>
					{:else}
						{#each plans as p, i (p.id)}
							{@const pk = planInfo(p.state)}
							<div style="padding:14px 16px;{i ? 'border-top:1px solid var(--line-2)' : ''}">
								<div style="display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:6px">
									<span style="font-size:13.5px;font-weight:600;color:var(--ink)">{p.productName}</span>
									<Pill tone={pk.tone} dot>{pk.label}</Pill>
								</div>
								<div style="display:flex;justify-content:space-between;gap:10px;font-size:12px;color:var(--muted);margin-bottom:8px">
									<span>{p.currentInstallment}/{p.installmentsTotal} prestações</span>
									<span class="mz-money" style="font-size:12px;color:var(--ink)">{money(p.remaining ?? 0)} restante</span>
								</div>
								<ProgressBar value={(p.paid ?? 0) / (p.total || 1)} tone={p.state === 'overdue' ? 'red' : 'blue'} />
							</div>
						{/each}
					{/if}
				</Card>
			</div>

			<!-- Payments -->
			<div>
				<div class="mz-eyebrow" style="margin-bottom:12px">Pagamentos ({payments.length})</div>
				<Card>
					{#if payments.length === 0}
						<div style="padding:24px 16px;text-align:center;color:var(--muted);font-size:13px">Sem pagamentos registados.</div>
					{:else}
						{#each payments as p, i (p.id)}
							<div style="display:flex;align-items:center;gap:10px;padding:11px 16px;{i ? 'border-top:1px solid var(--line-2)' : ''}">
								<div style="width:28px;height:28px;border-radius:8px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;background:{p.status === 'confirmed' ? 'var(--green-tint)' : 'var(--amber-tint)'};color:{p.status === 'confirmed' ? 'var(--green)' : 'var(--amber)'}">
									<Icon name={p.status === 'confirmed' ? 'check' : 'clock'} size={13} stroke={2} />
								</div>
								<div style="flex:1;min-width:0">
									<div style="font-size:13px;font-weight:500;color:var(--ink)">{p.plan}</div>
									<div style="font-size:11px;color:var(--muted)">{p.date} · {METHOD[p.method].label}</div>
								</div>
								<span class="mz-money" style="font-size:13px;color:{p.status === 'confirmed' ? 'var(--green)' : 'var(--ink)'}">{money(p.amount)}</span>
							</div>
						{/each}
					{/if}
				</Card>
			</div>
		</div>

		<!-- Disputes -->
		{#if disputes.length > 0}
			<div>
				<div class="mz-eyebrow" style="margin-bottom:12px">Disputas ({disputes.length})</div>
				<Card>
					{#each disputes as d, i (d.id)}
						{@const dk = disputeInfo(d.status)}
						<button
							type="button"
							onclick={() => goto('/merchant/disputes')}
							style="width:100%;text-align:left;background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:12px;padding:12px 16px;{i ? 'border-top:1px solid var(--line-2)' : ''}"
						>
							<Icon name="flag" size={15} stroke={1.8} style="color:var(--red);flex:0 0 auto" />
							<div style="flex:1;min-width:0">
								<div style="font-size:13px;font-weight:500;color:var(--ink)">{d.plan}</div>
								<div style="font-size:11px;color:var(--muted)">Aberta {d.opened}</div>
							</div>
							<Pill tone={dk.tone} dot>{dk.label}</Pill>
						</button>
					{/each}
				</Card>
			</div>
		{/if}
	</div>
{/if}

<HomeIndicator />
