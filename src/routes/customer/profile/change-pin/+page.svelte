<script lang="ts">
	import { goto } from '$app/navigation';
	import { StatusBar, AppBar, Field, Banner, Btn, Footer, HomeIndicator } from '$lib/components/index.js';
	import { setPin } from '$lib/api';
	import { setHasPin, toast } from '$lib/stores';

	let oldPin = $state('');
	let newPin = $state('');
	let confirmPin = $state('');
	let loading = $state(false);
	let error = $state('');
	let fieldError = $state('');

	async function handleChangePin() {
		error = '';
		fieldError = '';
		if (oldPin.length !== 6) { fieldError = 'oldPin'; error = 'Introduza o PIN actual de 6 dígitos.'; return; }
		if (newPin.length !== 6) { fieldError = 'newPin'; error = 'O novo PIN deve ter 6 dígitos.'; return; }
		if (newPin !== confirmPin) { fieldError = 'confirmPin'; error = 'Os PINs não coincidem.'; return; }
		loading = true;
		const result = await setPin(newPin, oldPin);
		loading = false;
		if (!result.ok) {
			if (result.error === 'INVALID_CREDENTIALS') {
				fieldError = 'oldPin';
				error = 'PIN actual incorreto.';
			} else {
				error = 'Não foi possível alterar o PIN.';
			}
			return;
		}
		setHasPin(true);
		toast.show('PIN alterado com sucesso', 'success');
		goto('/customer/profile');
	}

	function handleCancel() {
		goto('/customer/profile');
	}
</script>

<StatusBar />
<AppBar title="Alterar PIN" />

<div class="mz-body mz-body--pad" style="gap:14px">
	<div class="mz-narrow" style="display:flex;flex-direction:column;gap:14px;width:100%">
		<p class="mz-sub">Introduza o seu PIN actual e o novo PIN de 6 dígitos.</p>
		<div style="border-radius:12px;border:2px solid {fieldError === 'oldPin' ? 'var(--red)' : 'transparent'}"><Field label="PIN actual" bind:value={oldPin} input type="password" inputmode="numeric" /></div>
		<div style="border-radius:12px;border:2px solid {fieldError === 'newPin' ? 'var(--red)' : 'transparent'}"><Field label="Novo PIN" bind:value={newPin} input type="password" inputmode="numeric" /></div>
		<div style="border-radius:12px;border:2px solid {fieldError === 'confirmPin' ? 'var(--red)' : 'transparent'}"><Field label="Confirmar novo PIN" bind:value={confirmPin} input type="password" inputmode="numeric" /></div>
		{#if error}
			<Banner tone="red" icon="alert" title="Erro">{error}</Banner>
		{/if}
	</div>
</div>

<Footer>
	<div style="display:flex;flex-direction:column;gap:8px">
		<Btn variant="primary" block disabled={loading || oldPin.length !== 6 || newPin.length !== 6 || confirmPin.length !== 6} iconEnd={loading ? undefined : 'lock'} onclick={handleChangePin}>
			{loading ? 'A alterar...' : 'Alterar PIN'}
		</Btn>
		<button
			style="background:none;border:none;padding:8px;color:var(--muted);font-size:13px;font-weight:500;cursor:pointer;text-decoration:underline;text-align:center"
			onclick={handleCancel}
		>
			Cancelar
		</button>
	</div>
</Footer>
<HomeIndicator />
