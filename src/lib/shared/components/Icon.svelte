<script lang="ts">
	import { ICON_PATHS } from '$lib/icons/paths.js';

	interface Props {
		name: string;
		size?: number;
		stroke?: number;
		fill?: string;
		class?: string;
		style?: string;
	}

	let { name, size = 22, stroke = 1.8, fill, class: cls = '', style = '' }: Props = $props();

	let d = $derived(ICON_PATHS[name] ?? '');
</script>

<svg
	viewBox="0 0 24 24"
	width={size}
	height={size}
	fill="none"
	stroke={fill ? 'none' : 'currentColor'}
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	class={cls}
	{style}
	aria-hidden="true"
>
	<path d={d} fill={fill ?? 'none'} />
</svg>
