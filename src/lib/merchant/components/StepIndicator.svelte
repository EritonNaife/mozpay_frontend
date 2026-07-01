<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		steps: string[];
		/** Index of the active step (0-based). Steps before it render as completed. */
		current: number;
	}
	let { steps, current }: Props = $props();

	let showLabels = $derived(steps.some((s) => !!s));
</script>

<div style="display:flex;align-items:flex-start">
	{#each steps as label, i (i)}
		{@const done = i < current}
		{@const active = i === current}
		{@const filled = done || active}
		<div style="display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto">
			<div
				style:background={filled ? 'var(--blue-800)' : 'var(--surface-2)'}
				style:color={filled ? '#fff' : 'var(--muted)'}
				style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:var(--display);font-weight:600;font-size:14px;font-variant-numeric:tabular-nums"
			>
				{#if done}
					<Icon name="check" size={16} stroke={2.4} />
				{:else}
					{i + 1}
				{/if}
			</div>
			{#if showLabels && label}
				<span
					style:color={filled ? 'var(--ink)' : 'var(--muted)'}
					style="font-size:11px;font-weight:600;text-align:center;max-width:72px;line-height:1.25"
				>{label}</span>
			{/if}
		</div>
		{#if i < steps.length - 1}
			<div
				style:background={i < current ? 'var(--blue-800)' : 'var(--surface-2)'}
				style="flex:1 1 0;min-width:12px;height:2px;border-radius:2px;margin:14px 6px 0"
			></div>
		{/if}
	{/each}
</div>
