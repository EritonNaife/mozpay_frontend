<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Payment registration is now inline on the Pagamentos screen.
	onMount(() => {
		goto('/merchant/payment', { replaceState: true });
	});
</script>
