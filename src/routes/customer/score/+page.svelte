<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, Icon, Banner, HomeIndicator, Skeleton, ErrorState } from '$lib/shared';
	import { LuxuryScoreDial } from '$lib/customer';
	import { scoringStore } from '$lib/customer';
	import type { ScoreLabel } from '$lib/shared/api/types';
	import { BRAND_NAME } from '$lib/shared/brand.js';

	const toneColor: Record<string, string> = {
		green: 'var(--green)',
		amber: 'var(--amber)',
		red: 'var(--red)',
		slate: 'var(--muted)',
	};

	const labelMap: Record<ScoreLabel, string> = {
		'Excellent': 'Excelente',
		'Building': 'Perfil em consolidação',
		'Needs Attention': 'Precisa de atenção',
	};

	onMount(() => { scoringStore.load(); });
</script>

<StatusBar />

<div class="mz-body mz-body--pad" style="gap:0;overflow-y:auto">
	{#if scoringStore.loading}
		<Skeleton height="240px" />
	{:else if scoringStore.error}
		<ErrorState title="Erro ao carregar pontuação" sub={scoringStore.error} onretry={() => scoringStore.load()} />
	{:else if scoringStore.data}
		{@const d = scoringStore.data}
		{@const tier = d.tier ?? labelMap[d.label]}
		{@const outOf = d.scoreOutOf ?? 100}
		{@const factors = d.factors ?? []}

		<h1 style="font-family:var(--display);font-weight:600;font-size:20px;letter-spacing:-.3px;color:var(--ink);margin:0">Confiança</h1>

		<div style="display:flex;flex-direction:column;align-items:center;text-align:center;padding:16px 0 20px">
			<LuxuryScoreDial score={d.score} size={110} />
			<div style="font-family:var(--display);font-weight:600;font-size:16px;color:var(--ink);letter-spacing:-.1px;margin-top:12px">{tier}</div>
			<div style="font-size:11px;color:var(--muted);font-weight:500;margin-top:3px;letter-spacing:.02em">{d.score} de {outOf} pontos</div>
		</div>

		<Banner tone="amber" icon="trophy" title="Pague a tempo">Cada pagamento pontual melhora a sua pontuação de confiança.</Banner>

		<span class="mz-eyebrow" style="margin:16px 2px 8px">Factores</span>
		<div class="mz-list mz-list--card mz-list--divided">
			{#each factors as f (f.label)}
				<div class="mz-row">
					<Icon name={f.icon} size={16} stroke={1.8} style="color:{toneColor[f.tone] ?? 'var(--muted)'};flex:0 0 auto" />
					<div class="mz-row__main"><div class="mz-row__title" style="font-weight:500;font-size:14px">{f.label}</div></div>
					<span style="font-size:12px;font-weight:600;color:var(--ink);background:rgba(0,0,0,.03);padding:4px 10px;border-radius:8px;flex:0 0 auto">{f.value}</span>
				</div>
			{/each}
		</div>

		<div style="margin-top:14px">
			<Banner tone="blue" icon="info" title="Sabia que?">A sua pontuação de confiança viaja consigo para todos os comerciantes {BRAND_NAME}.</Banner>
		</div>
	{/if}
</div>

<HomeIndicator />
