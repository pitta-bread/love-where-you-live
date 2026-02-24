<script lang="ts">
	import {
		DEFAULT_ANCHOR_FORM_VALUES,
		type AnchorActionFormState
	} from '$lib/types/anchor-form';
	import type { AnchorRead, TravelMode } from '$lib/types/domain';

	let { anchors, form }: { anchors: AnchorRead[]; form?: AnchorActionFormState } = $props();

	const modeLabel: Record<TravelMode, string> = {
		drive: 'Drive',
		transit: 'Transit',
		walk: 'Walk'
	};

	const values = $derived({
		...DEFAULT_ANCHOR_FORM_VALUES,
		...(form?.values ?? {})
	});

	const fieldErrors = $derived(form?.fieldErrors ?? {});
	const formError = $derived(form?.formError ?? null);
</script>

<section class="rounded-md border border-border bg-surface p-5">
	<h3 class="text-lg font-semibold text-primary">Your anchors</h3>
	<p class="mt-2 text-sm text-muted">
		Add the places that matter most so we can compare homes against your weekly routine.
	</p>

	<form method="POST" action="?/create" class="mt-4 space-y-3 border-t border-border pt-4">
		<div>
			<label for="anchor-name" class="block text-xs font-bold uppercase tracking-wide text-muted"
				>Name</label
			>
			<input
				id="anchor-name"
				name="name"
				value={values.name}
				maxlength="120"
				required
				class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
			/>
			{#if fieldErrors.name}
				<p class="mt-1 text-xs text-red-700">{fieldErrors.name}</p>
			{/if}
		</div>

		<div>
			<label for="anchor-address" class="block text-xs font-bold uppercase tracking-wide text-muted"
				>Address</label
			>
			<input
				id="anchor-address"
				name="address"
				value={values.address}
				maxlength="255"
				required
				class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
			/>
			{#if fieldErrors.address}
				<p class="mt-1 text-xs text-red-700">{fieldErrors.address}</p>
			{/if}
		</div>

		<div class="grid grid-cols-3 gap-2">
			<div>
				<label for="anchor-mode" class="block text-xs font-bold uppercase tracking-wide text-muted"
					>Mode</label
				>
				<select
					id="anchor-mode"
					name="mode"
					class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
				>
					<option value="drive" selected={values.mode === 'drive'}>Drive</option>
					<option value="transit" selected={values.mode === 'transit'}>Transit</option>
					<option value="walk" selected={values.mode === 'walk'}>Walk</option>
				</select>
				{#if fieldErrors.mode}
					<p class="mt-1 text-xs text-red-700">{fieldErrors.mode}</p>
				{/if}
			</div>

			<div>
				<label
					for="anchor-frequency"
					class="block text-xs font-bold uppercase tracking-wide text-muted"
					>Weekly</label
				>
				<input
					id="anchor-frequency"
					name="frequency_per_week"
					value={values.frequency_per_week}
					inputmode="numeric"
					min="1"
					max="14"
					required
					class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
				/>
				{#if fieldErrors.frequency_per_week}
					<p class="mt-1 text-xs text-red-700">{fieldErrors.frequency_per_week}</p>
				{/if}
			</div>

			<div>
				<label for="anchor-importance" class="block text-xs font-bold uppercase tracking-wide text-muted"
					>Weight</label
				>
				<input
					id="anchor-importance"
					name="importance_weight"
					value={values.importance_weight}
					inputmode="numeric"
					min="1"
					max="5"
					required
					class="mt-1 w-full rounded border border-border bg-background px-3 py-2 text-sm text-primary"
				/>
				{#if fieldErrors.importance_weight}
					<p class="mt-1 text-xs text-red-700">{fieldErrors.importance_weight}</p>
				{/if}
			</div>
		</div>

		{#if formError}
			<p class="rounded border border-red-300 bg-red-50 px-3 py-2 text-xs text-red-700">{formError}</p>
		{/if}

		<button
			type="submit"
			class="w-full rounded border border-primary bg-primary px-3 py-2 text-sm font-bold text-white"
		>
			Save anchor
		</button>
	</form>

	<div class="mt-4 border-t border-border pt-4">
		<h4 class="text-sm font-bold uppercase tracking-wide text-muted">Saved anchors</h4>
		{#if anchors.length === 0}
			<p class="mt-2 text-sm text-muted">No anchors yet. Add your first place above.</p>
		{:else}
			<ul class="mt-3 space-y-3">
				{#each anchors as anchor (anchor.id)}
					<li class="rounded border border-border bg-background px-3 py-2">
						<p class="font-bold text-primary">{anchor.name}</p>
						<p class="text-sm text-muted">{anchor.address}</p>
						<p class="text-xs uppercase tracking-wide text-muted">
							{modeLabel[anchor.mode]} • {anchor.frequency_per_week}x/week • Weight {anchor.importance_weight}/5
						</p>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</section>
