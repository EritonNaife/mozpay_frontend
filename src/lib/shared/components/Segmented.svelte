<script lang="ts">
	interface Opt { value: string; label: string; }

	interface Props {
		options: (string | Opt)[];
		value?: string;
		onchange?: (value: string) => void;
	}
	let { options, value = $bindable(''), onchange }: Props = $props();

	let opts = $derived(options.map(o => typeof o === 'string' ? { value: o, label: o } : o));

	function select(v: string) {
		value = v;
		onchange?.(v);
	}
</script>

<div class="mz-seg">
	{#each opts as opt}
		{@const on = value === opt.value}
		<button
			type="button"
			class="mz-seg__i"
			class:mz-seg__i--on={on}
			aria-pressed={on}
			onclick={() => select(opt.value)}
		>
			{opt.label}
		</button>
	{/each}
</div>
