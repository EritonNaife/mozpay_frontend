<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StatusBar, AppBar, Btn, Avatar, Pill, ScoreRing, Footer, HomeIndicator, Icon, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { goto } from '$app/navigation';
	import { scoreInfo } from '$lib/utils/index.js';
	import { customersStore } from '$lib/stores';
	import type { CustomerSummary } from '$lib/api/types';

	let customer: CustomerSummary | null = $state(null);

	onMount(async () => {
		const id = $page.params.id ?? '';
		if (id) {
			const result = await customersStore.loadOne(id);
			customer = result;
		}
	});

	function custInfo(c: CustomerSummary) {
		return scoreInfo(c.score);
	}
</script>

<StatusBar />
<AppBar title="Cliente" back>
	{#snippet action()}<div class="mz-appbar__btn"><Icon name="more" size={20} /></div>{/snippet}
</AppBar>

{#if !customer}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden"><Skeleton height="200px" /></div>
{:else}
	{@const info = custInfo(customer)}
	<div class="mz-body mz-body--pad" style="gap:13px;overflow:hidden">
		<div class="mz-card mz-card--pad">
			<div style="display:flex;align-items:center;gap:14px">
				<Avatar name={customer.name} tone={customer.tone} size={52} />
				<div style="flex:1;min-width:0">
					<div style="font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.3px">{customer.name}</div>
					<div style="font-size:13px;color:var(--muted)">{customer.phone}</div>
				</div>
			</div>
			<div style="display:flex;align-items:center;gap:14px;margin-top:16px;padding-top:14px;border-top:1px solid var(--line-2)">
				<ScoreRing score={customer.score} size={62} />
				<div>
					<Pill tone={info.tone} dot>{info.merchant}</Pill>
					<div style="font-size:12px;color:var(--muted);margin-top:6px;line-height:1.4;max-width:180px">{info.customer}</div>
				</div>
			</div>
		</div>

		<div style="display:flex;gap:10px">
			<div class="mz-card" style="flex:1 1 0;padding:11px 12px">
				<div class="mz-money" style="font-size:16px;font-weight:600">{customer.activePlans}</div>
				<div style="font-size:10.5px;color:var(--muted);font-weight:600;margin-top:2px">Planos</div>
			</div>
			<div class="mz-card" style="flex:1 1 0;padding:11px 12px">
				<div class="mz-money" style="font-size:16px;font-weight:600">{customer.score}</div>
				<div style="font-size:10.5px;color:var(--muted);font-weight:600;margin-top:2px">Pontuação</div>
			</div>
		</div>

		<a href="/merchant/customers/{customer.id}/plan" class="mz-row" style="text-decoration:none;color:inherit;margin-top:8px">
			<div style="width:40px;height:40px;border-radius:11px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto"><Icon name="doc" size={20} stroke={1.7} /></div>
			<div class="mz-row__main"><div class="mz-row__title">Ver planos</div><div class="mz-row__sub">{customer.activePlans} plano(s) activo(s)</div></div>
			<div class="mz-row__end"><Pill tone="green" dot>Activo</Pill><Icon name="chevR" size={16} style="color:var(--faint)" /></div>
		</a>
	</div>
{/if}

<Footer><Btn variant="primary" block lg icon="wallet" onclick={() => goto('/merchant/payment/register')}>Registar pagamento</Btn></Footer>
<HomeIndicator />
