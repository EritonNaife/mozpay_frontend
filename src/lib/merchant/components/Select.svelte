<script lang="ts">
	import Icon from './Icon.svelte';

	interface Option { value: string; label: string; disabled?: boolean; }
	interface Props {
		label?: string;
		value?: string;
		options: Option[];
		placeholder?: string;
		disabled?: boolean;
	}
	let { label, value = $bindable(''), options, placeholder, disabled = false }: Props = $props();
</script>

<div class="mz-field" style={disabled ? 'opacity:.6' : ''}>
	{#if label}<span class="mz-field__lbl">{label}</span>{/if}
	<div style="display:flex;align-items:center;gap:6px">
		<select
			class="mz-field__val"
			bind:value
			{disabled}
			style:color={value ? 'var(--ink)' : 'var(--faint)'}
			style="appearance:none;-webkit-appearance:none;border:none;outline:none;background:transparent;font-family:var(--ui);font-size:16px;font-weight:500;width:100%;padding:0;min-height:22px;cursor:{disabled ? 'default' : 'pointer'}"
		>
			{#if placeholder}<option value="" disabled hidden>{placeholder}</option>{/if}
			{#each options as opt (opt.value)}
				<option value={opt.value} disabled={opt.disabled}>{opt.label}</option>
			{/each}
		</select>
		<Icon name="chevD" size={18} stroke={2} style="color:var(--muted);flex:0 0 auto;pointer-events:none" />
	</div>
</div>
