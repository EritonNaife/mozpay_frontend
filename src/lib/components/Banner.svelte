<script lang="ts">
	import Icon from './Icon.svelte';
	type Tone = 'blue' | 'green' | 'amber' | 'red';
	interface Props { tone?: Tone; icon?: string; title?: string; children?: import('svelte').Snippet; }
	let { tone = 'blue', icon, title, children }: Props = $props();

	const toneMap: Record<Tone, [string, string]> = {
		blue: ['var(--blue-tint)', 'var(--blue-800)'],
		green: ['var(--green-tint)', 'var(--green)'],
		amber: ['var(--amber-tint)', 'var(--amber)'],
		red: ['var(--red-tint)', 'var(--red)'],
	};

	let [bg, fg] = $derived(toneMap[tone] ?? toneMap.blue);
</script>

<div class="mz-banner" style:background={bg}>
	{#if icon}<Icon name={icon} size={19} stroke={2} style="color:{fg};flex:0 0 auto;margin-top:1px" />{/if}
	<div>
		{#if title}<div style="font-weight:700;font-size:13.5px;color:{fg};margin-bottom:2px">{title}</div>{/if}
		<div style="font-size:12.5px;color:var(--ink-2);line-height:1.45">{@render children?.()}</div>
	</div>
</div>
