<script lang="ts">
	import Icon from './Icon.svelte';
	type Variant = 'primary' | 'brand' | 'white' | 'dark' | 'green' | 'ghost' | 'soft' | 'danger' | 'text';
	interface Props {
		variant?: Variant; icon?: string; iconEnd?: string;
		block?: boolean; lg?: boolean; sub?: string; disabled?: boolean;
		onclick?: () => void; style?: string; children?: import('svelte').Snippet;
	}
	let { variant = 'primary', icon, iconEnd, block = false, lg = false, sub, disabled = false, onclick, style = '', children }: Props = $props();
</script>

<button
	class="mz-btn mz-btn--{variant}"
	class:mz-btn--block={block}
	class:mz-btn--lg={lg}
	class:mz-btn--stack={!!sub}
	{disabled}
	{onclick}
	{style}
>
	{#if icon}<Icon name={icon} size={19} stroke={2} />{/if}
	{#if sub}
		<span style="display:flex;flex-direction:column;align-items:center">
			<span>{@render children?.()}</span>
			<span class="mz-btn__sub">{sub}</span>
		</span>
	{:else}
		{@render children?.()}
	{/if}
	{#if iconEnd}<Icon name={iconEnd} size={19} stroke={2} />{/if}
</button>
