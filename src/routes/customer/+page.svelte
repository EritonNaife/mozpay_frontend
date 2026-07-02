<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { StatusBar, Icon, Pill, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { PremiumAction, LuxuryScoreDial, MonogramAvatar } from '$lib/customer';
	import { money } from '$lib/shared/utils/index.js';
	import { customerDashboardStore, scoringStore } from '$lib/customer';
	import type { CustomerDashboard } from '$lib/shared/api/types';

	onMount(() => {
		customerDashboardStore.load();
		scoringStore.load();
	});

	// Active plan detail if we have one, otherwise the plans list.
	function planHref(d: CustomerDashboard): string {
		const id = d.obligations?.[0]?.planId;
		return id ? `/customer/plans/${id}` : '/customer/plans';
	}

	const appBtn =
		'width:36px;height:36px;border-radius:10px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--ink);text-decoration:none;flex:0 0 auto';
	const rowBtn =
		'width:100%;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:12px 14px;display:flex;align-items:center;gap:12px;cursor:pointer;text-align:left;font-family:var(--ui)';
</script>

<StatusBar />

{#if customerDashboardStore.loading}
	<div style="padding:16px"><Skeleton height="200px" /></div>
{:else if customerDashboardStore.error}
	<div style="padding:16px">
		<ErrorState
			title="Erro ao carregar"
			sub={customerDashboardStore.error}
			onretry={() => customerDashboardStore.load()}
		/>
	</div>
{:else if !customerDashboardStore.data || customerDashboardStore.data.obligations.length === 0}
	<div style="padding:16px">
		<EmptyState icon="doc" title="Sem planos activos" sub="Ainda não tem planos confirmados" />
	</div>
{:else}
	{@const d = customerDashboardStore.data}
	<div>
		<!-- Greeting header -->
		<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 6px">
			<div>
				<div style="font-size:12px;color:var(--muted);font-weight:500">Bom dia</div>
				<div style="font-family:var(--display);font-weight:600;font-size:20px;letter-spacing:-.3px">Olá, {d.userName ?? ''}</div>
			</div>
			<a href="/customer/notifications" aria-label="Notificações" style={appBtn}>
				<Icon name="bell" size={18} stroke={1.6} />
			</a>
		</div>

		<!-- Next payment hero -->
		<div style="padding:8px 16px 0">
			<div style="border-radius:var(--r-card-lg);padding:14px 16px;background:var(--hero-gradient);color:#fff;box-shadow:var(--shadow-hero);position:relative;overflow:hidden">
				<div style="position:absolute;right:-40px;top:-40px;width:100px;height:100px;border-radius:50%;background:rgba(255,255,255,.04)"></div>
				<div style="position:relative">
					<div style="display:flex;justify-content:space-between;align-items:center">
						<span style="font-size:11.5px;font-weight:600;opacity:.8">Próximo pagamento</span>
						<Pill tone="amber" dot>Vence hoje</Pill>
					</div>
					<div class="mz-money" style="font-size:28px;font-weight:600;margin-top:4px;letter-spacing:-.8px">{money(d.nextAmount ?? 0)}</div>
					<div style="font-size:11px;opacity:.65;margin-top:2px">1 plano activo</div>
				</div>
			</div>
		</div>

		<!-- Quick actions -->
		<div style="display:flex;gap:6px;padding:18px 16px 0">
			<PremiumAction icon="send" label="Pagar" onclick={() => goto(planHref(d))} />
			<PremiumAction icon="doc" label="Planos" onclick={() => goto('/customer/plans')} />
			<PremiumAction icon="trophy" label="Confiança" onclick={() => goto('/customer/score')} />
			<PremiumAction icon="receipt" label="Recibos" onclick={() => goto('/customer/notifications')} />
		</div>

		<!-- Trust score row -->
		<div style="padding:18px 16px 0">
			<button onclick={() => goto('/customer/score')} style={rowBtn}>
				<LuxuryScoreDial score={scoringStore.data?.score ?? 0} size={46} />
				<div style="flex:1;min-width:0">
					<div style="font-weight:600;font-size:14px;color:var(--ink)">Confiança</div>
					<div style="font-size:12px;color:var(--muted);margin-top:1px">{scoringStore.data?.tier ?? ''}</div>
				</div>
				<Icon name="chevR" size={16} stroke={1.8} style="color:var(--muted)" />
			</button>
		</div>

		<!-- My plans -->
		<div style="padding:18px 16px 0">
			<div class="mz-eyebrow" style="margin-bottom:10px">Os meus planos</div>
			<button onclick={() => goto(planHref(d))} style={rowBtn}>
				<MonogramAvatar name={d.activePlanMerchant ?? ''} size={38} />
				<div style="flex:1;min-width:0">
					<div style="font-weight:600;font-size:14px;color:var(--ink)">{d.activePlanMerchant ?? ''}</div>
					<div style="font-size:12px;color:var(--muted);margin-top:1px">{d.currentInstallment ?? 0}/{d.installmentsTotal ?? 0} prestações · {money(d.nextAmount ?? 0)}</div>
				</div>
				<Pill tone="green" dot>Activo</Pill>
			</button>
		</div>

		<!-- Recent activity -->
		<div style="padding:18px 16px 0">
			<div class="mz-eyebrow" style="margin-bottom:10px">Actividade recente</div>
			<div style="background:var(--surface);border:1px solid var(--line);border-radius:16px;overflow:hidden">
				{#each d.recentActivity ?? [] as a, i (i)}
					<div style="display:flex;align-items:center;gap:12px;padding:12px 14px;{i ? 'border-top:1px solid rgba(0,0,0,.04)' : ''}">
						<div style="width:30px;height:30px;border-radius:50%;background:var(--green-tint);color:var(--green);display:flex;align-items:center;justify-content:center;flex:0 0 auto">
							<Icon name="check" size={14} stroke={2.2} />
						</div>
						<div style="flex:1;min-width:0">
							<div style="font-weight:600;font-size:14px;color:var(--ink)">{a.merchant}</div>
							<div style="font-size:12px;color:var(--muted);margin-top:1px">{a.method} · {a.date}</div>
						</div>
						<span class="mz-money" style="font-weight:600;font-size:14px;color:var(--green)">-{money(a.amount)}</span>
					</div>
				{/each}
			</div>
		</div>

		<div style="height:24px"></div>
	</div>
{/if}

<HomeIndicator />
