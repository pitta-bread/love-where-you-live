<script lang="ts">
	import AnchorManager from '$lib/components/AnchorManager.svelte';
	import type { PropertyCardSummary } from '$lib/types/domain';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	const featuredProperty: PropertyCardSummary = {
		title: '124 Maple Close',
		area: 'Bristol, BS8',
		priceGbp: 425000,
		lifestyleMatch: 87,
		commuteMins: 24,
		gymMins: 11,
		schoolMins: 17
	};

	const money = new Intl.NumberFormat('en-GB', {
		style: 'currency',
		currency: 'GBP',
		maximumFractionDigits: 0
	});
</script>

<svelte:head>
	<title>Love Where You Live</title>
	<meta name="description" content="Phase 0 static frontend shell for Love Where You Live." />
</svelte:head>

<div class="paper-texture min-h-screen">
	<header class="border-b border-border bg-background/90">
		<div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
			<h1 class="text-2xl font-semibold text-primary">Love Where You Live</h1>
			{#if data.user}
				<div class="flex items-center gap-3">
					<p class="max-w-56 truncate text-sm font-bold text-muted sm:max-w-none">{data.user.email}</p>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="rounded-sm border border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
						>
							Sign out
						</button>
					</form>
				</div>
			{/if}
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
			<AnchorManager anchors={data.anchors} form={form ?? undefined} />

			<section class="rounded-md border border-primary bg-primary p-5 text-white">
				<h3 class="text-xl font-semibold">Found a listing?</h3>
				<p class="mt-2 text-sm text-white/80">
					Rightmove paste/import flow will be added in a later milestone.
				</p>
			</section>
		</aside>
	</main>
</div>
