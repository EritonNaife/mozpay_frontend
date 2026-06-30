<script lang="ts">
	import Icon from './Icon.svelte';

	type Tone = 'ink' | 'tint' | 'surface' | 'green' | 'amber' | 'red';
	interface Props {
		icon: string;
		tone?: Tone;
		size?: number;
		radius?: number;
		stroke?: number;
		style?: string;
	}
	let { icon, tone = 'ink', size = 40, radius, stroke = 2, style = '' }: Props = $props();

	let iconSize = $derived(Math.round(size * 0.46));
	let r = $derived(radius ?? Math.round(size * 0.36));
</script>

<span
	class="mz-chip"
	class:mz-chip--tint={tone === 'tint'}
	class:mz-chip--surface={tone === 'surface'}
	class:mz-chip--green={tone === 'green'}
	class:mz-chip--amber={tone === 'amber'}
	class:mz-chip--red={tone === 'red'}
	style="width:{size}px;height:{size}px;border-radius:{r}px;{style}"
>
	<Icon name={icon} size={iconSize} stroke={stroke} />
</span>
