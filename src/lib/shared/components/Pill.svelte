<script lang="ts">
	import Icon from './Icon.svelte';
	type Tone = 'green' | 'amber' | 'red' | 'blue' | 'slate';
	interface Props { tone?: Tone; dot?: boolean; icon?: string | null; children?: import('svelte').Snippet; }
	let { tone = 'slate', dot = false, icon, children }: Props = $props();
</script>

<span class="mz-pill mz-pill--{tone}">
	{#if dot}<span class="mz-dot" style:background="currentColor"></span>{/if}
	{#if icon}<Icon name={icon} size={13} stroke={2.2} />{/if}
	{@render children?.()}
</span>
