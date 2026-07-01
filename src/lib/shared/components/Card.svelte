<script lang="ts">
	interface Props {
		pad?: boolean;
		flat?: boolean;
		class?: string;
		style?: string;
		children?: import('svelte').Snippet;
	}
	let { pad = false, flat = false, class: cls = '', style = '', children }: Props = $props();
</script>

<div class="mz-card {cls}" class:mz-card--pad={pad} class:mz-card--flat={flat} {style}>
	{@render children?.()}
</div>
