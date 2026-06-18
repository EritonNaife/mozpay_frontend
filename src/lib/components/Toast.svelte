<script lang="ts">
	import { toast, type ToastItem } from '$lib/stores/toast.svelte.js';

	let items = $derived(toast.items);

	const toneMap: Record<string, string> = {
		success: 'mz-toast--success',
		error: 'mz-toast--error',
	};
</script>

{#if items.length > 0}
	<div class="mz-toast-wrap" aria-live="polite" role="status">
		{#each items as t (t.id)}
			<div class="mz-toast {toneMap[t.tone ?? 'info'] ?? ''}">
				{t.message}
			</div>
		{/each}
	</div>
{/if}
