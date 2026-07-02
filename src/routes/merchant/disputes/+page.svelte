<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, HomeIndicator, Pill, Icon, Banner, Btn, Field, Segmented, Skeleton, EmptyState, ErrorState } from '$lib/shared';
	import { Avatar, MetricCard, Timeline } from '$lib/merchant';
	import { money, DISPUTE_STATUS } from '$lib/shared/utils/index.js';
	import { disputesStore } from '$lib/merchant';
	import { toast } from '$lib/shared';

	type DispKey = 'open' | 'review' | 'resolved';

	let filter = $state('all');
	let expandedId: string | null = $state(null);
	let noteText = $state('');
	let saving = $state(false);

	let count = $derived(disputesStore.data?.length ?? 0);
	let headerSub = $derived(
		`${count} disputa${count !== 1 ? 's' : ''} registada${count !== 1 ? 's' : ''}`,
	);

	let counts = $derived.by(() => {
		const c: Record<DispKey, number> = { open: 0, review: 0, resolved: 0 };
		for (const d of disputesStore.data ?? []) {
			const k = d.status as DispKey;
			if (k in c) c[k]++;
		}
		return c;
	});

	let filtered = $derived(
		(disputesStore.data ?? []).filter((d) => filter === 'all' || d.status === filter),
	);

	const filterOpts = [
		{ value: 'all', label: 'Todas' },
		{ value: 'open', label: 'Abertas' },
		{ value: 'review', label: 'Em análise' },
		{ value: 'resolved', label: 'Resolvidas' },
	];

	function toggle(id: string) {
		expandedId = expandedId === id ? null : id;
		noteText = '';
	}

	async function sendNote(id: string) {
		const text = noteText.trim();
		if (!text || saving) return;
		saving = true;
		await disputesStore.note(id, text);
		noteText = '';
		saving = false;
		toast.show('Nota adicionada', 'success');
	}

	async function resolve(id: string) {
		if (saving) return;
		saving = true;
		await disputesStore.resolve(id);
		saving = false;
		toast.show('Disputa resolvida', 'success');
	}

	onMount(() => { disputesStore.load(); });
</script>

<StatusBar />
<AppBar title="Disputas" sub={headerSub} />

{#if disputesStore.loading}
	<div class="mz-body mz-body--pad" style="gap:14px"><Skeleton height="220px" /></div>
{:else if disputesStore.error}
	<div class="mz-body mz-body--pad" style="gap:14px"><ErrorState sub={disputesStore.error} onretry={() => disputesStore.load()} /></div>
{:else if !disputesStore.data || disputesStore.data.length === 0}
	<div class="mz-body mz-body--pad" style="gap:14px"><EmptyState icon="flag" title="Sem disputas" sub="Nenhuma disputa registada" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:14px">
		<div class="grid grid-cols-3 gap-2.5">
			<MetricCard label="Abertas" value={String(counts.open)} tone="red" />
			<MetricCard label="Em análise" value={String(counts.review)} tone="amber" />
			<MetricCard label="Resolvidas" value={String(counts.resolved)} tone="green" />
		</div>

		<Segmented options={filterOpts} bind:value={filter} />

		<div class="mz-card" style="overflow:hidden;padding:0">
			{#if filtered.length === 0}
				<div style="padding:40px 16px;text-align:center;color:var(--muted);font-size:13px">Sem disputas nesta categoria.</div>
			{:else}
				{#each filtered as d, i (d.id)}
					{@const st = DISPUTE_STATUS[d.status as DispKey]}
					{@const expanded = expandedId === d.id}
					<div style={i > 0 ? 'border-top:1px solid var(--line-2)' : ''}>
						<button
							type="button"
							onclick={() => toggle(d.id)}
							style="display:flex;align-items:center;gap:14px;padding:14px 18px;width:100%;border:none;background:{expanded ? 'var(--blue-tint)' : 'transparent'};cursor:pointer;text-align:left;font-family:var(--ui);transition:background 100ms"
						>
							<Avatar name={d.customerName ?? 'Cliente'} gradient size={38} />
							<div style="flex:1;min-width:0">
								<div style="font-size:14px;font-weight:600;color:var(--ink)">{d.customerName}</div>
								<div style="font-size:12px;color:var(--muted);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">{d.plan} · {(d.reason ?? '').split('—')[0].trim()}</div>
							</div>
							<span class="mz-money" style="font-size:14px;color:var(--ink);flex:0 0 auto">{money(d.amount ?? 0)}</span>
							<Pill tone={st.tone} icon={st.icon}>{st.label}</Pill>
							<Icon name={expanded ? 'chevD' : 'chevR'} size={14} stroke={1.8} style="color:var(--muted);flex:0 0 auto" />
						</button>

						{#if expanded}
							<div style="background:var(--blue-tint);padding:2px 18px 18px 68px;display:flex;flex-direction:column;gap:16px">
								<div style="font-size:13px;color:var(--ink-2);line-height:1.5;padding:10px 14px;border-radius:10px;background:var(--surface);border:1px solid var(--line)">
									<span style="font-weight:600;color:var(--ink)">Motivo: </span>{d.reason}
								</div>

								<div>
									<div class="mz-lbl" style="text-transform:uppercase;letter-spacing:.06em;font-size:10.5px;margin-bottom:12px">Histórico</div>
									<Timeline events={d.timeline ?? []} />
								</div>

								{#if d.status !== 'resolved'}
									<div style="display:flex;gap:8px;align-items:flex-end">
										<div style="flex:1;min-width:0">
											<Field label="Adicionar nota" input bind:value={noteText} placeholder="Escrever nota…" />
										</div>
										<Btn variant="primary" sm icon="send" disabled={saving} onclick={() => sendNote(d.id)}>Enviar</Btn>
									</div>
									<div>
										<Btn variant="green" sm icon="check" disabled={saving} onclick={() => resolve(d.id)}>Resolver</Btn>
									</div>
								{:else}
									<Banner tone="green" icon="check">Disputa resolvida em {d.resolved}.</Banner>
								{/if}
							</div>
						{/if}
					</div>
				{/each}
			{/if}
		</div>
	</div>
{/if}

<HomeIndicator />
