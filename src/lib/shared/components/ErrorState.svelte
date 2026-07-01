<script lang="ts">
	import Btn from './Btn.svelte';
	import Icon from './Icon.svelte';

	interface Props {
		title?: string;
		sub?: string;
		retryLabel?: string;
		onretry?: () => void;
	}
	let { title = 'Algo correu mal', sub, retryLabel = 'Tentar de novo', onretry }: Props = $props();
</script>

<div class="mz-empty">
	<Icon name="alertc" size={36} stroke={1.5} style="color:var(--amber)" />
	<div class="mz-h2" style="font-size:16px">{title}</div>
	{#if sub}<p class="mz-sub">{sub}</p>{/if}
	{#if onretry}
		<div style="margin-top:8px">
			<Btn variant="ghost" onclick={onretry}>{retryLabel}</Btn>
		</div>
	{/if}
</div>
