<script lang="ts">
	interface Props {
		width?: string;
		height?: string;
		radius?: string;
		class?: string;
	}
	let { width = '100%', height = '16px', radius = '8px', class: cls = '' }: Props = $props();
</script>

<div class="mz-skel {cls}" style:width style:height style:border-radius={radius}></div>
