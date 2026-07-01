<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, AppBar, Avatar, Btn, Card, Banner, Icon, Field, Toggle, Modal, Skeleton, EmptyState, ErrorState } from '$lib/components/index.js';
	import { merchantProfileStore, toast } from '$lib/stores';

	// ── Profile: read-through view + saved overrides + edit draft ──
	let editing = $state(false);
	let overrides = $state<{ name?: string; phone?: string; store?: string; location?: string }>({});
	let draft = $state({ name: '', phone: '', store: '', location: '' });

	let v = $derived({
		name: overrides.name ?? merchantProfileStore.data?.name ?? '',
		phone: overrides.phone ?? merchantProfileStore.data?.phone ?? '',
		store: overrides.store ?? merchantProfileStore.data?.store ?? '',
		location: overrides.location ?? merchantProfileStore.data?.location ?? '',
	});
	let headerName = $derived(editing ? draft.name : v.name);

	// ── Notification prefs — local toggles (reference defaults) ──
	let notifs = $state({ payments: true, overdue: true, disputes: true, weekly: false, marketing: false });

	// ── Security ──
	let twoFA = $state(false);
	let showPwForm = $state(false);
	let pwSaved = $state(false);
	let pwActual = $state('');
	let pwNova = $state('');
	let pwConfirm = $state('');

	// ── Danger zone ──
	let showDelete = $state(false);
	let deleted = $state(false);

	const rowStyle = 'display:flex;align-items:center;gap:14px;padding:13px 18px;border-top:1px solid var(--line-2)';

	function startEdit() {
		draft = { ...v };
		editing = true;
	}

	function saveProfile() {
		overrides = { ...draft };
		editing = false;
		toast.show('Perfil actualizado com sucesso', 'success');
	}

	function savePassword() {
		showPwForm = false;
		pwSaved = true;
		pwActual = '';
		pwNova = '';
		pwConfirm = '';
	}

	function togglePwForm() {
		showPwForm = !showPwForm;
		if (showPwForm) pwSaved = false;
	}

	function resetDelete() {
		showDelete = false;
		deleted = false;
	}

	onMount(() => { merchantProfileStore.load(); });
</script>

{#snippet chip(name: string)}
	<div style="width:34px;height:34px;border-radius:10px;background:var(--surface-2);color:var(--ink-2);display:flex;align-items:center;justify-content:center;flex:0 0 auto">
		<Icon {name} size={17} stroke={1.6} />
	</div>
{/snippet}

{#snippet notifInfo(icon: string, label: string, sub: string)}
	{@render chip(icon)}
	<div style="flex:1;min-width:0">
		<div style="font-size:13.5px;font-weight:600;color:var(--ink)">{label}</div>
		<div style="font-size:11.5px;color:var(--muted);margin-top:1px">{sub}</div>
	</div>
{/snippet}

<StatusBar />
<AppBar title="Conta" sub="Perfil, notificações e segurança" />

{#if merchantProfileStore.loading}
	<div class="mz-body mz-body--pad" style="gap:16px"><Skeleton height="220px" /></div>
{:else if merchantProfileStore.error}
	<div class="mz-body mz-body--pad" style="gap:16px"><ErrorState sub={merchantProfileStore.error} onretry={() => merchantProfileStore.load()} /></div>
{:else if !merchantProfileStore.data}
	<div class="mz-body mz-body--pad" style="gap:16px"><EmptyState icon="user" title="Sem dados" sub="Perfil não disponível" /></div>
{:else}
	<div class="mz-body mz-body--pad" style="gap:16px">
		<div class="mz-narrow" style="display:flex;flex-direction:column;gap:8px;width:100%">

			<!-- ─── Perfil e loja ─── -->
			<span class="mz-lbl">Perfil e loja</span>
			<Card pad style="margin-bottom:16px">
				<div style="display:flex;align-items:center;gap:16px;margin-bottom:14px">
					<Avatar name={headerName} gradient size={52} />
					<div style="flex:1;min-width:0">
						<div class="mz-h2" style="font-size:17px">{headerName}</div>
						<div class="mz-sub" style="font-size:12px;margin-top:2px">Membro desde {merchantProfileStore.data.joinDate}</div>
					</div>
					{#if editing}
						<Btn variant="primary" icon="check" onclick={saveProfile} sm>Guardar</Btn>
					{:else}
						<Btn variant="ghost" onclick={startEdit} sm>Editar</Btn>
					{/if}
				</div>

				{#if editing}
					<div style="display:flex;flex-direction:column;gap:10px">
						<Field label="Nome" bind:value={draft.name} input />
						<Field label="Telemóvel" bind:value={draft.phone} input inputmode="tel" />
						<Field label="Loja" bind:value={draft.store} input />
						<Field label="Localização" bind:value={draft.location} input />
					</div>
				{:else}
					<div>
						<div class="mz-key"><span class="mz-keyl">Nome</span><span class="mz-keyv">{v.name}</span></div>
						<div class="mz-key"><span class="mz-keyl">Telemóvel</span><span class="mz-keyv">+258 {v.phone}</span></div>
						<div class="mz-key"><span class="mz-keyl">Loja</span><span class="mz-keyv">{v.store}</span></div>
						<div class="mz-key"><span class="mz-keyl">Localização</span><span class="mz-keyv">{v.location}</span></div>
					</div>
				{/if}
			</Card>

			<!-- ─── Notificações ─── -->
			<span class="mz-lbl">Notificações</span>
			<Card style="overflow:hidden;margin-bottom:16px">
				<div style={rowStyle}>
					{@render notifInfo('check', 'Pagamento recebido', 'Alerta quando um cliente efectua pagamento')}
					<Toggle bind:checked={notifs.payments} label="Pagamento recebido" />
				</div>
				<div style={rowStyle}>
					{@render notifInfo('alert', 'Alertas de atraso', 'Notificar sobre prestações em atraso')}
					<Toggle bind:checked={notifs.overdue} label="Alertas de atraso" />
				</div>
				<div style={rowStyle}>
					{@render notifInfo('flag', 'Actualizações de disputas', 'Novos comentários e resoluções')}
					<Toggle bind:checked={notifs.disputes} label="Actualizações de disputas" />
				</div>
				<div style={rowStyle}>
					{@render notifInfo('receipt', 'Resumo semanal', 'Relatório de cobranças e actividade')}
					<Toggle bind:checked={notifs.weekly} label="Resumo semanal" />
				</div>
				<div style={rowStyle}>
					{@render notifInfo('send', 'Comunicações MozPay', 'Novidades, dicas e promoções')}
					<Toggle bind:checked={notifs.marketing} label="Comunicações MozPay" />
				</div>
			</Card>

			<!-- ─── Segurança ─── -->
			<span class="mz-lbl">Segurança</span>
			<Card style="overflow:hidden;margin-bottom:16px">
				<!-- Palavra-passe -->
				<div style="padding:14px 18px">
					<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
						<div style="display:flex;align-items:center;gap:14px;min-width:0">
							{@render chip('lock')}
							<div style="min-width:0">
								<div style="font-size:13.5px;font-weight:600;color:var(--ink)">Palavra-passe</div>
								<div style="font-size:11.5px;color:var(--muted);margin-top:1px">Última alteração há 45 dias</div>
							</div>
						</div>
						<Btn variant="ghost" onclick={togglePwForm} sm>{showPwForm ? 'Cancelar' : 'Alterar'}</Btn>
					</div>

					{#if showPwForm}
						<div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
							<Field label="Palavra-passe actual" bind:value={pwActual} input type="password" />
							<Field label="Nova palavra-passe" bind:value={pwNova} input type="password" />
							<Field label="Confirmar nova palavra-passe" bind:value={pwConfirm} input type="password" />
							<div>
								<Btn variant="primary" icon="check" onclick={savePassword} sm>Guardar palavra-passe</Btn>
							</div>
						</div>
					{/if}

					{#if pwSaved}
						<div style="margin-top:12px">
							<Banner tone="green" icon="check">Palavra-passe alterada com sucesso.</Banner>
						</div>
					{/if}
				</div>

				<!-- Autenticação de dois factores -->
				<div style={rowStyle}>
					{@render chip('settings')}
					<div style="flex:1;min-width:0">
						<div style="font-size:13.5px;font-weight:600;color:var(--ink)">Autenticação de dois factores</div>
						<div style="font-size:11.5px;color:var(--muted);margin-top:1px">{twoFA ? 'Activado — via SMS' : 'Protecção adicional para a sua conta'}</div>
					</div>
					<Toggle bind:checked={twoFA} label="Autenticação de dois factores" />
				</div>

				<!-- Sessões activas -->
				<div style={rowStyle}>
					{@render chip('user')}
					<div style="flex:1;min-width:0">
						<div style="font-size:13.5px;font-weight:600;color:var(--ink)">Sessões activas</div>
						<div style="font-size:11.5px;color:var(--muted);margin-top:1px">1 dispositivo · Este navegador</div>
					</div>
				</div>
			</Card>

			<!-- ─── Danger zone ─── -->
			<Card pad style="margin-bottom:24px">
				<div style="display:flex;align-items:center;justify-content:space-between;gap:12px">
					<div style="min-width:0">
						<div style="font-size:13.5px;font-weight:600;color:var(--red)">Encerrar conta</div>
						<div style="font-size:11.5px;color:var(--muted);margin-top:1px">Esta acção é permanente e não pode ser revertida.</div>
					</div>
					<Btn variant="danger" onclick={() => (showDelete = true)} sm>Encerrar</Btn>
				</div>
			</Card>
		</div>
	</div>
{/if}

<!-- Encerrar conta — confirmação -->
<Modal bind:open={showDelete} title={deleted ? 'Conta encerrada' : 'Encerrar conta?'} onclose={() => (deleted = false)}>
	{#if deleted}
		<div style="text-align:center">
			<div style="width:48px;height:48px;border-radius:50%;background:var(--red-tint);color:var(--red);display:flex;align-items:center;justify-content:center;margin:0 auto 14px">
				<Icon name="check" size={22} stroke={2.2} />
			</div>
			<p class="mz-sub" style="margin-bottom:18px">A sua conta foi marcada para encerramento.</p>
			<Btn variant="primary" block onclick={resetDelete}>OK</Btn>
		</div>
	{:else}
		<p class="mz-sub" style="margin-bottom:20px">Esta acção é permanente. Todos os seus dados, planos e histórico serão eliminados.</p>
		<div style="display:flex;gap:10px">
			<Btn variant="ghost" onclick={() => (showDelete = false)} style="flex:1">Cancelar</Btn>
			<Btn variant="danger" onclick={() => (deleted = true)} style="flex:1">Encerrar conta</Btn>
		</div>
	{/if}
</Modal>
