<script lang="ts">
	interface Props {
		checked?: boolean;
		disabled?: boolean;
		/** Accessible label for the switch. */
		label?: string;
		onchange?: (checked: boolean) => void;
	}
	let { checked = $bindable(false), disabled = false, label = 'Alternar', onchange }: Props = $props();

	function toggle() {
		if (disabled) return;
		checked = !checked;
		onchange?.(checked);
	}
</script>

<button
	type="button"
	role="switch"
	aria-checked={checked}
	aria-label={label}
	{disabled}
	onclick={toggle}
	style:background={checked ? 'var(--green)' : 'var(--line)'}
	style="position:relative;width:44px;height:26px;flex:0 0 auto;border:none;border-radius:999px;padding:0;cursor:{disabled ? 'default' : 'pointer'};opacity:{disabled ? '.5' : '1'};transition:background .2s ease"
>
	<span
		style:transform={checked ? 'translateX(18px)' : 'translateX(0)'}
		style="position:absolute;top:2px;left:2px;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.3);transition:transform .2s ease"
	></span>
</button>
