<script lang="ts">
	import { Icon } from '$lib/shared';

	interface Props {
		open?: boolean;
		title?: string;
		onclose?: () => void;
		children?: import('svelte').Snippet;
	}
	let { open = $bindable(false), title, onclose, children }: Props = $props();

	function close() {
		open = false;
		onclose?.();
	}

	function onOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}

	function onWindowKeydown(e: KeyboardEvent) {
		if (open && e.key === 'Escape') close();
	}
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if open}
	<div
		role="presentation"
		onclick={onOverlayClick}
		style="position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;padding:20px"
	>
		<div
			role="dialog"
			aria-modal="true"
			aria-label={title}
			style="background:var(--surface);border-radius:18px;max-width:360px;width:100%;padding:20px;box-shadow:var(--shadow-pop, 0 20px 50px -12px rgba(15,26,46,.35))"
		>
			{#if title}
				<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px">
					<h2 style="font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.3px;margin:0;color:var(--ink)">{title}</h2>
					<button
						type="button"
						aria-label="Fechar"
						onclick={close}
						style="width:32px;height:32px;flex:0 0 auto;display:flex;align-items:center;justify-content:center;border:none;background:var(--surface-2);border-radius:999px;color:var(--ink-2);cursor:pointer"
					>
						<Icon name="close" size={18} stroke={2} />
					</button>
				</div>
			{/if}
			{@render children?.()}
		</div>
	</div>
{/if}
