<script lang="ts">
	import Icon from './Icon.svelte';
	interface Props { title?: string; sub?: string; back?: boolean; onSurface?: boolean; action?: import('svelte').Snippet; }
	let { title, sub, back = false, onSurface = false, action }: Props = $props();
</script>

<div class="mz-appbar" class:mz-appbar--surface={onSurface}>
	{#if back}<button class="mz-appbar__btn" aria-label="Voltar"><Icon name="back" size={20} /></button>{/if}
	<div class="mz-appbar__t">
		{#if title}<div class="mz-appbar__title">{title}</div>{/if}
		{#if sub}<div class="mz-appbar__sub">{sub}</div>{/if}
	</div>
	{#if action}{@render action()}{/if}
</div>
