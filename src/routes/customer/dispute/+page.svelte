<script lang="ts">
	import { StatusBar, AppBar, Icon, Btn, Banner, Footer, HomeIndicator, OptionCard } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { toast } from '$lib/stores/toast.svelte.js';

	let reason = $state('none');

	const reasons = [
		{ value: 'none', label: 'Não fiz este pagamento', icon: 'close' },
		{ value: 'wrong', label: 'O valor está errado', icon: 'cash' },
		{ value: 'already', label: 'Já tinha pago esta prestação', icon: 'receipt' },
		{ value: 'other', label: 'Outro motivo', icon: 'more' },
	];

	function submit() {
		toast.show('Contestação enviada', 'success');
		goto('/customer');
	}
</script>

<StatusBar />
<AppBar title="Contestar registo" sub="Prestação 1 · 5.333 MT" back />

<div class="mz-body mz-body--pad" style="gap:12px">
	<Banner tone="blue" icon="shield" title="A sua pontuação está protegida">
		Enquanto a contestação estiver aberta, não há penalização. A TecnoMaputo revê e responde.
	</Banner>

	<span class="mz-lbl" style="margin-left:2px;margin-top:2px">Qual é o problema?</span>

	<div style="display:flex;flex-direction:column;gap:9px" role="radiogroup" aria-label="Motivo da contestação">
		{#each reasons as r}
			<OptionCard bind:value={reason} option={r.value} title={r.label} icon={r.icon} />
		{/each}
	</div>

	<div class="mz-field" style="min-height:84px;align-items:flex-start">
		<span class="mz-field__lbl">Quer acrescentar algum detalhe? (opcional)</span>
		<span class="mz-field__val mz-field__val--ph" style="font-weight:400">Ex.: paguei só 3.000 MT, não 5.333…</span>
	</div>

	<div style="margin-top:auto;display:flex;gap:7px;align-items:flex-start;color:var(--faint);font-size:11.5px;line-height:1.4">
		<Icon name="info" size={15} stroke={1.9} style="flex:0 0 auto;margin-top:1px" />
		Contestar de má-fé pode baixar a sua pontuação. Use só quando o registo estiver mesmo errado.
	</div>
</div>

<Footer>
	<Btn variant="danger" block lg icon="flag" onclick={submit}>Enviar contestação</Btn>
</Footer>
<HomeIndicator />
