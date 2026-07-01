<script lang="ts">
	type Tone = 'amber' | 'red' | 'green' | 'blue' | 'neutral';
	interface Props {
		label: string;
		value: string;
		sub?: string;
		tone?: Tone;
	}
	let { label, value, sub, tone = 'neutral' }: Props = $props();

	const toneMap: Record<Tone, string> = {
		amber: 'var(--amber)',
		red: 'var(--red)',
		green: 'var(--green)',
		blue: 'var(--blue-800)',
		neutral: 'var(--ink)',
	};

	let fg = $derived(toneMap[tone] ?? toneMap.neutral);
</script>

<div style="background:var(--surface);border:1px solid var(--line);border-radius:var(--r-card,16px);padding:14px 16px;display:flex;flex-direction:column;gap:4px">
	<span style="font-size:12px;font-weight:600;color:var(--muted)">{label}</span>
	<span style="font-family:var(--display);font-variant-numeric:tabular-nums;font-size:22px;font-weight:600;line-height:1.05;letter-spacing:-.4px;color:{fg}">{value}</span>
	{#if sub}<span style="font-size:12px;color:var(--muted)">{sub}</span>{/if}
</div>
