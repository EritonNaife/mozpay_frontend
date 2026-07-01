<script lang="ts">
	import { BRAND_NAME } from '$lib/brand.js';
	interface Props { size?: number; showName?: boolean; light?: boolean; }
	let { size = 52, showName = false, light = false }: Props = $props();
</script>

<div style="display:flex;align-items:center;gap:12px">
	<div style="width:{size}px;height:{size}px;border-radius:{size * 0.3}px;background:var(--hero-gradient);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px -6px rgba(30,58,138,.55);flex:0 0 auto">
		<span style="font-family:var(--display);font-weight:600;font-size:{size * 0.46}px;color:#fff;letter-spacing:-1px">M</span>
	</div>
	{#if showName}
		<span style="font-family:var(--display);font-weight:600;font-size:{size * 0.42}px;letter-spacing:-.5px;color:{light ? '#fff' : 'var(--ink)'}">{BRAND_NAME}</span>
	{/if}
</div>
