<script lang="ts">
	import { page } from '$app/state';
	import { SideNav, CustTabBar } from '$lib/components/index.js';
	import { CUSTOMER_NAV } from '$lib/nav.js';
	import { auth } from '$lib/stores';

	let { children } = $props();
	let bare = $derived(
		page.url.pathname.startsWith('/customer/consent') ||
		page.url.pathname.startsWith('/customer/login') ||
		page.url.pathname.startsWith('/customer/payment') ||
		/^\/customer\/plans\/[^/]+$/.test(page.url.pathname)
	);
</script>

{#if bare}
	{@render children()}
{:else if auth.isAuthenticated}
	<div class="mz-shell">
		<SideNav items={CUSTOMER_NAV} rootHref="/customer" />
		<div class="mz-main">
			<div class="mz-body" style="min-height:0">{@render children()}</div>
			<CustTabBar />
		</div>
	</div>
{/if}
