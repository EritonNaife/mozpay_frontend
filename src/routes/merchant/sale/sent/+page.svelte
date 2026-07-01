<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Legacy multi-page flow removed — the sale wizard is now a single screen.
	onMount(() => {
		goto('/merchant/sale/create', { replaceState: true });
	});
</script>
