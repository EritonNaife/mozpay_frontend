<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, Avatar, Icon, Pill, ScoreRing, HomeIndicator, Skeleton, EmptyState, ErrorState, Banner, Field, Btn } from '$lib/components/index.js';
	import { money } from '$lib/utils/index.js';
	import { auth, customerDashboardStore, setHasPin } from '$lib/stores';
	import { setPin } from '$lib/api/auth';

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

	onMount(() => { customerDashboardStore.load(); });
</script>

<StatusBar />

<!-- Greeting appbar -->
<div class="mz-appbar" style="padding-top:6px">
	<Avatar name={auth.phone || 'Cliente'} tone="blue" size={42} />
	<div class="mz-appbar__t">
		<div style="font-size:12.5px;color:var(--muted);font-weight:600">Olá</div>
		<div class="mz-appbar__title" style="font-size:18px">{auth.phone || 'Cliente'}</div>
	</div>
	<a href="/customer/notifications" style="position:relative;text-decoration:none" aria-label="Notificações">
		<div class="mz-appbar__btn"><Icon name="bell" size={20} /></div>
	</a>
</div>

{#if !auth.hasPin && !showPinSetup}
	<div class="mz-body--pad" style="margin-top:-6px">
		<Banner tone="amber" icon="lock" title="Proteja a sua conta">
			Configure um PIN de acesso rápido para entrar sem SMS.
			<button
				style="display:block;margin-top:8px;background:var(--amber);color:#fff;border:none;padding:8px 16px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer"
				onclick={() => showPinSetup = true}
			>
				Configurar PIN
			</button>
		</Banner>
	</div>
{/if}
{#if showPinSetup}
	<div class="mz-body--pad" style="margin-bottom:10px">
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
	</div>
{/if}

{#if customerDashboardStore.loading}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if customerDashboardStore.error}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><ErrorState sub={customerDashboardStore.error} onretry={() => customerDashboardStore.load()} /></div>
{:else if !customerDashboardStore.data || customerDashboardStore.data.obligations.length === 0}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><EmptyState icon="doc" title="Sem planos activos" sub="Ainda não tem planos confirmados" /></div>
{:else}
	{@const d = customerDashboardStore.data}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<!-- Next payment hero -->
		<div style="border-radius:22px;padding:17px 19px;background:var(--hero-gradient);color:#fff;box-shadow:0 14px 30px -12px rgba(22,48,110,.6);position:relative;overflow:hidden">
			<div style="position:absolute;right:-28px;top:-28px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.06)"></div>
			<div style="display:flex;justify-content:space-between;align-items:center">
				<span style="font-size:12.5px;font-weight:600;opacity:.85">Próximo pagamento</span>
				<Pill tone="amber" dot>Em breve</Pill>
			</div>
			<div class="mz-money" style="font-size:33px;font-weight:600;margin-top:6px;letter-spacing:-1px">{money(d.nextPaymentCentavos / 100)}</div>
			<div style="font-size:12.5px;opacity:.8;margin-top:2px">{d.obligations.length} plano(s) · {money(d.totalOwedCentavos / 100)} em dívida</div>
			<div class="mz-prog" style="margin-top:13px;background:rgba(255,255,255,.18)"><div class="mz-prog__f" style="width:8%;background:#fff"></div></div>
		</div>

		<!-- Trust score strip -->
		<a href="/customer/score" class="mz-card mz-card--pad" style="display:flex;align-items:center;gap:14px;text-decoration:none;color:inherit">
			<ScoreRing score={d.score} size={58} />
			<div style="flex:1;min-width:0">
				<div style="font-size:12.5px;color:var(--muted);font-weight:600">Pontuação de confiança</div>
				<div style="font-weight:700;font-size:15.5px;color:var(--ink);margin-top:1px">{d.scoreLabel}</div>
				<div style="font-size:11.5px;color:var(--muted);margin-top:1px">Pague a tempo para subir de nível</div>
			</div>
			<Icon name="chevR" size={18} style="color:var(--faint)" />
		</a>

		<!-- My plans -->
		<div style="display:flex;align-items:center;justify-content:space-between;margin-top:2px">
			<span class="mz-h2">Os meus planos</span>
			<Pill tone="blue">{d.obligations.length} activo(s)</Pill>
		</div>
		<div class="mz-list" style="margin-top:-4px">
			{#each d.obligations as obligation}
				<a href="/customer/plans/{obligation.planId}" class="mz-row" style="text-decoration:none;color:inherit">
					<div style="width:42px;height:42px;border-radius:12px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><Icon name="doc" size={21} stroke={1.7} /></div>
					<div class="mz-row__main"><div class="mz-row__title">{obligation.merchantName}</div><div class="mz-row__sub">{obligation.productName} · {money(obligation.remainingBalanceCentavos / 100)} restantes</div></div>
					<div class="mz-row__end"><Pill tone="green" dot>Activo</Pill><Icon name="chevR" size={16} style="color:var(--faint)" /></div>
				</a>
			{/each}
		</div>
	</div>
{/if}

<HomeIndicator />
