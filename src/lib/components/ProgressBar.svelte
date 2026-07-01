<script lang="ts">
	type Tone = 'blue' | 'red' | 'green';
	interface Props {
		/** Fraction in the range 0..1 (values outside are clamped). */
		value: number;
		tone?: Tone;
	}
	let { value, tone = 'blue' }: Props = $props();

	const toneMap: Record<Tone, string> = {
		blue: 'var(--blue-800)',
		red: 'var(--red)',
		green: 'var(--green)',
	};

	let pct = $derived(Math.max(0, Math.min(1, value)) * 100);
</script>

<div class="mz-prog">
	<div class="mz-prog__f" style:width="{pct}%" style:background={toneMap[tone] ?? toneMap.blue}></div>
</div>
