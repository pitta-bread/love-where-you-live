<script lang="ts">
	import {
		DEFAULT_PROJECT_FORM_VALUES,
		type ProjectActionFormState
	} from '$lib/types/project-form';
	import type { ProjectRead, TravelMode } from '$lib/types/domain';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData | null } = $props();

	let isCreateModalOpen = $state(false);
	let pendingDeleteProjectId = $state<number | null>(null);
	let pendingDeleteProjectName = $state('');

	const modeLabel: Record<TravelMode, string> = {
		drive: 'Drive',
		transit: 'Public transport',
		walk: 'Walk'
	};
	const dateFormatter = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' });

	const createForm = $derived((form?.createForm as ProjectActionFormState | undefined) ?? null);
	const deleteError = $derived(form?.deleteError ?? null);
	const showCreateModal = $derived(isCreateModalOpen || createForm !== null);
	const createValues = $derived({
		...DEFAULT_PROJECT_FORM_VALUES,
		...(createForm?.values ?? {})
	});
	const createFieldErrors = $derived(createForm?.fieldErrors ?? {});
	const createFormError = $derived(createForm?.formError ?? null);
	const hasProjects = $derived(data.projects.length > 0);

	function formatDate(value: string): string {
		const parsed = new Date(value);
		if (Number.isNaN(parsed.getTime())) {
			return value;
		}
		return dateFormatter.format(parsed);
	}

	function openCreateModal(): void {
		isCreateModalOpen = true;
	}

	function closeCreateModal(): void {
		isCreateModalOpen = false;
	}

	function openDeleteModal(project: ProjectRead): void {
		pendingDeleteProjectId = project.id;
		pendingDeleteProjectName = project.name;
	}

	function closeDeleteModal(): void {
		pendingDeleteProjectId = null;
		pendingDeleteProjectName = '';
	}
</script>

<svelte:head>
	<title>Your Moves | Love Where You Live</title>
	<meta name="description" content="Create and manage your Moves for property search decisions." />
</svelte:head>

<div class="paper-texture min-h-screen bg-background text-primary">
	<nav class="w-full border-b border-primary/5 px-6 py-6 md:px-12">
		<div class="mx-auto flex w-full max-w-7xl items-center justify-between">
			<div class="flex items-center gap-3">
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
			</div>

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

	<main class="mx-auto w-full max-w-7xl px-6 pb-20 pt-8 md:px-12">
		{#if !hasProjects}
			<section class="mx-auto flex min-h-[70vh] max-w-[640px] flex-col items-center text-center">
				<div class="mb-10 rounded-xl border border-border bg-surface-muted/30 p-8">
					<svg
						aria-hidden="true"
						viewBox="0 0 24 24"
						class="h-14 w-14 text-primary/35"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
					>
						<path
							d="M4 8.8L10.5 3.5L17 8.8V20.5H4V8.8Z"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M9 20.5V14H12V20.5" stroke-linecap="round" stroke-linejoin="round" />
						<path
							d="M18.5 5.5H22V20.5H18.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
						<path d="M20 9H21" stroke-linecap="round" />
						<path d="M20 12H21" stroke-linecap="round" />
					</svg>
				</div>

				<div class="mb-10 space-y-4">
					<h1 class="text-[42px] font-semibold leading-tight text-primary">Your Moves</h1>
					<p class="mx-auto max-w-[560px] text-[18px] leading-relaxed text-muted">
						Think of 'Moves' like folders for your property search. Organise different searches, compare
						locations, and measure them against your life's anchors.
					</p>
				</div>

				<div class="relative flex flex-col items-center">
					<button
						type="button"
						onclick={openCreateModal}
						class="inline-flex items-center gap-3 rounded-[2px] bg-primary px-10 py-4 text-sm font-bold uppercase tracking-[0.05em] text-white transition duration-300 hover:bg-[#3d4f58] hover:shadow-lg"
					>
						<span aria-hidden="true" class="text-lg">+</span>
						<span>Create New Move</span>
					</button>

					<div class="mt-5 flex flex-col items-center text-accent">
						<svg aria-hidden="true" class="h-12 w-12 -rotate-12" viewBox="0 0 100 100" fill="none">
							<path
								d="M60 80 C 60 50, 40 40, 30 15 M 30 15 L 15 30 M 30 15 L 45 25"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<p class="-mt-1 max-w-40 text-center font-serif text-2xl italic leading-tight">
							Start by creating your first project here
						</p>
					</div>
				</div>
			</section>
		{:else}
			<section class="space-y-6">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h1 class="text-5xl font-semibold text-primary">Your Moves</h1>
						<p class="mt-2 max-w-2xl text-lg text-muted">
							Choose a move to continue, or create a new one to start a different property search.
						</p>
					</div>
					<button
						type="button"
						onclick={openCreateModal}
						class="inline-flex items-center gap-2 rounded-[2px] bg-primary px-6 py-3 text-xs font-bold uppercase tracking-[0.05em] text-white transition hover:bg-[#3d4f58]"
					>
						<span aria-hidden="true" class="text-base">+</span>
						<span>Create New Move</span>
					</button>
				</div>

				{#if deleteError}
					<p class="rounded border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{deleteError}</p>
				{/if}

				<ul class="grid gap-4 md:grid-cols-2">
					{#each data.projects as project (project.id)}
						<li class="rounded border border-border bg-surface p-5 shadow-sm">
							<div class="flex items-start justify-between gap-4">
								<div>
									<h2 class="text-2xl font-semibold text-primary">{project.name}</h2>
									<p class="mt-1 text-sm text-muted">{project.area}</p>
								</div>
							</div>

							<dl class="mt-4 space-y-1 text-sm text-muted">
								<div class="flex items-center gap-2">
									<dt class="font-bold text-primary">Default transport:</dt>
									<dd>{modeLabel[project.default_transport_mode]}</dd>
								</div>
								<div class="flex items-center gap-2">
									<dt class="font-bold text-primary">Search started:</dt>
									<dd>{formatDate(project.search_started_at)}</dd>
								</div>
							</dl>

							<div class="mt-5 flex items-center gap-2">
								<a
									href={`/projects/${project.id}`}
									class="rounded border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
								>
									Open
								</a>
								<button
									type="button"
									onclick={() => openDeleteModal(project)}
									class="rounded border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-100"
								>
									Delete
								</button>
							</div>
						</li>
					{/each}
				</ul>
			</section>
		{/if}
	</main>
</div>

{#if showCreateModal}
	<div class="fixed inset-0 z-40 flex items-center justify-center bg-black/35 p-4">
		<div class="w-full max-w-lg rounded border border-border bg-surface p-6 shadow-xl">
			<div class="mb-4 flex items-center justify-between">
				<h2 class="text-3xl font-semibold text-primary">Create New Move</h2>
				<button
					type="button"
					onclick={closeCreateModal}
					class="rounded border border-border bg-background px-2 py-1 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
				>
					Close
				</button>
			</div>

			<p class="mb-5 text-sm text-muted">
				Name your move, choose the rough area you are searching in, and set a default transport mode.
			</p>

			<form method="POST" action="?/create" class="space-y-4">
				<div>
					<label for="project-name" class="block text-xs font-bold uppercase tracking-wide text-muted"
						>Name</label
					>
					<input
						id="project-name"
						name="name"
						value={createValues.name}
						maxlength="120"
						required
						class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
						placeholder="e.g. Bristol Move 2026"
					/>
					{#if createFieldErrors.name}
						<p class="mt-1 text-xs text-red-700">{createFieldErrors.name}</p>
					{/if}
				</div>

				<div>
					<label for="project-area" class="block text-xs font-bold uppercase tracking-wide text-muted"
						>Area</label
					>
					<input
						id="project-area"
						name="area"
						value={createValues.area}
						maxlength="120"
						required
						class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
						placeholder="e.g. Somerset"
					/>
					{#if createFieldErrors.area}
						<p class="mt-1 text-xs text-red-700">{createFieldErrors.area}</p>
					{/if}
				</div>

				<div>
					<label
						for="project-default-transport"
						class="block text-xs font-bold uppercase tracking-wide text-muted"
						>Default transport method</label
					>
					<select
						id="project-default-transport"
						name="default_transport_mode"
						class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
					>
						<option value="drive" selected={createValues.default_transport_mode === 'drive'}>Drive</option>
						<option value="transit" selected={createValues.default_transport_mode === 'transit'}>
							Public transport
						</option>
						<option value="walk" selected={createValues.default_transport_mode === 'walk'}>Walk</option>
					</select>
					{#if createFieldErrors.default_transport_mode}
						<p class="mt-1 text-xs text-red-700">{createFieldErrors.default_transport_mode}</p>
					{/if}
				</div>

				{#if createFormError}
					<p class="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
						{createFormError}
					</p>
				{/if}

				<div class="flex items-center justify-end gap-3 pt-1">
					<button
						type="button"
						onclick={closeCreateModal}
						class="rounded border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="rounded bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-[#3d4f58]"
					>
						Create Move
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

{#if pendingDeleteProjectId !== null}
	<div class="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
		<div class="w-full max-w-md rounded border border-border bg-surface p-6 shadow-xl">
			<h2 class="text-2xl font-semibold text-primary">Delete Move?</h2>
			<p class="mt-3 text-sm leading-relaxed text-muted">
				Are you sure you want to delete <span class="font-bold text-primary">{pendingDeleteProjectName}</span>?
				This action cannot be undone.
			</p>

			<form method="POST" action="?/delete" class="mt-6 flex items-center justify-end gap-3">
				<input type="hidden" name="project_id" value={pendingDeleteProjectId} />
				<button
					type="button"
					onclick={closeDeleteModal}
					class="rounded border border-border bg-background px-4 py-2 text-xs font-bold uppercase tracking-wide text-primary transition hover:border-accent hover:text-accent"
				>
					Cancel
				</button>
				<button
					type="submit"
					class="rounded border border-red-300 bg-red-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-red-700 transition hover:bg-red-100"
				>
					Yes, delete move
				</button>
			</form>
		</div>
	</div>
{/if}
