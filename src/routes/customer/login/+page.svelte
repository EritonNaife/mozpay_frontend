<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { StatusBar, Btn, Banner, Brand, Footer, HomeIndicator, OtpInput, PinPad, Icon } from '$lib/components/index.js';
	import { requestOtp, setPin } from '$lib/api';
	import { auth, login, setHasPin, customerDashboardStore } from '$lib/stores';
	import { BRAND_NAME } from '$lib/brand.js';

	type Step = 'phone' | 'pin' | 'otp' | 'setpin' | 'welcome';

	let step = $state<Step>('phone');
	let pinStage = $state<'create' | 'confirm'>('create');
	let phoneNumber = $state('');
	let otpCode = $state('');
	let loginPin = $state(''); // returning-user PIN login
	let pinCode = $state(''); // new PIN — create
	let pinConfirm = $state(''); // new PIN — confirm
	let loading = $state(false);
	let error = $state('');
	let resendTimer = $state(30);
	let returnTo = $state('/customer');

	let phoneValid = $derived(phoneNumber.replace(/\s/g, '').length >= 9);
	let welcomeName = $derived(customerDashboardStore.data?.userName ?? 'Cliente');

	const features = [
		{ icon: 'doc', text: 'Consulte e aceite planos de prestações' },
		{ icon: 'shield', text: 'Construa a sua reputação de pagamento' },
		{ icon: 'bell', text: 'Receba lembretes antes do vencimento' },
	];

	onMount(() => {
		returnTo = $page.url.searchParams.get('returnTo') ?? '/customer';
	});

	$effect(() => {
		if (step !== 'otp') return;
		resendTimer = 30;
		const interval = setInterval(() => {
			resendTimer--;
			if (resendTimer <= 0) clearInterval(interval);
		}, 1000);
		return () => clearInterval(interval);
	});

	function goBack() {
		error = '';
		if (step === 'otp' || step === 'pin') {
			step = 'phone';
		} else if (step === 'setpin') {
			if (pinStage === 'confirm') {
				pinStage = 'create';
				pinConfirm = '';
			} else {
				step = 'otp';
			}
		}
	}

	async function handlePhoneSubmit() {
		if (!phoneValid || loading) return;
		if (auth.hasPin) {
			error = '';
			loginPin = '';
			step = 'pin';
		} else {
			await handleRequestOtp();
		}
	}

	async function handleRequestOtp() {
		if (!phoneNumber.trim()) return;
		loading = true;
		error = '';
		const result = await requestOtp(phoneNumber);
		loading = false;
		if (!result.ok) {
			error = 'Não foi possível enviar o código. Tente de novo.';
			return;
		}
		otpCode = '';
		step = 'otp';
	}

	async function handleLoginWithPin(pin?: string) {
		const value = pin ?? loginPin;
		if (value.length !== 6) return;
		loading = true;
		error = '';
		const res = await fetch('/auth/login-with-pin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone_number: phoneNumber, pin: value }),
		});
		const result = await res.json();
		loading = false;
		if (!res.ok) {
			error = 'PIN inválido. Tente de novo.';
			loginPin = '';
			return;
		}
		login({ roles: result.roles, isNew: result.is_new, has_pin: result.has_pin }, phoneNumber);
		goto(returnTo || '/customer');
	}

	async function submitOtp() {
		if (otpCode.length !== 6) return;
		loading = true;
		error = '';
		const res = await fetch('/auth/verify-otp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone_number: phoneNumber, code: otpCode }),
		});
		const result = await res.json();
		loading = false;
		if (!res.ok) {
			error =
				result.error?.code === 'INVALID_OTP'
					? 'Código inválido ou expirado'
					: 'Não foi possível verificar o código. Tente de novo.';
			otpCode = '';
			return;
		}
		login({ roles: result.roles, isNew: result.is_new, has_pin: result.has_pin }, phoneNumber);
		if (!result.has_pin) {
			pinStage = 'create';
			pinCode = '';
			pinConfirm = '';
			error = '';
			step = 'setpin';
		} else {
			goto(returnTo || '/customer');
		}
	}

	async function handleResend() {
		if (resendTimer > 0) return;
		const result = await requestOtp(phoneNumber);
		if (!result.ok) {
			error = 'Não foi possível reenviar o código.';
			return;
		}
		resendTimer = 30;
	}

	function onPinCreate() {
		error = '';
		pinStage = 'confirm';
	}

	async function onPinConfirm(value: string) {
		if (value !== pinCode) {
			error = 'Os PINs não coincidem';
			pinConfirm = '';
			return;
		}
		loading = true;
		error = '';
		const result = await setPin(pinCode);
		loading = false;
		if (!result.ok) {
			error = 'Não foi possível guardar o PIN.';
			pinConfirm = '';
			return;
		}
		setHasPin(true);
		customerDashboardStore.load();
		step = 'welcome';
	}
</script>

{#snippet topBack()}
	<div class="mz-appbar">
		<button class="mz-appbar__btn" aria-label="Voltar" onclick={goBack}>
			<Icon name="back" size={20} />
		</button>
	</div>
{/snippet}

{#if step === 'phone'}
	<StatusBar />
	<div class="mz-body mz-body--pad" style="padding-top:44px">
		<div style="display:flex;justify-content:center;margin-bottom:28px"><Brand size={56} /></div>
		<h1 class="mz-h1" style="text-align:center">Entrar no {BRAND_NAME}</h1>
		<p class="mz-sub" style="text-align:center;margin-top:6px">O seu número é a sua identidade. Sem palavras-passe.</p>

		<div style="margin-top:32px">
			<div style="font-size:12px;font-weight:600;color:var(--muted);margin-bottom:6px">Número de telemóvel</div>
			<div style="display:flex;gap:8px">
				<div style="background:var(--surface-2);border:1.5px solid var(--line);border-radius:12px;padding:12px;font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink);flex:0 0 auto">+258</div>
				<input
					class="phone-inp"
					type="tel"
					inputmode="tel"
					aria-label="Número de telemóvel"
					placeholder="84 123 4567"
					bind:value={phoneNumber}
				/>
			</div>
		</div>

		<div style="margin-top:auto"></div>
		<Banner tone="blue" icon="shield" title="Seguro">O {BRAND_NAME} nunca lhe pede o PIN por SMS.</Banner>
		{#if error}
			<div style="margin-top:12px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
	</div>
	<Footer>
		<Btn variant="primary" block lg disabled={!phoneValid || loading} iconEnd={loading ? undefined : 'fwd'} onclick={handlePhoneSubmit}>
			{loading ? 'A enviar...' : 'Continuar'}
		</Btn>
		<button
			style="background:none;border:none;padding:2px;color:var(--blue-800);font-weight:600;font-size:13px;cursor:pointer;text-align:center"
			onclick={() => { error = ''; loginPin = ''; step = 'pin'; }}
		>
			Entrar com PIN
		</button>
		<p style="font-size:11px;color:var(--faint);text-align:center;line-height:1.5">Ao continuar aceita os Termos e a Política de Privacidade do {BRAND_NAME}.</p>
	</Footer>
	<HomeIndicator />

{:else if step === 'otp'}
	<StatusBar />
	{@render topBack()}
	<div class="mz-body mz-body--pad">
		<h1 class="mz-h1">Verificação</h1>
		<p class="mz-sub" style="margin-top:10px">
			Introduza o código de 6 dígitos enviado para <strong style="color:var(--ink-2)">+258 {phoneNumber}</strong>
		</p>
		<div style="margin-top:28px">
			<OtpInput bind:value={otpCode} oncomplete={submitOtp} />
		</div>
		<div style="text-align:center;font-size:13px;color:var(--muted);margin-top:18px">
			{#if resendTimer > 0}
				Reenviar em 0:{resendTimer.toString().padStart(2, '0')}
			{:else}
				<button
					style="background:none;border:none;padding:0;color:var(--blue-800);font-weight:600;font-size:13px;cursor:pointer"
					onclick={handleResend}
				>
					Reenviar código
				</button>
			{/if}
		</div>
		{#if error}
			<div style="margin-top:18px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto"></div>
		<Banner tone="blue" icon="info" title="Sabia que?">O {BRAND_NAME} nunca lhe pede o código por chamada. Não o partilhe com ninguém.</Banner>
	</div>
	<Footer>
		<Btn variant="primary" block lg disabled={loading || otpCode.length !== 6} onclick={submitOtp}>
			{loading ? 'A verificar...' : 'Verificar'}
		</Btn>
	</Footer>
	<HomeIndicator />

{:else if step === 'pin'}
	<StatusBar />
	{@render topBack()}
	<div class="mz-body mz-body--pad">
		<h1 class="mz-h1">Introduza o<br />seu PIN</h1>
		<p class="mz-sub" style="margin-top:10px">Use o PIN de 6 dígitos que criou para entrar rapidamente.</p>
		<button
			style="align-self:flex-start;background:none;border:none;padding:0;margin-top:16px;color:var(--blue-800);font-weight:600;font-size:13px;cursor:pointer"
			onclick={handleRequestOtp}
		>
			Esqueci o meu PIN — enviar código
		</button>
		{#if error}
			<div style="margin-top:16px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto"></div>
		<div style="padding-bottom:20px">
			<PinPad bind:value={loginPin} oncomplete={handleLoginWithPin} />
		</div>
	</div>
	<HomeIndicator />

{:else if step === 'setpin'}
	<StatusBar />
	{@render topBack()}
	<div class="mz-body mz-body--pad">
		<h1 class="mz-h1">{pinStage === 'create' ? 'Criar PIN' : 'Confirmar PIN'}</h1>
		<p class="mz-sub" style="margin-top:10px">
			{pinStage === 'create'
				? 'Escolha um PIN de 6 dígitos para proteger a sua conta.'
				: 'Introduza o PIN novamente para confirmar.'}
		</p>
		{#if error}
			<div style="text-align:center;font-size:12.5px;color:var(--red);font-weight:600;margin-top:16px">{error}</div>
		{/if}
		<div style="margin-top:auto"></div>
		<div style="padding-bottom:20px">
			{#if pinStage === 'create'}
				<PinPad bind:value={pinCode} oncomplete={onPinCreate} />
			{:else}
				<PinPad bind:value={pinConfirm} oncomplete={onPinConfirm} />
			{/if}
		</div>
	</div>
	<HomeIndicator />

{:else}
	<StatusBar />
	<div class="mz-body mz-body--pad" style="align-items:center;justify-content:center;text-align:center">
		<div style="margin-bottom:20px"><Brand size={64} /></div>
		<h1 class="mz-h1">Bem-vindo, {welcomeName}!</h1>
		<p class="mz-sub" style="margin-top:8px;max-width:280px">A sua conta está pronta. Comece a acompanhar os seus pagamentos com confiança.</p>
		<div style="display:flex;flex-direction:column;gap:16px;margin-top:32px;max-width:260px;width:100%">
			{#each features as f (f.icon)}
				<div style="display:flex;gap:12px;align-items:center;text-align:left">
					<div style="width:36px;height:36px;border-radius:50%;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto">
						<Icon name={f.icon} size={17} stroke={1.8} />
					</div>
					<span style="font-size:13px;color:var(--ink);font-weight:500;line-height:1.4">{f.text}</span>
				</div>
			{/each}
		</div>
	</div>
	<Footer>
		<Btn variant="primary" block lg onclick={() => goto(returnTo || '/customer')}>Começar</Btn>
	</Footer>
	<HomeIndicator />
{/if}

<style>
	.phone-inp {
		flex: 1;
		min-width: 0;
		background: var(--surface);
		border: 1.5px solid var(--line);
		border-radius: 12px;
		padding: 12px 14px;
		font-family: var(--ui);
		font-size: 16px;
		font-weight: 500;
		color: var(--ink);
		outline: none;
	}
	.phone-inp::placeholder {
		color: var(--faint);
	}
	.phone-inp:focus {
		border-color: var(--blue-700);
		box-shadow: 0 0 0 4px var(--blue-tint);
	}
</style>
