<script lang="ts">
	import { StatusBar, AppBar, Icon, Pill, ScoreRing } from '$lib/components/index.js';
	import { scoreInfo } from '$lib/utils/index.js';
	import { auth, logout } from '$lib/stores';

	const info = scoreInfo(0);
	const settingsBase = [
		{ icon: 'pencil', label: 'Editar perfil', href: '#' },
		{ icon: 'bell', label: 'Notificações', href: '/customer/notifications' },
		{ icon: 'info', label: 'Ajuda e suporte', href: '#' },
		{ icon: 'close', label: 'Terminar sessão', href: '/', danger: true },
	];

	let settings = $derived(
		auth.hasPin
			? [{ icon: 'lock', label: 'Alterar PIN', href: '/customer/profile/change-pin' }, ...settingsBase]
			: settingsBase
	);
</script>

<StatusBar />
<AppBar title="Perfil" />

<div class="mz-body mz-body--pad" style="gap:16px">
	<div class="mz-narrow" style="display:flex;flex-direction:column;gap:14px;width:100%">
		<div class="mz-card mz-card--pad">
			<div style="display:flex;align-items:center;gap:14px">
				<div style="width:52px;height:52px;border-radius:14px;background:var(--blue-tint);color:var(--blue-800);display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-family:var(--display);font-weight:600;font-size:18px">
					{(auth.phone || 'CL').slice(0, 2).toUpperCase()}
				</div>
				<div style="flex:1;min-width:0">
					<div class="mz-h2" style="font-size:17px;margin-bottom:2px">{auth.phone || 'Cliente'}</div>
					<div class="mz-sub">{auth.phone || '—'}</div>
				</div>
			</div>
			<div style="display:flex;align-items:center;gap:14px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line-2)">
				<ScoreRing score={0} size={62} />
				<div>
					<Pill tone={info.tone} dot>{info.customer}</Pill>
					<div style="font-size:12px;color:var(--muted);margin-top:6px;line-height:1.4">Pague a tempo para subir de nível</div>
				</div>
			</div>
		</div>

		<span class="mz-lbl">Configurações</span>
		<div class="mz-list">
			{#each settings as s}
				<a
					href={s.href}
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
