<script lang="ts">
	import { onNavigate } from '$app/navigation';
	import '../app.css';
	import { Toast } from '$lib/shared';
	import { hydrate } from '$lib/shared';
	import { BRAND_NAME } from '$lib/shared/brand.js';
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
