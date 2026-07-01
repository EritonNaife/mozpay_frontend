<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// Payment registration is now inline on the Pagamentos screen; there is no
	// separate confirmation step, so send stray visits back to the list.
	onMount(() => {
		goto('/merchant/payment', { replaceState: true });
	});
</script>
