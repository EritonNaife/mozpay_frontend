<script lang="ts">
	import { scoreInfo } from '$lib/utils/index.js';
	interface Props { score: number; size?: number; }
	let { score, size = 64 }: Props = $props();

	let info = $derived(scoreInfo(score));
	const colMap: Record<string, string> = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)' };
	const trackMap: Record<string, string> = { green: 'var(--green-tint)', amber: 'var(--amber-tint)', red: 'var(--red-tint)' };
	let col = $derived(colMap[info.tone] ?? 'var(--blue-800)');
	let track = $derived(trackMap[info.tone] ?? 'var(--blue-tint)');
</script>

<div
	role="img"
	aria-label="Pontuação {score} de 100"
	style="width:{size}px;height:{size}px;border-radius:50%;flex:0 0 auto;background:conic-gradient({col} {score * 3.6}deg, {track} 0deg);display:flex;align-items:center;justify-content:center"
>
	<div style="width:{size - 12}px;height:{size - 12}px;border-radius:50%;background:var(--surface);display:flex;flex-direction:column;align-items:center;justify-content:center">
		<span class="mz-money" style="font-size:{size * 0.34}px;font-weight:600;color:var(--ink);line-height:1">{score}</span>
		<span style="font-size:8.5px;color:var(--muted);font-weight:700;letter-spacing:.04em">/100</span>
	</div>
</div>
