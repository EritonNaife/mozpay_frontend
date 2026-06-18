<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { CUSTOMER_NAV, isActive } from '$lib/nav.js';
	interface Props { active?: string; }
	let { active }: Props = $props();
	let pathname = $derived(page.url.pathname);
</script>

<nav class="mz-tab lg:hidden" aria-label="Navegação">
	{#each CUSTOMER_NAV as t (t.id)}
		{@const on = active ? active === t.id : isActive(t.href, pathname, '/customer')}
		<a href={t.href} class="mz-tab__i" class:mz-tab__i--on={on} aria-current={on ? 'page' : undefined} style="text-decoration:none">
			<Icon name={t.icon} size={23} stroke={on ? 2.1 : 1.8} />
			<span class="mz-tab__lbl">{t.label}</span>
		</a>
	{/each}
</nav>
