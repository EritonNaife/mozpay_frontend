<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, Icon, HomeIndicator } from '$lib/shared';
	import { plansStore } from '$lib/shared';
	import { BRAND_NAME } from '$lib/shared/brand.js';

	onMount(() => { plansStore.load(); });
</script>

<div class="mz-screen" style="background:var(--hero-gradient-dark);position:relative;min-height:100dvh;display:flex;flex-direction:column">
	<StatusBar light />

	<div style="flex:1;display:flex;flex-direction:column;align-items:center;padding-top:34px">
		<div style="font-family:var(--display);color:rgba(255,255,255,.92);font-weight:500;font-size:15px;letter-spacing:.04em">quinta-feira, 4 de junho</div>
		<div style="font-family:var(--display);color:#fff;font-weight:600;font-size:74px;letter-spacing:-2px;line-height:1;margin-top:2px">9:41</div>
	</div>

	<div style="padding:0 12px 16px;max-width:440px;margin:0 auto;width:100%">
		<div class="mz-blur-bg" style="background:rgba(255,255,255,.13);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-radius:20px;padding:14px 15px;border:1px solid rgba(255,255,255,.14)">
			<div style="display:flex;align-items:center;gap:9px;margin-bottom:9px">
				<div style="width:24px;height:24px;border-radius:7px;background:linear-gradient(155deg,var(--blue-900),var(--blue-800));display:flex;align-items:center;justify-content:center;flex:0 0 auto">
					<span style="font-family:var(--display);font-weight:600;font-size:13px;color:#fff">M</span>
				</div>
				<span style="color:rgba(255,255,255,.92);font-size:12.5px;font-weight:600;flex:1">MENSAGEM · {BRAND_NAME}</span>
				<span style="color:rgba(255,255,255,.6);font-size:12px">agora</span>
			</div>
			<div style="color:#fff;font-size:14px;line-height:1.5">
				Um comerciante criou um plano de prestações para si.
				Confirme se reconhece esta compra: <span style="color:var(--amber-600)">mozpay.co.mz/c/8F2K</span>
			</div>
		</div>
	</div>

	<div style="padding:0 12px 28px;max-width:440px;margin:0 auto;width:100%">
		<a href="/customer/consent/review" style="text-decoration:none;background:#fff;border-radius:18px;padding:14px;display:flex;align-items:center;gap:12px;box-shadow:0 10px 30px rgba(0,0,0,.3)">
			<div style="width:38px;height:38px;border-radius:11px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto">
				<Icon name="link" size={19} stroke={1.9} />
			</div>
			<div style="flex:1;font-size:13px;color:var(--ink-2);font-weight:500">Toque na ligação para rever e confirmar</div>
			<Icon name="chevR" size={18} style="color:var(--faint)" />
		</a>
	</div>

	<HomeIndicator light />
</div>
