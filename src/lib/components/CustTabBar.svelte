<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { CUSTOMER_NAV, isActive } from '$lib/nav.js';
	interface Props { active?: string; }
	let { active }: Props = $props();
	let pathname = $derived(page.url.pathname);
</script>

<nav class="mz-tab lg:hidden" aria-label="Navegação">
	<div class="mz-tab__pill">
		{#each CUSTOMER_NAV as t (t.id)}
			{@const on = active ? active === t.id : isActive(t.href, pathname, '/customer')}
			<a href={t.href} class="mz-tab__i" class:mz-tab__i--on={on} aria-current={on ? 'page' : undefined} style="text-decoration:none">
				<Icon name={t.icon} size={22} stroke={on ? 2.2 : 1.9} />
				<span class="mz-tab__lbl">{t.label}</span>
			</a>
		{/each}
	</div>
</nav>
