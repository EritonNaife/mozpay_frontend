<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Icon, Pill, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { merchantProfileStore, auth, logout } from '$lib/stores';

	const settingsBase = [
		{ icon: 'pencil', label: 'Editar perfil', href: '#' },
		{ icon: 'bell', label: 'Notificações', href: '/merchant/notifications' },
		{ icon: 'info', label: 'Ajuda e suporte', href: '#' },
		{ icon: 'close', label: 'Terminar sessão', href: '/', danger: true },
	];

	let settings = $derived(
		auth.hasPin
			? [{ icon: 'lock', label: 'Alterar PIN', href: '/merchant/account/change-pin' }, ...settingsBase]
			: settingsBase
	);

	onMount(() => { merchantProfileStore.load(); });
</script>

<StatusBar />
<AppBar title="Negócio" />

{#if merchantProfileStore.loading}
	<div class="mz-body mz-body--pad" style="gap:16px"><Skeleton height="200px" /></div>
{:else if merchantProfileStore.error}
	<div class="mz-body mz-body--pad" style="gap:16px"><ErrorState sub={merchantProfileStore.error} onretry={() => merchantProfileStore.load()} /></div>
{:else if !merchantProfileStore.data}
	<div class="mz-body mz-body--pad" style="gap:16px"><EmptyState icon="store" title="Sem dados" sub="Perfil de negócio não disponível" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:16px">
		<div class="mz-narrow" style="display:flex;flex-direction:column;gap:14px;width:100%">
			<div class="mz-card mz-card--pad">
				<div style="display:flex;align-items:center;gap:14px">
					<div style="width:52px;height:52px;border-radius:14px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-family:var(--display);font-weight:600;font-size:18px">
						{(merchantProfileStore.data.business_name ?? 'M').charAt(0)}
					</div>
					<div style="flex:1;min-width:0">
					<div class="mz-h2" style="font-size:17px;margin-bottom:2px">{merchantProfileStore.data.business_name ?? '—'}</div>
					<div class="mz-sub">{merchantProfileStore.data.business_category ?? '—'}</div>
					</div>
				</div>
				<div style="margin-top:14px;padding-top:12px;border-top:1px solid var(--line-2)">
					<div class="mz-key"><span class="mz-keyl">Estado</span><span class="mz-keyv"><Pill tone="green" dot>Activo</Pill></span></div>
				</div>
			</div>

			<span class="mz-lbl">Configurações</span>
			<div class="mz-list mz-list--card">
				{#each settings as s}
					<a
						href={s.danger ? undefined : s.href}
						class="mz-row"
						style="text-decoration:none;color:inherit"
						onclick={s.danger ? (e) => { e.preventDefault(); logout(); } : undefined}
					>
						<div style="width:36px;height:36px;border-radius:11px;background:{s.danger ? 'var(--red-tint)' : 'var(--surface-2)'};color:{s.danger ? 'var(--red)' : 'var(--ink-2)'};display:flex;align-items:center;justify-content:center;flex:0 0 auto">
							<Icon name={s.icon} size={18} stroke={1.9} />
						</div>
						<div class="mz-row__main">
							<div class="mz-row__title" style="color:{s.danger ? 'var(--red)' : 'var(--ink)'}">{s.label}</div>
						</div>
						<Icon name="chevR" size={16} style="color:var(--faint)" />
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}
