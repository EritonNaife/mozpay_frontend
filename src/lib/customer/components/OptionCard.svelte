<script lang="ts">
	import { Icon } from '$lib/shared';

	interface Props {
		value?: string;
		option: string;
		title: string;
		sub?: string;
		icon?: string;
		onselect?: (option: string) => void;
	}
	let { value = $bindable(''), option, title, sub, icon, onselect }: Props = $props();

	let on = $derived(value === option);

	function handle() {
		value = option;
		onselect?.(option);
	}
</script>

<button
	type="button"
	role="radio"
	aria-checked={on}
	class="mz-optcard"
	class:mz-optcard--on={on}
	onclick={handle}
>
	{#if icon}
		<div style="width:36px;height:36px;border-radius:11px;flex:0 0 auto;background:{on ? 'var(--blue-tint)' : 'var(--surface-2)'};color:{on ? 'var(--blue-800)' : 'var(--ink-2)'};display:flex;align-items:center;justify-content:center">
			<Icon name={icon} size={19} stroke={1.9} />
		</div>
	{/if}
	<div style="flex:1;min-width:0;text-align:left">
		<div style="font-weight:600;font-size:14px">{title}</div>
		{#if sub}<div style="font-size:11.5px;color:var(--muted);line-height:1.35;margin-top:2px">{sub}</div>{/if}
	</div>
	<div style="width:21px;height:21px;border-radius:50%;flex:0 0 auto;border:{on ? 'none' : '2px solid var(--line)'};background:{on ? 'var(--blue-800)' : 'transparent'};color:#fff;display:flex;align-items:center;justify-content:center">
		{#if on}<Icon name="check" size={12} stroke={3} />{/if}
	</div>
</button>
