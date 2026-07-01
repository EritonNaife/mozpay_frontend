<script lang="ts">
	import Icon from './Icon.svelte';

	interface Props {
		icon?: string;
		title: string;
		sub?: string;
		children?: import('svelte').Snippet;
	}
	let { icon = 'search', title, sub, children }: Props = $props();
</script>

<div class="mz-empty">
	<Icon name={icon} size={36} stroke={1.5} style="color:var(--faint)" />
	<div class="mz-h2" style="font-size:16px">{title}</div>
	{#if sub}<p class="mz-sub">{sub}</p>{/if}
	{#if children}
		<div style="margin-top:8px">{@render children()}</div>
	{/if}
</div>
