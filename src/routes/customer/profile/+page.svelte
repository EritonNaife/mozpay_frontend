<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, Icon, MonogramAvatar, HomeIndicator } from '$lib/components/index.js';
	import { auth, logout, customerDashboardStore } from '$lib/stores';
	import { BRAND_NAME } from '$lib/brand.js';

	const rows = [
		{ icon: 'lock', label: 'Alterar PIN', href: '/customer/profile/change-pin' },
		{ icon: 'bell', label: 'Notificações', href: '/customer/notifications' },
		{ icon: 'shield', label: 'Segurança', href: '#' },
		{ icon: 'info', label: `Sobre o ${BRAND_NAME}`, href: '#' },
	];

	let userName = $derived(customerDashboardStore.data?.userName || auth.phone || 'Cliente');
	let userPhone = $derived(customerDashboardStore.data?.userPhone || auth.phone || '');

	onMount(() => { customerDashboardStore.load(); });
</script>

<StatusBar />

<div class="mz-body">
	<div class="mz-narrow" style="width:100%">
		<div style="padding:14px 18px 6px;font-family:var(--display);font-weight:600;font-size:20px;letter-spacing:-.3px">Conta</div>

		<div style="display:flex;flex-direction:column;align-items:center;padding:12px 18px 24px">
			<MonogramAvatar name={userName} size={60} />
			<div style="font-family:var(--display);font-weight:600;font-size:18px;margin-top:8px;letter-spacing:-.2px">{userName}</div>
			<div style="font-size:13px;color:var(--ink-2);margin-top:3px;letter-spacing:.03em">+258 {userPhone}</div>
		</div>

		<div style="padding:0 18px">
			<div class="mz-eyebrow">Definições</div>
			{#each rows as r, i (r.label)}
				<a
					href={r.href}
					style="width:100%;display:flex;align-items:center;gap:14px;padding:18px 0;text-decoration:none;color:inherit;{i ? 'border-top:1px solid var(--line-2)' : ''}"
				>
					<Icon name={r.icon} size={18} stroke={1.6} style="color:var(--ink-2);flex:0 0 auto" />
					<span style="flex:1;font-weight:500;font-size:14px;color:var(--ink)">{r.label}</span>
					<Icon name="chevR" size={14} stroke={1.8} style="color:var(--muted)" />
				</a>
			{/each}

			<div style="margin-top:40px">
				<button
					onclick={() => logout()}
					style="background:none;border:none;padding:0;cursor:pointer;font-family:var(--ui);font-size:14px;font-weight:500;color:#4A2832;letter-spacing:.02em"
				>Sair</button>
			</div>
		</div>
	</div>
</div>

<HomeIndicator />
