<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { StatusBar, AppBar, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { notificationsStore } from '$lib/stores';
	import type { NotificationItem } from '$lib/api/types';

	type NotifType = 'payment' | 'overdue' | 'dispute' | 'pending';

	const colors: Record<NotifType, { bg: string; fg: string }> = {
		payment: { bg: 'var(--green-tint)', fg: 'var(--green)' },
		overdue: { bg: 'var(--red-tint)', fg: 'var(--red)' },
		dispute: { bg: 'var(--red-tint)', fg: 'var(--red)' },
		pending: { bg: 'var(--amber-tint)', fg: 'var(--amber)' }
	};

	const routes: Record<NotifType, string> = {
		payment: '/merchant/payment',
		overdue: '/merchant/customers',
		dispute: '/merchant/disputes',
		pending: '/merchant/plans'
	};

	// Local read state layered over the store feed so rows can be marked read
	// without mutating the shared store.
	let markedRead = $state<Record<string, boolean>>({});
	let allRead = $state(false);

	let items = $derived(
		(notificationsStore.data ?? []).map((n) => ({
			...n,
			read: !!n.read || allRead || !!markedRead[n.id]
		}))
	);

	onMount(() => { notificationsStore.load(); });

	function typeOf(n: NotificationItem): NotifType {
		return (n.type ?? 'payment') as NotifType;
	}

	function markAll() {
		notificationsStore.markAllRead();
		allRead = true;
	}

	function open(n: NotificationItem) {
		markedRead = { ...markedRead, [n.id]: true };
		goto(routes[typeOf(n)]);
	}
</script>

<StatusBar />
<AppBar title="Alertas">
	{#snippet action()}<button onclick={markAll} style="font-size:12.5px;color:var(--blue-800);font-weight:700;background:none;border:none;cursor:pointer;font-family:inherit">Marcar lidas</button>{/snippet}
</AppBar>

{#if notificationsStore.loading}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if notificationsStore.error}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><ErrorState sub={notificationsStore.error} onretry={() => notificationsStore.load()} /></div>
{:else if items.length === 0}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><EmptyState icon="bell" title="Sem alertas" sub="Ainda não tem alertas" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden">
		<div class="mz-list mz-list--card mz-list--divided">
			{#each items as n (n.id)}
				{@const c = colors[typeOf(n)]}
				<button
					type="button"
					class="mz-row"
					onclick={() => open(n)}
					style="width:100%;text-align:left;border:none;cursor:pointer;font-family:inherit;background:{n.read ? 'transparent' : 'var(--blue-tint)'}"
				>
					<div style="width:34px;height:34px;border-radius:50%;flex:0 0 auto;background:{c.bg};color:{c.fg};display:flex;align-items:center;justify-content:center">
						<Icon name={n.icon ?? 'bell'} size={16} stroke={2} />
					</div>
					<div class="mz-row__main">
						<div style="font-size:13.5px;font-weight:{n.read ? 500 : 700};color:var(--ink);line-height:1.3;white-space:normal">{n.message}</div>
					</div>
					<div class="mz-row__end">
						<span style="font-size:11px;color:var(--muted);font-weight:600;white-space:nowrap">{n.time}</span>
						{#if !n.read}<span class="mz-dot" style="background:var(--blue-800);width:8px;height:8px"></span>{/if}
					</div>
				</button>
			{/each}
		</div>
	</div>
{/if}

<HomeIndicator />
