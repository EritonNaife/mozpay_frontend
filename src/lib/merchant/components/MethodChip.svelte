<script lang="ts">
	import Icon from './Icon.svelte';
	import { METHOD } from '$lib/utils/status.js';

	interface Props { method: 'mpesa' | 'cash' | 'bank'; }
	let { method }: Props = $props();

	let m = $derived(METHOD[method]);
</script>

<span style="display:inline-flex;align-items:center;gap:8px">
	<span style="width:22px;height:22px;flex:0 0 auto;border-radius:7px;background:var(--blue-tint);color:var(--blue-800);display:inline-flex;align-items:center;justify-content:center">
		<Icon name={m.icon} size={13} stroke={2} />
	</span>
	<span style="font-size:14px;font-weight:600;color:var(--ink)">{m.label}</span>
</span>
