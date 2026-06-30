<script lang="ts">
	import { page } from '$app/state';
	import Brand from './Brand.svelte';
	import Icon from './Icon.svelte';
	import { isActive, type NavItem } from '$lib/nav.js';
	interface Props { items: NavItem[]; rootHref: string; }
	let { items, rootHref }: Props = $props();
	let pathname = $derived(page.url.pathname);
</script>

<nav class="mz-sidenav hidden lg:flex lg:flex-col" aria-label="Navegação principal">
	<a href={rootHref} class="mz-sidenav__brand" style="text-decoration:none">
		<Brand size={36} showName />
	</a>
	<ul class="mz-sidenav__list">
		{#each items as item (item.id)}
			{@const on = isActive(item.href, pathname, rootHref)}
			<li>
				<a
					href={item.href}
					class="mz-sidenav__i"
					class:mz-sidenav__i--on={on}
					aria-current={on ? 'page' : undefined}
					style="text-decoration:none"
				>
					<Icon name={item.icon} size={22} stroke={on ? 2.1 : 1.8} />
					<span>{item.label}</span>
				</a>
			</li>
		{/each}
	</ul>
</nav>
