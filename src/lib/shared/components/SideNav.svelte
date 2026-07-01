<script lang="ts">
	import { page } from '$app/state';
	import Brand from './Brand.svelte';
	import Icon from './Icon.svelte';
	import { isActive, type NavItem } from '$lib/nav.js';
	interface Props { items: NavItem[]; rootHref: string; footer?: NavItem[]; }
	let { items, rootHref, footer }: Props = $props();
	let pathname = $derived(page.url.pathname);
</script>

{#snippet navItem(item: NavItem)}
	{@const on = isActive(item.href, pathname, rootHref)}
	<li>
		<a
			href={item.href}
			class="mz-sidenav__i"
			class:mz-sidenav__i--on={on}
			aria-current={on ? 'page' : undefined}
			style="text-decoration:none"
		>
			<Icon name={item.icon} size={20} stroke={on ? 2 : 1.6} />
			<span>{item.label}</span>
		</a>
	</li>
{/snippet}

<nav class="mz-sidenav hidden lg:flex lg:flex-col" aria-label="Navegação principal">
	<a href={rootHref} class="mz-sidenav__brand" style="text-decoration:none">
		<Brand size={34} showName />
	</a>
	<ul class="mz-sidenav__list">
		{#each items as item (item.id)}
			{@render navItem(item)}
		{/each}
	</ul>
	{#if footer?.length}
		<ul
			class="mz-sidenav__list"
			style="margin-top:auto;padding-top:12px;border-top:1px solid var(--line)"
		>
			{#each footer as item (item.id)}
				{@render navItem(item)}
			{/each}
		</ul>
	{/if}
</nav>
