<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import '../app.css';
	import Toast from '$lib/components/Toast.svelte';
	import { hydrate } from '$lib/stores';
	import { BRAND_NAME } from '$lib/brand.js';
	let { data, children } = $props();

	$effect(() => {
		hydrate(data);
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		return new Promise((resolve) => {
			document.startViewTransition(() => resolve());
		});
	});
</script>

<svelte:head>
	<title>{BRAND_NAME}</title>
	<meta name="description" content="Pagamentos a prestações — sem burocracia" />
</svelte:head>

{@render children()}
<Toast />
