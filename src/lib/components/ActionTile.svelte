<script lang="ts">
	import IconChip from './IconChip.svelte';

	interface Props {
		icon: string;
		label: string;
		onclick?: () => void;
	}
	let { icon, label, onclick }: Props = $props();
</script>

<button type="button" class="mz-tile" {onclick}>
	<IconChip {icon} size={32} radius={11} stroke={2.1} />
	<span class="mz-tile__lbl">{label}</span>
</button>
