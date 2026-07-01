<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StatusBar, AppBar, Icon, Btn, Footer, HomeIndicator } from '$lib/components/index.js';
	import { auth } from '$lib/stores';
	import { BRAND_NAME } from '$lib/brand.js';

	let status = $state<'confirmed' | 'rejected'>('confirmed');

	onMount(() => {
		status = ($page.url.searchParams.get('status') as 'confirmed' | 'rejected') ?? 'confirmed';
	});

	const copy = {
		confirmed: {
			title: 'Plano confirmado',
			message: `Obrigado, ${auth.phone || 'Cliente'}. O seu plano está activo e o comerciante foi notificado. Vamos lembrá-la antes de cada prestação.`,
			iconTone: 'green' as const,
			cta: 'Ver os meus planos',
			href: '/customer/plans',
		},
		rejected: {
			title: 'Plano rejeitado',
			message: `Informámos o comerciante de que não reconhece esta compra. Não será criada qualquer obrigação de pagamento.`,
			iconTone: 'red' as const,
			cta: 'Voltar ao início',
			href: '/customer',
		},
	};
</script>

<StatusBar />
<AppBar />

<div class="mz-body mz-body--pad" style="overflow:hidden">
	<div style="display:flex;flex-direction:column;align-items:center;text-align:center;margin-top:16px">
		<div style="width:88px;height:88px;border-radius:50%;background:var({status === 'confirmed' ? '--green-tint' : '--red-tint'});display:flex;align-items:center;justify-content:center">
			<div style="width:62px;height:62px;border-radius:50%;background:var({status === 'confirmed' ? '--green' : '--red'});display:flex;align-items:center;justify-content:center;color:#fff">
				<Icon name={status === 'confirmed' ? 'check' : 'flag'} size={32} stroke={2.6} />
			</div>
		</div>
		<h1 class="mz-h1" style="margin-top:20px;font-size:24px">{copy[status].title}</h1>
		<p class="mz-sub" style="margin-top:8px;max-width:290px">{copy[status].message}</p>
	</div>

	<!-- Trust score callout only for confirmed -->
	{#if status === 'confirmed'}
		<div class="mz-card mz-card--pad" style="margin-top:22px;display:flex;align-items:center;gap:14px;background:var(--blue-tint);border:none">
			<Icon name="shield" size={26} stroke={1.8} style="color:var(--blue-800);flex:0 0 auto" />
			<div>
				<div style="font-weight:700;font-size:13.5px;color:var(--blue-900)">A sua pontuação de confiança começou</div>
				<div style="font-size:12.5px;color:var(--ink-2);margin-top:2px;line-height:1.4">Pague a tempo e construa um histórico que vale em qualquer loja {BRAND_NAME}.</div>
			</div>
		</div>
	{/if}
</div>

<Footer>
	<a href={copy[status].href} style="text-decoration:none"><Btn variant="primary" block iconEnd="fwd">{copy[status].cta}</Btn></a>
</Footer>
<HomeIndicator />
