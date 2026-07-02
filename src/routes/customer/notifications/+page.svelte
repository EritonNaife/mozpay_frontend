<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, HomeIndicator, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { notificationsStore } from '$lib/shared';

	const colMap: Record<string, string> = { red: 'var(--red)', amber: 'var(--amber)', green: 'var(--green)', blue: 'var(--blue-800)' };
	const bgMap: Record<string, string> = { red: 'var(--red-tint)', amber: 'var(--amber-tint)', green: 'var(--green-tint)', blue: 'var(--blue-tint)' };

	onMount(() => { notificationsStore.load(); });
</script>

<StatusBar />
<AppBar title="Notificações" />

{#if notificationsStore.loading}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><Skeleton height="200px" /></div>
{:else if notificationsStore.error}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><ErrorState sub={notificationsStore.error} onretry={() => notificationsStore.load()} /></div>
{:else if !notificationsStore.data}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden"><EmptyState icon="bell" title="Sem notificações" sub="Ainda não tem notificações" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:10px;overflow:hidden">
		<div class="mz-eyebrow" style="margin-left:2px">Recentes</div>
		<div class="mz-list mz-list--card" style="margin-top:-2px">
			{#each notificationsStore.data.filter(n => n.read) as n (n.id)}
				<div class="mz-row" style="align-items:flex-start;padding:13px 14px;background:var(--blue-tint)">
					<div style="width:40px;height:40px;border-radius:12px;flex:0 0 auto;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center">
						<Icon name="bell" size={20} stroke={1.9} />
					</div>
					<div class="mz-row__main">
						<div style="font-weight:600;font-size:14px;color:var(--ink);line-height:1.3;white-space:normal">{n.message}</div>
						<div class="mz-row__sub" style="white-space:normal;margin-top:2px">{n.channel}</div>
					</div>
					<div class="mz-row__end" style="justify-content:space-between;align-self:stretch">
						<span style="font-size:11px;color:var(--faint);font-weight:600;white-space:nowrap">{n.createdAt}</span>
						<span class="mz-dot" style="background:var(--blue-700);width:8px;height:8px"></span>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}

<HomeIndicator />
