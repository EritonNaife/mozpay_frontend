<script lang="ts">
	import { goto } from '$app/navigation';
	import { Icon, Btn } from '$lib/shared';
	import { customersStore } from '$lib/merchant/stores/customers.svelte.js';
	import { merchantProfileStore } from '$lib/merchant/stores/merchantProfile.svelte.js';
	import { plansStore } from '$lib/shared/stores/plans.svelte.js';
	import { notificationsStore } from '$lib/shared/stores/notifications.svelte.js';
	import { money } from '$lib/shared/utils/index.js';

	let query = $state('');
	let focused = $state(false);
	let boxEl: HTMLDivElement | undefined = $state();

	type Result = { type: string; icon: string; text: string; sub: string; href: string };

	let results = $derived.by<Result[]>(() => {
		const q = query.toLowerCase().trim();
		if (q.length < 2) return [];
		const out: Result[] = [];
		for (const c of (customersStore.data ?? []).filter((c) => c.name.toLowerCase().includes(q)).slice(0, 3)) {
			out.push({ type: 'Cliente', icon: 'user', text: c.name, sub: '+258 ' + c.phone, href: `/merchant/customers/${c.id}` });
		}
		for (const p of (plansStore.data ?? [])
			.filter((p) => (p.customerName ?? '').toLowerCase().includes(q) || (p.productName ?? '').toLowerCase().includes(q))
			.slice(0, 3)) {
			out.push({
				type: 'Plano',
				icon: 'doc',
				text: p.customerName ?? p.productName ?? 'Plano',
				sub: `${p.productName ?? ''} · ${money(p.remaining ?? 0)}`,
				href: '/merchant/plans',
			});
		}
		return out;
	});

	let unread = $derived((notificationsStore.data ?? []).some((n) => !n.read));

	let initials = $derived.by(() => {
		const name = merchantProfileStore.data?.name ?? merchantProfileStore.data?.store ?? 'MozPay';
		return name
			.split(' ')
			.map((w) => w[0])
			.filter(Boolean)
			.slice(0, 2)
			.join('')
			.toUpperCase();
	});

	function pick(href: string) {
		query = '';
		focused = false;
		goto(href);
	}

	$effect(() => {
		if (!focused) return;
		const onDown = (e: MouseEvent) => {
			if (boxEl && !boxEl.contains(e.target as Node)) {
				focused = false;
				query = '';
			}
		};
		document.addEventListener('mousedown', onDown);
		return () => document.removeEventListener('mousedown', onDown);
	});
</script>

<header class="mtop">
	<!-- Search (desktop) -->
	<div class="mtop__search hidden lg:block" bind:this={boxEl}>
		<div class="mtop__field" class:mtop__field--on={focused}>
			<Icon name="search" size={15} stroke={1.7} style="color:var(--muted);flex-shrink:0" />
			<input
				bind:value={query}
				onfocus={() => (focused = true)}
				placeholder="Pesquisar..."
				aria-label="Pesquisar"
			/>
			{#if query}
				<button type="button" class="mtop__clear" aria-label="Limpar" onclick={() => (query = '')}>
					<Icon name="close" size={13} stroke={2} />
				</button>
			{/if}
		</div>
		{#if focused && results.length > 0}
			<div class="mtop__drop">
				{#each results as r (r.type + r.href + r.text)}
					<button type="button" class="mtop__res" onclick={() => pick(r.href)}>
						<span class="mtop__resicon"><Icon name={r.icon} size={14} stroke={1.6} /></span>
						<span class="mtop__resmain">
							<span class="mtop__restext">{r.text}</span>
							<span class="mtop__ressub">{r.sub}</span>
						</span>
						<span class="mtop__restag">{r.type}</span>
					</button>
				{/each}
			</div>
		{:else if focused && query.trim().length >= 2}
			<div class="mtop__drop mtop__drop--empty">Sem resultados para "{query}"</div>
		{/if}
	</div>

	<div style="flex:1"></div>

	<div class="hidden lg:block">
		<Btn variant="primary" sm icon="plus" onclick={() => goto('/merchant/sale/create')}>Nova Venda</Btn>
	</div>

	<button type="button" class="mtop__bell" aria-label="Alertas" onclick={() => goto('/merchant/notifications')}>
		<Icon name="bell" size={17} stroke={1.7} />
		{#if unread}<span class="mtop__dot"></span>{/if}
	</button>

	<button type="button" class="mtop__av" aria-label="Conta" onclick={() => goto('/merchant/account')}>
		{initials}
	</button>
</header>

<style>
	.mtop {
		flex: 0 0 auto;
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 10px 24px;
		background: var(--surface);
		border-bottom: 1px solid var(--line);
	}
	.mtop__search {
		position: relative;
		width: 300px;
	}
	.mtop__field {
		display: flex;
		align-items: center;
		gap: 8px;
		background: var(--bg);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 8px 14px;
		transition: border-color 0.15s, background 0.15s, box-shadow 0.15s;
	}
	.mtop__field--on {
		background: var(--surface);
		border-color: var(--blue-700);
		box-shadow: var(--ring-focus);
	}
	.mtop__field input {
		flex: 1;
		min-width: 0;
		border: none;
		outline: none;
		background: transparent;
		font-size: 13px;
		color: var(--ink);
		font-family: var(--ui);
		padding: 0;
	}
	.mtop__clear {
		border: none;
		background: none;
		cursor: pointer;
		color: var(--muted);
		padding: 0;
		display: flex;
	}
	.mtop__drop {
		position: absolute;
		top: 100%;
		left: 0;
		right: 0;
		margin-top: 6px;
		background: var(--surface);
		border: 1px solid var(--line);
		border-radius: 12px;
		box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
		padding: 4px;
		z-index: 60;
		max-height: 320px;
		overflow-y: auto;
	}
	.mtop__drop--empty {
		padding: 16px;
		text-align: center;
		color: var(--muted);
		font-size: 13px;
	}
	.mtop__res {
		display: flex;
		align-items: center;
		gap: 10px;
		width: 100%;
		padding: 8px 12px;
		border: none;
		background: transparent;
		border-radius: 8px;
		cursor: pointer;
		font-family: var(--ui);
		text-align: left;
	}
	.mtop__res:hover {
		background: var(--blue-tint);
	}
	.mtop__resicon {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--surface-2);
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--ink-2);
		flex-shrink: 0;
	}
	.mtop__resmain {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
	}
	.mtop__restext {
		font-size: 13px;
		font-weight: 600;
		color: var(--ink);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mtop__ressub {
		font-size: 11px;
		color: var(--muted);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.mtop__restag {
		font-size: 10px;
		font-weight: 600;
		color: var(--muted);
		letter-spacing: 0.03em;
		flex-shrink: 0;
	}
	.mtop__bell {
		position: relative;
		width: 38px;
		height: 38px;
		border-radius: 10px;
		background: var(--bg);
		border: 1px solid var(--line);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: var(--ink);
		flex-shrink: 0;
	}
	.mtop__dot {
		position: absolute;
		top: 8px;
		right: 8px;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--red);
		border: 2px solid var(--surface);
	}
	.mtop__av {
		width: 36px;
		height: 36px;
		border-radius: 10px;
		background: var(--hero-gradient);
		display: flex;
		align-items: center;
		justify-content: center;
		color: rgba(255, 255, 255, 0.9);
		font-family: var(--display);
		font-weight: 600;
		font-size: 13px;
		letter-spacing: 0.3px;
		border: none;
		cursor: pointer;
		flex-shrink: 0;
	}
</style>
