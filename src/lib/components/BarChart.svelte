<script lang="ts">
	interface BarDatum {
		label: string;
		value: number;
	}
	interface Props {
		data?: BarDatum[];
		activeIndex?: number;
		height?: number;
		/** Optional formatter for a value label rendered above each bar. */
		valueFormat?: (value: number) => string;
	}
	let { data = [], activeIndex = 0, height = 200, valueFormat }: Props = $props();

	let max = $derived(Math.max(...data.map((d) => d.value), 1));
	let reserved = $derived(valueFormat ? 54 : 34);
</script>

<div style="display:flex;align-items:flex-end;gap:8px;height:{height}px">
	{#each data as d, i (d.label + i)}
		{@const on = i === activeIndex}
		{@const h = Math.max(12, (d.value / max) * (height - reserved))}
		<div style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:8px;height:100%;justify-content:flex-end">
			{#if valueFormat}
				<span style="font-size:10px;font-weight:600;color:{on ? 'var(--ink)' : 'var(--muted)'};font-variant-numeric:tabular-nums">{valueFormat(d.value)}</span>
			{/if}
			<span
				style="width:100%;max-width:28px;height:{h}px;border-radius:8px;background:{on ? 'var(--blue-800)' : 'var(--surface-2)'};box-shadow:{on ? '0 4px 12px -4px rgba(16,59,54,.35)' : 'none'};transition:background .25s ease,height .8s ease"
			></span>
			<span style="font-size:12px;font-weight:{on ? 700 : 600};color:{on ? 'var(--ink)' : 'var(--faint)'}">{d.label}</span>
		</div>
	{/each}
</div>
