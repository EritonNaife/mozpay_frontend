<script lang="ts">
	type Tone = 'blue' | 'green' | 'amber' | 'red' | 'slate';
	interface Props { name: string; tone?: Tone; size?: number; gradient?: boolean; }
	let { name, tone = 'blue', size = 42, gradient = false }: Props = $props();

	const toneMap: Record<Tone, [string, string]> = {
		blue: ['var(--blue-tint)', 'var(--blue-800)'],
		green: ['var(--green-tint)', 'var(--green)'],
		amber: ['var(--amber-tint)', 'var(--amber)'],
		red: ['var(--red-tint)', 'var(--red)'],
		slate: ['var(--surface-2)', 'var(--ink-2)'],
	};

	let initials = $derived((name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase());
	let [bg, fg] = $derived(gradient ? ['var(--hero-gradient)', '#fff'] : (toneMap[tone] ?? toneMap.blue));
</script>

<div class="mz-av" style:width="{size}px" style:height="{size}px" style:background={bg} style:color={fg} style:font-size="{size * 0.36}px">
	{initials}
</div>
