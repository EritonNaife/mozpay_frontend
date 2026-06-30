<script lang="ts">
	import Icon from './Icon.svelte';

	interface Stat { label: string; value: string; }
	interface Tile { icon: string; label: string; onclick?: () => void; }

	interface Props {
		title?: string;
		subtitle?: string;
		avatar?: string;
		search?: boolean;
		eyebrow?: string;
		amount?: string;
		currency?: string;
		trend?: string;
		stats?: Stat[];
		tiles?: Tile[];
		onbell?: () => void;
		onsearch?: () => void;
		sheet?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		title,
		subtitle,
		avatar,
		search = false,
		eyebrow,
		amount,
		currency = 'MT',
		trend,
		stats = [],
		tiles = [],
		onbell,
		onsearch,
		sheet = true,
		children,
	}: Props = $props();
</script>

<!-- MozPay dashboard hero: full-bleed navy→blue gradient that melts into a white sheet. -->
<div style="background:#0B1428">
	<div style="position:relative">
		<div style="position:relative;padding:18px 20px 76px;background:var(--hero-gradient)">
			<svg class="mz-grain" aria-hidden="true">
				<filter id="mzHeroGrain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
				<rect width="100%" height="100%" filter="url(#mzHeroGrain)" />
			</svg>
			<div style="position:absolute;right:-44px;top:-40px;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,#4E78DC 0%,rgba(78,120,220,0) 70%);pointer-events:none"></div>

			<div style="position:relative;display:flex;align-items:center;gap:10px;color:#fff">
				{#if search}
					<div onclick={onsearch} class="mz-search mz-search--glass" style="flex:1;cursor:pointer">
						<Icon name="search" size={17} stroke={1.9} />Procurar
					</div>
				{:else}
					<div style="flex:1;display:flex;align-items:center;gap:11px">
						{#if avatar}
							<div class="mz-chip" style="width:42px;height:42px;border-radius:16px;background:rgba(255,255,255,.16);font-family:var(--display);font-weight:600;font-size:17px">{avatar}</div>
						{/if}
						<div style="min-width:0">
							{#if subtitle}<div style="font-size:12.5px;font-weight:500;color:rgba(255,255,255,.66)">{subtitle}</div>{/if}
							{#if title}<div style="font-family:var(--display);font-weight:600;font-size:18px;letter-spacing:-.3px">{title}</div>{/if}
						</div>
					</div>
				{/if}
				<div onclick={onbell} style="width:44px;height:44px;flex:0 0 auto;border-radius:999px;background:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;color:#fff;cursor:pointer">
					<Icon name="bell" size={19} />
				</div>
			</div>

			{#if stats.length > 0}
				<div style="position:relative;display:flex;gap:14px;margin-top:18px;color:#fff">
					{#each stats as s, i (s.label)}
						<div style="display:flex;flex-direction:column;gap:2px;padding-left:{i ? 14 : 0}px;border-left:{i ? '1px solid rgba(255,255,255,.18)' : 'none'}">
							<span style="font-size:10px;font-weight:700;color:rgba(255,255,255,.6);letter-spacing:.05em;text-transform:uppercase;white-space:nowrap">{s.label}</span>
							<span class="mz-money" style="font-size:16px;font-weight:600">{s.value}</span>
						</div>
					{/each}
				</div>
			{/if}

			<div style="position:relative;margin-top:22px">
				{#if eyebrow}<div style="font-size:11.5px;font-weight:600;color:rgba(255,255,255,.66);letter-spacing:.01em">{eyebrow}</div>{/if}
				<div class="mz-balance" style="color:#fff;margin-top:4px">
					{amount} {#if currency}<span style="font-size:20px;opacity:.6">{currency}</span>{/if}
				</div>
				{#if trend}
					<span style="display:inline-flex;align-items:center;gap:3px;background:rgba(255,255,255,.16);color:#fff;font-size:11px;font-weight:700;padding:4px 10px;border-radius:999px;margin-top:10px">
						<Icon name="arrowUp" size={11} stroke={2.8} />{trend}
					</span>
				{/if}
			</div>
		</div>

		{#if tiles.length > 0}
			<div style="position:relative;margin-top:-52px;padding:0 14px;display:flex;gap:9px">
				{#each tiles as t (t.label)}
					<button type="button" onclick={t.onclick} class="mz-tile">
						<span class="mz-chip" style="width:32px;height:32px"><Icon name={t.icon} size={16} stroke={2.1} /></span>
						<span class="mz-tile__lbl">{t.label}</span>
					</button>
				{/each}
			</div>
		{/if}

		{#if children}
			{#if sheet}
				<div class="mz-sheet" style="position:relative;margin-top:{tiles.length ? 18 : -48}px;padding:18px 18px 20px;min-height:40px">
					{@render children()}
				</div>
			{:else}
				<div style="position:relative;margin-top:{tiles.length ? 18 : 0}px;background:var(--bg);padding:4px 18px 0">
					{@render children()}
				</div>
			{/if}
		{/if}
	</div>
</div>
