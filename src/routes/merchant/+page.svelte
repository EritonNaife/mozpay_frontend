<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, Avatar, Icon, Pill, Banner, HomeIndicator, Skeleton, EmptyState, ErrorState, Field, Btn } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { merchantStore, merchantProfileStore, auth, setHasPin } from '$lib/stores';
	import { setPin } from '$lib/api/auth';

	function avgScoreLabel(score: number | null): string {
		if (score === null) return '—';
		if (score >= 80) return 'Saudável';
		if (score >= 40) return 'Estável';
		return 'Atenção';
	}

	function avgScoreTone(score: number | null): 'green' | 'amber' | 'red' {
		if (score === null) return 'amber';
		if (score >= 80) return 'green';
		if (score >= 40) return 'amber';
		return 'red';
	}

	let greetingName = $derived(merchantProfileStore.data?.business_name ?? 'MozPay');
	let hasDashboard = $derived(merchantStore.data !== null);

	let showPinSetup = $state(false);
	let setupPin = $state('');
	let setupPinConfirm = $state('');
	let pinLoading = $state(false);
	let pinError = $state('');

	async function handleSetupPin() {
		if (setupPin.length !== 6 || setupPin !== setupPinConfirm) {
			pinError = setupPin !== setupPinConfirm ? 'Os PINs não coincidem.' : '';
			return;
		}
		pinLoading = true;
		pinError = '';
		const result = await setPin(setupPin);
		pinLoading = false;
		if (!result.ok) { pinError = 'Não foi possível guardar o PIN.'; return; }
		setHasPin(true);
		showPinSetup = false;
	}

	onMount(() => {
		merchantProfileStore.load();
		merchantStore.load();
	});
</script>

<StatusBar />

<!-- Greeting -->
<div class="mz-appbar" style="padding-top:6px">
	<Avatar name={greetingName} tone="blue" size={42} />
	<div class="mz-appbar__t">
		<div style="font-size:12.5px;color:var(--muted);font-weight:600">Bom dia</div>
		<div class="mz-appbar__title" style="font-size:18px">{greetingName}</div>
	</div>
	<a href="/merchant/notifications" style="position:relative;text-decoration:none" aria-label="Notificações">
		<div class="mz-appbar__btn"><Icon name="bell" size={20} /></div>
	</a>
</div>

{#if merchantProfileStore.loading}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden"><Skeleton height="300px" /></div>
{:else if hasDashboard}
	{@const d = merchantStore.data}
	{#if d}
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden">
		<!-- Hero card -->
		<div style="border-radius:22px;padding:18px 20px;background:var(--hero-gradient);color:#fff;box-shadow:0 14px 30px -12px rgba(22,48,110,.6);position:relative;overflow:hidden">
			<div style="position:absolute;right:-30px;top:-30px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.06)"></div>
			<div style="font-size:12.5px;font-weight:600;opacity:.8">Valor activo a receber</div>
			<div class="mz-money" style="font-size:34px;font-weight:600;margin-top:4px;letter-spacing:-1px">{money(d.activeInstallmentValueCentavos / 100)}</div>
			<div style="display:flex;gap:18px;margin-top:14px;padding-top:13px;border-top:1px solid rgba(255,255,255,.16)">
				<div><div class="mz-money" style="font-size:17px;font-weight:600">{d.activeCustomers}</div><div style="font-size:11px;opacity:.75;font-weight:500">Clientes activos</div></div>
				<div><div class="mz-money" style="font-size:17px;font-weight:600">{d.averageCustomerScore ?? '—'}</div><div style="font-size:11px;opacity:.75;font-weight:500">Pontuação média</div></div>
				<div style="margin-left:auto;align-self:center"><Pill tone={avgScoreTone(d.averageCustomerScore)} dot>{avgScoreLabel(d.averageCustomerScore)}</Pill></div>
			</div>
		</div>

		<!-- Actions -->
		<div style="display:flex;gap:10px">
			<a href="/merchant/sale/create" class="mz-btn mz-btn--primary mz-btn--block" style="height:50px;font-size:14.5px;border-radius:14px;text-decoration:none">
				<Icon name="plus" size={19} stroke={2.2} />Criar venda
			</a>
			<a href="/merchant/payment/register" class="mz-btn mz-btn--ghost mz-btn--block" style="height:50px;font-size:14.5px;border-radius:14px;text-decoration:none">
				<Icon name="wallet" size={19} stroke={1.9} />Registar
			</a>
		</div>

		<!-- Mini stats -->
		<div style="display:flex;gap:10px">
			{#each [
				{ value: String(d.dueToday.length), label: 'Vencem hoje', tone: 'amber' as const },
				{ value: String(d.overdueItems.length), label: 'Em atraso', tone: 'red' as const },
				{ value: String(d.pendingPayments), label: 'A confirmar', tone: 'blue' as const },
			] as stat}
				<div class="mz-card mz-card--pad" style="flex:1 1 0;padding:12px 13px">
					<div style="display:flex;align-items:center;gap:6px">
						<span class="mz-dot" style="background:var(--{stat.tone === 'amber' ? 'amber' : stat.tone === 'red' ? 'red' : 'blue-800'})"></span>
						<span class="mz-money" style="font-size:22px;font-weight:600;color:var(--ink)">{stat.value}</span>
					</div>
					<div style="font-size:11.5px;color:var(--muted);font-weight:600;margin-top:3px;line-height:1.2">{stat.label}</div>
				</div>
			{/each}
		</div>

		<!-- Today list -->
		<div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px">
			<span class="mz-h2">Hoje</span>
			<span style="font-size:12.5px;color:var(--blue-800);font-weight:700">Ver tudo</span>
		</div>
		<div class="mz-list mz-list--card" style="margin-top:-4px">
			{#each d.dueToday as plan}
				<div class="mz-row">
					<Avatar name={plan.id} tone="blue" size={42} />
					<div class="mz-row__main">
						<div class="mz-row__title">{plan.id}</div>
						<div class="mz-row__sub">{plan.status} · {plan.installments.length} prestações</div>
					</div>
					<div class="mz-row__end">
						<span class="mz-money" style="font-size:14.5px;font-weight:600">{money(plan.remainingBalanceCentavos / 100)}</span>
						<Pill tone="amber" dot>Vence hoje</Pill>
					</div>
				</div>
			{/each}
		</div>
	</div>
	{/if}
{:else}
	<!-- No dashboard data yet — show getting-started state with actions -->
	<div class="mz-body mz-body--pad" style="gap:14px;overflow:hidden">
		<!-- Hero card — zeroed out -->
		<div style="border-radius:22px;padding:18px 20px;background:var(--hero-gradient);color:#fff;box-shadow:0 14px 30px -12px rgba(22,48,110,.6);position:relative;overflow:hidden">
			<div style="position:absolute;right:-30px;top:-30px;width:130px;height:130px;border-radius:50%;background:rgba(255,255,255,.06)"></div>
			<div style="font-size:12.5px;font-weight:600;opacity:.8">Valor activo a receber</div>
			<div class="mz-money" style="font-size:34px;font-weight:600;margin-top:4px;letter-spacing:-1px">{money(0)}</div>
			<div style="display:flex;gap:18px;margin-top:14px;padding-top:13px;border-top:1px solid rgba(255,255,255,.16)">
				<div><div class="mz-money" style="font-size:17px;font-weight:600">0</div><div style="font-size:11px;opacity:.75;font-weight:500">Clientes activos</div></div>
				<div><div class="mz-money" style="font-size:17px;font-weight:600">—</div><div style="font-size:11px;opacity:.75;font-weight:500">Pontuação média</div></div>
			</div>
		</div>

		<!-- Actions -->
		<div style="display:flex;gap:10px">
			<a href="/merchant/sale/create" class="mz-btn mz-btn--primary mz-btn--block" style="height:50px;font-size:14.5px;border-radius:14px;text-decoration:none">
				<Icon name="plus" size={19} stroke={2.2} />Criar venda
			</a>
			<a href="/merchant/payment/register" class="mz-btn mz-btn--ghost mz-btn--block" style="height:50px;font-size:14.5px;border-radius:14px;text-decoration:none">
				<Icon name="wallet" size={19} stroke={1.9} />Registar
			</a>
		</div>

		<!-- Getting started -->
		<Banner tone="blue" icon="info" title="Comece aqui">Crie a sua primeira venda para começar a registar prestações e acompanhar os seus clientes.</Banner>

		{#if !auth.hasPin && !showPinSetup}
			<Banner tone="amber" icon="lock" title="Proteja a sua conta">
				Configure um PIN de acesso rápido para entrar sem SMS.
				<button
					style="display:block;margin-top:8px;background:var(--amber);color:#fff;border:none;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer"
					onclick={() => showPinSetup = true}
				>
					Configurar PIN
				</button>
			</Banner>
		{/if}
		{#if showPinSetup}
			<div class="mz-card mz-card--pad" style="display:flex;flex-direction:column;gap:10px">
				<span class="mz-h2" style="font-size:15px">Configurar PIN</span>
				<Field label="PIN (6 dígitos)" bind:value={setupPin} input type="password" inputmode="numeric" />
				<Field label="Confirmar PIN" bind:value={setupPinConfirm} input type="password" inputmode="numeric" />
				{#if pinError}
					<Banner tone="red" icon="alert" title="Erro">{pinError}</Banner>
				{/if}
				<div style="display:flex;gap:8px">
					<Btn variant="primary" disabled={pinLoading || setupPin.length !== 6 || setupPinConfirm.length !== 6} onclick={handleSetupPin}>
						{pinLoading ? 'A guardar...' : 'Guardar PIN'}
					</Btn>
					<Btn variant="ghost" onclick={() => { showPinSetup = false; pinError = ''; }}>
						Mais tarde
					</Btn>
				</div>
			</div>
		{/if}
	</div>
{/if}

<HomeIndicator />
