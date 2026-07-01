<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { SideNav, TabBar, MerchantTopBar } from '$lib/components/index.js';
	import { MERCHANT_NAV, MERCHANT_NAV_FOOTER } from '$lib/nav.js';
	import { auth, notificationsStore, merchantProfileStore } from '$lib/stores';

	let { children } = $props();
	let bare = $derived(page.url.pathname.startsWith('/merchant/onboarding'));

	onMount(() => {
		notificationsStore.load();
		merchantProfileStore.load();
	});
</script>

{#if bare}
	<div class="mz-screen">{@render children()}</div>
{:else if auth.isAuthenticated}
	<div class="mz-shell">
		<SideNav items={MERCHANT_NAV} footer={MERCHANT_NAV_FOOTER} rootHref="/merchant" />
		<div class="mz-main">
			<MerchantTopBar />
			<div class="mz-body" style="min-height:0">{@render children()}</div>
			<TabBar />
		</div>
	</div>
{/if}
