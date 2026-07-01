<script lang="ts">
	interface Props { children?: import('svelte').Snippet; }
	let { children }: Props = $props();
</script>

<div style="flex:0 0 auto;padding:14px 18px calc(14px + env(safe-area-inset-bottom));background:var(--bg);display:flex;flex-direction:column;gap:10px">
	{@render children?.()}
</div>
