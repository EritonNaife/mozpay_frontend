<script lang="ts">
	import { goto } from '$app/navigation';
	import { StatusBar, AppBar, Btn, Field, Banner, Brand, Footer, HomeIndicator, OtpInput, Segmented, Icon } from '$lib/components/index.js';
	import { requestOtp, setPin, createProfile } from '$lib/api';
	import { login, merchantProfileStore, auth, setHasPin } from '$lib/stores';
	import { BRAND_NAME } from '$lib/brand.js';

	let step = $state<'login' | 'pin' | 'otp' | 'profile' | 'setpin'>('login');
	let phoneNumber = $state('');
	let otpCode = $state('');
	let pinCode = $state('');
	let pinConfirm = $state('');
	let businessName = $state('');
	let cat = $state('');
	let loading = $state(false);
	let error = $state('');
	let resendTimer = $state(30);

	const catOpts = ['Telemóveis e electrónica', 'Mobiliário', 'Electrodomésticos', 'Retalho geral'];

	$effect(() => {
		if (step !== 'otp') return;
		resendTimer = 30;
		const interval = setInterval(() => {
			resendTimer--;
			if (resendTimer <= 0) clearInterval(interval);
		}, 1000);
		return () => clearInterval(interval);
	});

	async function handlePhoneSubmit() {
		if (!phoneNumber.trim()) return;
		// Check if this phone has a stored PIN preference
		if (auth.hasPin) {
			step = 'pin';
		} else {
			await handleRequestOtp();
		}
	}

	async function handleRequestOtp() {
		if (!phoneNumber.trim()) return;
		loading = true;
		error = '';
		const result = await requestOtp(phoneNumber, 'MERCHANT');
		loading = false;
		if (!result.ok) {
			error = result.error === 'PHONE_NOT_APPROVED_FOR_ROLE'
				? 'Este número não está aprovado para acesso de comerciante.'
				: 'Não foi possível enviar o código. Tente de novo.';
			return;
		}
		step = 'otp';
	}

	async function handleLoginWithPin() {
		if (pinCode.length !== 6) return;
		loading = true;
		error = '';
		const res = await fetch('/auth/login-with-pin', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ phone_number: phoneNumber, pin: pinCode }),
		});
		const result = await res.json();
		loading = false;
		if (!res.ok) {
			error = 'PIN inválido. Tente de novo.';
			return;
		}
		if (!result.roles.includes('MERCHANT')) {
			error = 'Este número não está aprovado para acesso de comerciante.';
			return;
		}
		login({ roles: result.roles, isNew: result.is_new, has_pin: result.has_pin }, phoneNumber);
		merchantProfileStore.load().then(() => {
			if (merchantProfileStore.data) {
				goto('/merchant');
			} else {
				step = 'profile';
			}
		});
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
			error = result.error?.code === 'INVALID_OTP' ? 'Código inválido ou expirado' : 'Não foi possível verificar o código. Tente de novo.';
			return;
		}
		if (!result.roles.includes('MERCHANT')) {
			error = 'Este número não está aprovado para acesso de comerciante.';
			return;
		}
		login({ roles: result.roles, isNew: result.is_new, has_pin: result.has_pin }, phoneNumber);
		if (result.has_pin) {
			merchantProfileStore.load().then(() => {
				if (merchantProfileStore.data) {
					goto('/merchant');
				} else {
					step = 'profile';
				}
			});
		} else {
			step = 'profile';
		}
	}

	async function handleResend() {
		if (resendTimer > 0) return;
		const result = await requestOtp(phoneNumber, 'MERCHANT');
		if (!result.ok) {
			error = result.error === 'PHONE_NOT_APPROVED_FOR_ROLE'
				? 'Este número não está aprovado para acesso de comerciante.'
				: 'Não foi possível reenviar o código.';
			return;
		}
		resendTimer = 30;
	}

	async function handleCreateProfile() {
		if (!businessName.trim() || !cat) return;
		loading = true;
		error = '';
		const result = await createProfile({ business_name: businessName, business_category: cat });
		loading = false;
		if (!result.ok) { error = 'Não foi possível criar o perfil. Tente de novo.'; return; }
		merchantProfileStore.set(result.data);
		step = 'setpin';
	}

	async function handleSetPin() {
		if (pinCode.length !== 6) return;
		if (pinCode !== pinConfirm) {
			error = 'Os PINs não coincidem.';
			return;
		}
		loading = true;
		error = '';
		const result = await setPin(pinCode);
		loading = false;
		if (!result.ok) { error = 'Não foi possível guardar o PIN.'; return; }
		setHasPin(true);
		goto('/merchant');
	}

	function skipPin() {
		goto('/merchant');
	}
</script>

{#if step === 'login'}
	<StatusBar />
	<div class="mz-body" style="padding:0 22px;justify-content:center">
		<Brand size={58} showName />
		<h1 class="mz-h1" style="margin-top:40px">Entrar no {BRAND_NAME}</h1>
		<p class="mz-sub" style="margin-top:10px;max-width:280px">Introduza o seu número de telemóvel. Vamos enviar-lhe um código por SMS para confirmar.</p>
		<div style="margin-top:28px"><Field label="Número de telemóvel" bind:value={phoneNumber} input type="tel" inputmode="tel" /></div>
		<div style="display:flex;gap:8px;align-items:center;margin-top:14px;color:var(--muted);font-size:12.5px">
			<Icon name="shield" size={16} stroke={1.9} style="color:var(--green)" />
			O seu número é a sua identidade. Sem palavras-passe.
		</div>
			<button
			style="background:none;border:none;padding:0;color:var(--blue-800);font-weight:600;font-size:12.5px;cursor:pointer;text-decoration:underline;margin-top:10px"
			disabled={!phoneNumber.trim()}
			onclick={() => { error = ''; step = 'pin'; }}
		>
			Entrar com PIN
		</button>
		{#if error}
			<div style="margin-top:14px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
	</div>
	<Footer>
		<Btn variant="primary" block disabled={loading} iconEnd={loading ? undefined : 'fwd'} onclick={handlePhoneSubmit}>
			{loading ? 'A enviar...' : 'Continuar'}
		</Btn>
		<p style="font-size:11px;color:var(--faint);text-align:center;line-height:1.5">Ao continuar aceita os Termos e a Política de Privacidade do {BRAND_NAME}.</p>
	</Footer>
	<HomeIndicator />

{:else if step === 'pin'}
	<StatusBar />
	<AppBar back />
	<div class="mz-body mz-body--pad">
		<h1 class="mz-h1">Introduza o<br/>seu PIN</h1>
		<p class="mz-sub" style="margin-top:10px">Use o PIN de 6 dígitos que criou para entrar rapidamente.</p>
		<div style="margin-top:30px">
			<OtpInput bind:value={pinCode} oncomplete={handleLoginWithPin} />
		</div>
		<div style="display:flex;align-items:center;gap:7px;margin-top:22px;color:var(--muted);font-size:13px">
			<button
				style="background:none;border:none;padding:0;color:var(--blue-800);font-weight:600;font-size:inherit;cursor:pointer;text-decoration:underline"
				onclick={handleRequestOtp}
			>
				Esqueci o meu PIN — enviar código
			</button>
		</div>
		{#if error}
			<div style="margin-top:22px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto">
			<Banner tone="blue" icon="info" title="Sabia que?">Nunca partilhe o seu PIN com ninguém. O {BRAND_NAME} nunca lhe pede o PIN.</Banner>
		</div>
	</div>
	<Footer>
		<Btn variant="primary" block disabled={loading} onclick={handleLoginWithPin}>
			{loading ? 'A verificar...' : 'Entrar'}
		</Btn>
	</Footer>
	<HomeIndicator />

{:else if step === 'otp'}
	<StatusBar />
	<AppBar back />
	<div class="mz-body mz-body--pad">
		<h1 class="mz-h1">Verifique o<br/>seu número</h1>
		<p class="mz-sub" style="margin-top:10px">Introduza o código de 6 dígitos enviado por SMS para <strong style="color:var(--ink-2)">{phoneNumber}</strong>.</p>
		<div style="margin-top:30px">
			<OtpInput bind:value={otpCode} oncomplete={submitOtp} />
		</div>
		<div style="display:flex;align-items:center;gap:7px;margin-top:22px;color:var(--muted);font-size:13px">
			<Icon name="clock" size={16} stroke={1.9} />
			{#if resendTimer > 0}
				Reenviar código em <strong style="color:var(--ink-2)">0:{resendTimer.toString().padStart(2, '0')}</strong>
			{:else}
				<button
					style="background:none;border:none;padding:0;color:var(--blue-800);font-weight:600;font-size:inherit;cursor:pointer;text-decoration:underline"
					onclick={handleResend}
				>
					Reenviar código
				</button>
			{/if}
		</div>
		{#if error}
			<div style="margin-top:22px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto">
			<Banner tone="blue" icon="info" title="Sabia que?">O {BRAND_NAME} nunca lhe pede o código por chamada. Não o partilhe com ninguém.</Banner>
		</div>
	</div>
	<Footer>
		<Btn variant="primary" block disabled={loading} onclick={submitOtp}>
			{loading ? 'A verificar...' : 'Verificar'}
		</Btn>
	</Footer>
	<HomeIndicator />

{:else if step === 'profile'}
	<StatusBar />
	<AppBar />
	<div class="mz-body mz-body--pad">
		<div class="mz-eyebrow">Passo 2 de 2 · Configuração</div>
		<h1 class="mz-h1" style="margin-top:10px">Configure o<br/>seu negócio</h1>
		<p class="mz-sub" style="margin-top:10px">Só precisamos do essencial para registar a sua primeira venda. O resto fica para depois.</p>
		<div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">
			<Field label="Nome do negócio" bind:value={businessName} input />
			<div>
				<span class="mz-lbl" style="margin-left:2px">Categoria do negócio</span>
				<div style="margin-top:7px">
					<Segmented options={catOpts} bind:value={cat} />
				</div>
			</div>
		</div>
		{#if error}
			<div style="margin-top:22px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto">
			<Banner tone="green" icon="check" title="Pronto em segundos">Pode acrescentar morada, NUIT e logótipo mais tarde — nada disto bloqueia a sua primeira venda.</Banner>
		</div>
	</div>
	<Footer>
		<Btn variant="primary" block disabled={loading} iconEnd={loading ? undefined : 'fwd'} onclick={handleCreateProfile}>
			{loading ? 'A criar conta...' : 'Criar conta e começar'}
		</Btn>
	</Footer>
	<HomeIndicator />

{:else}
	<!-- step === 'setpin' -->
	<StatusBar />
	<AppBar />
	<div class="mz-body mz-body--pad">
		<div class="mz-eyebrow">Segurança</div>
		<h1 class="mz-h1" style="margin-top:10px">Crie o seu<br/>PIN de acesso</h1>
		<p class="mz-sub" style="margin-top:10px">Um PIN de 6 dígitos para entrar rapidamente da próxima vez, sem precisar de SMS.</p>
		<div style="display:flex;flex-direction:column;gap:12px;margin-top:24px">
			<Field label="PIN (6 dígitos)" bind:value={pinCode} input type="password" inputmode="numeric" />
			<Field label="Confirmar PIN" bind:value={pinConfirm} input type="password" inputmode="numeric" />
		</div>
		{#if error}
			<div style="margin-top:14px"><Banner tone="red" icon="alert" title="Erro">{error}</Banner></div>
		{/if}
		<div style="margin-top:auto">
			<Banner tone="blue" icon="info" title="Privacidade">O seu PIN é guardado de forma segura. Nunca é partilhado nem visível para ninguém.</Banner>
		</div>
	</div>
	<Footer>
		<div style="display:flex;flex-direction:column;gap:8px">
			<Btn variant="primary" block disabled={loading || pinCode.length !== 6 || pinConfirm.length !== 6} iconEnd={loading ? undefined : 'lock'} onclick={handleSetPin}>
				{loading ? 'A guardar...' : 'Guardar PIN'}
			</Btn>
			<button
				style="background:none;border:none;padding:8px;color:var(--muted);font-size:13px;font-weight:500;cursor:pointer;text-decoration:underline;text-align:center"
				onclick={skipPin}
			>
				Mais tarde
			</button>
		</div>
	</Footer>
	<HomeIndicator />
{/if}
