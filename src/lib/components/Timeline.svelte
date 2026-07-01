<script lang="ts">
	import Icon from './Icon.svelte';

	type EventType = 'opened' | 'note' | 'action' | 'resolved';
	interface TimelineEvent {
		type: EventType;
		date: string;
		time: string;
		text: string;
	}
	interface Props { events: TimelineEvent[]; }
	let { events }: Props = $props();

	const typeMap: Record<EventType, { tint: string; fg: string; icon: string }> = {
		opened:   { tint: 'var(--red-tint)',   fg: 'var(--red)',      icon: 'flag'  },
		note:     { tint: 'var(--blue-tint)',  fg: 'var(--blue-800)', icon: 'doc'   },
		action:   { tint: 'var(--amber-tint)', fg: 'var(--amber)',    icon: 'alert' },
		resolved: { tint: 'var(--green-tint)', fg: 'var(--green)',    icon: 'check' },
	};
</script>

<div>
	{#each events as ev, i (i)}
		{@const m = typeMap[ev.type]}
		{@const last = i === events.length - 1}
		<div style="display:flex;gap:12px;align-items:stretch">
			<div style="display:flex;flex-direction:column;align-items:center;flex:0 0 auto">
				<div style="width:26px;height:26px;flex:0 0 auto;border-radius:50%;display:flex;align-items:center;justify-content:center;background:{m.tint};color:{m.fg}">
					<Icon name={m.icon} size={13} stroke={2.2} />
				</div>
				{#if !last}
					<div style="flex:1 1 auto;width:2px;min-height:16px;background:var(--line);margin:4px 0"></div>
				{/if}
			</div>
			<div style="padding-bottom:{last ? '0' : '16px'}">
				<div style="font-size:14px;color:var(--ink);line-height:1.4">{ev.text}</div>
				<div style="font-size:12px;color:var(--muted);margin-top:2px">{ev.date} · {ev.time}</div>
			</div>
		</div>
	{/each}
</div>
