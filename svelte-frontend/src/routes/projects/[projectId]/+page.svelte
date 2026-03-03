<script lang="ts">
	import type { TravelMode } from '$lib/types/domain';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const modeLabel: Record<TravelMode, string> = {
		drive: 'Drive',
		transit: 'Public transport',
		walk: 'Walk'
	};
	const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

	function formatDate(value: string): string {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			return value;
		}
		return dateFormatter.format(parsed);
	}
</script>

<svelte:head>
	<title>{data.project.name} | Love Where You Live</title>
	<meta name="description" content="Move details for Love Where You Live." />
</svelte:head>

<div class="paper-texture min-h-screen bg-background text-primary">
	<nav class="w-full border-b border-primary/5 px-6 py-6 md:px-12">
		<div class="mx-auto flex w-full max-w-7xl items-center justify-between">
			<a href="/projects" class="flex items-center gap-3">
				<svg
					aria-hidden="true"
					viewBox="0 0 24 24"
					class="h-6 w-6 text-accent"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
				>
					<path d="M3 10.5L12 3l9 7.5" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M6.75 9.75V21h10.5V9.75" stroke-linecap="round" stroke-linejoin="round" />
				</svg>
				<span class="text-base font-semibold tracking-tight text-primary sm:text-xl">
					Love Where You Live
				</span>
			</a>
			{#if data.user}
				<div class="flex items-center gap-6">
					<p class="hidden text-sm text-primary/70 sm:block">{data.user.email}</p>
					<form method="POST" action="/logout">
						<button
							type="submit"
							class="text-sm font-semibold text-primary transition-colors hover:text-accent"
						>
							Log out
						</button>
					</form>
				</div>
			{/if}
		</div>
	</nav>

	<main class="mx-auto w-full max-w-4xl px-6 py-10 md:px-12">
		<a
			href="/projects"
			class="inline-flex items-center gap-2 rounded border border-border bg-surface px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
		>
			<span aria-hidden="true">&lt;-</span>
			<span>Back to Moves</span>
		</a>

		<section class="mt-6 rounded border border-border bg-surface p-6 shadow-sm">
			<h1 class="text-4xl font-semibold text-primary">{data.project.name}</h1>
			<p class="mt-2 text-base text-muted">{data.project.area}</p>

			<dl class="mt-6 grid gap-3 text-sm md:grid-cols-2">
				<div class="rounded border border-border bg-background px-4 py-3">
					<dt class="text-xs font-bold uppercase tracking-wide text-muted">Default transport</dt>
					<dd class="mt-1 text-base font-semibold text-primary">
						{modeLabel[data.project.default_transport_mode]}
					</dd>
				</div>
				<div class="rounded border border-border bg-background px-4 py-3">
					<dt class="text-xs font-bold uppercase tracking-wide text-muted">Search started</dt>
					<dd class="mt-1 text-base font-semibold text-primary">
						{formatDate(data.project.search_started_at)}
					</dd>
				</div>
			</dl>
		</section>

		<section class="mt-6 rounded border border-dashed border-border bg-surface p-6">
			<h2 class="text-2xl font-semibold text-primary">Next step coming soon</h2>
			<p class="mt-2 text-sm leading-relaxed text-muted">
				This move is created. Anchor setup and candidate home workflows will be added in the next MVP
				iterations.
			</p>
		</section>
	</main>
</div>
