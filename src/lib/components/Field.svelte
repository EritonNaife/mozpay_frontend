<script lang="ts">
	interface Props {
		label: string;
		value?: string;
		placeholder?: string;
		prefix?: string;
		suffix?: string;
		focus?: boolean;
		mono?: boolean;
		input?: boolean;
		type?: 'text' | 'tel' | 'email' | 'url' | 'numeric' | 'search' | 'password' | 'date';
		inputmode?: 'text' | 'tel' | 'numeric' | 'decimal' | 'email' | 'url' | 'search' | 'none';
		oninput?: (value: string) => void;
	}
	let {
		label,
		value = $bindable(''),
		placeholder,
		prefix,
		suffix,
		focus = false,
		mono = false,
		input: isInput = false,
		type = 'text',
		inputmode,
		oninput,
	}: Props = $props();
</script>

<div class="mz-field" class:mz-field--focus={isInput ? false : focus}>
	<span class="mz-field__lbl">{label}</span>
	{#if isInput}
		<input
			class="mz-field__inp"
			bind:value
			{type}
			{placeholder}
			inputmode={inputmode ?? undefined}
			oninput={(e) => oninput?.(e.currentTarget.value)}
			style={mono ? "font-family:var(--display);font-variant-numeric:tabular-nums" : ''}
		/>
	{:else}
		<span class="mz-field__val" class:mz-field__val--ph={!value} style={mono ? "font-family:var(--display);font-variant-numeric:tabular-nums" : ''}>
			{#if prefix}<span style="color:var(--faint)">{prefix}</span>{/if}
			{value || placeholder || ''}
			{#if focus}<span class="mz-caret"></span>{/if}
			{#if suffix}<span style="margin-left:auto;color:var(--muted);font-size:13px;font-weight:600">{suffix}</span>{/if}
		</span>
	{/if}
</div>
