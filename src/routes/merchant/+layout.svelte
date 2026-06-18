<script lang="ts">
	import { page } from '$app/state';
	import { SideNav, TabBar } from '$lib/components/index.js';
	import { MERCHANT_NAV } from '$lib/nav.js';
	import { auth } from '$lib/stores';

	let { children } = $props();
	let bare = $derived(page.url.pathname.startsWith('/merchant/onboarding'));
</script>

{#if bare}
	{@render children()}
{:else if auth.isAuthenticated}
	<div class="mz-shell">
		<SideNav items={MERCHANT_NAV} rootHref="/merchant" />
		<div class="mz-main">
			<div class="mz-body" style="min-height:0">{@render children()}</div>
			<TabBar />
		</div>
	</div>
{/if}
