<script lang="ts">
	interface Props { name: string; size?: number; }
	let { name, size = 42 }: Props = $props();

	let initials = $derived(
		(name || '')
			.split(' ')
			.map((w) => w[0])
			.slice(0, 2)
			.join('')
			.toUpperCase()
	);
</script>

<div
	style="flex:0 0 auto;width:{size}px;height:{size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--blue-900);color:rgba(255,255,255,.85);font-family:'Georgia','Times New Roman',serif;font-weight:400;font-size:{size *
		0.36}px;letter-spacing:.5px"
>{initials}</div>
