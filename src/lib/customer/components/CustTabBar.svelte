<script lang="ts">
	import { page } from '$app/state';
	import Icon from './Icon.svelte';
	import { CUSTOMER_NAV, isActive } from '$lib/nav.js';
	interface Props { active?: string; }
	let { active }: Props = $props();
	let pathname = $derived(page.url.pathname);
</script>

<nav class="mz-tab lg:hidden" aria-label="Navegação">
	<div class="cust-dock">
		{#each CUSTOMER_NAV as t (t.id)}
			{@const on = active ? active === t.id : isActive(t.href, pathname, '/customer')}
			<a
				href={t.href}
				class="cust-dock__i"
				class:cust-dock__i--on={on}
				aria-current={on ? 'page' : undefined}
			>
				<Icon name={t.icon} size={19} stroke={on ? 2 : 1.6} />
				<span class="cust-dock__lbl">{t.label}</span>
			</a>
		{/each}
	</div>
</nav>

<style>
	.cust-dock {
		display: inline-flex;
		align-items: center;
		gap: 2px;
		background: var(--surface);
		border-radius: 999px;
		padding: 5px 4px;
		box-shadow: 0 4px 20px rgba(29, 25, 22, 0.12);
	}
	.cust-dock__i {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		padding: 6px 14px;
		border-radius: 999px;
		background: transparent;
		color: var(--muted);
		text-decoration: none;
		transition: background 0.15s, color 0.15s;
	}
	.cust-dock__i:focus-visible {
		outline: 2px solid var(--blue-700);
		outline-offset: -2px;
	}
	.cust-dock__i--on {
		background: var(--blue-tint);
		color: var(--blue-900);
	}
	.cust-dock__lbl {
		font-size: 10px;
		font-weight: 600;
		letter-spacing: 0.01em;
	}
</style>
