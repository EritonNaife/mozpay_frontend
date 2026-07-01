<script lang="ts">
	interface Props { score: number; size?: number; }
	let { score, size = 110 }: Props = $props();

	let r = $derived((size - 10) / 2);
	let circ = $derived(2 * Math.PI * r);
	let arc = $derived((score / 100) * circ);
	let mini = $derived(size < 70);
	let inner = $derived(size - (mini ? 14 : 20));
</script>

<div
	role="img"
	aria-label="Pontuação {score} de 100"
	style="position:relative;flex:0 0 auto;width:{size}px;height:{size}px;display:flex;align-items:center;justify-content:center"
>
	<svg
		width={size}
		height={size}
		viewBox="0 0 {size} {size}"
		style="position:absolute;transform:rotate(-90deg)"
		aria-hidden="true"
	>
		<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(28,41,85,0.08)" stroke-width={mini ? 2 : 3.5} />
		<circle
			cx={size / 2}
			cy={size / 2}
			r={r}
			fill="none"
			stroke="var(--amber)"
			stroke-width={mini ? 2.5 : 4}
			stroke-dasharray="{arc} {circ - arc}"
			stroke-linecap="round"
		/>
	</svg>
	<div
		style="position:relative;width:{inner}px;height:{inner}px;border-radius:50%;background:var(--surface);box-shadow:{mini
			? 'none'
			: 'inset 0 2px 8px rgba(28,41,85,.06)'};display:flex;flex-direction:column;align-items:center;justify-content:center"
	>
		<span
			style="font-family:var(--display);font-variant-numeric:tabular-nums;font-size:{mini
				? size * 0.34
				: size * 0.32}px;font-weight:600;color:var(--ink);line-height:1;letter-spacing:-.5px">{score}</span>
		{#if !mini}
			<span style="font-size:9px;color:#8A8F96;font-weight:400;letter-spacing:.1em;margin-top:2px">DE 100</span>
		{/if}
	</div>
</div>
