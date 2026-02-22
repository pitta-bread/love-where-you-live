<script lang="ts">
	import type { AnchorSummary, PropertyCardSummary } from '$lib/types/domain';

	const featuredProperty: PropertyCardSummary = {
		title: '124 Maple Close',
		area: 'Bristol, BS8',
		priceGbp: 425000,
		lifestyleMatch: 87,
		commuteMins: 24,
		gymMins: 11,
		schoolMins: 17
	};

	const anchors: AnchorSummary[] = [
		{ name: 'Temple Quay Office', mode: 'transit', cadenceLabel: '5x per week' },
		{ name: 'Clifton Gym', mode: 'walk', cadenceLabel: '3x per week' },
		{ name: 'Little Oaks Nursery', mode: 'drive', cadenceLabel: '5x per week' }
	];

	const money = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		maximumFractionDigits: 0
	});

	const modeLabel: Record<AnchorSummary['mode'], string> = {
		drive: 'Drive',
		transit: 'Transit',
		walk: 'Walk'
	};
</script>

<svelte:head>
	<title>Love Where You Live</title>
	<meta name="description" content="Phase 0 static frontend shell for Love Where You Live." />
</svelte:head>

<div class="paper-texture min-h-screen">
	<header class="border-b border-border bg-background/90">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<h1 class="text-2xl font-semibold text-primary">Love Where You Live</h1>
			<p class="text-sm font-bold uppercase tracking-wide text-muted">Phase 0 Static Screen</p>
		</div>
	</header>

	<main class="mx-auto grid max-w-6xl gap-6 px-6 py-8 lg:grid-cols-[2fr_1fr]">
		<section class="space-y-4">
			<div class="space-y-2">
				<p class="text-sm uppercase tracking-widest text-muted">Hello world starter</p>
				<h2 class="text-3xl font-semibold text-primary">Top lifestyle matches</h2>
				<p class="max-w-xl text-sm text-muted">
					Static boilerplate for the first design pass. Data shown below is hardcoded UK mock data.
				</p>
			</div>

			<article class="overflow-hidden rounded-md border border-border bg-surface shadow-sm">
				<div class="relative h-44 bg-gradient-to-br from-[#d7c6b3] via-[#f2e8db] to-[#d9e4d7]">
					<div class="absolute right-4 top-4 rounded-full bg-surface px-3 py-1 text-sm font-bold text-primary">
						{featuredProperty.lifestyleMatch}% match
					</div>
				</div>
				<div class="space-y-5 p-6">
					<div>
						<h3 class="text-2xl font-semibold text-primary">{featuredProperty.title}</h3>
						<p class="text-sm text-muted">
							{featuredProperty.area} • {money.format(featuredProperty.priceGbp)}
						</p>
					</div>
					<dl class="grid grid-cols-3 gap-3 border-t border-border pt-4 text-sm">
						<div class="rounded bg-background px-3 py-2">
							<dt class="text-xs font-bold uppercase tracking-wide text-muted">Commute</dt>
							<dd class="mt-1 text-base font-bold text-success">{featuredProperty.commuteMins} mins</dd>
						</div>
						<div class="rounded bg-background px-3 py-2">
							<dt class="text-xs font-bold uppercase tracking-wide text-muted">Gym</dt>
							<dd class="mt-1 text-base font-bold text-success">{featuredProperty.gymMins} mins</dd>
						</div>
						<div class="rounded bg-background px-3 py-2">
							<dt class="text-xs font-bold uppercase tracking-wide text-muted">Nursery</dt>
							<dd class="mt-1 text-base font-bold text-success">{featuredProperty.schoolMins} mins</dd>
						</div>
					</dl>
				</div>
			</article>
		</section>

		<aside class="space-y-4">
			<section class="rounded-md border border-border bg-surface p-5">
				<h3 class="text-lg font-semibold text-primary">Your anchors</h3>
				<p class="mt-2 text-sm text-muted">Static placeholders for the weekly places that matter most.</p>
				<ul class="mt-4 space-y-3">
					{#each anchors as anchor}
						<li class="rounded border border-border bg-background px-3 py-2">
							<p class="font-bold text-primary">{anchor.name}</p>
							<p class="text-xs uppercase tracking-wide text-muted">
								{modeLabel[anchor.mode]} • {anchor.cadenceLabel}
							</p>
						</li>
					{/each}
				</ul>
			</section>

			<section class="rounded-md border border-primary bg-primary p-5 text-white">
				<h3 class="text-xl font-semibold">Found a listing?</h3>
				<p class="mt-2 text-sm text-white/80">
					Rightmove paste/import flow will be added in a later milestone.
				</p>
			</section>
		</aside>
	</main>
</div>
