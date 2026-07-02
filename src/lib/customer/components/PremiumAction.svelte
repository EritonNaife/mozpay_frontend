<script lang="ts">
	import { Icon } from '$lib/shared';
	interface Props { icon: string; label: string; onclick?: () => void; }
	let { icon, label, onclick }: Props = $props();
</script>

<button
	class="mz-premium-action"
	{onclick}
	style="flex:1 1 0;display:flex;flex-direction:column;align-items:center;gap:7px;border:none;background:transparent;cursor:pointer;font-family:var(--ui);padding:0"
>
	<span
		class="mz-premium-action__tile"
		style="width:46px;height:46px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:var(--surface);border:1px solid var(--line);color:var(--ink);box-shadow:0 1px 3px rgba(29,25,22,.06)"
	>
		<Icon name={icon} size={20} stroke={1.8} />
	</span>
	<span style="font-size:11px;font-weight:600;color:var(--ink-2);letter-spacing:.01em">{label}</span>
</button>

<style>
	.mz-premium-action__tile {
		transition: transform 120ms;
	}
	.mz-premium-action:active .mz-premium-action__tile {
		transform: scale(0.95);
	}
</style>
