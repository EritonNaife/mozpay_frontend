<script lang="ts">
	import { onMount } from 'svelte';
	import { StatusBar, HomeIndicator, Footer, Icon, Banner, Btn } from '$lib/shared';
	import { Avatar, StepIndicator } from '$lib/merchant';
	import { customersStore } from '$lib/merchant';
	import { toast } from '$lib/shared';
	import { money } from '$lib/shared/utils/index.js';
	import { goto } from '$app/navigation';
	import type { CustomerSummary } from '$lib/shared/api/types';

	const STEPS = ['Cliente', 'Produto', 'Plano', 'Confirmar'];
	const MONTHS_PT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
	const INSTALLMENT_OPTS = [2, 3, 4, 5, 6, 8, 10, 12];

	interface SaleForm {
		customer: CustomerSummary | null;
		isNew: boolean;
		newName: string;
		newPhone: string;
		product: string;
		amount: string;
		installments: number;
		startDate: string;
	}

	interface InputOpts {
		prefix?: string;
		suffix?: string;
		type?: 'text' | 'tel' | 'search' | 'date';
		inputmode?: 'text' | 'tel' | 'numeric' | 'search' | 'none';
		digitsOnly?: boolean;
		mono?: boolean;
	}

	let step = $state(0);
	let loading = $state(false);
	let search = $state('');
	let form = $state<SaleForm>({
		customer: null,
		isNew: false,
		newName: '',
		newPhone: '',
		product: '',
		amount: '',
		installments: 3,
		startDate: '2026-07-01',
	});

	let amt = $derived(parseInt(form.amount) || 0);
	let per = $derived(form.installments > 0 ? Math.floor(amt / form.installments) : 0);

	let filtered = $derived(
		(customersStore.data ?? []).filter(
			(c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
		)
	);

	function parseDate(s: string): Date {
		const [y, m, d] = (s || '').split('-').map(Number);
		return new Date(y || 2026, (m || 1) - 1, d || 1);
	}
	function fmtDate(dt: Date): string {
		return dt.getDate() + ' ' + MONTHS_PT[dt.getMonth()] + ' ' + dt.getFullYear();
	}
	function makeSchedule(total: number, n: number, start: string) {
		const each = Math.floor(total / n);
		const base = parseDate(start);
		const out: { n: number; amount: number; date: string }[] = [];
		for (let i = 0; i < n; i++) {
			const dt = new Date(base.getFullYear(), base.getMonth() + i, base.getDate());
			out.push({ n: i + 1, amount: i === n - 1 ? total - each * (n - 1) : each, date: fmtDate(dt) });
		}
		return out;
	}

	let schedule = $derived(amt > 0 && form.installments > 0 ? makeSchedule(amt, form.installments, form.startDate) : []);
	let customerName = $derived(form.isNew ? form.newName : (form.customer?.name ?? '—'));
	let customerPhone = $derived(form.isNew ? form.newPhone : (form.customer?.phone ?? '—'));

	let confirmRows: [string, string][] = $derived([
		['Cliente', customerName],
		['Telemóvel', '+258 ' + customerPhone],
		['Produto', form.product],
		['Valor total', money(amt)],
		['Prestações', form.installments + '× de ' + money(per)],
		['Primeira prestação', schedule[0]?.date ?? '—'],
		['Última prestação', schedule.length ? schedule[schedule.length - 1].date : '—'],
	]);

	function valid(): boolean {
		if (step === 0) return !!form.customer || (form.isNew && form.newName.length > 1 && form.newPhone.length >= 6);
		if (step === 1) return form.product.length > 0 && amt > 0;
		if (step === 2) return form.installments >= 2 && !!form.startDate;
		return true;
	}

	function back() {
		if (step > 0) step -= 1;
		else goto('/merchant/plans');
	}

	function next() {
		if (!valid() || loading) return;
		if (step === 3) {
			loading = true;
			setTimeout(() => {
				loading = false;
				step = 4;
			}, 1400);
			return;
		}
		step += 1;
	}

	onMount(() => {
		customersStore.load();
	});
</script>

{#snippet inputRow(label: string, value: string, placeholder: string, set: (v: string) => void, opts?: InputOpts)}
	<label class="mz-field">
		<span class="mz-field__lbl">{label}</span>
		<div style="display:flex;align-items:center;gap:8px">
			{#if opts?.prefix}<span style="font-size:15px;color:var(--muted);font-weight:500;flex:0 0 auto">{opts.prefix}</span>{/if}
			<input
				class="mz-field__inp"
				style="flex:1 1 auto;{opts?.type === 'date' || opts?.mono ? 'font-family:var(--display);font-variant-numeric:tabular-nums' : ''}"
				type={opts?.type ?? 'text'}
				inputmode={opts?.inputmode}
				{placeholder}
				{value}
				oninput={(e) => set(opts?.digitsOnly ? e.currentTarget.value.replace(/[^0-9]/g, '') : e.currentTarget.value)}
			/>
			{#if opts?.suffix}<span style="font-size:13px;color:var(--muted);font-weight:600;flex:0 0 auto">{opts.suffix}</span>{/if}
		</div>
	</label>
{/snippet}

<StatusBar />

{#if step === 4}
	<div class="mz-body mz-body--pad" style="align-items:center;justify-content:center;text-align:center">
		<div style="width:60px;height:60px;border-radius:50%;background:var(--green-tint);color:var(--green);display:flex;align-items:center;justify-content:center;margin-bottom:18px">
			<Icon name="check" size={28} stroke={2.2} />
		</div>
		<div style="font-family:var(--display);font-weight:600;font-size:21px;letter-spacing:-.3px;margin-bottom:6px">Plano criado com sucesso</div>
		<div style="font-size:14px;color:var(--muted);margin-bottom:3px">{form.product} · {money(amt)}</div>
		<div style="font-size:13px;color:var(--muted)">{customerName} · {form.installments} prestações</div>
		<div style="display:flex;gap:10px;margin-top:28px;flex-wrap:wrap;justify-content:center">
			<Btn variant="ghost" sm icon="send" onclick={() => toast.show('Plano enviado ao cliente', 'success')}>Enviar ao cliente</Btn>
			<Btn variant="primary" sm onclick={() => goto('/merchant')}>Voltar ao painel</Btn>
		</div>
	</div>
{:else}
	<div class="mz-appbar">
		<button class="mz-appbar__btn" onclick={back} aria-label="Voltar"><Icon name="back" size={20} /></button>
		<div class="mz-appbar__t"><div class="mz-appbar__title">Nova Venda</div></div>
	</div>

	<div class="mz-body mz-body--pad" style="gap:16px">
		<div style="padding:4px 0 6px"><StepIndicator steps={STEPS} current={step} /></div>

		{#if step === 0}
			{#if form.isNew}
				<div style="display:flex;flex-direction:column;gap:12px">
					<button
						onclick={() => {
							form.isNew = false;
							form.newName = '';
							form.newPhone = '';
						}}
						style="display:flex;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:var(--blue-800);font-size:13px;font-weight:600;padding:0"
					>
						<Icon name="back" size={16} stroke={2} /> Voltar à lista
					</button>
					<div style="font-family:var(--display);font-weight:600;font-size:17px;letter-spacing:-.2px">Novo cliente</div>
					{@render inputRow('Nome completo', form.newName, 'Nome do cliente', (v) => (form.newName = v))}
					{@render inputRow('Telemóvel', form.newPhone, '84 XXX XXXX', (v) => (form.newPhone = v), { prefix: '+258', type: 'tel', inputmode: 'tel' })}
				</div>
			{:else}
				<div style="display:flex;flex-direction:column;gap:12px">
					{@render inputRow('Pesquisar cliente', search, 'Nome ou número de telefone...', (v) => (search = v), { type: 'search', inputmode: 'search' })}
					<div style="background:var(--surface);border:1px solid var(--line);border-radius:18px;overflow:hidden;max-height:260px;overflow-y:auto">
						{#each filtered as c, i (c.id)}
							{@const sel = form.customer?.id === c.id}
							<button
								onclick={() => (form.customer = c)}
								style="display:flex;align-items:center;gap:12px;padding:11px 14px;width:100%;border:none;border-top:{i ? '1px solid var(--line-2)' : 'none'};background:{sel ? 'var(--blue-tint)' : 'transparent'};cursor:pointer;text-align:left"
							>
								<Avatar name={c.name} gradient size={34} />
								<div style="flex:1;min-width:0">
									<div style="font-size:13.5px;font-weight:600;color:var(--ink)">{c.name}</div>
									<div style="font-size:11.5px;color:var(--muted)">+258 {c.phone}</div>
								</div>
								{#if sel}<Icon name="check" size={16} stroke={2.2} style="color:var(--blue-800);flex:0 0 auto" />{/if}
							</button>
						{/each}
						{#if filtered.length === 0}
							<div style="padding:20px;text-align:center;color:var(--muted);font-size:13px">Nenhum cliente encontrado.</div>
						{/if}
					</div>
					<button
						onclick={() => {
							form.isNew = true;
							form.customer = null;
						}}
						style="display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 0;border-radius:12px;border:1.5px dashed var(--line);background:transparent;width:100%;cursor:pointer;font-size:13px;font-weight:600;color:var(--blue-800)"
					>
						<Icon name="plus" size={15} stroke={2} /> Adicionar novo cliente
					</button>
				</div>
			{/if}
		{:else if step === 1}
			<div style="display:flex;flex-direction:column;gap:12px">
				{@render inputRow('Produto ou serviço', form.product, 'Ex: Samsung Galaxy A14, Televisão 32"...', (v) => (form.product = v))}
				{@render inputRow('Valor total', form.amount, '0', (v) => (form.amount = v), { suffix: 'MT', inputmode: 'numeric', digitsOnly: true })}
				{#if amt > 0}
					<Banner tone="blue" icon="info">O cliente pagará <strong>{money(amt)}</strong> em prestações mensais.</Banner>
				{/if}
			</div>
		{:else if step === 2}
			<div style="display:flex;flex-direction:column;gap:16px">
				<div>
					<span class="mz-lbl" style="margin-left:2px">Número de prestações</span>
					<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px">
						{#each INSTALLMENT_OPTS as n (n)}
							{@const on = form.installments === n}
							<button
								onclick={() => (form.installments = n)}
								style="padding:8px 14px;border-radius:12px;border:{on ? '2px solid var(--blue-800)' : '1.5px solid var(--line)'};background:{on ? 'var(--blue-tint)' : 'var(--surface)'};color:{on ? 'var(--blue-800)' : 'var(--ink)'};font-family:var(--display);font-size:14px;font-weight:600;cursor:pointer;font-variant-numeric:tabular-nums"
							>{n}×</button>
						{/each}
					</div>
				</div>
				{@render inputRow('Data da primeira prestação', form.startDate, '', (v) => (form.startDate = v), { type: 'date', mono: true })}
				{#if schedule.length > 0}
					<div>
						<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px">
							<span style="font-size:12px;font-weight:600;color:var(--muted);letter-spacing:.03em">Pré-visualização</span>
							<span class="mz-money" style="font-size:13px;font-weight:600;color:var(--ink)">{form.installments}× {money(per)}</span>
						</div>
						<div class="mz-list mz-list--card mz-list--divided">
							{#each schedule as s (s.n)}
								<div class="mz-row" style="padding:11px 0">
									<div class="mz-step" style="width:28px;height:28px;border-radius:50%;background:rgba(28,41,85,.06);color:var(--ink-2);font-size:12px">{s.n}</div>
									<div class="mz-row__main">
										<div class="mz-row__title" style="font-size:13.5px">Prestação {s.n}</div>
										<div class="mz-row__sub">{s.date}</div>
									</div>
									<span class="mz-money" style="font-size:13.5px;font-weight:600">{money(s.amount)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		{:else if step === 3}
			<div style="display:flex;flex-direction:column;gap:14px">
				<div class="mz-card" style="padding:2px 18px">
					{#each confirmRows as [label, value] (label)}
						<div class="mz-key">
							<span class="mz-keyl">{label}</span>
							<span class="mz-keyv">{value}</span>
						</div>
					{/each}
				</div>
				<Banner tone="blue" icon="info">Ao confirmar, o plano será enviado ao cliente para aceitação via SMS.</Banner>
			</div>
		{/if}
	</div>

	<Footer>
		<div style="display:flex;gap:10px;align-items:stretch">
			<Btn variant="ghost" lg onclick={back}>Voltar</Btn>
			<div style="flex:1 1 0">
				{#if step === 3}
					<Btn variant="green" block lg icon="check" disabled={loading} onclick={next}>{loading ? 'A criar...' : 'Confirmar plano'}</Btn>
				{:else}
					<Btn variant="primary" block lg iconEnd="fwd" disabled={!valid()} onclick={next}>Continuar</Btn>
				{/if}
			</div>
		</div>
	</Footer>
{/if}

<HomeIndicator />
