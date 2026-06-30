<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StatusBar, Icon, Btn, Banner, Pill, Brand, Footer, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { toast } from '$lib/stores/toast.svelte.js';
	import { auth } from '$lib/stores';
	import { money } from '$lib/utils/index.js';
	import { getConfirmationContext, confirmPlan, rejectPlan } from '$lib/api/plans';
	import type { ConfirmationContext } from '$lib/api/types';

	let token = $state('');
	let context = $state<ConfirmationContext | null>(null);
	let loading = $state(true);
	let error = $state('');
	let acting = $state(false);

	onMount(() => {
		token = $page.url.searchParams.get('token') ?? '';
		if (!token) {
			loading = false;
			error = 'Link de confirmação inválido. Solicite um novo link ao comerciante.';
			return;
		}
		loadContext();
	});

	async function loadContext() {
		loading = true;
		error = '';
		const res = await getConfirmationContext(token);
		loading = false;
		if (!res.ok) {
			error = res.message || 'Não foi possível carregar os detalhes do plano.';
			return;
		}
		context = res.data;
	}

	function requireAuth() {
		if (auth.isAuthenticated) return true;
		const returnTo = encodeURIComponent($page.url.pathname + $page.url.search);
		goto(`/customer/login?returnTo=${returnTo}`);
		return false;
	}

	async function handleConfirm() {
		if (!context || !requireAuth()) return;
		acting = true;
		const res = await confirmPlan(context.planId, { confirmationToken: token });
		acting = false;
		if (!res.ok) {
			toast.show(res.message || 'Não foi possível confirmar o plano.', 'error');
			return;
		}
		goto('/customer/consent/done?status=confirmed');
	}

	async function handleReject() {
		if (!context || !requireAuth()) return;
		acting = true;
		const res = await rejectPlan(context.planId, { confirmationToken: token, reason: 'not_mine' });
		acting = false;
		if (!res.ok) {
			toast.show(res.message || 'Não foi possível rejeitar o plano.', 'error');
			return;
		}
		goto('/customer/consent/done?status=rejected');
	}

	function instPill(status: string) {
		if (status === 'PAID') return { tone: 'green' as const, icon: 'check' as const, label: 'Paga' };
		if (status === 'PENDING') return { tone: 'amber' as const, icon: 'clock' as const, label: 'Pendente' };
		return { tone: 'slate' as const, icon: null, label: status };
	}
</script>

<StatusBar />

<!-- Appbar with brand -->
<div class="mz-appbar" style="padding-top:6px">
	<Brand size={32} />
	<div class="mz-appbar__t"></div>
	<Pill tone="amber" dot>Aguarda a sua confirmação</Pill>
</div>

{#if loading}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if error}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<ErrorState sub={error} onretry={() => loadContext()} />
	</div>
{:else if !context}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<EmptyState icon="doc" title="Plano não encontrado" sub="Este link de confirmação não é válido ou já expirou." />
	</div>
{:else}
	{@const plan = context}
	<div class="mz-body mz-body--pad" style="gap:12px;overflow:hidden">
		<div>
			<h1 class="mz-h1" style="font-size:23px">Reconhece esta<br/>compra?</h1>
			<p class="mz-sub" style="margin-top:8px">
				O comerciante <strong style="color:var(--ink-2)">{plan.merchantName}</strong> registou um plano a prestações em seu nome. Confirme só se foi mesmo o(a) senhor(a).
			</p>
		</div>

		<!-- Product card -->
		<div class="mz-card mz-card--pad">
			<div style="display:flex;align-items:center;gap:12px">
				<div style="width:44px;height:44px;border-radius:13px;background:var(--surface-2);color:var(--ink-2);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><Icon name="doc" size={22} stroke={1.7} /></div>
				<div style="flex:1;min-width:0">
					<div style="font-weight:600;font-size:15.5px">{plan.productName}</div>
					<div style="font-size:12.5px;color:var(--muted)">{plan.installments.length} prestações</div>
				</div>
			</div>
			<div style="margin-top:6px">
				<div class="mz-key"><span class="mz-keyl">Valor do produto</span><span class="mz-keyv">{money(plan.productValueCentavos / 100)}</span></div>
				<div class="mz-key"><span class="mz-keyl">Entrada paga</span><span class="mz-keyv">{money(plan.downPaymentCentavos / 100)}</span></div>
				<div class="mz-key"><span class="mz-keyl" style="color:var(--ink);font-weight:700">A pagar</span><span class="mz-keyv" style="color:var(--blue-800);font-size:16px">{money(plan.remainingBalanceCentavos / 100)}</span></div>
			</div>
		</div>

		<!-- Installment schedule -->
		<span class="mz-h2" style="font-size:15.5px;margin-top:2px">Calendário de pagamentos</span>
		<div class="mz-list mz-list--card" style="margin-top:-4px">
			{#each plan.installments as inst}
				{@const cfg = instPill(inst.status)}
				<div class="mz-row" style="padding:12px 15px">
					<div style="width:30px;height:30px;border-radius:50%;flex:0 0 auto;border:2px solid var(--line);display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:600;font-size:12px">
						<span style="color:var(--ink-2)">{inst.sequence}</span>
					</div>
					<div class="mz-row__main">
						<div class="mz-row__title" style="font-size:14px">Prestação {inst.sequence}</div>
						<div class="mz-row__sub">Vence {inst.dueDate}</div>
					</div>
					<div class="mz-row__end">
						<span class="mz-money" style="font-size:14px;font-weight:600">{money(inst.amountDueCentavos / 100)}</span>
						<Pill tone={cfg.tone} icon={cfg.icon}>{cfg.label}</Pill>
					</div>
				</div>
			{/each}
		</div>

		<div style="margin-top:auto">
			<Banner tone="green" icon="shield" title="Sem juros escondidos">
				Paga exactamente o valor acordado. Confirmar começa a construir a sua pontuação de confiança MozPay.
			</Banner>
		</div>
	</div>
{/if}

{#if context}
	<Footer>
		<Btn variant="green" block lg icon="check" disabled={acting} onclick={handleConfirm}>
			{acting ? 'A processar...' : 'Sim, confirmo o plano'}
		</Btn>
		<Btn variant="ghost" block icon="flag" disabled={acting} style="color:var(--red)" onclick={handleReject}>
			Não reconheço esta compra
		</Btn>
	</Footer>
{/if}
<HomeIndicator />
