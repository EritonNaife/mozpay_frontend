<script lang="ts">
	interface Props {
		value?: string;
		length?: number;
		oncomplete?: (value: string) => void;
	}
	let { value = $bindable(''), length = 6, oncomplete }: Props = $props();

	const keys: (number | string)[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'];
	let dots = $derived(Array.from({ length }, (_, i) => i));

	function press(k: number | string) {
		if (k === 'del') {
			value = value.slice(0, -1);
			return;
		}
		if (value.length >= length) return;
		const next = value + String(k);
		value = next;
		if (next.length === length) oncomplete?.(next);
	}
</script>

<div style="display:flex;flex-direction:column;align-items:center;width:100%">
	<div style="display:flex;gap:16px;justify-content:center;margin-bottom:10px" aria-hidden="true">
		{#each dots as i (i)}
			<div
				style="width:16px;height:16px;border-radius:50%;background:{i < value.length
					? 'var(--blue-800)'
					: 'transparent'};border:2px solid {i < value.length
					? 'var(--blue-800)'
					: 'var(--line)'};transition:all 120ms"
			></div>
		{/each}
	</div>
	<div
		style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;max-width:280px;width:100%;margin:0 auto"
	>
		{#each keys as k (k)}
			{#if k === ''}
				<div></div>
			{:else}
				<button
					type="button"
					aria-label={k === 'del' ? 'Apagar' : String(k)}
					onclick={() => press(k)}
					style="height:56px;border-radius:12px;border:none;background:{k === 'del'
						? 'transparent'
						: 'var(--surface-2)'};font-family:{k === 'del'
						? 'var(--ui)'
						: 'var(--display)'};font-size:{k === 'del' ? 18 : 22}px;font-weight:600;color:var(--ink);cursor:pointer;display:flex;align-items:center;justify-content:center"
				>
					{k === 'del' ? '⌫' : k}
				</button>
			{/if}
		{/each}
	</div>
</div>
