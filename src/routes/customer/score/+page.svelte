<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, Pill, Banner, ScoreRing, HomeIndicator, Skeleton, ErrorState } from '$lib/components/index.js';
	import { scoringStore } from '$lib/stores';
	import type { ScoreLabel } from '$lib/api/types';

	interface Factor { icon: string; tone: 'green' | 'amber' | 'blue'; label: string; value: string; }
	const factors: Factor[] = [
		{ icon: 'check', tone: 'green', label: 'Prestações pagas a tempo', value: '—' },
		{ icon: 'clock', tone: 'amber', label: 'Dias médios de atraso', value: '—' },
		{ icon: 'trophy', tone: 'blue', label: 'Planos concluídos', value: '—' },
		{ icon: 'store', tone: 'blue', label: 'Lojas onde já comprou', value: '—' },
	];

	const colMap: Record<string, string> = { green: 'var(--green)', amber: 'var(--amber)', blue: 'var(--blue-800)' };
	const bgMap: Record<string, string> = { green: 'var(--green-tint)', amber: 'var(--amber-tint)', blue: 'var(--blue-tint)' };

	const labelMap: Record<ScoreLabel, string> = {
		'Excellent': 'Excelente',
		'Building': 'Em construção',
		'Needs Attention': 'Precisa de atenção',
	};

	onMount(() => { scoringStore.load(); });
</script>

<StatusBar />
<AppBar title="Confiança" sub="A sua reputação MozPay" back />

<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
	{#if scoringStore.loading}
		<Skeleton />
	{:else if scoringStore.error}
		<ErrorState title="Erro ao carregar pontuação" sub={scoringStore.error} onretry={() => scoringStore.load()} />
	{:else}
		{@const score = scoringStore.data?.score ?? 50}
		{@const label = scoringStore.data?.label ?? 'Building'}
		<!-- Score card -->
		<div class="mz-card mz-card--pad" style="display:flex;flex-direction:column;align-items:center;text-align:center;padding-top:18px;padding-bottom:18px">
			<ScoreRing {score} size={120} />
			<div style="margin-top:12px"><Pill tone="amber" dot>{labelMap[label]}</Pill></div>
			<p class="mz-sub" style="margin-top:9px;max-width:250px">
				Continue a pagar a tempo para <strong style="color:var(--green)">melhorar</strong>. Cada prestação a tempo conta.
			</p>
		</div>

		<!-- Factors -->
		<span class="mz-lbl" style="margin-left:2px">O que conta para a sua pontuação</span>
		<div class="mz-list" style="margin-top:-2px">
			{#each factors as f}
				<div class="mz-row" style="padding:12px 14px">
					<div style="width:36px;height:36px;border-radius:11px;background:{bgMap[f.tone]};color:{colMap[f.tone]};display:flex;align-items:center;justify-content:center;flex:0 0 auto">
						<Icon name={f.icon} size={18} stroke={1.9} />
					</div>
					<div class="mz-row__main"><div class="mz-row__title" style="font-size:14px">{f.label}</div></div>
					<span style="font-size:13px;font-weight:700;color:{colMap[f.tone]}">{f.value}</span>
				</div>
			{/each}
		</div>

		<div style="margin-top:auto">
			<Banner tone="blue" icon="info" title="A sua pontuação é sua">
				Vale em qualquer comerciante MozPay. Quanto mais alta, mais fácil comprar a prestações em qualquer loja.
			</Banner>
		</div>
	{/if}
</div>

<HomeIndicator />
